
function StatsCard({ history = [] }) {
    const totalPredictions = history.length;

    const goodAQI = history.filter(
        item => item.AQI_Status === "Good"
    ).length;

    const moderateAQI = history.filter(
        item => item.AQI_Status === "Moderate"
    ).length;

    const unhealthyAQI = history.filter(
        item =>
            item.AQI_Status === "Unhealthy" ||
            item.AQI_Status === "Unhealthy for Sensitive Groups" ||
            item.AQI_Status === "Very Unhealthy" ||
            item.AQI_Status === "Hazardous"
    ).length;

    const averageAQI =
        totalPredictions > 0
            ? (
                history.reduce(
                    (sum, item) => sum + (Number(item.AQI_Value) || 0),
                    0
                ) / totalPredictions
            ).toFixed(2)
            : "0.00";

    const stats = [
        {
            title: "Total Predictions",
            value: totalPredictions,
            icon: "📊",
            accent: "stat-blue",
            description: "Predictions recorded"
        },
        {
            title: "Good AQI",
            value: goodAQI,
            icon: "🌿",
            accent: "stat-green",
            description: "Good air quality"
        },
        {
            title: "Moderate AQI",
            value: moderateAQI,
            icon: "🌤️",
            accent: "stat-yellow",
            description: "Moderate category"
        },
        {
            title: "Unhealthy AQI",
            value: unhealthyAQI,
            icon: "⚠️",
            accent: "stat-red",
            description: "Unhealthy categories"
        },
        {
            title: "Average Class",
            value: averageAQI,
            icon: "📈",
            accent: "stat-purple",
            description: "Mean of predicted class codes"
        }
    ];

    return (
        <section className="stats-section">
            <div className="stats-heading">
                <div>
                    <span className="section-eyebrow">OVERVIEW</span>
                    <h2>Prediction Statistics</h2>
                    <p>Summary of your recorded AQI predictions.</p>
                </div>
            </div>

            <div className="stats-container">
                {stats.map((stat) => (
                    <article
                        className={`stats-card ${stat.accent}`}
                        key={stat.title}
                    >
                        <div className="stats-card-top">
                            <span className="stats-icon" aria-hidden="true">
                                {stat.icon}
                            </span>
                            <span className="stats-indicator" />
                        </div>

                        <p className="stats-label">{stat.title}</p>

                        <h3 className="stats-value">
                            {stat.value}
                        </h3>

                        <p className="stats-description">
                            {stat.description}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default StatsCard;
