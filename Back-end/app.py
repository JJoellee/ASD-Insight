from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)
model = joblib.load('model.joblib')

# Create a list of all columns that your model expects
expected_columns = ['A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score', 'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score', 'age', 'gender', 'jaundice', 'autism', 'used_app_before', 'ethnicity_asian', 'ethnicity_black', 'ethnicity_hispanic', 'ethnicity_latino', 'ethnicity_middle eastern', 'ethnicity_others', 'ethnicity_pasifika', 'ethnicity_south asian', 'ethnicity_turkish', 'ethnicity_white-european', 'contry_of_res_afghanistan', 'contry_of_res_albania', 'contry_of_res_americansamoa', 'contry_of_res_angola', 'contry_of_res_anguilla', 'contry_of_res_argentina', 'contry_of_res_armenia', 'contry_of_res_aruba', 'contry_of_res_australia', 'contry_of_res_austria', 'contry_of_res_azerbaijan', 'contry_of_res_bahamas', 'contry_of_res_bahrain', 'contry_of_res_bangladesh', 'contry_of_res_belgium', 'contry_of_res_bhutan', 'contry_of_res_bolivia', 'contry_of_res_brazil', 'contry_of_res_bulgaria', 'contry_of_res_burundi', 'contry_of_res_canada', 'contry_of_res_chile', 'contry_of_res_china', 'contry_of_res_comoros', 'contry_of_res_costa rica', 'contry_of_res_croatia', 'contry_of_res_cyprus', 'contry_of_res_czech republic', 'contry_of_res_ecuador', 'contry_of_res_egypt', 'contry_of_res_ethiopia', 'contry_of_res_europe', 'contry_of_res_finland', 'contry_of_res_france', 'contry_of_res_georgia', 'contry_of_res_germany', 'contry_of_res_ghana', 'contry_of_res_greenland', 'contry_of_res_hong kong', 'contry_of_res_iceland', 'contry_of_res_india', 'contry_of_res_indonesia', 'contry_of_res_iran', 'contry_of_res_iraq', 'contry_of_res_ireland', 'contry_of_res_isle of man', 'contry_of_res_italy', 'contry_of_res_japan', 'contry_of_res_jordan', 'contry_of_res_kazakhstan', 'contry_of_res_kuwait', 'contry_of_res_latvia', 'contry_of_res_lebanon', 'contry_of_res_libya', 'contry_of_res_malaysia', 'contry_of_res_malta', 'contry_of_res_mexico', 'contry_of_res_nepal', 'contry_of_res_netherlands', 'contry_of_res_new zealand', 'contry_of_res_nicaragua', 'contry_of_res_niger', 'contry_of_res_nigeria', 'contry_of_res_norway', 'contry_of_res_oman', 'contry_of_res_pakistan', 'contry_of_res_philippines', 'contry_of_res_portugal', 'contry_of_res_qatar', 'contry_of_res_romania', 'contry_of_res_russia', 'contry_of_res_saudi arabia', 'contry_of_res_serbia', 'contry_of_res_sierra leone', 'contry_of_res_south africa', 'contry_of_res_south korea', 'contry_of_res_spain', 'contry_of_res_sri lanka', 'contry_of_res_sweden', 'contry_of_res_syria', 'contry_of_res_tonga', 'contry_of_res_turkey', 'contry_of_res_u.s. outlying islands', 'contry_of_res_ukraine', 'contry_of_res_united arab emirates', 'contry_of_res_united kingdom', 'contry_of_res_united states', 'contry_of_res_uruguay', 'contry_of_res_viet nam', 'relation_health care professional', 'relation_others', 'relation_parent', 'relation_relative', 'relation_self']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    df = pd.DataFrame(data, index=[0])  # Convert data to pandas DataFrame

    # Convert 'A1_Score' to 'A10_Score' to numeric
    for i in range(1, 11):
        df[f'A{i}_Score'] = pd.to_numeric(df[f'A{i}_Score'])

    # Convert gender to binary
    df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})

    # Convert boolean columns to binary
    for column in ['jaundice', 'autism', 'used_app_before']:
        df[column] = df[column].map({'Yes': 1, 'No': 0})

    # Convert categorical variables into numerical variables
    df = pd.get_dummies(df, drop_first=True)

    # Add the missing columns with default value as 0
    missing_cols = set(expected_columns) - set(df.columns)
    for c in missing_cols:
        df[c] = 0

    # Ensure the order of column in the test set is in the same order than in train set
    df = df[expected_columns]

    column_names = df.columns.to_list()
    print(column_names)
    prediction = model.predict(df)  # Make prediction using the model

    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(port=5555)
