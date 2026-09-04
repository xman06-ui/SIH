import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";

import TrafficScoreCard from "./TrafficScoreCard";
import CongestionCard from "./CongestionCard";
import TrafficScoreChart from "./TrafficScoreChart";

import TrafficMap from "../map/TrafficMap";

import mockTrafficData from "../../data/mockTrafficData";
import TrafficAnalytics from "./TrafficAnalytics";
import TrafficAlerts from "./TrafficAlerts";

function Dashboard() {
        const trafficData = mockTrafficData;

        /*
         * Average traffic score across all locations.
         */
        const averageTrafficScore =
                trafficData.length > 0
                        ? trafficData.reduce(
                                (sum, point) =>
                                        sum + point.traffic.traffic_score,
                                0
                        ) / trafficData.length
                        : 0;

        /*
         * Number of locations with HIGH congestion.
         */
        const highCongestionCount = trafficData.filter(
                (point) =>
                        point.traffic.congestion_level.toUpperCase() ===
                        "HIGH"
        ).length;

        return (
                <div className="dashboard-layout">
                        <Sidebar />

                        <div className="dashboard-main">
                                <Header />

                                <main className="dashboard-content">
                                        <div className="dashboard-heading">
                                                <h2>
                                                        Traffic Dashboard
                                                </h2>

                                                <p>
                                                        GIS-based real-time
                                                        traffic monitoring
                                                </p>
                                        </div>

                                        <TrafficMap
                                                trafficData={trafficData}
                                        />

                                        <div className="dashboard-cards">
                                                <TrafficScoreCard
                                                        score={averageTrafficScore.toFixed(
                                                                1
                                                        )}
                                                />

                                                <CongestionCard
                                                        count={
                                                                highCongestionCount
                                                        }
                                                />
                                        </div>

                                        <TrafficScoreChart
                                                trafficData={trafficData}
                                        />

                                        <TrafficAnalytics
                                                trafficData={trafficData}
                                        />
                                </main>
                        </div>
                </div>
        );
}

export default Dashboard;