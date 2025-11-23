// src/lib/weatherApi.ts

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  wind: number;
  feelsLike: number;
  visibility: string;
  uv: string;
  pressure: string;
  airQuality: number; // Índice AQI Europeu
  sunrise: string;
  sunset: string;
  chanceOfRain: number; // % de chance de chuva
  chartData: number[]; 
}

export interface CitySuggestion {
  id: number;
  name: string;
  admin1?: string; // Estado
  country: string;
  latitude: number;
  longitude: number;
}

const wmoCodes: Record<number, { label: string; condition: string }> = {
  0: { label: "Céu Limpo", condition: "Ensolarado" },
  1: { label: "Predom. Ensolarado", condition: "Ensolarado" },
  2: { label: "Parc. Nublado", condition: "Nublado" },
  3: { label: "Encoberto", condition: "Nublado" },
  45: { label: "Nevoeiro", condition: "Nublado" },
  51: { label: "Garoa Leve", condition: "Chuvoso" },
  61: { label: "Chuva Fraca", condition: "Chuvoso" },
  63: { label: "Chuva Moderada", condition: "Chuvoso" },
  65: { label: "Chuva Forte", condition: "Chuvoso" },
  80: { label: "Pancadas de Chuva", condition: "Chuvoso" },
  95: { label: "Tempestade", condition: "Tempestade" },
};

// 1. Autocomplete
export async function searchCities(query: string): Promise<CitySuggestion[]> {
  if (query.length < 3) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=pt&format=json`
    );
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro no autocomplete:", error);
    return [];
  }
}

// 2. Busca de Clima Completa
export async function fetchWeather(cityData: CitySuggestion): Promise<WeatherData | null> {
  try {
    const [weatherRes, airRes] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,visibility,precipitation_probability&daily=uv_index_max,sunrise,sunset&timezone=auto&forecast_days=1`
      ),
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=european_aqi`
      )
    ]);

    const weather = await weatherRes.json();
    const air = await airRes.json();

    const current = weather.current;
    const daily = weather.daily;
    const hourly = weather.hourly;
    
    const currentHour = new Date().getHours();
    const nextHours = hourly.temperature_2m.slice(currentHour, currentHour + 7);
    
    // Pega a chance de chuva da hora atual
    const currentChanceOfRain = hourly.precipitation_probability[currentHour] || 0;

    const code = current.weather_code as number;
    const info = wmoCodes[code] || { label: "Instável", condition: "Nublado" };

    const formatTime = (isoString: string) => isoString.split("T")[1];

    return {
      city: cityData.name,
      country: cityData.country,
      temp: Math.round(current.temperature_2m),
      condition: info.condition,
      description: info.label,
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      feelsLike: Math.round(current.apparent_temperature),
      visibility: `${(hourly.visibility[currentHour] / 1000).toFixed(1)}km`,
      pressure: `${Math.round(current.surface_pressure)} hPa`,
      uv: daily.uv_index_max[0]?.toFixed(0) || "-",
      sunrise: formatTime(daily.sunrise[0]),
      sunset: formatTime(daily.sunset[0]),
      airQuality: air.current?.european_aqi || 0,
      chanceOfRain: currentChanceOfRain, // Novo dado!
      chartData: nextHours
    };

  } catch (error) {
    console.error("Erro ao buscar clima completo:", error);
    return null;
  }
}