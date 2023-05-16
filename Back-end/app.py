from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)
model = joblib.load('model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    df = pd.DataFrame(data, index=[0])  # Convert data to pandas DataFrame

    print(df)

    # Convert 'A1_Score' to 'A10_Score' to numeric
    for i in range(1, 11):
        df[f'A{i}_Score'] = pd.to_numeric(df[f'A{i}_Score'])

    # Convert gender to binary
    df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})

    # Convert boolean columns to binary
    for column in ['jaundice', 'autism', 'used_app_before']:
        df[column] = df[column].map({'Yes': 1, 'No': 0})

    prediction = model.predict(df)  # Make prediction using the model

    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(port=5555)