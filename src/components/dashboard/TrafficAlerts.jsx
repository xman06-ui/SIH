function TrafficAlerts({ trafficData = [] }) {
        const alerts = [...trafficData]
                .filter(
                        (point) =>
                                point.traffic?.congestion_level
                                        ?.toUpperCase() !== "LOW"
                )
                .sort(
                        (a, b) =>
                                (b.traffic?.traffic_score || 0) -
                                (a.traffic?.traffic_score || 0)
                );

        const getAlertType = (point) => {
                const score = point.traffic?.traffic_score || 0;
                const level =
                        point.traffic?.congestion_level?.toUpperCase();

                if (level === "HIGH" || score >= 8) {
                        return "high";
                }

                return "medium";
        };

        const getAlertLabel = (point) => {
                const score = point.traffic?.traffic_score || 0;

                if (score >= 8) {
                        return "HIGH CONGESTION";
                }

                return "TRAFFIC BUILDUP";
        };

        return (
                <section className="traffic-alerts dashboard-card">
                        <div className="alerts-header">
                                <div>
                                        <span className="alerts-label">
                                                LIVE MONITORING
                                        </span>

                                        <h2>Traffic Alerts</h2>

                                        <p>
                                                Locations requiring attention
                                        </p>
                                </div>

                                <div className="active-alert-count">
                                        {alerts.length}
                                        <span>ACTIVE</span>
                                </div>
                        </div>

                        {alerts.length === 0 ? (
                                <div className="no-alerts">
                                        <strong>
                                                No active traffic alerts
                                        </strong>

                                        <span>
                                                All monitored locations are
                                                operating normally.
                                        </span>
                                </div>
                        ) : (
                                <div className="alert-list">
                                        {alerts.map((point) => {
                                                const alertType =
                                                        getAlertType(point);

                                                return (
                                                        <div
                                                                className={`traffic-alert ${alertType}`}
                                                                key={
                                                                        point.event_id
                                                                }
                                                        >
                                                                <div className="alert-indicator" />

                                                                <div className="alert-content">
                                                                        <div className="alert-title">
                                                                                <strong>
                                                                                        {getAlertLabel(
                                                                                                point
                                                                                        )}
                                                                                </strong>

                                                                                <span>
                                                                                        {point.location
                                                                                                ?.name ||
                                                                                                "Detected Location"}
                                                                                </span>
                                                                        </div>

                                                                        <div className="alert-details">
                                                                                <span>
                                                                                        Score{" "}
                                                                                        {
                                                                                                point
                                                                                                        .traffic
                                                                                                        .traffic_score
                                                                                        }
                                                                                        /10
                                                                                </span>

                                                                                <span>
                                                                                        {
                                                                                                point
                                                                                                        .traffic
                                                                                                        .vehicle_count
                                                                                        }{" "}
                                                                                        vehicles
                                                                                </span>

                                                                                <span>
                                                                                        {
                                                                                                point
                                                                                                        .traffic
                                                                                                        .congestion_level
                                                                                        }
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                );
                                        })}
                                </div>
                        )}
                </section>
        );
}

export default TrafficAlerts;