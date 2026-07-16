import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  AlertCircle,
  Info,
  Globe,
  Sparkles,
  Layers,
} from "lucide-react";
import { COUNTRIES, STATES_BY_COUNTRY } from "./countriesData";

// Types for the OpenWeatherMap API response
interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

// Built-in high-fidelity simulated weather for Demo Mode
const DEMO_CITIES: Record<string, any> = {
  london: {
    name: "London",
    sys: { country: "GB" },
    main: { temp: 14.5, feels_like: 13.8, humidity: 82 },
    weather: [
      { id: 803, main: "Clouds", description: "broken clouds", icon: "04d" },
    ],
    wind: { speed: 4.1 },
  },
  tokyo: {
    name: "Tokyo",
    sys: { country: "JP" },
    main: { temp: 22.1, feels_like: 22.4, humidity: 65 },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    ],
    wind: { speed: 2.5 },
  },
  "new york": {
    name: "New York",
    sys: { country: "US" },
    main: { temp: 27.8, feels_like: 29.5, humidity: 55 },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    ],
    wind: { speed: 5.4 },
  },
  reykjavik: {
    name: "Reykjavik",
    sys: { country: "IS" },
    main: { temp: 2.2, feels_like: -2.1, humidity: 88 },
    weather: [
      { id: 601, main: "Snow", description: "moderate snow", icon: "13d" },
    ],
    wind: { speed: 8.5 },
  },
  cairo: {
    name: "Cairo",
    sys: { country: "EG" },
    main: { temp: 35.6, feels_like: 37.2, humidity: 32 },
    weather: [
      { id: 800, main: "Clear", description: "sunny and dry", icon: "01d" },
    ],
    wind: { speed: 3.8 },
  },
  sydney: {
    name: "Sydney",
    sys: { country: "AU" },
    main: { temp: 17.2, feels_like: 16.8, humidity: 74 },
    weather: [
      { id: 501, main: "Rain", description: "moderate rain", icon: "10d" },
    ],
    wind: { speed: 6.2 },
  },
};

// Seed-based dynamic weather generator for Demo Mode (allows searching literally any city)
function getSimulatedWeather(cityInput: string): WeatherData {
  const parts = cityInput.split(",");
  const rawCity = parts[0].trim();
  const stateCode = parts[1] ? parts[1].trim().toUpperCase() : "";
  const countryCode = parts[2]
    ? parts[2].trim().toUpperCase()
    : parts[1] && parts[1].trim().length === 2
      ? parts[1].trim().toUpperCase()
      : "SIM";

  const cleanCity = rawCity.toLowerCase();

  let baseData: any = null;
  if (DEMO_CITIES[cleanCity]) {
    baseData = JSON.parse(JSON.stringify(DEMO_CITIES[cleanCity]));
  } else {
    // Deterministic hash based on city name to ensure consistent weather on subsequent searches
    const hash = cleanCity
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const weatherTypes = [
      "Clear",
      "Clouds",
      "Rain",
      "Snow",
      "Thunderstorm",
      "Atmosphere",
    ];
    const weatherMain = weatherTypes[hash % weatherTypes.length];

    let temp = 12 + (hash % 16); // 12°C to 28°C
    let humidity = 45 + (hash % 45); // 45% to 90%
    let windSpeed = 1.5 + (hash % 7); // 1.5 m/s to 8.5 m/s
    let description = "scattered clouds";
    let iconCode = "03d";
    let id = 801;

    if (weatherMain === "Clear") {
      temp = 22 + (hash % 12); // 22°C to 34°C
      description = "clear sky";
      iconCode = hash % 2 === 0 ? "01d" : "01n";
      id = 800;
    } else if (weatherMain === "Rain") {
      temp = 8 + (hash % 10); // 8°C to 18°C
      description = "moderate rain";
      iconCode = "10d";
      id = 500;
    } else if (weatherMain === "Snow") {
      temp = -4 + (hash % 8); // -4°C to 4°C
      description = "light snow";
      iconCode = "13d";
      id = 600;
    } else if (weatherMain === "Thunderstorm") {
      temp = 16 + (hash % 9); // 16°C to 25°C
      description = "thunderstorm with rain";
      iconCode = "11d";
      id = 211;
    } else if (weatherMain === "Atmosphere") {
      temp = 6 + (hash % 12); // 6°C to 18°C
      description = "misty fog";
      iconCode = "50d";
      id = 701;
    }

    baseData = {
      name: rawCity.charAt(0).toUpperCase() + rawCity.slice(1),
      sys: { country: countryCode },
      main: {
        temp,
        feels_like: temp + (hash % 3) - 1.2,
        humidity,
      },
      weather: [{ id, main: weatherMain, description, icon: iconCode }],
      wind: { speed: windSpeed },
    };
  }

  if (stateCode) {
    baseData.name = `${baseData.name}, ${stateCode}`;
  }
  if (countryCode && countryCode !== "SIM") {
    baseData.sys.country = countryCode;
  }
  return baseData;
}

