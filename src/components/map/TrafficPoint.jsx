import { CircleMarker } from "react-leaflet";

function TrafficPoint({ point, onPointClick }) {
        const { latitude, longitude } = point.location;
        const { traffic_score } = point.traffic;

        const getColor = () => {
                if (traffic_score <= 3) return "#35d07f";
                if (traffic_score <= 6) return "#f5c542";
                if (traffic_score <= 8) return "#f28c28";
                return "#ef4444";
        };

        const color = getColor();

        return (
                <CircleMarker
                        center={[latitude, longitude]}
                        radius={8}
                        pane="markerPane"
                        eventHandlers={{
                                click: (event) => {
                                        onPointClick(point);
                                },
                        }}
                        pathOptions={{
                                color,
                                fillColor: color,
                                fillOpacity: 0.95,
                                weight: 2,
                        }}
                />
        );
}

export default TrafficPoint;