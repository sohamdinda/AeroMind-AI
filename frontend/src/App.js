
import './App.css';
import Header from './components/Header';
import WeatherForm from './components/WeatherForm';
import PredictionCard from './components/PredictionCard';
import HistoryTable from './components/HistoryTable';
import StatsCard from './components/StatsCard';
import SearchBar from './components/SearchBar';
import AQICharts from './components/AQICharts';
import { useState, useEffect } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windKph, setWindKph] = useState("");
  const [pressureMb, setPressureMb] = useState("");
  const [precipMm, setPrecipMm] = useState("");

  const [pm25, setPm25] = useState("");
  const [pm10, setPm10] = useState("");
  const [carbonMonoxide, setCarbonMonoxide] = useState("");
  const [nitrogenDioxide, setNitrogenDioxide] = useState("");
  const [ozone, setOzone] = useState("");
  const [sulphurDioxide, setSulphurDioxide] = useState("");

  const [result, setResult] = useState("");
  const [topFactors, setTopFactors] = useState([]);
  const [shapContributions, setShapContributions] = useState([]);
  const [locationName, setLocationName] = useState("");

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get current location and weather
  const getCurrentWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Get city name
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!geoResponse.ok) {
            throw new Error("Could not retrieve your location name.");
          }

          const geoData = await geoResponse.json();
          const address = geoData.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            address.state_district ||
            "Unknown";

          setLocationName(city);

          // Get current weather
          const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,precipitation`;

          const weatherResponse = await fetch(weatherUrl);

          if (!weatherResponse.ok) {
            throw new Error("Could not retrieve current weather.");
          }

          const weatherData = await weatherResponse.json();
          const current = weatherData.current;

          if (!current) {
            throw new Error("Weather data is unavailable.");
          }

          setTemperature(String(current.temperature_2m));
          setHumidity(String(current.relative_humidity_2m));
          setWindKph(String(current.wind_speed_10m));
          setPressureMb(String(current.pressure_msl));
          setPrecipMm(String(current.precipitation ?? 0));

          alert(`Weather loaded successfully for ${city}!`);
        } catch (error) {
          console.error("Weather error:", error);
          alert(error.message || "Unable to load weather data.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(
          error.code === 1
            ? "Location access denied. Please allow location access."
            : "Unable to get your current location."
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  // Predict AQI
  const predictAQI = async () => {
    try {
      const params = new URLSearchParams({
        temperature,
        humidity,
        wind_kph: windKph,
        pressure_mb: pressureMb,
        precip_mm: precipMm,
        pm25,
        pm10,
        carbon_monoxide: carbonMonoxide,
        nitrogen_dioxide: nitrogenDioxide,
        ozone,
        sulphur_dioxide: sulphurDioxide,
        location: locationName || "Unknown",
      });

      const response = await fetch(
        `http://127.0.0.1:8000/predict?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message = Array.isArray(errorData.detail)
          ? errorData.detail.map((item) => item.msg).join(", ")
          : errorData.detail;

        throw new Error(message || "Prediction failed.");
      }

      const data = await response.json();

      setResult(
        `Predicted class: ${data.AQI_Value} | Status: ${data.AQI_Status}`
      );
      setTopFactors(data.Top_Factors || []);
      setShapContributions(data.SHAP_Contributions || []);

      await loadHistory();
    } catch (error) {
      console.error("Prediction error:", error);
      alert(error.message || "Unable to predict AQI.");
    }
  };

  // Load prediction history
  const loadHistory = async () => {
    setLoadingHistory(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/history");

      if (!response.ok) {
        throw new Error(`History request failed: HTTP ${response.status}`);
      }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("History error:", error);
      alert(
        "Could not load prediction history. Check the backend and database."
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  // Delete one prediction
  const deletePrediction = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this prediction?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/delete/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Could not delete this prediction.");
      }

      await loadHistory();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
    }
  };

  // Delete all predictions
  const deleteAllHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all prediction history?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/delete_all",
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Could not delete prediction history.");
      }

      await loadHistory();
    } catch (error) {
      console.error("Delete history error:", error);
      alert(error.message);
    }
  };

  // Export prediction history
  const exportHistory = () => {
    window.open("http://127.0.0.1:8000/export", "_blank");
  };

  // Automatically load history on startup
  useEffect(() => {
    loadHistory();
  }, []);

  // Filter history
  const filteredHistory = history.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      String(item.AQI_Status || "").toLowerCase().includes(search) ||
      String(item.AQI_Value ?? "").includes(search)
    );
  });

  return (
    <div className={`app ${darkMode ? "dark-theme" : ""}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="dashboard-content">
        <WeatherForm
          temperature={temperature}
          setTemperature={setTemperature}
          humidity={humidity}
          setHumidity={setHumidity}
          windKph={windKph}
          setWindKph={setWindKph}
          pressureMb={pressureMb}
          setPressureMb={setPressureMb}
          precipMm={precipMm}
          setPrecipMm={setPrecipMm}
          pm25={pm25}
          setPm25={setPm25}
          pm10={pm10}
          setPm10={setPm10}
          carbonMonoxide={carbonMonoxide}
          setCarbonMonoxide={setCarbonMonoxide}
          nitrogenDioxide={nitrogenDioxide}
          setNitrogenDioxide={setNitrogenDioxide}
          ozone={ozone}
          setOzone={setOzone}
          sulphurDioxide={sulphurDioxide}
          setSulphurDioxide={setSulphurDioxide}
          getCurrentWeather={getCurrentWeather}
          predictAQI={predictAQI}
        />

        <PredictionCard
          result={result}
          topFactors={topFactors}
          shapContributions={shapContributions}
        />

        <StatsCard history={history} />

        <AQICharts history={history} />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <HistoryTable
          history={filteredHistory}
          loadingHistory={loadingHistory}
          deletePrediction={deletePrediction}
          deleteAllHistory={deleteAllHistory}
          exportHistory={exportHistory}
        />
      </main>
    </div>
  );
}

export default App;
