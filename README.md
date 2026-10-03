# Weatherly: React Weather App Curriculum

Build a modular weather application with React, Material UI (MUI), and the OpenWeatherMap Current Weather API. This project is designed for learners who already know JavaScript ES6+, basic React state and props, Node.js tooling, and REST APIs.

## Prerequisites

- Node.js 20.19+ or 22.12+ and npm
- An OpenWeatherMap account and an API key for the Current Weather API
- Familiarity with JSX, React components, promises, and HTTP/JSON

## Run the Project

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_OPENWEATHER_API_KEY` to your API key.
3. Start the development server with `npm run dev`.
4. Run `npm run lint` and `npm run build` to check the project.

Vite exposes `VITE_` variables to browser code. Treat this key as visible to users, restrict it in the OpenWeatherMap dashboard where possible, and monitor its quota. Do not commit `.env`.

## Curriculum

### Module 1: MUI Integration and Fundamentals

MUI and its icon package are dependencies in `package.json`. Explore the `Button`, `Typography`, `Card`, `TextField`, and icon components used throughout the app. The `ButtonTest` sample in `src/components/ButtonTest.jsx` demonstrates contained, outlined, and text button variants with icons.

**Exercise:** Render `ButtonTest` temporarily in `WeatherApp`, compare the variants, then customize labels and colors with MUI props and the app theme styles.

### Module 2: Search Box and Validation

`src/components/SearchBox.jsx` owns the search form's interaction and uses a controlled value supplied by its parent. It validates an empty city, unsupported characters, and overlong values, shows helper text, and submits only valid input.

**Exercise:** Extend the validator to support a country name or a postal code. Keep the validation message beside the field and test both keyboard submission and the Search button.

### Module 3: OpenWeatherMap API

`src/services/weatherApi.js` builds a request to `/data/2.5/weather` with metric units, awaits `fetch()`, handles HTTP and JSON errors, and normalizes the response before the UI receives it. The normalized model includes temperature, feels-like temperature, high/low, humidity, wind speed, condition, icon code, country code, observation time, and timezone offset.

**Exercise:** Add another field from the API response to `normalizeWeatherResponse` and render it in `InfoBox`. Handle missing or invalid values rather than assuming every response is complete.

### Module 4: Weather Info Box

`src/components/InfoBox.jsx` is presentational: it receives normalized weather data and unit-control props, then displays location, observation time, conditions, icon, humidity, wind, and high/low values in MUI Card primitives. Temperature tiers style the display differently for frost, cold, mild, warm, and hot conditions.

**Exercise:** Change the tier thresholds or colors and verify the result for both below-zero and high-temperature data.

### Module 5: Root Component and State Lifting

`src/components/WeatherApp.jsx` owns city, weather, loading, error, and unit state. It passes the city and event handlers down to `SearchBox`, then passes weather data to `InfoBox`, keeping data flow one-way. It loads New Delhi on the first render, cancels obsolete requests, and displays the observation's local date and time.

**Exercise:** Add a saved-city selection in the root and pass its selection handler down as a prop. Keep API state in the root rather than duplicating it in both child components.

### Module 6: Dynamic UI and Error Handling

The app chooses a weather background and icon from the API condition, styles temperature tiers, provides a Celsius/Fahrenheit toggle, and displays API failures with an MUI Alert. Frost conditions receive a distinct cool theme; loading, empty, invalid-input, and request-error states are also represented.

**Exercises:** Add a new weather tier, create a more specific frost treatment, or add another display unit. Test invalid API keys, unknown cities, blank input, and network failures.

## Architecture

```text
src/
	App.jsx                      App entry and stylesheet
	components/
		WeatherApp.jsx             Root state, API lifecycle, and composition
		SearchBox.jsx              Controlled search and input validation
		InfoBox.jsx                Presentational weather card and unit toggle
		ButtonTest.jsx              MUI button-variant learning exercise
	services/
		weatherApi.js              API request, errors, and response normalization
```

The root manages shared state; `SearchBox` raises user intent through callbacks; `InfoBox` renders props without owning API state. The API service isolates network and response-shaping logic from presentation. This structure practices component-driven UI, async data handling, state lifting, and defensive error handling.
