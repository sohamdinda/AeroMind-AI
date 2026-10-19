// Backend URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// Predict AQI
export const predictAQI = async (data) => {
    const url =
        `${BASE_URL}/predict?temperature=${data.temperature}&humidity=${data.humidity}&wind_kph=${data.windKph}&pressure_mb=${data.pressureMb}&precip_mm=${data.precipMm}&pm25=${data.pm25}&pm10=${data.pm10}&carbon_monoxide=${data.carbonMonoxide}&nitrogen_dioxide=${data.nitrogenDioxide}&ozone=${data.ozone}&sulphur_dioxide=${data.sulphurDioxide}&location=${encodeURIComponent(data.location || "Unknown")}`;

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.detail || "Prediction failed. Please check your inputs."
        );
    }

    return result;
};

// Get Prediction History
export const getHistory = async () => {
    const response = await fetch(
        `${BASE_URL}/history`
    );
    return await response.json();
};

// Delete One Prediction
export const deletePrediction = async (id) => {
    await fetch(
        `${BASE_URL}/delete/${id}`,
        {
            method: "DELETE"
        }
    );
};

// Delete All Predictions
export const deleteAllHistory = async () => {
    await fetch(
        `${BASE_URL}/delete_all`,
        {
            method: "DELETE"
        }
    );
};

// Export CSV
export const exportCSV = () => {
    window.open(
        `${BASE_URL}/export`,
        "_blank"
    );
};