import { Polyline } from "react-leaflet";

function interpolateColor(score) {
        const stops = [
                { score: 1, color: [53, 208, 127] },   // Green
                { score: 4, color: [245, 197, 66] },   // Yellow
                { score: 7, color: [242, 140, 40] },   // Orange
                { score: 10, color: [239, 68, 68] },   // Red
        ];

        if (score <= 1) return "rgb(53, 208, 127)";
        if (score >= 10) return "rgb(239, 68, 68)";

        for (let i = 0; i < stops.length - 1; i++) {
                const start = stops[i];
                const end = stops[i + 1];

                if (score >= start.score && score <= end.score) {
                        const ratio =
                                (score - start.score) / (end.score - start.score);

                        const r = Math.round(
                                start.color[0] + (end.color[0] - start.color[0]) * ratio
                        );

                        const g = Math.round(
                                start.color[1] + (end.color[1] - start.color[1]) * ratio
                        );

                        const b = Math.round(
                                start.color[2] + (end.color[2] - start.color[2]) * ratio
                        );

                        return `rgb(${r}, ${g}, ${b})`;
                }
        }

        return "rgb(245, 197, 66)";
}

function TrafficRoads({ trafficData }) {
        if (!trafficData || trafficData.length < 2) {
                return null;
        }

        const roadSegments = [];

        for (let i = 0; i < trafficData.length - 1; i++) {
                const current = trafficData[i];
                const next = trafficData[i + 1];

                const startLat = current.location.latitude;
                const startLng = current.location.longitude;

                const endLat = next.location.latitude;
                const endLng = next.location.longitude;

                const startScore = current.traffic.traffic_score;
                const endScore = next.traffic.traffic_score;

                const steps = 30;

                for (let j = 0; j < steps; j++) {
                        const t1 = j / steps;
                        const t2 = (j + 1) / steps;

                        const lat1 = startLat + (endLat - startLat) * t1;
                        const lng1 = startLng + (endLng - startLng) * t1;

                        const lat2 = startLat + (endLat - startLat) * t2;
                        const lng2 = startLng + (endLng - startLng) * t2;

                        const score = startScore + (endScore - startScore) * t1;

                        roadSegments.push(
                                <Polyline
                                        key={`${current.event_id}-${i}-${j}`}
                                        positions={[
                                                [lat1, lng1],
                                                [lat2, lng2],
                                        ]}
                                        pathOptions={{
                                                color: interpolateColor(score),
                                                weight: 9,
                                                opacity: 0.9,
                                        }}
                                />
                        );
                }
        }

        return <>{roadSegments}</>;
}

export default TrafficRoads;