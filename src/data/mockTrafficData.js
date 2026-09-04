const mockTrafficData = [
        {
                event_id: "EVT_000152",
                timestamp: "2026-09-02T16:12:15",
                location: {
                        latitude: 21.1702,
                        longitude: 72.8311,
                },
                traffic: {
                        vehicle_count: 27,
                        density: 0.64,
                        density_level: "HIGH",
                        congestion_level: "HIGH",
                        traffic_score: 8.4,
                },
        },
        {
                event_id: "EVT_000153",
                timestamp: "2026-09-02T16:12:15",
                location: {
                        latitude: 21.1712,
                        longitude: 72.8331,
                },
                traffic: {
                        vehicle_count: 19,
                        density: 0.45,
                        density_level: "MEDIUM",
                        congestion_level: "MEDIUM",
                        traffic_score: 5.7,
                },
        },
        {
                event_id: "EVT_000154",
                timestamp: "2026-09-02T16:12:15",
                location: {
                        latitude: 21.1721,
                        longitude: 72.835,
                },
                traffic: {
                        vehicle_count: 9,
                        density: 0.22,
                        density_level: "LOW",
                        congestion_level: "LOW",
                        traffic_score: 2.8,
                },
        },
];

export default mockTrafficData;