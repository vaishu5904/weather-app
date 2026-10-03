import {
  Box,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import AirRoundedIcon from '@mui/icons-material/AirRounded'
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded'
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'

function convertTemperature(celsius, unit) {
  return unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius
}

function formatTemperature(celsius, unit) {
  return `${Math.round(convertTemperature(celsius, unit))}°${unit === 'fahrenheit' ? 'F' : 'C'}`
}

function getTemperatureTier(celsius) {
  if (celsius <= 0) return { name: 'Frost', className: 'frost' }
  if (celsius <= 10) return { name: 'Cold', className: 'cold' }
  if (celsius <= 20) return { name: 'Mild', className: 'mild' }
  if (celsius <= 28) return { name: 'Warm', className: 'warm' }
  return { name: 'Hot', className: 'hot' }
}

function formatObservedTime(observedAt, timezoneOffset) {
  const cityTime = new Date((observedAt + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(cityTime)
}

export default function InfoBox({ weather, unit, onUnitChange }) {
  const tier = getTemperatureTier(weather.tempC)
  const location = [weather.cityName, weather.countryCode].filter(Boolean).join(', ')

  return (
    <Card className={`weather-card temperature-tier-${tier.className}`} elevation={0}>
      <CardContent>
        <Box className="weather-heading">
          <Box>
            <Box className="location-line">
              <NearMeRoundedIcon />
              <Typography className="location">{location}</Typography>
            </Box>
            <Typography className="updated">
              Last updated {formatObservedTime(weather.observedAt, weather.timezoneOffset)}
            </Typography>
          </Box>
          {weather.iconCode && (
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`}
              alt={weather.description}
            />
          )}
        </Box>

        <Box className="temperature-row">
          <Typography className={`temperature temperature-tone-${tier.className}`}>
            {formatTemperature(weather.tempC, unit)}
          </Typography>
          <Box>
            <Typography className="condition">{weather.description}</Typography>
            <Typography className="feels-like">
              Feels like {formatTemperature(weather.feelsLikeC, unit)}
            </Typography>
            <Typography className={`temperature-tier-label tier-label-${tier.className}`}>
              {tier.name} conditions
            </Typography>
          </Box>
        </Box>

        <Box className="weather-card-tools">
          <Typography className="unit-label">Temperature</Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={unit}
            onChange={(_, nextUnit) => nextUnit && onUnitChange(nextUnit)}
            aria-label="Temperature unit"
          >
            <ToggleButton value="celsius" aria-label="Celsius">°C</ToggleButton>
            <ToggleButton value="fahrenheit" aria-label="Fahrenheit">°F</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box className="details-grid">
          <Box className="detail"><WaterDropRoundedIcon /><span>Humidity</span><strong>{Math.round(weather.humidity)}%</strong></Box>
          <Box className="detail"><AirRoundedIcon /><span>Wind</span><strong>{Math.round(weather.windSpeedMs * 3.6)} km/h</strong></Box>
          <Box className="detail"><WbSunnyRoundedIcon /><span>High / low</span><strong>{formatTemperature(weather.tempMaxC, unit)} / {formatTemperature(weather.tempMinC, unit)}</strong></Box>
        </Box>
      </CardContent>
    </Card>
  )
}