export default function App() {
  const [searchInput, setSearchInput] = useState("");
  const [currentCity, setCurrentCity] = useState("Tokyo");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  // Country & State Selection State
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [selectedState, setSelectedState] = useState<string>("TX");

  // Handler for changing country and automatically setting default state
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    if (countryCode) {
      const states = STATES_BY_COUNTRY[countryCode];
      if (states && states.length > 0) {
        setSelectedState(states[0].code);
      } else {
        setSelectedState("");
      }
    } else {
      setSelectedState("");
    }
  };

  // Demo Mode is active when the server-side API key is unconfigured or a query fails with API_KEY_MISSING/API_KEY_INVALID
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const browserApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();

  const fetchWeatherFromBrowser = async (
    city: string,
    units: string = "metric",
  ) => {
    if (!browserApiKey) {
      throw new Error(
        "Missing VITE_OPENWEATHER_API_KEY for static deployment.",
      );
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city,
    )}&appid=${browserApiKey}&units=${units}`;
    return fetch(url);
  };

  // Fetch weather data from our secure server proxy (or fall back to direct browser API if hosting statically)
  const fetchWeather = async (city: string, forceDemo: boolean = false) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    // If forced demo mode, fetch simulated data instantly
    if (forceDemo) {
      setTimeout(() => {
        try {
          const simData = getSimulatedWeather(city);
          setWeather(simData);
          setCurrentCity(simData.name);
          setLoading(false);
        } catch (err) {
          setError("Failed to simulate weather data.");
          setLoading(false);
        }
      }, 600); // realistic network delay
      return;
    }

    try {
      let response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}&units=metric`,
      );
      let data: any = null;

      const responseContentType = response.headers.get("content-type");
      if (
        responseContentType &&
        responseContentType.includes("application/json")
      ) {
        data = await response.json();
      }

      if (!response.ok) {
        // If the proxy route is unavailable (404/500) on static GitHub Pages, try direct browser fetch.
        if (
          (response.status === 404 ||
            response.status === 500 ||
            !response.ok) &&
          browserApiKey
        ) {
          response = await fetchWeatherFromBrowser(city);
          data = await response.json();
        }
      }

      if (!response.ok) {
        if (
          data &&
          (data.error === "API_KEY_MISSING" || data.error === "API_KEY_INVALID")
        ) {
          setIsDemoMode(true);
          const simData = getSimulatedWeather(city);
          setWeather(simData);
          setCurrentCity(simData.name);
          setError(
            `Demo Mode: ${
              data.error === "API_KEY_MISSING"
                ? "API key not set"
                : "Invalid/unactivated API key"
            }. Displaying simulated weather.`,
          );
        } else {
          setError(
            (data && data.message) ||
              `Error fetching weather (Status ${response.status})`,
          );
        }
      } else {
        setWeather(data);
        setCurrentCity(data.name);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error("Fetch failed:", err);
      if (browserApiKey) {
        try {
          const directResponse = await fetchWeatherFromBrowser(city);
          const directData = await directResponse.json();
          if (directResponse.ok) {
            setWeather(directData);
            setCurrentCity(directData.name);
            setIsDemoMode(false);
            return;
          }
          setError(
            (directData && directData.message) ||
              `Error fetching weather (Status ${directResponse.status})`,
          );
          return;
        } catch (browserErr: any) {
          console.error("Direct browser fetch failed:", browserErr);
        }
      }

      setIsDemoMode(true);
      const simData = getSimulatedWeather(city);
      setWeather(simData);
      setCurrentCity(simData.name);
      setError(
        "Demo Mode: Unable to fetch live weather. Displaying simulated weather.",
      );

      setCurrentCity(simData.name);
      setError(
        `Network proxy unreachable: ${err.message || err}. Entered local Weather Simulator demo mode.`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Run initial fetch on mount
  useEffect(() => {
    fetchWeather("Austin,TX,US");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      let query = searchInput.trim();
      if (selectedCountry) {
        if (selectedState) {
          query = `${query},${selectedState},${selectedCountry}`;
        } else {
          query = `${query},${selectedCountry}`;
        }
      }
      fetchWeather(query);
    }
  };

  const selectSuggestedCity = (city: string) => {
    setSearchInput("");
    let query = city;
    if (selectedCountry) {
      if (selectedState) {
        query = `${city},${selectedState},${selectedCountry}`;
      } else {
        query = `${city},${selectedCountry}`;
      }
    }
    fetchWeather(query);
  };

  const selectGlobalCity = (city: string) => {
    setSearchInput("");
    if (city.toLowerCase() === "london") {
      setSelectedCountry("GB");
      setSelectedState("ENG");
      fetchWeather("London,ENG,GB");
    } else if (city.toLowerCase() === "tokyo") {
      setSelectedCountry("JP");
      setSelectedState("13");
      fetchWeather("Tokyo,13,JP");
    } else if (city.toLowerCase() === "reykjavik") {
      setSelectedCountry("");
      setSelectedState("");
      fetchWeather("Reykjavik");
    } else if (city.toLowerCase() === "cairo") {
      setSelectedCountry("");
      setSelectedState("");
      fetchWeather("Cairo");
    } else if (city.toLowerCase() === "sydney") {
      setSelectedCountry("AU");
      setSelectedState("NSW");
      fetchWeather("Sydney,NSW,AU");
    } else {
      fetchWeather(city);
    }
  };

  // Convert Celsius to Fahrenheit and metrics accordingly
  const formatTemp = (celsiusValue: number) => {
    if (units === "imperial") {
      return Math.round((celsiusValue * 9) / 5 + 32);
    }
    return Math.round(celsiusValue);
  };

  const formatWind = (mpsValue: number) => {
    if (units === "imperial") {
      return `${Math.round(mpsValue * 2.237)} mph`;
    }
    return `${mpsValue.toFixed(1)} m/s`;
  };

  const getPlaceholderText = () => {
    if (selectedCountry) {
      const countryObj = COUNTRIES.find((c) => c.code === selectedCountry);
      const stateObj =
        selectedState &&
        STATES_BY_COUNTRY[selectedCountry]?.find(
          (s) => s.code === selectedState,
        );
      if (stateObj) {
        return `Enter city in ${stateObj.name} (e.g. ${stateObj.popularCities[0]})...`;
      } else if (countryObj) {
        return `Enter city in ${countryObj.name}...`;
      }
    }
    return "Search city (e.g., London, Tokyo, Paris)...";
  };

  // Helper to determine background gradient and styling based on weather condition
  const getWeatherTheme = () => {
    if (!weather || !weather.weather || weather.weather.length === 0) {
      return {
        bgStyle: {
          background:
            "radial-gradient(circle at top right, #243b55, #141e30), radial-gradient(circle at bottom left, #b21f1f, #1a2a6c)",
          backgroundBlendMode: "overlay" as const,
        },
        accent: "text-blue-400",
        label: "Default",
        iconColor: "text-sky-400",
      };
    }

    const main = weather.weather[0].main;
    const icon = weather.weather[0].icon;
    const isNight = icon.endsWith("n");

    if (main === "Clear") {
      if (isNight) {
        return {
          bgStyle: {
            background:
              "radial-gradient(circle at top right, #1e1b4b, #020617), radial-gradient(circle at bottom left, #0f172a, #020617)",
            backgroundBlendMode: "overlay" as const,
          },
          accent: "text-indigo-400",
          label: "Clear Night",
          iconColor: "text-indigo-300",
        };
      }
      return {
        bgStyle: {
          background:
            "radial-gradient(circle at top right, #f59e0b, #7c2d12), radial-gradient(circle at bottom left, #ea580c, #b91c1c)",
          backgroundBlendMode: "overlay" as const,
        },
        accent: "text-amber-300",
        label: "Sunny",
        iconColor: "text-yellow-300",
      };
    }

    if (main === "Clouds") {
      const description = weather.weather[0].description;
      if (description.includes("few") || description.includes("scattered")) {
        return {
          bgStyle: {
            background: isNight
              ? "radial-gradient(circle at top right, #1e293b, #0b0f19), radial-gradient(circle at bottom left, #0f172a, #0b0f19)"
              : "radial-gradient(circle at top right, #0284c7, #0369a1), radial-gradient(circle at bottom left, #0f172a, #0369a1)",
            backgroundBlendMode: "overlay" as const,
          },
          accent: "text-sky-300",
          label: "Partly Cloudy",
          iconColor: "text-slate-200",
        };
      }
      return {
        bgStyle: {
          background:
            "radial-gradient(circle at top right, #475569, #1e293b), radial-gradient(circle at bottom left, #334155, #1e293b)",
          backgroundBlendMode: "overlay" as const,
        },
        accent: "text-slate-300",
        label: "Overcast",
        iconColor: "text-slate-300",
      };
    }

    if (main === "Rain" || main === "Drizzle") {
      return {
        bgStyle: {
          background:
            "radial-gradient(circle at top right, #1e293b, #0f172a), radial-gradient(circle at bottom left, #172554, #0f172a)",
          backgroundBlendMode: "overlay" as const,
        },
        accent: "text-blue-400",
        label: "Rainy",
        iconColor: "text-blue-300",
      };
    }

    if (main === "Thunderstorm") {
      return {
        bgStyle: {
          background:
            "radial-gradient(circle at top right, #2e1065, #0c0a09), radial-gradient(circle at bottom left, #1c1917, #0c0a09)",
          backgroundBlendMode: "overlay" as const,
        },
        accent: "text-purple-400",
        label: "Thunderstorm",
        iconColor: "text-yellow-400",
      };
    }

    if (main === "Snow") {
      return {
        bgStyle: {
          background:
            "radial-gradient(circle at top right, #0284c7, #1e293b), radial-gradient(circle at bottom left, #0369a1, #0c4a6e)",
          backgroundBlendMode: "overlay" as const,
        },
        accent: "text-cyan-200",
        label: "Snowy",
        iconColor: "text-cyan-100",
      };
    }

    // Atmosphere (Mist, Fog, Haze, etc.)
    return {
      bgStyle: {
        background:
          "radial-gradient(circle at top right, #3f3f46, #18181b), radial-gradient(circle at bottom left, #27272a, #18181b)",
        backgroundBlendMode: "overlay" as const,
      },
      accent: "text-zinc-400",
      label: "Misty",
      iconColor: "text-zinc-300",
    };
  };

  const theme = getWeatherTheme();

  // Pick suitable Lucide weather icon based on OpenWeatherMap icon code and main tag
  const renderWeatherIcon = () => {
    if (!weather || !weather.weather || weather.weather.length === 0)
      return <Sun className="w-20 h-20" />;

    const icon = weather.weather[0].icon;
    const main = weather.weather[0].main;
    const isNight = icon.endsWith("n");

    if (main === "Clear") {
      return isNight ? (
        <Moon
          className={`w-20 h-20 ${theme.iconColor} drop-shadow-[0_10px_20px_rgba(255,255,255,0.15)] animate-float`}
        />
      ) : (
        <Sun
          className={`w-20 h-20 ${theme.iconColor} drop-shadow-[0_10px_25px_rgba(245,158,11,0.3)] animate-float`}
        />
      );
    }

    if (main === "Clouds") {
      const desc = weather.weather[0].description;
      if (desc.includes("few") || desc.includes("scattered")) {
        return isNight ? (
          <CloudMoon
            className={`w-20 h-20 ${theme.iconColor} drop-shadow-lg animate-float`}
          />
        ) : (
          <CloudSun
            className={`w-20 h-20 ${theme.iconColor} drop-shadow-lg animate-float`}
          />
        );
      }
      return (
        <Cloud
          className={`w-20 h-20 ${theme.iconColor} drop-shadow-lg animate-float`}
        />
      );
    }

    if (main === "Rain") {
      return (
        <CloudRain
          className={`w-20 h-20 ${theme.iconColor} drop-shadow-md animate-float`}
        />
      );
    }

    if (main === "Drizzle") {
      return (
        <CloudDrizzle
          className={`w-20 h-20 ${theme.iconColor} drop-shadow-md animate-float`}
        />
      );
    }

    if (main === "Thunderstorm") {
      return (
        <CloudLightning
          className={`w-20 h-20 ${theme.iconColor} drop-shadow-[0_10px_20px_rgba(250,204,21,0.2)] animate-float`}
        />
      );
    }

    if (main === "Snow") {
      return (
        <Snowflake
          className={`w-20 h-20 ${theme.iconColor} drop-shadow-md animate-float`}
        />
      );
    }

    return (
      <Wind
        className={`w-20 h-20 ${theme.iconColor} drop-shadow-md animate-float`}
      />
    );
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between transition-all duration-1000 overflow-x-hidden p-4 md:p-6"
      style={theme.bgStyle}
      id="weather-app-root"
    >
      {/* Top Bar / Mode Selector */}
      <header
        className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 py-2 z-10"
        id="top-bar"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 shadow-sm">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-white tracking-wide">
              Weather App
            </h1>
            <p className="text-xs text-white/60 font-mono tracking-tight">
              Real-time Glass Weather
            </p>
          </div>
        </div>

        {/* Dynamic Mode Selector / Settings pills */}
        <div className="flex items-center gap-2">
          {isDemoMode && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono shadow-sm"
              id="demo-pill"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simulator Mode
            </motion.div>
          )}

          <button
            onClick={() => setShowConfigModal(true)}
            className="glassmorphism hover:bg-white/15 text-white/85 hover:text-white transition-all text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-sans cursor-pointer shadow-sm"
            id="setup-btn"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>API Settings</span>
          </button>
        </div>
      </header>

      {/* Main glassmorphism container */}
      <main
        className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl my-6 z-10"
        id="main-content"
      >
        {/* API key banner if in demo mode / error */}
        {error && isDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glassmorphism border-amber-500/20 bg-amber-500/10 p-4 rounded-2xl mb-4 text-xs text-amber-200/95 flex items-start gap-3 shadow-md"
            id="warning-notice"
          >
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 w-full">
              <span className="font-semibold block text-amber-300">
                {error.includes("unreachable")
                  ? "Transient Connection Notice"
                  : "Live API Connection Offline"}
              </span>
              <p className="leading-relaxed text-white/80 text-[11px]">
                {error}
              </p>
              <div className="flex flex-wrap items-center gap-3.5 mt-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsDemoMode(false);
                    fetchWeather(currentCity, false);
                  }}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-3.5 py-2 rounded-xl text-[11px] cursor-pointer transition-all shadow-md active:scale-95"
                >
                  Connect to Live Weather Server
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="text-amber-300 hover:text-amber-200 font-semibold text-[11px] cursor-pointer transition-colors"
                >
                  View Setup Guide
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* The Card */}
        <div
          className="w-full glassmorphism-card p-6 md:p-12 relative overflow-hidden flex flex-col gap-6"
          id="glass-card"
        >
          {/* Card top decorative gradient flare */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Unit Switch & Action Bar */}
          <div
            className="flex items-center justify-between gap-4 w-full"
            id="card-action-row"
          >
            <span className="text-xs uppercase font-mono tracking-widest text-white/40">
              Current Status
            </span>

            {/* °C / °F Selector Slider */}
            <div
              className="bg-slate-950/40 p-0.5 rounded-xl flex border border-white/5 shadow-inner"
              id="unit-switch"
            >
              <button
                onClick={() => setUnits("metric")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  units === "metric"
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/40 hover:text-white/70"
                }`}
                id="unit-c-btn"
              >
                °C
              </button>
              <button
                onClick={() => setUnits("imperial")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  units === "imperial"
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/40 hover:text-white/70"
                }`}
                id="unit-f-btn"
              >
                °F
              </button>
            </div>
          </div>

          {/* Location Filters */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full bg-white/5 p-4 rounded-2xl border border-white/10"
            id="location-filters-panel"
          >
            {/* Country Selector */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="country-selector"
                className="text-[11px] uppercase tracking-wider font-mono text-white/50 flex items-center gap-1.5"
              >
                <span>📍 Country Filter</span>
              </label>
              <div className="relative">
                <select
                  id="country-selector"
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-950/40 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none rounded-xl px-4 py-3 text-white transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-white">
                    🌍 World (No Country Filter)
                  </option>
                  {COUNTRIES.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      className="bg-slate-900 text-white"
                    >
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* State Selector */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="state-selector"
                className="text-[11px] uppercase tracking-wider font-mono text-white/50 flex items-center gap-1.5"
              >
                <span>🏙️ State / Province</span>
              </label>
              <div className="relative">
                <select
                  id="state-selector"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={
                    loading ||
                    !selectedCountry ||
                    !STATES_BY_COUNTRY[selectedCountry]?.length
                  }
                  className="w-full bg-slate-950/40 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none rounded-xl px-4 py-3 text-white transition-all text-sm appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {!selectedCountry ? (
                    <option value="" className="bg-slate-900 text-white">
                      Select a country first...
                    </option>
                  ) : !STATES_BY_COUNTRY[selectedCountry]?.length ? (
                    <option value="" className="bg-slate-900 text-white">
                      No states available
                    </option>
                  ) : (
                    <>
                      <option value="" className="bg-slate-900 text-white">
                        All States / Provinces
                      </option>
                      {STATES_BY_COUNTRY[selectedCountry].map((state) => (
                        <option
                          key={state.code}
                          value={state.code}
                          className="bg-slate-900 text-white"
                        >
                          [{state.code}] {state.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="flex gap-3 w-full"
            id="search-form"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={getPlaceholderText()}
              disabled={loading}
              className="flex-grow bg-black/20 border border-white/25 rounded-xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/45 transition-all font-sans text-base disabled:opacity-50"
              id="city-input"
            />
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="bg-white text-[#1a2a6c] font-semibold rounded-xl px-6 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm"
              id="search-btn"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH</span>
            </button>
          </form>

          {/* Rapid Suggested Cities Pills */}
          <div
            className="flex flex-col gap-2 w-full bg-white/5 p-4 rounded-xl border border-white/10"
            id="suggested-section"
          >
            {selectedCountry &&
            selectedState &&
            STATES_BY_COUNTRY[selectedCountry]?.find(
              (s) => s.code === selectedState,
            ) ? (
              <div
                className="flex flex-wrap gap-1.5 items-center justify-start"
                id="state-popular-pills"
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300 mr-1 flex items-center gap-1">
                  <span>
                    ✨ Popular in{" "}
                    {
                      STATES_BY_COUNTRY[selectedCountry]?.find(
                        (s) => s.code === selectedState,
                      )?.name
                    }
                    :
                  </span>
                </span>
                {STATES_BY_COUNTRY[selectedCountry]
                  ?.find((s) => s.code === selectedState)
                  ?.popularCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => selectSuggestedCity(city)}
                      disabled={loading}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-sans ${
                        currentCity.toLowerCase().includes(city.toLowerCase())
                          ? "bg-amber-400/25 text-amber-200 border-amber-400/40"
                          : "bg-white/5 text-white/75 border-white/5 hover:bg-white/10 hover:text-white"
                      } disabled:opacity-50`}
                      id={`pill-state-${city.toLowerCase()}`}
                    >
                      📍 {city}
                    </button>
                  ))}
              </div>
            ) : (
              <div
                className="flex flex-wrap gap-1.5 items-center justify-start"
                id="global-popular-pills"
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 mr-1">
                  Global Favorites:
                </span>
                {["London", "Tokyo", "Reykjavik", "Cairo", "Sydney"].map(
                  (city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => selectGlobalCity(city)}
                      disabled={loading}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-sans ${
                        currentCity.toLowerCase().includes(city.toLowerCase())
                          ? "bg-white/25 text-white border-white/40"
                          : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white"
                      } disabled:opacity-50`}
                      id={`pill-global-${city.toLowerCase()}`}
                    >
                      {city === "London" && "🇬🇧 "}
                      {city === "Tokyo" && "🇯🇵 "}
                      {city === "Reykjavik" && "🇮🇸 "}
                      {city === "Cairo" && "🇪🇬 "}
                      {city === "Sydney" && "🇦🇺 "}
                      {city}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Loader State */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center gap-4"
                id="loader-container"
              >
                {/* Subtle, beautiful modern spinner */}
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-t-white/80 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-display tracking-wide font-medium text-white/80">
                    Fetching weather matrix...
                  </p>
                  <p className="text-[10px] font-mono text-white/40">
                    Querying OpenWeatherMap API
                  </p>
                </div>
              </motion.div>
            ) : error && !isDemoMode ? (
              // General non-demo mode true error state
              <motion.div
                key="error-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-10 flex flex-col items-center justify-center text-center gap-3"
                id="error-message-box"
              >
                <div className="bg-red-500/20 p-3 rounded-full border border-red-500/30">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-red-300">
                    Query Failed
                  </h3>
                  <p className="text-sm text-white/75 px-4 leading-relaxed max-w-sm">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => fetchWeather(currentCity)}
                  className="mt-2 text-xs bg-white/15 hover:bg-white/20 text-white border border-white/10 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  Retry Search
                </button>
              </motion.div>
            ) : weather ? (
              // Success Weather Data State
              <motion.div
                key="weather-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
                id="weather-data-content"
              >
                {/* Weather main display - Side-by-side "Frosted Glass" template layout */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between w-full py-4 gap-6"
                  id="main-weather-block"
                >
                  {/* Location Info (Left) */}
                  <div className="flex flex-col text-left" id="location-info">
                    <h2
                      className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight"
                      id="location-heading"
                    >
                      {weather.name}
                    </h2>
                    <p className="text-xs md:text-sm font-sans uppercase tracking-[0.2em] text-white/60 font-medium mt-1">
                      {weather.sys.country}
                    </p>
                  </div>

                  {/* Temperature Display (Right) */}
                  <div className="flex items-start" id="temp-display">
                    <span className="text-6xl md:text-8xl font-extralight text-white tracking-tighter leading-none text-glow">
                      {formatTemp(weather.main.temp)}
                    </span>
                    <span className="text-lg md:text-2xl font-semibold text-white/50 align-top ml-1.5 select-none">
                      {units === "metric" ? "°C" : "°F"}
                    </span>
                  </div>
                </div>

                {/* Centered weather condition and beautifully styled large glowing icon */}
                <div
                  className="flex flex-col items-center justify-center w-full py-6 my-2 border-t border-white/10"
                  id="weather-icon-section"
                >
                  <div
                    className="relative flex items-center justify-center w-36 h-36 rounded-full weather-icon-glow mb-2"
                    id="icon-placeholder"
                  >
                    {renderWeatherIcon()}
                  </div>
                  <div className="text-lg md:text-xl font-light text-white/90 tracking-wide capitalize flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>{weather.weather[0].description}</span>
                  </div>
                </div>

                {/* Details grid with 3 columns (Feels Like, Humidity, Wind) */}
                <div
                  className="grid grid-cols-3 gap-4 w-full mt-6 pt-8 border-t border-white/20"
                  id="details-grid"
                >
                  {/* Feels Like */}
                  <div
                    className="glassmorphism bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center"
                    id="detail-feels-like"
                  >
                    <Thermometer className="w-5 h-5 text-white/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-sans">
                        Feels Like
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                        {formatTemp(weather.main.feels_like)}°
                      </span>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div
                    className="glassmorphism bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center"
                    id="detail-humidity"
                  >
                    <Droplets className="w-5 h-5 text-white/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-sans">
                        Humidity
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                        {weather.main.humidity}%
                      </span>
                    </div>
                  </div>

                  {/* Wind Speed */}
                  <div
                    className="glassmorphism bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center"
                    id="detail-wind"
                  >
                    <Wind className="w-5 h-5 text-white/50" />
                    <div className="flex flex-col items-center w-full">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-sans">
                        Wind
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-white font-mono truncate max-w-full">
                        {formatWind(weather.wind.speed)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Modern, elegant full footer */}
      <footer
        className="w-full max-w-5xl text-center py-4 text-xs text-white/35 font-mono tracking-tight z-10"
        id="footer-credits"
      >
        <p>© 2026 Weather App • Real-time Weather Proxy System</p>
        <p className="mt-0.5 text-[10px] text-white/20">
          Designed with pure glassmorphism & fluid animations
        </p>
      </footer>

      {/* Settings / API Key Guide Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            id="config-modal-backdrop"
          >
            {/* Blurry, translucent overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="glassmorphism bg-slate-900/90 border border-white/10 w-full max-w-md p-6 rounded-[28px] text-white relative z-10 shadow-2xl overflow-hidden flex flex-col gap-5"
              id="config-modal-body"
            >
              {/* Decorative top strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <span>API Integration Settings</span>
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                  title="Close Settings"
                >
                  <Search className="w-4 h-4 rotate-45" />{" "}
                  {/* Close looks like rotated plus */}
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-3.5 text-xs text-white/80 font-sans leading-relaxed">
                <p>
                  To secure your API keys and comply with production
                  architecture, the Weather App routes all queries through a
                  secure server-side proxy route:{" "}
                  <code className="bg-slate-950/50 p-1 rounded text-sky-300 font-mono">
                    /api/weather
                  </code>
                  .
                </p>

                <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 space-y-2">
                  <span className="font-semibold text-white font-mono uppercase tracking-wider text-[10px] block text-sky-400">
                    Step-by-Step Instructions:
                  </span>
                  <ol className="list-decimal pl-4 space-y-1.5 text-white/70">
                    <li>
                      Create a free account at{" "}
                      <a
                        href="https://openweathermap.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-300 underline hover:text-sky-200"
                      >
                        openweathermap.org
                      </a>
                      .
                    </li>
                    <li>
                      Generate a <strong>Current Weather API Key</strong> in
                      your profile.
                    </li>
                    <li>
                      Open the <strong>Secrets</strong> panel in Google AI
                      Studio.
                    </li>
                    <li>
                      Define{" "}
                      <code className="text-white bg-slate-950 p-0.5 rounded font-mono">
                        OPENWEATHER_API_KEY
                      </code>{" "}
                      with your generated key.
                    </li>
                  </ol>
                </div>

                {/* Mode Toggles */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <span className="font-semibold block text-white/95">
                    Active Engine:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setIsDemoMode(false);
                        setShowConfigModal(false);
                        fetchWeather(currentCity, false);
                      }}
                      className={`py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        !isDemoMode
                          ? "bg-sky-500/10 text-sky-300 border-sky-500/30 shadow-md"
                          : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Live Server Mode</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDemoMode(true);
                        setShowConfigModal(false);
                        fetchWeather(currentCity, true);
                      }}
                      className={`py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isDemoMode
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-md"
                          : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Simulator Mode</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowConfigModal(false)}
                className="mt-2 w-full bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl border border-white/10 transition-all font-semibold text-xs text-center cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
