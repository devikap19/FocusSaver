let activityData = {
    active_tabs: 0,
    study_tabs: 0,
    non_study_tabs: 0,
    tab_switches: 0,
    idle_minutes: 0,
    clicks_per_minute: 0
};

let lastActiveTabId = null;
let lastClickTime = Date.now();
let clickCount = 0;
let idleStart = Date.now();

// Example study sites
const studySites = ["khanacademy.org", "wikipedia.org", "coursera.org", "leetcode.com", "chat.openai.com"];

function isStudySite(url) {
    return studySites.some(site => url.includes(site));
}

chrome.tabs.onActivated.addListener(activeInfo => {
    activityData.tab_switches++;

    chrome.tabs.get(activeInfo.tabId, tab => {
        if (tab && tab.url) {
            const url = tab.url;
            activityData.active_tabs = 1;
            activityData.study_tabs = isStudySite(url) ? 1 : 0;
            activityData.non_study_tabs = isStudySite(url) ? 0 : 1;

            sendDataToAPI();  // Send data every time tab is switched
        }
    });
});

chrome.idle.onStateChanged.addListener(newState => {
    if (newState === "idle" || newState === "locked") {
        idleStart = Date.now();
    } else if (newState === "active") {
        let idleEnd = Date.now();
        activityData.idle_minutes += Math.floor((idleEnd - idleStart) / 60000);
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "click") {
        clickCount++;
        let now = Date.now();
        let elapsedMinutes = (now - lastClickTime) / 60000;
        if (elapsedMinutes >= 1) {
            activityData.clicks_per_minute = Math.round(clickCount / elapsedMinutes);
            clickCount = 0;
            lastClickTime = now;
        }
    }
});

function sendDataToAPI() {
    fetch('http://127.0.0.1:5000/predict', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(activityData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Focus Prediction:", data);
        chrome.storage.local.set({ focus_result: data });
    })
    .catch(error => console.error("API call failed:", error));
}
