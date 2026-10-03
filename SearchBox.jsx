import { useState } from 'react'
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

const CITY_QUERY_PATTERN = /^[\p{L}\p{M}\s.'’-]+(?:,\s*[A-Za-z]{2})?$/u

function getCityError(value, touched) {
  const query = value.trim()
  if (!query) return touched ? 'Enter a city name to search.' : ''
  if (query.length > 100 || !CITY_QUERY_PATTERN.test(query)) {
    return 'Use a city name, optionally followed by a 2-letter country code.'
  }
  return ''
}

export default function SearchBox({ city, onCityChange, onSearch, loading }) {
  const [touched, setTouched] = useState(false)
  const cityError = getCityError(city, touched)

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched(true)
    if (!getCityError(city, true)) onSearch(city.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="search-row" noValidate>
      <TextField
        fullWidth
        value={city}
        onChange={(event) => {
          onCityChange(event.target.value)
          setTouched(true)
        }}
        placeholder="Search a city..."
        aria-label="Search a city"
        error={Boolean(cityError)}
        helperText={cityError || ' '}
        slotProps={{
          htmlInput: { maxLength: 110 },
          input: {
            startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
            ),
          },
        }}
      />
      <Button type="submit" variant="contained" disabled={loading} aria-label="Search weather">
        {loading ? <CircularProgress size={22} color="inherit" /> : 'Search'}
      </Button>
    </form>
  )
}