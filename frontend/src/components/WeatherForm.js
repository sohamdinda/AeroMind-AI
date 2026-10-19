
function WeatherForm({
    temperature, setTemperature,
    humidity, setHumidity,
    windKph, setWindKph,
    pressureMb, setPressureMb,
    precipMm, setPrecipMm,
    pm25, setPm25,
    pm10, setPm10,
    carbonMonoxide, setCarbonMonoxide,
    nitrogenDioxide, setNitrogenDioxide,
    ozone, setOzone,
    sulphurDioxide, setSulphurDioxide,
    getCurrentWeather,
    predictAQI
}) {
    return (
        <section className="card weather-form-card">
            <div className="form-heading">
                <div>
                    <span className="section-eyebrow">AQI ANALYSIS</span>
                    <h2>Air Quality Predictor</h2>
                    <p>
                        Enter weather conditions and pollutant levels
                        to predict the air quality category.
                    </p>
                </div>

                <div className="form-heading-icon" aria-hidden="true">
                    🌤️
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">
                    <span className="form-section-icon" aria-hidden="true">
                        🌦️
                    </span>
                    <div>
                        <h3>Weather Conditions</h3>
                        <p>Enter local weather measurements.</p>
                    </div>
                </div>

                <div className="input-grid">
                    <label className="field">
                        <span>Temperature</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 28"
                                value={temperature}
                                onChange={e => setTemperature(e.target.value)}
                            />
                            <span>°C</span>
                        </div>
                    </label>

                    <label className="field">
                        <span>Humidity</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 65"
                                value={humidity}
                                onChange={e => setHumidity(e.target.value)}
                            />
                            <span>%</span>
                        </div>
                    </label>

                    <label className="field">
                        <span>Wind Speed</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 12"
                                value={windKph}
                                onChange={e => setWindKph(e.target.value)}
                            />
                            <span>kph</span>
                        </div>
                    </label>

                    <label className="field">
                        <span>Atmospheric Pressure</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 1013"
                                value={pressureMb}
                                onChange={e => setPressureMb(e.target.value)}
                            />
                            <span>mb</span>
                        </div>
                    </label>

                    <label className="field">
                        <span>Rainfall</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="e.g. 0"
                                value={precipMm}
                                onChange={e => setPrecipMm(e.target.value)}
                            />
                            <span>mm</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="form-section">
                <div className="form-section-title">
                    <span className="form-section-icon" aria-hidden="true">
                        🧪
                    </span>
                    <div>
                        <h3>Air Pollutants</h3>
                        <p>Enter pollutant measurements used by your model.</p>
                    </div>
                </div>

                <div className="input-grid">
                    <label className="field">
                        <span>PM2.5</span>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Enter PM2.5"
                            value={pm25}
                            onChange={e => setPm25(e.target.value)}
                        />
                    </label>

                    <label className="field">
                        <span>PM10</span>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Enter PM10"
                            value={pm10}
                            onChange={e => setPm10(e.target.value)}
                        />
                    </label>

                    <label className="field">
                        <span>Carbon Monoxide (CO)</span>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Enter CO"
                            value={carbonMonoxide}
                            onChange={e => setCarbonMonoxide(e.target.value)}
                        />
                    </label>

                    <label className="field">
                        <span>Nitrogen Dioxide (NO₂)</span>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Enter NO₂"
                            value={nitrogenDioxide}
                            onChange={e => setNitrogenDioxide(e.target.value)}
                        />
                    </label>

                    <label className="field">
                        <span>Ozone (O₃)</span>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Enter O₃"
                            value={ozone}
                            onChange={e => setOzone(e.target.value)}
                        />
                    </label>

                    <label className="field">
                        <span>Sulphur Dioxide (SO₂)</span>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Enter SO₂"
                            value={sulphurDioxide}
                            onChange={e => setSulphurDioxide(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="location-btn"
                    onClick={getCurrentWeather}
                >
                    <span aria-hidden="true">📍</span>
                    Use My Location
                </button>

                <button
                    type="button"
                    className="predict-btn"
                    onClick={predictAQI}
                >
                    <span aria-hidden="true">✦</span>
                    Predict Air Quality
                </button>
            </div>

            <p className="form-footnote">
                Weather values can be filled from your location.
                Enter pollutant measurements manually.
            </p>
        </section>
    );
}

export default WeatherForm;
