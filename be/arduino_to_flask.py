import serial
import requests
import json
import time

arduino_port = 'COM7'  
baud_rate = 9600
flask_endpoint = 'http://127.0.0.1:5000/update_sensor_data'

ser = serial.Serial(arduino_port, baud_rate)

while True:
    try:
        data = ser.readline().decode('utf-8').strip()
        if data:
            print(f"Data read from serial: {data}")
            sensor_data = json.loads(data)
            response = requests.post(flask_endpoint, json=sensor_data)
            print(f'Data sent: {response.status_code}, {response.json()}')
        time.sleep(2)
    except Exception as e:
        print('Error:', e)
        time.sleep(5)
