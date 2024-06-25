import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './AdminPage.css'; 
import sunIcon from './icons/sun-icon.png'; 
import sunCloudIcon from './icons/sun-cloud.png';
import cloudIcon from './icons/clouds.png';
import editIcon from './icons/edit-icon.png';

const locations = [
  "Abrud", "Adjud", "Agnita", "Aiud", "Alba Iulia", "Aleșd", "Alexandria", "Amara", "Anina", "Aninoasa", 
  "Arad", "Ardud", "Avrig", "Azuga", "Babadag", "Băbeni", "Bacău", "Baia de Aramă", "Baia de Arieș", "Baia Mare", 
  "Baia Sprie", "Băicoi", "Băile Govora", "Băile Herculane", "Băile Olănești", "Băilești", "Băile Tușnad", "Bălan", 
  "Bălcești", "Balș", "Băneasa", "Baraolt", "Bârlad", "Bechet", "Beclean", "Beiuș", "Berbești", "Berești", 
  "Bicaz", "Bistrița", "Blaj", "Bocșa", "Boldești-Scăeni", "Bolintin-Vale", "Borșa", "Borsec", "Botoșani", "Brad", 
  "Bragadiru", "Brăila", "Brașov", "Breaza", "Brețcu", "Broșteni", "Bucecea", "București", "Budești", "Buftea", 
  "Buhuși", "Bumbești-Jiu", "Bușteni", "Buzău", "Buziaș", "Cajvana", "Calafat", "Călan", "Călărași", "Călimănești", 
  "Câmpeni", "Câmpia Turzii", "Câmpina", "Câmpulung", "Câmpulung Moldovenesc", "Caracal", "Caransebeș", "Carei", 
  "Cavnic", "Căzănești", "Cehu Silvaniei", "Cernavodă", "Chișineu-Criș", "Chitila", "Ciacova", "Cisnădie", 
  "Cluj-Napoca", "Codlea", "Comănești", "Comarnic", "Constanța", "Copșa Mică", "Corabia", "Costești", "Covasna", 
  "Craiova", "Cristuru Secuiesc", "Cugir", "Curtea de Argeș", "Curtici", "Dăbuleni", "Darabani", "Dărmănești", "Dej", 
  "Deta", "Deva", "Dolhasca", "Dorohoi", "Drăgănești-Olt", "Drăgășani", "Dragomirești", "Drobeta-Turnu Severin", 
  "Dumbrăveni", "Eforie", "Făgăraș", "Făget", "Fălticeni", "Făurei", "Fetești", "Fieni", "Fierbinți-Târg", "Filiași", 
  "Flămânzi", "Focșani", "Frasin", "Fundulea", "Găești", "Galați", "Gătaia", "Geoagiu", "Gheorgheni", "Gherla", 
  "Ghimbav", "Giurgiu", "Gura Humorului", "Hârlău", "Hârșova", "Hațeg", "Horezu", "Huedin", "Hunedoara", "Huși", 
  "Ianca", "Iași", "Iernut", "Ineu", "Însurăței", "Întorsura Buzăului", "Isaccea", "Jibou", "Jimbolia", "Lehliu Gară", 
  "Lipova", "Liteni", "Livada", "Luduș", "Lugoj", "Lupeni", "Măcin", "Măgurele", "Mangalia", "Mărășești", "Marghita", 
  "Medgidia", "Mediaș", "Miercurea Ciuc", "Miercurea Nirajului", "Miercurea Sibiului", "Mihăilești", "Milișăuți", 
  "Mioveni", "Mizil", "Moinești", "Moldova Nouă", "Moreni", "Motru", "Murfatlar", "Murgeni", "Nădlac", "Năsăud", 
  "Năvodari", "Negrești", "Negrești-Oaș", "Negru Vodă", "Nehoiu", "Novaci", "Nucet", "Ocna Mureș", "Ocna Sibiului", 
  "Ocnele Mari", "Odobești", "Odorheiu Secuiesc", "Oltenița", "Onești", "Oradea", "Orăștie", "Oravița", "Orșova", 
  "Oțelu Roșu", "Otopeni", "Ovidiu", "Panciu", "Pâncota", "Pantelimon", "Pașcani", "Pătârlagele", "Pecica", "Petrila", 
  "Petroșani", "Piatra-Olt", "Piatra Neamț", "Pitești", "Ploiești", "Plopeni", "Podu Iloaiei", "Pogoanele", 
  "Popești-Leordeni", "Potcoava", "Predeal", "Pucioasa", "Răcari", "Rădăuți", "Râmnicu Sărat", "Râmnicu Vâlcea", 
  "Râșnov", "Recaș", "Reghin", "Reșița", "Roman", "Roșiorii de Vede", "Rovinari", "Roznov", "Rupea", "Săcele", 
  "Săcueni", "Salcea", "Săliște", "Săliștea de Sus", "Salonta", "Sângeorgiu de Pădure", "Sângeorz-Băi", 
  "Sânnicolau Mare", "Sântana", "Sărmașu", "Satu Mare", "Săveni", "Scornicești", "Sebeș", "Sebiș", "Segarcea", 
  "Seini", "Sfântu Gheorghe", "Sibiu", "Sighetu Marmației", "Sighișoara", "Simeria", "Sinaia", "Siret", "Slănic", 
  "Slănic-Moldova", "Slatina", "Slobozia", "Solca", "Șomcuta Mare", "Sovata", "Ștefănești", "Ștefănești", "Ștei", 
  "Strehaia", "Suceava", "Sulina", "Tălmaciu", "Țăndărei", "Târgoviște", "Târgu Bujor", "Târgu Cărbunești", 
  "Târgu Frumos", "Târgu Jiu", "Târgu Lăpuș", "Târgu Mureș", "Târgu Neamț", "Târgu Ocna", "Târgu Secuiesc", 
  "Târnăveni", "Tășnad", "Tăuții-Măgherăuș", "Techirghiol", "Tecuci", "Teiuș", "Țicleni", "Timișoara", "Tismana", 
  "Titu", "Toplița", "Topoloveni", "Tulcea", "Turceni", "Turda", "Turnu Măgurele", "Ulmeni", "Ungheni", "Uricani", 
  "Urlați", "Urziceni", "Valea lui Mihai", "Vălenii de Munte", "Vânju Mare", "Vașcău", "Vaslui", "Vatra Dornei", 
  "Vicovu de Sus", "Victoria", "Videle", "Vișeu de Sus", "Vlăhița", "Voluntari", "Vulcan", "Zalău", "Zărnești", 
  "Zimnicea", "Zlatna", "Șimleu Silvaniei"
];

