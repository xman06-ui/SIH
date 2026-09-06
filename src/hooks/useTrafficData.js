import { useEffect, useState } from "react";
import { getCurrentTraffic } from "../services/TrafficServices";

export function useTrafficData() {
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTraffic() {
            try {
                const data = await getCurrentTraffic();

                const formattedData = data.map((point) => ({
                    ...point,

                    traffic: {
                        ...point.traffic,

                        // Backend vehicle_occupancy: 0–1
                        // Frontend traffic_score: 0–10
                        traffic_score:
                            point.traffic.vehicle_occupancy * 10,
                    },
                }));

                setTrafficData(formattedData);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch traffic data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        // Fetch immediately when dashboard loads
        fetchTraffic();

        // Fetch again every 5 seconds
        const interval = setInterval(fetchTraffic, 5000);

        // Stop polling when component is removed
        return () => clearInterval(interval);
    }, []);

    return {
        trafficData,
        loading,
        error,
    };
}