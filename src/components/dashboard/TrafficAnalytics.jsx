function TrafficAnalytics({ trafficData = [] }) {
        const totalLocations = trafficData.length;

        const totalVehicles = trafficData.reduce(
                (sum, point) => sum + (point.traffic?.vehicle_count || 0),
                0
        );

        const averageScore =
                totalLocations > 0
                        ? trafficData.reduce(
                                (sum, point) =>
                                        sum +
                                        (point.traffic?.traffic_score || 0),
                                0
                        ) / totalLocations
                        : 0;

        const congestionCounts = {
                LOW: 0,
                MEDIUM: 0,
                HIGH: 0,
        };

        trafficData.forEach((point) => {
                const level =
                        point.traffic?.congestion_level?.toUpperCase();

                if (congestionCounts[level] !== undefined) {
                        congestionCounts[level]++;
                }
        });

        return (
                <section className="traffic-analytics">
                        <div className="analytics-heading">
                                <div>
                                        <h2>Traffic Analytics</h2>
                                        <p>
                                                Current city-wide traffic
                                                conditions
                                        </p>
                                </div>
                        </div>

                        <div className="analytics-grid">
                                <div className="analytics-card">
                                        <span>AVERAGE TRAFFIC SCORE</span>

                                        <strong>
                                                {averageScore.toFixed(1)}
                                                <small>/10</small>
                                        </strong>

                                        <p>
                                                Across monitored locations
                                        </p>
                                </div>

                                <div className="analytics-card">
                                        <span>VEHICLES DETECTED</span>

                                        <strong>
                                                {totalVehicles.toLocaleString()}
                                        </strong>

                                        <p>
                                                Across all monitored points
                                        </p>
                                </div>

                                <div className="analytics-card">
                                        <span>HIGH CONGESTION</span>

                                        <strong>
                                                {congestionCounts.HIGH}
                                        </strong>

                                        <p>
                                                Locations requiring attention
                                        </p>
                                </div>

                                <div className="analytics-card">
                                        <span>MONITORED LOCATIONS</span>

                                        <strong>
                                                {totalLocations}
                                        </strong>

                                        <p>
                                                Active traffic points
                                        </p>
                                </div>
                        </div>

                        <div className="congestion-distribution dashboard-card">
                                <div className="card-header">
                                        <span>CONGESTION DISTRIBUTION</span>
                                </div>

                                <div className="congestion-bars">
                                        <div className="congestion-row">
                                                <span>LOW</span>

                                                <div className="bar-track">
                                                        <div
                                                                className="bar-fill low"
                                                                style={{
                                                                        width: `${totalLocations
                                                                                        ? (congestionCounts.LOW /
                                                                                                totalLocations) *
                                                                                        100
                                                                                        : 0
                                                                                }%`,
                                                                }}
                                                        />
                                                </div>

                                                <strong>
                                                        {
                                                                congestionCounts.LOW
                                                        }
                                                </strong>
                                        </div>

                                        <div className="congestion-row">
                                                <span>MEDIUM</span>

                                                <div className="bar-track">
                                                        <div
                                                                className="bar-fill medium"
                                                                style={{
                                                                        width: `${totalLocations
                                                                                        ? (congestionCounts.MEDIUM /
                                                                                                totalLocations) *
                                                                                        100
                                                                                        : 0
                                                                                }%`,
                                                                }}
                                                        />
                                                </div>

                                                <strong>
                                                        {
                                                                congestionCounts.MEDIUM
                                                        }
                                                </strong>
                                        </div>

                                        <div className="congestion-row">
                                                <span>HIGH</span>

                                                <div className="bar-track">
                                                        <div
                                                                className="bar-fill high"
                                                                style={{
                                                                        width: `${totalLocations
                                                                                        ? (congestionCounts.HIGH /
                                                                                                totalLocations) *
                                                                                        100
                                                                                        : 0
                                                                                }%`,
                                                                }}
                                                        />
                                                </div>

                                                <strong>
                                                        {
                                                                congestionCounts.HIGH
                                                        }
                                                </strong>
                                        </div>
                                </div>
                        </div>
                </section>
        );
}

export default TrafficAnalytics;