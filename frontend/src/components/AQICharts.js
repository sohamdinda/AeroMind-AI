
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function AQICharts({ history = [] }) {
    const labels = [
        "Good",
        "Moderate",
        "Unhealthy for Sensitive Groups",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous"
    ];

    const colors = [
        "#22c55e",
        "#eab308",
        "#f97316",
        "#ef4444",
        "#a855f7",
        "#7f1d1d"
    ];

    const statusCounts = Object.fromEntries(
        labels.map(status => [status, 0])
    );

    history.forEach(item => {
        if (item.AQI_Status in statusCounts) {
            statusCounts[item.AQI_Status]++;
        }
    });

    const values = labels.map(status => statusCounts[status]);

    const isDarkMode = document.querySelector(".app")
        ?.classList.contains("dark-theme");

    const textColor = isDarkMode ? "#e2e8f0" : "#475569";
    const gridColor = isDarkMode
        ? "rgba(148, 163, 184, 0.15)"
        : "rgba(148, 163, 184, 0.2)";

    const barData = {
        labels,
        datasets: [
            {
                label: "Predictions",
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
                borderRadius: 8,
                maxBarThickness: 48
            }
        ]
    };

    const pieData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderColor: isDarkMode ? "#1e293b" : "#ffffff",
                borderWidth: 3,
                hoverOffset: 8
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 700
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: gridColor,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: context =>
                        ` ${context.parsed.y} prediction(s)`
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    maxRotation: 35,
                    minRotation: 0,
                    font: {
                        size: 10
                    }
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    color: textColor,
                    padding: 8
                },
                grid: {
                    color: gridColor
                },
                border: {
                    display: false
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 700
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: textColor,
                    boxWidth: 11,
                    boxHeight: 11,
                    padding: 14,
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: gridColor,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: context => {
                        const total = context.dataset.data.reduce(
                            (sum, value) => sum + value,
                            0
                        );

                        const percentage = total
                            ? ((context.parsed / total) * 100).toFixed(1)
                            : "0.0";

                        return ` ${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <section className="charts-section">
            <div className="charts-heading">
                <div>
                    <span className="section-eyebrow">DATA INSIGHTS</span>
                    <h2>AQI Analytics</h2>
                    <p>
                        Explore the distribution of your recorded air-quality
                        predictions.
                    </p>
                </div>

                <div className="charts-total">
                    <span>Total records</span>
                    <strong>{history.length}</strong>
                </div>
            </div>

            <div className="charts-grid">
                <article className="history-card chart-card">
                    <div className="chart-card-heading">
                        <div>
                            <h3>AQI Distribution</h3>
                            <p>Prediction count by category</p>
                        </div>
                        <span className="chart-heading-icon">📊</span>
                    </div>

                    <div className="chart-container">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </article>

                <article className="history-card chart-card">
                    <div className="chart-card-heading">
                        <div>
                            <h3>Status Distribution</h3>
                            <p>Share of each AQI category</p>
                        </div>
                        <span className="chart-heading-icon">🍩</span>
                    </div>

                    <div className="chart-container">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </article>
            </div>
        </section>
    );
}

export default AQICharts;
