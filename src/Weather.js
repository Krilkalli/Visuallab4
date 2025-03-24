import React from 'react';

const Weather = ({ weatherData, city, location, uvData, isNight, hour, isAntarctica }) => {
    const startIndex = weatherData.list.reduce((closestIndex, forecast, index) => {
        const forecastHour = new Date(forecast.dt_txt).getHours();
        const currentDiff = Math.abs(forecastHour - hour);
        const closestDiff = Math.abs(new Date(weatherData.list[closestIndex].dt_txt).getHours() - hour);
        return currentDiff < closestDiff ? index : closestIndex;
    }, 0);

    const hourlyForecasts = weatherData.list.slice(startIndex, startIndex + 5);

    const formatTime = (hour) => {
        return `${hour}:00`;
    };

    const formatDate = (date) => {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('ru-RU', options);
    };

    const getUvIndexLevel = (value) => {
        if (value <= 2) return 'Низкий';
        if (value <= 5) return 'Умеренный';
        if (value <= 7) return 'Высокий';
        if (value <= 10) return 'Очень высокий';
        return 'Экстремальный';
    };

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            color: isNight ? '#f0f4ff' : '#f0f4ff',
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
            borderRadius: '24px',
            /*background: isNight 
                ? 'linear-gradient(135deg, rgba(16, 20, 40, 0.8), rgba(32, 40, 80, 0.6))' 
                : 'linear-gradient(135deg, rgba(240, 248, 255, 0.8), rgba(200, 220, 255, 0.6))',
            backdropFilter: 'blur(12px)',*/
            boxShadow: isNight 
                ? '0 8px 32px rgba(0, 0, 20, 0.3)'
                : '0 8px 32px rgba(100, 140, 255, 0.2)',
            border: isNight 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.3)'
        }}>
            {/* Шапка с городом и временем */}
            <div style={{
                display: 'flex',
                padding:'0px',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        margin: '0',
                        fontWeight: '700',
                        background: isNight 
                            ? 'linear-gradient(90deg, #f0f4ff, #a0b0ff)'
                            : 'linear-gradient(90deg, #1a1a1a, #3a3a3a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {city}
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        margin: '5px 0 0',
                        color: isNight ? '#c0c8ff' : '#666'
                    }}>
                        {formatTime(hour)}
                    </p>
                </div>
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '500',
                }}>
                    {Math.round(hourlyForecasts[0].main.temp)}°
                </div>
            </div>

            {/* Основная информация о погоде */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '40px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <img
                        src={`https://openweathermap.org/img/wn/${hourlyForecasts[0].weather[0].icon}@4x.png`}
                        alt={hourlyForecasts[0].weather[0].description}
                        style={{
                            width: '120px',
                            height: '120px',
                            filter: isNight ? 'drop-shadow(0 0 8px rgba(160, 180, 255, 0.6))' 
                                           : 'drop-shadow(0 0 8px rgba(100, 140, 255, 0.4))'
                        }}
                    />
                    <div>
                        <p style={{
                            fontSize: '1.5rem',
                            margin: '0 0 5px',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                        }}>
                            {hourlyForecasts[0].weather[0].description}
                        </p>
                        <p style={{
                            fontSize: '1rem',
                            margin: '0',
                            color: isNight ? '#c0c8ff' : '#666'
                        }}>
                            Ощущается как {Math.round(hourlyForecasts[0].main.feels_like)}°
                        </p>
                    </div>
                </div>
            </div>

            {/* Почасовой прогноз */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '15px',
                marginBottom: '40px',
                overflowX: 'auto',
                paddingBottom: '15px'
            }}>
                {hourlyForecasts.map((forecast, index) => (
                    <div key={index} style={{
                        minWidth: '80px',
                        textAlign: 'center',
                        padding: '15px 10px',
                        borderRadius: '16px',
                        background: isNight 
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(5px)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                    }}>
                        <p style={{
                            margin: '0 0 10px',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            {index === 0 ? 'Сейчас' : formatTime(new Date(forecast.dt_txt).getHours())}
                        </p>
                        <img
                            src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                            alt={forecast.weather[0].description}
                            style={{
                                width: '50px',
                                height: '50px',
                                margin: '0 auto 10px',
                                filter: isNight ? 'drop-shadow(0 0 4px rgba(160, 180, 255, 0.6))' 
                                               : 'drop-shadow(0 0 4px rgba(100, 140, 255, 0.4))'
                            }}
                        />
                        <p style={{
                            margin: '0',
                            fontWeight: '600',
                            fontSize: '1.2rem'
                        }}>
                            {Math.round(forecast.main.temp)}°
                        </p>
                    </div>
                ))}
            </div>

            {/* Детали погоды */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <WeatherDetail 
                    icon="💧" 
                    label="Влажность" 
                    value={`${hourlyForecasts[0].main.humidity}%`}
                    isNight={isNight}
                />
                <WeatherDetail 
                    icon="🌬️" 
                    label="Ветер" 
                    value={`${Math.round(hourlyForecasts[0].wind.speed)} м/с`}
                    isNight={isNight}
                />
                <WeatherDetail 
                    icon="⏱️" 
                    label="Давление" 
                    value={`${hourlyForecasts[0].main.pressure} hPa`}
                    isNight={isNight}
                />
                <WeatherDetail 
                    icon="☀️" 
                    label="УФ индекс" 
                    value={`${Math.round(uvData.value)} (${getUvIndexLevel(uvData.value)})`}
                    isNight={isNight}
                />
            </div>

            {/* Прогноз на 5 дней */}
            <div>
                <h3 style={{
                    fontSize: '1.3rem',
                    margin: '0 0 20px',
                    fontWeight: '600'
                }}>
                    Прогноз на 5 дней
                </h3>
                <div style={{
                    display: 'grid',
                    gap: '15px'
                }}>
                    {weatherData.list
                        .filter((forecast, index) => (index + 1) % 8 === 0)
                        .slice(0, 5)
                        .map((forecast, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 20px',
                                borderRadius: '16px',
                                background: isNight 
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(5px)'
                            }}>
                                <p style={{
                                    margin: '0',
                                    fontWeight: '500',
                                    minWidth: '120px'
                                }}>
                                    {formatDate(new Date(forecast.dt_txt))}
                                </p>
                                <img
                                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                    alt={forecast.weather[0].description}
                                    style={{
                                        width: '40px',
                                        height: '40px'
                                    }}
                                />
                                <p style={{
                                    margin: '0',
                                    fontWeight: '600',
                                    fontSize: '1.2rem',
                                    minWidth: '50px',
                                    textAlign: 'right'
                                }}>
                                    {Math.round(forecast.main.temp)}°
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const WeatherDetail = ({ icon, label, value, isNight }) => (
    <div style={{
        padding: '15px',
        borderRadius: '16px',
        background: isNight 
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(5px)'
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
        }}>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            <p style={{
                margin: '0',
                fontWeight: '500',
                fontSize: '0.9rem',
                color: isNight ? '#c0c8ff' : '#666'
            }}>
                {label}
            </p>
        </div>
        <p style={{
            margin: '0',
            fontWeight: '600',
            fontSize: '1.3rem'
        }}>
            {value}
        </p>
    </div>
    
);
const globalStyles = `
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);
export default Weather;