import React, { useState, useEffect } from 'react';
import Weather from './Weather';

const API_KEY = 'c72e2d77ed6dd09c20f9f5b2c491b94e';

const App = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [uvData, setUvData] = useState(null);
    const [city, setCity] = useState('Novosibirsk');
    const [inputCity, setInputCity] = useState('');
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [currentTime, setCurrentTime] = useState(new Date());


    useEffect(() => {
        const loadWeather = async () => {
                const geoResp = await fetch(
                    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
                );
                const geoData = await geoResp.json();

                if (geoData.length === 0) {
                    alert('Город не найден. Пожалуйста, введите корректное название города.');
                    return;
                }

                const { lat, lon } = geoData[0];
                setLocation({ lat, lon });

                const weatherResp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                const weatherData = await weatherResp.json();
                setWeatherData(weatherData);

                const uvResp = await fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                const uvData = await uvResp.json();
                setUvData(uvData);
           
        };

        loadWeather();
        const weatherInterval = setInterval(loadWeather, 3 * 3600 * 1000);
        return () => clearInterval(weatherInterval);
    }, [city]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    const isNight = currentTime.getHours() >= 18 || currentTime.getHours() < 6;
    const backgroundImage = isNight ? "url('/images/notch.jpg')" : "url('/images/utro.png')";
    //const backgroundImage = isNight ? "url('/images/utro.png')" : "url('/images/utro.png')";
    
    const hour = currentTime.getHours();

    const handleCityChange = (e) => {
        setInputCity(e.target.value);
    };

    const handleSearch = () => {
        if (inputCity.trim() !== '') {
            setCity(inputCity.trim());
        }
    };


    return (
      <><div
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          textAlign: 'center',
          margin: 0,
          backgroundImage: backgroundImage,
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={inputCity}
            onChange={handleCityChange}
            placeholder="Введите город"
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginRight: '10px',
            }} />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#979aaa',
              color: '#0a010d',
              cursor: 'pointer',
            }}
          >
            Поиск
          </button>
        </div>
        {weatherData && uvData ? (
          <Weather weatherData={weatherData} city={city} location={location} uvData={uvData} isNight={isNight} hour={hour} isAntarctica={city.toLocaleLowerCase()==="антарктида"}/>
        ) : (
          <p style={{ color: '#fff' }}>Загрузка данных о погоде...</p>
        )}
      </div></>
    );
};

export default App;