const AdminPage = () => {
  const [optimalConditions, setOptimalConditions] = useState({temperature: null, humidity: null});
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [showVolumeDropdown, setShowVolumeDropdown] = useState(false); 
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedVolume, setSelectedVolume] = useState(''); 
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [submittedLocation, setSubmittedLocation] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [temperature, setTemperature] = useState(parseFloat(localStorage.getItem('temperature')));
  const [humidity, setHumidity] = useState(parseFloat(localStorage.getItem('humidity')));
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [showOccupantForm, setShowOccupantForm] = useState(localStorage.getItem('showOccupantForm') === 'true');
  const [age, setAge] = useState('');
  const [clothing, setClothing] = useState('');
  const [showWeather, setShowWeather] = useState(localStorage.getItem('showWeather') === 'true');
  const [season, setSeason] = useState('');

  const apiKey = '1a55c1acae16e40496ede4e405145a64'; 

 
   
  useEffect(() => {
    const savedRoom = localStorage.getItem('selectedRoom');
    const savedBuilding = localStorage.getItem('selectedBuilding');
    const savedLocation = localStorage.getItem('selectedLocation');
    const savedVolume = localStorage.getItem('selectedVolume');
    const roomConfigured = localStorage.getItem('roomConfigured') === 'true';
    const savedTemperature = localStorage.getItem('locationTemperature');
    const savedHumidity = localStorage.getItem('locationHumidity');
    localStorage.setItem('showWeather', showWeather.toString());
    localStorage.setItem('showOccupantForm', showOccupantForm.toString());

    if (roomConfigured) {
      setSelectedRoom(savedRoom);
      setSelectedVolume(savedVolume);
      setSelectedBuilding(savedBuilding);
      setSelectedLocation(savedLocation);
      setIsEditing(false); 
      setTemperature(savedTemperature ? parseFloat(savedTemperature) : null);
      setHumidity(savedHumidity ? parseFloat(savedHumidity) : null);
    }
  }, []);

  const handleRoomClick = () => {
    if (isEditing) {
      setShowRoomDropdown(!showRoomDropdown);
      setShowBuildingDropdown(false); 
      setShowLocationDropdown(false);
      setShowVolumeDropdown(false);
    }
  };
  
  const fetchOptimalConditions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_optimal_conditions');
      if(response.status === 200) {
          setOptimalConditions({
              temperature: response.data.temperature,
              humidity: response.data.humidity
          });
      }
        console.log('optimal conditions: ' , response.data.optimal_humidity)
    } catch (error) {
        console.error('Failed to fetch optimal conditions:', error);
    }
};


