import type { City } from '../lib/model';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

const weatherIcons = {
  0: '☀️',    // Clear sky
  1: '🌤️',    // Mainly clear
  2: '⛅',    // Partly cloudy
  3: '☁️',    // Overcast
  45: '🌫️',   // Fog
  48: '🌫️',   // Depositing rime fog
  51: '🌦️',   // Light drizzle
  53: '🌦️',   // Moderate drizzle
  55: '🌧️',   // Dense drizzle
  61: '🌧️',   // Slight rain
  63: '🌧️',   // Moderate rain
  65: '🌧️',   // Heavy rain
  66: '🌧️',   // Light freezing rain
  67: '🌧️',   // Heavy freezing rain
  71: '❄️',   // Slight snow fall
  73: '❄️',   // Moderate snow fall
  75: '❄️',   // Heavy snow fall
  77: '❄️',   // Snow grains
  80: '🌦️',   // Light rain showers
  81: '🌧️',   // Moderate rain showers
  82: '🌧️',   // Heavy rain showers
  85: '❄️',   // Slight snow showers
  86: '❄️',   // Heavy snow showers
  95: '⛈️',   // Thunderstorm
  96: '⛈️',   // Thunderstorm with slight hail
  99: '⛈️'    // Thunderstorm with heavy hail
};

const ForecastPanel = ({ city }: { city: City }) => {
  if (!city.daily_forecast || city.daily_forecast.length === 0) {
    return <div>No forecast data available</div>;
  }

  // console.log(city)
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b  sm:flex-row">
        <div className="grid flex-1 px-3">
          <CardTitle className="text-xl">{city.city}</CardTitle>
          <CardDescription>{city.state ? `${city.state}, ${city.country}` : city.country}</CardDescription>
        </div>
        <div className="px-3 text-3xl pb-3">{city?.current.temperature_2m}°</div>
      </CardHeader>
      <div className="flex flex-col">
        <div className="flex mt-2 space-x-2 justify-between items-center px-5">
          {city.daily_forecast.map((day, index) => {
            // Format the date for display
            const date = new Date(day.time);

            const dayName = date.toLocaleDateString('de-DE', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });

            return (
              <div key={index} className="flex flex-col items-center p-2 rounded-xl h-20 border w-36 bg-muted">
                <div>
                  <span className="font-medium">{dayName}</span> {monthDay}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="p-2 text-2xl">{weatherIcons[day.weather_code as keyof typeof weatherIcons]}</span>
                  <span className="text-blue-400 text-lg">{Math.round(day.temperature_2m_max)}°</span>
                  <span className="text-gray-400">{Math.round(day.temperature_2m_min)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export { ForecastPanel };