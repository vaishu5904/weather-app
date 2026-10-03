const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export const DEFAULT_CITY = 'New Delhi'

function finiteNumber(value, fieldName) {
  const parsedValue = Number(value)
  if (!Number.isFinite(parsedValue)) {
    throw new Error(`The weather response is missing valid ${fieldName} data.`)
  }
  return parsedValue
}

export function normalizeWeatherResponse(data) {
  const condition = data?.weather?.[0]
  if (!data?.main || !condition || !data?.wind) {
    throw new Error('The weather service returned an incomplete response.')
  }

  return {
    cityName: String(data.name || '').trim(),
    countryCode: String(data.sys?.country || '').trim(),
    tempC: finiteNumber(data.main.temp, 'temperature'),
    feelsLikeC: finiteNumber(data.main.feels_like, 'feels-like temperature'),
    tempMinC: finiteNumber(data.main.temp_min, 'low temperature'),
    tempMaxC: finiteNumber(data.main.temp_max, 'high temperature'),
    humidity: finiteNumber(data.main.humidity, 'humidity'),
    windSpeedMs: finiteNumber(data.wind.speed, 'wind speed'),
    description: String(condition.description || 'Conditions unavailable'),
    condition: String(condition.main || '').toLowerCase(),
    iconCode: String(condition.icon || ''),
    observedAt: finiteNumber(data.dt, 'observation time'),
    timezoneOffset: finiteNumber(data.timezone ?? 0, 'timezone'),
  }
}

export async function fetchWeather(city, { signal } = {}) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!apiKey) {
    throw new Error('Add VITE_OPENWEATHER_API_KEY to your .env file to load live weather.')
  }

  const parameters = new URLSearchParams({
    q: city.trim(),
    units: 'metric',
    appid: apiKey,
  })
  const response = await fetch(`${API_BASE_URL}?${parameters}`, { signal })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The weather service returned an unreadable response.')
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('The OpenWeatherMap API key is invalid or not active yet.')
    }
    if (response.status === 404) {
      throw new Error('Location not found. Try a city name such as Tokyo or Paris.')
    }
    throw new Error(data?.message || 'Weather data could not be loaded. Please try again.')
  }

  return normalizeWeatherResponse(data)
}