useEffect(() => {
  const interval = setInterval(() => {
    fetchOptimalConditions();
  }, 10000); 

  return () => clearInterval(interval); 
}, []); 

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


  const handleBuildingClick = () => {
    if (isEditing) {
      setShowBuildingDropdown(!showBuildingDropdown);
      setShowRoomDropdown(false); 
      setShowLocationDropdown(false);
      setShowVolumeDropdown(false);
    }
  };

  const roomTypeMappings = {
    'Bedroom': 'Dormitor',
    'Living room': 'Living',
    'Office': 'Birou',
    'Classroom': 'Clasă',
    'Other': 'Altul'
  };
  

  const volumeMappings = {
    '1-300': 'Mic',
    '300-700': 'Mediu',
    '700+': 'Mare',
    '0': 'Necunoscut'
  };  

  const handleLocationClick = () => {
    if (isEditing) {
      setShowLocationDropdown(!showLocationDropdown);
      setShowRoomDropdown(false); 
      setShowBuildingDropdown(false);
      setShowVolumeDropdown(false);
    }
  };

  const handleVolumeClick = () => {
    if (isEditing) {
      setShowVolumeDropdown(!showVolumeDropdown);
      setShowRoomDropdown(false); 
      setShowBuildingDropdown(false);
      setShowLocationDropdown(false);
    }
  };

  const handleRoomTypeSelect = (type) => {
    setSelectedRoom(type);
    setShowRoomDropdown(false);
  };

  const handleBuildingTypeSelect = (type) => {
    setSelectedBuilding(type);
    setShowBuildingDropdown(false);
  };

  const handleVolumeSelect = (type) => {
    setSelectedVolume(type);
    setShowVolumeDropdown(false);
  };

  const handleLocationTypeSelect = (type) => {
    setSelectedLocation(type);
    setShowLocationDropdown(false);
  };

  const fetchWeather = async (location) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
      const { temp, humidity } = response.data.main;
      setTemperature(temp);
      setHumidity(humidity);
      setShowMessage(true);
      localStorage.setItem('temperature', temp.toString());
      localStorage.setItem('humidity', humidity.toString());
      localStorage.setItem('showMessage', 'true');
      setError('');
    } catch (error) {
      setError('Could not fetch the weather data.');
      setTemperature(null);
      setHumidity(null);
      localStorage.removeItem('temperature');
      localStorage.removeItem('humidity');
      localStorage.setItem('showMessage', 'false');
    }
  };

  const handleSubmit = async () => {
    determineSeason(); 
  };

  useEffect(() => {
    if (season) {
      actualSubmit(); 
    }
  }, [season]);

  const actualSubmit  = async () => {
    setSubmittedLocation(selectedLocation);
    setShowMessage(true);
    setIsEditing(false); 
    localStorage.setItem('roomConfigured', 'true'); 
    localStorage.setItem('selectedRoom', selectedRoom); 
    localStorage.setItem('selectedBuilding', selectedBuilding); 
    localStorage.setItem('selectedLocation', selectedLocation); 
    localStorage.setItem('selectedVolume', selectedVolume); 
    setShowOccupantForm(true);
    setShowWeather(true);
    localStorage.setItem('showWeather', 'true');
    localStorage.setItem('showOccupantForm', 'true');
    await fetchWeather(selectedLocation);
    };

    const handleSubmit_form = async (event) => {
      event.preventDefault();
      determineSeason();
      const formData = {
        'Building Type': selectedBuilding,
        'Building Function': selectedRoom,
        'Sex': 'Unknown',
        'Age': age,
        'Clothing Insulation (clo)': clothing,
        'Season': season,
        'Room Volume Category': selectedVolume,
        'Outdoor Temperature (℃)': localStorage.temperature,
        'Outdoor Humidity (%)': localStorage.humidity
        }


    console.log('Form data being submitted:', formData);
    saveToLocalStorage(formData);

    try {
      await axios.post('http://127.0.0.1:5000/set_data', formData);
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
  
  const buildingTypeMappings = {
    'Residential': 'Locuință',
    'Office': 'Birou',
    'Educational': 'Educațional'
  };  

  const toggleEditing = () => {
    if (!isEditing) {
      setShowModal(true);
    } else {
      setIsEditing(!isEditing);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmToggleEditing = () => {
    setShowModal(false);
    setIsEditing(true);
    localStorage.removeItem('roomConfigured'); 
    localStorage.removeItem('selectedRoom'); 
    localStorage.removeItem('selectedBuilding'); 
    localStorage.removeItem('selectedLocation'); 
    localStorage.removeItem('selectedVolume'); 
    localStorage.removeItem('locationTemperature');
    localStorage.removeItem('locationHumidity');
  };

  const isSubmitEnabled = selectedRoom && selectedBuilding && selectedLocation && selectedVolume;

  const getWeatherIcon = () => {
    if (localStorage.temperature === null) return null;
    if (localStorage.temperature > 20) {
      return sunIcon;
    } else if (localStorage.temperature >= 10 && temperature <= 20) {
      return sunCloudIcon;
    } else {
      return cloudIcon;
    }
  };

  return (
    <div className="admin-options-container">
    <div className="edit-switch">
      <span className="edit-switch-text">Editează</span>
      <input
        type="checkbox"
        className="edit-switch-checkbox"
        id="editSwitch"
        checked={!isEditing}
        onChange={toggleEditing}
      />
      <label className="edit-switch-label" htmlFor="editSwitch">
        <span className="edit-switch-inner" />
        <span className="edit-switch-switch" />
      </label>
    </div>
      <div className={`admin-options-wrapper ${!isEditing ? 'disabled' : ''}`}>
        {!isEditing && <div className="overlay"></div>}
        <div className="admin-options">
        <div className="admin-option" onClick={handleVolumeClick}>
  {selectedVolume ? (
    <>
      <div className="selected-building">Volumul camerei</div>
      <div className="selected-building-type">{volumeMappings[selectedVolume]}</div>  {}
    </>
  ) : (
    'Volumul camerei'
  )}
  <div className={`building-dropdown ${showVolumeDropdown ? 'active' : ''}`}>
    <div className="dropdown-item" onClick={() => handleVolumeSelect('1-300')}>Mic</div>
    <div className="dropdown-item" onClick={() => handleVolumeSelect('300-700')}>Mediu</div>
    <div className="dropdown-item" onClick={() => handleVolumeSelect('700+')}>Mare</div>
    <div className="dropdown-item" onClick={() => handleVolumeSelect('0')}>Necunoscut</div>
  </div>
</div>

<div className="admin-option" onClick={handleBuildingClick}>
  {selectedBuilding ? (
    <>
      <div className="selected-building">Tipul clădirii</div>
      <div className="selected-building-type">{buildingTypeMappings[selectedBuilding]}</div> {}
    </>
  ) : (
    'Tipul clădirii'
  )}
  <div className={`building-dropdown ${showBuildingDropdown ? 'active' : ''}`}>
    <div className="dropdown-item" onClick={() => handleBuildingTypeSelect('Residential')}>Locuință</div>
    <div className="dropdown-item" onClick={() => handleBuildingTypeSelect('Office')}>Birou</div>
    <div className="dropdown-item" onClick={() => handleBuildingTypeSelect('Educational')}>Educațional</div>
  </div>
</div>

<div className="admin-option" onClick={handleRoomClick}>
  {selectedRoom ? (
    <>
      <div className="selected-room">Scopul clădirii</div>
      <div className="selected-room-type">{roomTypeMappings[selectedRoom]}</div> {}
    </>
  ) : (
    'Scopul clădirii'
  )}
  <div className={`room-dropdown ${showRoomDropdown ? 'active' : ''}`}>
    <div className="dropdown-item" onClick={() => handleRoomTypeSelect('Bedroom')}>Dormitor</div>
    <div className="dropdown-item" onClick={() => handleRoomTypeSelect('Living room')}>Living</div>
    <div className="dropdown-item" onClick={() => handleRoomTypeSelect('Office')}>Birou</div>
    <div className="dropdown-item" onClick={() => handleRoomTypeSelect('Classroom')}>Clasă</div>
    <div className="dropdown-item" onClick={() => handleRoomTypeSelect('Other')}>Altul</div>
  </div>
</div>
          <div className="admin-option" onClick={handleLocationClick}>
            {selectedLocation ? (
              <>
                <div className="selected-location">Locație</div>
                <div className="selected-location-type">{selectedLocation}</div>
              </>
            ) : (
              'Locație'
            )}
            <div className={`location-dropdown ${showLocationDropdown ? 'active' : ''}`}>
              {locations.map((location, index) => (
                <div key={index} className="dropdown-item" onClick={() => handleLocationTypeSelect(location)}>
                  {location}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className={`submit-button ${isSubmitEnabled ? 'enabled' : ''}`}
          onClick={handleSubmit}
          disabled={!isSubmitEnabled || !isEditing}
        >
          Setează
        </button>
      </div>
      <div className="dashboard-container">
      <div className="weather-section">
      {showWeather && (
        <div className="message-box">
          <p>Vremea în {localStorage.selectedLocation}</p>
          {localStorage.temperature !== null && (
            <div className="weather-info">
              <div className="temperature-section">
                <img src={getWeatherIcon()} alt="Weather icon" className="weather-icon" />
                <span className="temperature">{localStorage.temperature}°C</span>
              </div>
              <span className="humidity">Umiditate: {localStorage.humidity}%</span>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      )}
      </div>
      {optimalConditions.temperature && optimalConditions.humidity && (
    <div className="optimal-conditions">
      <p>Condiții Optime:</p>
      <p>Temperatură: {optimalConditions.temperature}°C</p>
      <p>Umiditate: {optimalConditions.humidity}%</p>
    </div>
    )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <p>
            Puteți avea o singură clădire în contul dvs. Dacă o editați, cea curenta și feedback-ul de la aceasta vor fi eliminate.</p>
            <button onClick={confirmToggleEditing}>Confirm</button>
          </div>
        </div>
      )}

<div className="admin-page">
  </div>
   {showOccupantForm && (
        <div className="form-section">
          <h2>Informații despre locatari</h2>
          <form>
            <div className="form-group">
              <label>Care este media de vârstă a locatarilor?</label>
              <select value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">Selecteaza vârsta</option>
                <option value="9-17">9-17</option>
                <option value="18-30">18-30</option>
                <option value="31-40">31-40</option>
                <option value="41-50">41-50</option>
                <option value="51-60">51-60</option>
                <option value=">60">{">"}60</option>
                <option value="0">Prefer să nu menționez</option>
              </select>
            </div>
          
            <div className="form-group">
              <label>Cât de gros sunt îmbracați locatarii?</label>
              <div className="radio-group">
                <label><input type="radio" value="light" checked={clothing === 'light'} onChange={() => setClothing('light')} />Subțire</label>
                <label><input type="radio" value="medium" checked={clothing === 'medium'} onChange={() => setClothing('medium')} />Mediu</label>
                <label><input type="radio" value="heavy" checked={clothing === 'heavy'} onChange={() => setClothing('heavy')} />Gros</label>
              </div>
            </div>
            <button type="submit"
            onClick={handleSubmit_form}>
           Trimite formularul</button>
          </form>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminPage;