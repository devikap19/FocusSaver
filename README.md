# FocusSaver 🔍🧠

**FocusSaver** is a Chrome extension that tracks your tab activity and predicts your focus level using a Machine Learning model.

## 🌟 Features
- Tracks:
  - Active tab URL
  - Tab switches
  - Click activity
  - Idle time
  - Time spent on tab
- ML model predicts:
  - `Deep Focus`, `Focused`, `Mildly Distracted`, `Distracted`, `Procrastinating`, `Break Mode`
- Uses Flask backend + scikit-learn
- Privacy-first: Works locally on your machine

## 📦 Technologies
- JavaScript (Chrome Extension)
- Python (Flask API)
- scikit-learn (ML model)
- HTML/CSS

## 🧠 How It Works
The extension captures tab behavior and sends it to a local Flask API. The API returns the predicted focus level based on the trained ML model.

## 🚀 Getting Started
1. Run `focus_api.py`
2. Load this folder as an unpacked extension in Chrome
3. Click **Predict Focus** to get real-time predictions!

## 🔐 Note
Model files (`*.pkl`) are excluded via `.gitignore`. Upload them manually if needed.

---

Want to improve it? Pull requests welcome!

