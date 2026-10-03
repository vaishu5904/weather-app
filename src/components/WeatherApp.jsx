import { useEffect, useRef, useState } from 'react'
import { Alert, Box, Container, Typography } from '@mui/material'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import InfoBox from './InfoBox.jsx'
import SearchBox from './SearchBox.jsx'
import { DEFAULT_CITY, fetchWeather } from '../services/weatherApi.js'

function getWeatherTheme(weather) {
  if (weather.condition.includes('snow') || weather.tempC <= 0) return 'frost'
  if (weather.condition.includes('thunder')) return 'storm'
  if (weather.condition.includes('rain') || weather.condition.includes('drizzle')) return 'rain'
  if (weather.condition.includes('cloud')) return 'clouds'
  if (['mist', 'fog', 'haze', 'smoke', 'dust'].some((condition) => weather.condition.includes(condition))) {
    return 'mist'
  }
  return 'clear'
}

export default function WeatherApp() {
  const [city, setCity] = useState(DEFAULT_CITY)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState('celsius')
  const requestController = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    requestController.current = controller

    fetchWeather(DEFAULT_CITY, { signal: controller.signal })
      .then(setWeather)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const searchWeather = async (query) => {
    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setLoading(true)
    setError('')

    try {
      const nextWeather = await fetchWeather(query, { signal: controller.signal })
      if (!controller.signal.aborted) setWeather(nextWeather)
    } catch (requestError) {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  const theme = weather ? getWeatherTheme(weather) : 'clear'

  return (
    <Box className={`app-shell weather-${theme}`}>
      <Container maxWidth="md" className="page-container">
        <Box component="header" className="topbar">
          <Box className="brand-lockup">
            <Box className="brand-mark"><WbSunnyRoundedIcon /></Box>
            <Typography className="brand-name">weatherly</Typography>
          </Box>
          <Typography className="live-label"><span /> Live conditions</Typography>
        </Box>

        <Box component="main">
          <Box className="intro">
            <Typography className="eyebrow">Your sky, right now</Typography>
            <Typography component="h1">Find your <em>forecast.</em></Typography>
            <Typography className="intro-copy">Search any city to see what the day feels like there.</Typography>
          </Box>

          <SearchBox city={city} onCityChange={setCity} onSearch={searchWeather} loading={loading} />
          {error && <Alert severity="error" className="notice">{error}</Alert>}

          {weather ? (
            <InfoBox weather={weather} unit={unit} onUnitChange={setUnit} />
          ) : (
            <Box className={`empty-state${loading ? ' is-loading' : ''}`} aria-live="polite">
              <WbSunnyRoundedIcon />
              <Typography>{loading ? 'Finding your forecast' : 'Start with a city above'}</Typography>
              <Typography variant="body2">
                {loading ? 'Connecting to current conditions...' : 'Your latest weather snapshot will appear here.'}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography component="footer" className="footer">Weather data provided by OpenWeather</Typography>
      </Container>
    </Box>
  )
}
