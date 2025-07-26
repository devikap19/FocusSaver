from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and encoders
rf_model = joblib.load('focus_model.pkl')
le_site = joblib.load('site_encoder.pkl')
le_label = joblib.load('label_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        site = data.get('current_site', '')
        if site in le_site.classes_:
            site_encoded = int(le_site.transform([site])[0])
        else:
            site_encoded = -1  # Unknown site

        features = [[
            site_encoded,
            int(data.get('is_study_site', 0)),
            int(data.get('is_distraction_site', 0)),
            int(data.get('idle_time_mins', 0)),
            int(data.get('tab_switch_count', 0)),
            int(data.get('click_count', 0)),
            int(data.get('time_spent_mins', 0))
        ]]

        encoded_pred = rf_model.predict(features)[0]
        label = le_label.inverse_transform([encoded_pred])[0]

        response = {
            'focus_label': str(label),
            'site_encoded': site_encoded,
            'input_features': [int(x) for x in features[0]]
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000)
