
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    try {
      // Using OpenWeatherMap API (free tier)
      const apiKey = "bd5e378503939ddaee76f12ad7a97608"; // This is a public API key for demo purposes
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(response.status === 404 
          ? "City not found" 
          : "Failed to fetch weather data");
      }
      
      const data = await response.json();
      setWeather(data);
      toast({
        title: "Weather fetched",
        description: `Current weather for ${data.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Hermes Weather App</h1>
      
      <form onSubmit={fetchWeather} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter a city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
          >
            {loading ? "Searching..." : "Get Weather"}
          </button>
        </div>
      </form>

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold">{weather.name}, {weather.sys.country}</h2>
              <div className="text-gray-600 text-sm mt-1">
                <span>Sunrise: {formatDate(weather.sys.sunrise)}</span>
                <span className="mx-2">|</span>
                <span>Sunset: {formatDate(weather.sys.sunset)}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <img 
                src={getWeatherIcon(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
                className="w-16 h-16"
              />
              <div className="text-5xl font-bold ml-2">{Math.round(weather.main.temp)}°C</div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-xl capitalize">{weather.weather[0].description}</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Feels Like</p>
                <p className="text-lg font-medium">{Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="text-lg font-medium">{weather.main.humidity}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Wind</p>
                <p className="text-lg font-medium">{Math.round(weather.wind.speed * 3.6)} km/h</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Pressure</p>
                <p className="text-lg font-medium">{weather.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Powered by OpenWeatherMap</p>
      </div>
    </div>
  );
};

export default Weather;
