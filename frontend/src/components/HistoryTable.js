
function HistoryTable({
    history = [],
    loadingHistory,
    deletePrediction,
    deleteAllHistory,
    exportHistory
}) {
    const hasHistory = history.length > 0;

    if (loadingHistory) {
        return (
            <section className="history-card history-loading">
                <div className="history-loading-icon">⏳</div>
                <h2>Loading Prediction History</h2>
                <p>Please wait while your records are being loaded.</p>
            </section>
        );
    }

    const getStatusClass = (status) => {
        const normalizedStatus = String(status || "Unknown")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        return `status status-${normalizedStatus}`;
    };

    return (
        <section className="history-card history-section">
            <div className="history-heading">
                <div className="history-title-group">
                    <span className="section-eyebrow">RECORDS</span>
                    <h2>Prediction History</h2>
                    <p>Review and manage your previous AQI predictions.</p>
                </div>

                <div className="history-actions">
                    <button
                        type="button"
                        className="history-export-btn"
                        onClick={exportHistory}
                        disabled={!hasHistory}
                    >
                        <span aria-hidden="true">📥</span>
                        Export CSV
                    </button>

                    <button
                        type="button"
                        className="history-delete-all-btn"
                        onClick={deleteAllHistory}
                        disabled={!hasHistory}
                    >
                        <span aria-hidden="true">🗑️</span>
                        Delete All
                    </button>
                </div>
            </div>

            <div className="history-summary">
                <div className="history-summary-dot" />
                <span>
                    {history.length} {history.length === 1 ? "record" : "records"} found
                </span>
            </div>

            {!hasHistory ? (
                <div className="history-empty">
                    <div className="history-empty-icon">📋</div>
                    <h3>No Prediction History Yet</h3>
                    <p>
                        Your AQI predictions will appear here after you run
                        your first analysis.
                    </p>
                </div>
            ) : (
                <div className="history-table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date &amp; Time</th>
                                <th>Location</th>
                                <th>Predicted Class</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {history.map((item, index) => {
                                const status = String(
                                    item.AQI_Status || "Unknown"
                                );

                                return (
                                    <tr key={item.id ?? `${item.timestamp}-${index}`}>
                                        <td className="history-date">
                                            {item.timestamp
                                                ? new Date(item.timestamp).toLocaleString()
                                                : "-"}
                                        </td>

                                        <td className="history-location">
                                            <span className="location-icon" aria-hidden="true">
                                                📍
                                            </span>
                                            {item.location || "-"}
                                        </td>

                                        <td>
                                            <span className="history-class-value">
                                                {item.AQI_Value ?? "-"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={getStatusClass(status)}>
                                                <span
                                                    className="status-indicator"
                                                    aria-hidden="true"
                                                />
                                                {status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="history-delete-btn"
                                                onClick={() => deletePrediction(item.id)}
                                                disabled={item.id == null}
                                                aria-label={`Delete prediction for ${item.location || "unknown location"}`}
                                                title="Delete this prediction"
                                            >
                                                <span aria-hidden="true">🗑️</span>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default HistoryTable;
