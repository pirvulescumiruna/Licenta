import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [comfort, setComfort] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [buildingFunction, setBuildingFunction] = useState('');
  const [roomVolume, setRoomVolume] = useState('');
  const [clothing, setClothing] = useState('');
  const [season, setSeason] = useState('');
  const [isRoomConfigured, setIsRoomConfigured] = useState(false);
  const [sensorData, setSensorData] = useState({ temperature: null, humidity: null });
  const [locationData, setLocationData] = useState({ temperature: null, humidity: null });

  useEffect(() => {
    const roomConfigured = localStorage.getItem('roomConfigured') === 'true';
    if (roomConfigured) {
      fetchBuildingInfo();
      setIsRoomConfigured(true);
    }
    determineSeason(); 
  }, []);

  const fetchBuildingInfo = () => {
    const savedBuildingType = localStorage.getItem('selectedBuilding');
    const savedBuildingFunction = localStorage.getItem('selectedRoom');
    const savedRoomVolume = localStorage.getItem('selectedVolume');
    setRoomVolume(savedRoomVolume);
    setBuildingType(savedBuildingType);
    setBuildingFunction(savedBuildingFunction);
  };

  const fetchSensorData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_sensor_data');
      console.log('Fetched sensor data:', response.data);
      setSensorData(response.data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const fetchLocationData = () => {
    const temperature = localStorage.getItem('locationTemperature');
    const humidity = localStorage.getItem('locationHumidity');
    setLocationData({ temperature: parseFloat(temperature), humidity: parseFloat(humidity) });
  };

  const determineSeason = () => {
    const today = new Date();
    const month = today.getMonth() + 1; 
    if ([12, 1, 2].includes(month)) {
      setSeason('Winter Season');
    } else if ([3, 4, 5, 9, 10, 11].includes(month)) {
      setSeason('Transition Season');
    } else {
      setSeason('Summer Season');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetchSensorData();
    fetchLocationData();

    const formData = {
      'Sex': sex,
      'Age': age,
      'Clothing Insulation (clo)': clothing,
      'Thermal Comfort Vote': comfort,
      'Building Type': buildingType,
      'Building Function': buildingFunction,
      'Indoor Temperature (℃)': sensorData.temperature,
      'Indoor Humidity (%)': sensorData.humidity,
      'Outdoor Temperature (℃)': localStorage.humidity,
      'Outdoor Humidity (%)': localStorage.humidity,
      'Season': season,
      'Room Volume Category': roomVolume
    };

    console.log('Form data being submitted:', formData);
    saveToLocalStorage(formData);

    try {
      await axios.post('http://127.0.0.1:5000/submit_feedback', formData);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    }
  };

  const saveToLocalStorage = (data) => {
    const existingData = JSON.parse(localStorage.getItem('userData')) || [];
    existingData.push(data);
    localStorage.setItem('userData', JSON.stringify(existingData));
  };

  if (!isRoomConfigured) {
    return (
      <div className="user-profile">
        <h1>User Profile</h1>
        <p>Nu aveți o cameră setata. Vă rugăm să cereți administratorului dvs. să configureze configurația camerei pentru a putea oferi feedback.</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <form onSubmit={handleSubmit}>
        <h1>Formular de feedback</h1>
        <div className="form-group">
          <label>Sex:</label>
          <div className="radio-group">
            <label><input type="radio" value="Female" checked={sex === 'Female'} onChange={() => setSex('Female')} />Feminin</label>
            <label><input type="radio" value="Male" checked={sex === 'Male'} onChange={() => setSex('Male')} />Masculin</label>
            <label><input type="radio" value="Unknown" checked={sex === 'Unknown'} onChange={() => setSex('Unknown')} />Prefer să nu menționez</label>
          </div>
        </div>
        <div className="form-group">
          <label>Vârstă:</label>
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Selectează vârstă</option>
            <option value="9-17">9-17</option>
            <option value="18-30">18-30</option>
            <option value="31-40">31-40</option>
            <option value="41-50">41-50</option>
            <option value="51-60">51-60</option>
            <option value=">60">{'>'}60</option>
            <option value="0">Prefer să nu menționez</option>
          </select>
        </div>
        <div className="form-group">
          <label>Cât de confortabil te simți? (1= foarte confortabil, 5 = foarte inconfortabil)</label>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map(value => (
              <label key={value}>
                <input type="radio" value={value} checked={comfort === value} onChange={() => setComfort(value)} />
                {value}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Cât de gros ești îmbrăcat?</label>
          <div className="radio-group">
            <label><input type="radio" value="light" checked={clothing === 'light'} onChange={() => setClothing('light')} />Subțire</label>
            <label><input type="radio" value="medium" checked={clothing === 'medium'} onChange={() => setClothing('medium')} />Mediu</label>
            <label><input type="radio" value="heavy" checked={clothing === 'heavy'} onChange={() => setClothing('heavy')} />Gros</label>
          </div>
        </div>
        <button type="submit">Trimite</button>
      </form>
    </div>
  );
};

export default UserProfile;
