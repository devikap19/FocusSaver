document.getElementById("predictBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = new URL(tabs[0].url);
    const hostname = url.hostname;

    // List of known study and distraction sites (expand this later)
    const studySites = ["geeksforgeeks", "khanacademy", "w3schools", "stackoverflow", "coursera"];
    const distractionSites = ["youtube", "instagram", "facebook", "netflix", "reddit"];

    // Check if current site is study or distraction
    const isStudy = studySites.some(site => hostname.includes(site)) ? 1 : 0;
    const isDistraction = distractionSites.some(site => hostname.includes(site)) ? 1 : 0;

    // Simulated/test values for now (you can link real tracking later)
    const data = {
      current_site: hostname,
      is_study_site: isStudy,
      is_distraction_site: isDistraction,
      idle_time_mins: 1,
      tab_switch_count: 2,
      click_count: 10,
      time_spent_mins: 12
    };

    console.log("Sending data to Flask:", data);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      document.getElementById("result").innerText = `Prediction: ${result.focus_label}`;
    })
    .catch(error => {
      document.getElementById("result").innerText = "Error connecting to backend.";
      console.error("Error:", error);
    });
  });
});

