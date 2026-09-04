import {
        LineChart,
        Line,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
} from "recharts";

function TrafficScoreChart({ trafficData = [] }) {
        const chartData = trafficData.map((point, index) => ({
                time: `Point ${index + 1}`,
                score: point.traffic.traffic_score,
        }));

        return (
                <section className="traffic-score-chart dashboard-card">
                        <div className="card-header">
                                <span>
                                        AVERAGE TRAFFIC SCORE
                                </span>

                                <select defaultValue="current">
                                        <option value="current">
                                                Current locations
                                        </option>
                                </select>
                        </div>

                        <div className="chart-container">
                                <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                >
                                        <LineChart
                                                data={chartData}
                                        >
                                                <CartesianGrid
                                                        strokeDasharray="3 3"
                                                />

                                                <XAxis
                                                        dataKey="time"
                                                />

                                                <YAxis
                                                        domain={[0, 10]}
                                                />

                                                <Tooltip />

                                                <Line
                                                        type="monotone"
                                                        dataKey="score"
                                                        strokeWidth={2}
                                                        dot={{
                                                                r: 4,
                                                        }}
                                                        activeDot={{
                                                                r: 6,
                                                        }}
                                                />
                                        </LineChart>
                                </ResponsiveContainer>
                        </div>
                </section>
        );
}

export default TrafficScoreChart;