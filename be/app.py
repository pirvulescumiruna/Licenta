from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import pandas as pd
import pickle
import joblib


model_path = 'final_knn_model.joblib'


model = joblib.load(model_path)
print("Model loaded successfully")

app = Flask(__name__)
CORS(app) 

sensor_data = {
    'temperature': None,
    'humidity': None
}

optimal_conditions_storage = {}

@app.route('/update_sensor_data', methods=['POST'])
def update_sensor_data():
    global sensor_data
    data = request.json
    if not data or 'temperature' not in data or 'humidity' not in data:
        return jsonify({'error': 'Invalid data'}), 400
    sensor_data['temperature'] = data['temperature']
    sensor_data['humidity'] = data['humidity']
    print(f"Updated sensor data: {sensor_data}") 
    return jsonify({'message': 'Sensor data updated successfully'}), 200

@app.route('/get_sensor_data', methods=['GET'])
def get_sensor_data():
    return jsonify(sensor_data), 200

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    print(f"Feedback received: {data}") 
    
    feedback_df = pd.DataFrame({
            'Building Type': [building_type_encoder.transform([data['Building Type']])[0]],
            'Building Function': [building_function_encoder.transform([data['Building Function']])[0]],
            'Sex': [sex_encoder.transform([data['Sex']])[0]],
            'Age': [age_encoder.transform([data['Age']])[0]],
            'Clothing Insulation (clo)': [clothing_insulation_encoder.transform([data['Clothing Insulation (clo)']])[0]],
            'Indoor Temperature (℃)': [[data['Indoor Temperature (℃)']][0]],
            'Indoor Humidity (%)': [[data['Indoor Humidity (%)']][0]],
            'Season': [season_encoder.transform([data['Season']])[0]],
            'Outdoor Temperature (℃)': [[data['Outdoor Temperature (℃)']][0]],
            'Outdoor Humidity (%)': [[data['Outdoor Humidity (%)']][0]],
            'Thermal Comfort Vote': [[data['Thermal Comfort Vote']][0]],
            'Room Volume Category': [room_volume_encoder.transform([data['Room Volume Category']])[0]],
        })

    X_new = feedback_df.drop('Thermal Comfort Vote', axis=1)
    y_new = feedback_df['Thermal Comfort Vote']

    model.fit(X_new, y_new)
    return jsonify({'message': 'Feedback received successfully'}), 200

def load_label_encoder(file_path):
    with open(file_path, 'rb') as file:
        encoder = pickle.load(file)
    return encoder

building_type_encoder = load_label_encoder('label_encoders/Building Type_encoder.pkl')
age_encoder = load_label_encoder('label_encoders/Age_encoder.pkl')
building_function_encoder = load_label_encoder('label_encoders/Building Function_encoder.pkl')
clothing_insulation_encoder = load_label_encoder('label_encoders/Clothing Insulation (clo)_encoder.pkl')
room_volume_encoder = load_label_encoder('label_encoders/Room Volume Category_encoder.pkl')
season_encoder = load_label_encoder('label_encoders/Season_encoder.pkl')
sex_encoder = load_label_encoder('label_encoders/Sex_encoder.pkl')

stored_data = {}


@app.route('/set_data', methods=['POST'])
def set_data():
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    stored_data['latest'] = data
    return jsonify({'message': 'Data stored successfully'}), 200


from apscheduler.schedulers.background import BackgroundScheduler
def scheduled_best_params():
    global optimal_conditions_storage
    with app.app_context():
        if 'latest' not in stored_data:
            print('No data available')
            return

        data = stored_data['latest']
        test_conditions = []
        temperatures = [15, 16, 17, 18, 19, 20, 21, 22, 23]  
        humidities = [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]    

        for temp in temperatures:
            for hum in humidities:
                test_conditions.append({'indoor_temp': temp, 'indoor_humidity': hum})

        results = []

        for condition in test_conditions:
            current_data = pd.DataFrame({
    'Building Type': [float(building_type_encoder.transform([data['Building Type']])[0])],
    'Building Function': [float(building_function_encoder.transform([data['Building Function']])[0])],
    'Sex': [float(sex_encoder.transform([data['Sex']])[0])],
    'Age': [float(age_encoder.transform([data['Age']])[0])],
    'Clothing Insulation (clo)': [float(clothing_insulation_encoder.transform([data['Clothing Insulation (clo)']])[0])],
    'Indoor Temperature (℃)': [float(condition['indoor_temp'])],
    'Indoor Humidity (%)': [float(condition['indoor_humidity'])],
    'Season': [float(season_encoder.transform([data['Season']])[0])],
    'Outdoor Temperature (℃)': [float(data['Outdoor Temperature (℃)'][0])],  
    'Outdoor Humidity (%)': [float(data['Outdoor Humidity (%)'][0])],      
    'Room Volume Category': [float(room_volume_encoder.transform([data['Room Volume Category']])[0])],
    })

            prediction = model.predict(current_data)
            results.append({
                'indoor_temperature': condition['indoor_temp'],
                'indoor_humidity': condition['indoor_humidity'],
                'prediction': prediction[0]
            })

        optimal_condition = min(results, key=lambda x: x['prediction'])
        optimal_conditions_storage['optimal'] = {
        'temperature': optimal_condition['indoor_temperature'],
        'humidity': optimal_condition['indoor_humidity'],
        'prediction': optimal_condition['prediction']
        }
        print(f"Optimal Indoor Temperature: {optimal_condition['indoor_temperature']}°C, "
              f"Indoor Humidity: {optimal_condition['indoor_humidity']}%, "
              f"Prediction: {optimal_condition['prediction']}")

        return jsonify({'message': 'Data stored successfully', 
                    'optimal temperature': optimal_condition['indoor_temperature'], 
                    'optimal humidity':optimal_condition['indoor_humidity']}), 200
        


with app.app_context():
    scheduler = BackgroundScheduler(daemon=True)
    scheduler.add_job(scheduled_best_params, 'interval', minutes=0.2)
    scheduler.start()

@app.route('/get_optimal_conditions', methods=['GET'])
def get_optimal_conditions():
    if 'optimal' in optimal_conditions_storage:
        return jsonify(optimal_conditions_storage['optimal']), 200
    else:
        return jsonify({'error': 'Optimal conditions not available'}), 404

if __name__ == '__main__':
    app.run(debug=True)

