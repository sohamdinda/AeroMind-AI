
function PredictionCard({ result, topFactors = [], shapContributions = [] }) {
    if (!result) return null;

    let badgeClass = "badge-good";
    let statusLabel = result;

    if (result.includes("Very Unhealthy")) {
        badgeClass = "badge-very";
    } else if (result.includes("Unhealthy for Sensitive")) {
        badgeClass = "badge-usg";
    } else if (result.includes("Unhealthy")) {
        badgeClass = "badge-unhealthy";
    } else if (result.includes("Hazardous")) {
        badgeClass = "badge-hazard";
    } else if (result.includes("Moderate")) {
        badgeClass = "badge-moderate";
    }

    const maxImpact = Math.max(
        ...shapContributions.map(item => Math.abs(Number(item.Impact) || 0)),
        0.0001
    );

    return (
        <section className="prediction-card">
            <div className="prediction-heading">
                <div>
                    <span className="section-eyebrow">MODEL OUTPUT</span>
                    <h2>Prediction Result</h2>
                    <p className="prediction-subtitle">
                        Air quality classification from your input measurements.
                    </p>
                </div>

                <div className="prediction-icon" aria-hidden="true">
                    <span>✦</span>
                </div>
            </div>

            <div className="prediction-result-panel">
                <div className="prediction-result-label">
                    <span className="result-dot" />
                    Predicted air quality
                </div>

                <div className={badgeClass}>
                    {statusLabel}
                </div>
            </div>

            <div className="contributors-section">
                <h3>Top Contributors</h3>
                <p className="prediction-description">
                    Features identified as important by your prediction model.
                </p>

                {topFactors.length > 0 ? (
                    <ul className="contributors-list">
                        {topFactors.map((factor, index) => (
                            <li key={`${factor}-${index}`}>
                                <span className="contributor-rank">
                                    {index + 1}
                                </span>
                                <span className="contributor-name">
                                    {factor}
                                </span>
                                <span className="contributor-check" aria-hidden="true">
                                    ✓
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-explanation">
                        No contributor information is available.
                    </p>
                )}
            </div>

            <div className="shap-section">
                <div className="shap-heading">
                    <div className="shap-heading-icon" aria-hidden="true">
                        ◈
                    </div>
                    <div>
                        <h3>SHAP Explainability</h3>
                        <p>
                            Explore how individual features influence the
                            model's explained output.
                        </p>
                    </div>
                </div>

                {shapContributions.length > 0 ? (
                    <>
                        <div className="shap-legend">
                            <span>
                                <i className="legend-dot legend-positive" />
                                Positive impact
                            </span>
                            <span>
                                <i className="legend-dot legend-negative" />
                                Negative impact
                            </span>
                        </div>

                        <div className="shap-list">
                            {shapContributions.map((item, index) => {
                                const impact = Number(item.Impact) || 0;
                                const barWidth =
                                    (Math.abs(impact) / maxImpact) * 100;

                                return (
                                    <div
                                        className="shap-item"
                                        key={`${item.Feature || "feature"}-${index}`}
                                    >
                                        <div className="shap-item-header">
                                            <strong>{item.Feature}</strong>
                                            <span>
                                                Input: {item.Value}
                                            </span>
                                        </div>

                                        <div className="shap-impact">
                                            <span>SHAP impact</span>
                                            <strong
                                                className={
                                                    impact >= 0
                                                        ? "shap-positive"
                                                        : "shap-negative"
                                                }
                                            >
                                                {impact > 0 ? "+" : ""}
                                                {impact.toFixed(4)}
                                            </strong>
                                        </div>

                                        <div
                                            className="shap-bar-background"
                                            role="img"
                                            aria-label={`${item.Feature}: SHAP impact ${impact.toFixed(4)}`}
                                        >
                                            <div
                                                className={
                                                    impact >= 0
                                                        ? "shap-bar shap-bar-positive"
                                                        : "shap-bar shap-bar-negative"
                                                }
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="shap-note">
                            Bar lengths compare absolute SHAP impact within
                            this list. Positive and negative impacts describe
                            the explained model output, not proof of real-world
                            causation.
                        </p>
                    </>
                ) : (
                    <div className="empty-explanation">
                        <span aria-hidden="true">ⓘ</span>
                        <p>
                            SHAP contributions will appear here after a
                            prediction if the backend returns them.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default PredictionCard;
