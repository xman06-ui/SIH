import { useRef, useState } from "react";
import {
        MapContainer,
        TileLayer,
        useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import TrafficPoint from "./TrafficPoint";
import TrafficRoads from "./TrafficRoads";
import SelectedPointPopup from "./SelectedPointPopup";
import TrafficLegend from "./TrafficLegend";

function MapClickHandler({ onMapClick }) {
        useMapEvents({
                click: (event) => {
                        const target = event.originalEvent?.target;

                        // Do not close the popup when clicking a traffic point.
                        if (
                                target &&
                                target.classList &&
                                target.classList.contains("leaflet-interactive")
                        ) {
                                return;
                        }

                        onMapClick();
                },
        });

        return null;
}

function TrafficMap({ trafficData = [] }) {
        const mapRef = useRef(null);

        const [selectedPoint, setSelectedPoint] = useState(null);
        const [selectedPosition, setSelectedPosition] = useState(null);

        const mapCenter =
                trafficData.length > 0
                        ? [
                                trafficData[0].location.latitude,
                                trafficData[0].location.longitude,
                        ]
                        : [21.1702, 72.8311];

        const handlePointClick = (point) => {
                if (!mapRef.current) {
                        return;
                }

                const map = mapRef.current;

                const pointPosition = map.latLngToContainerPoint([
                        point.location.latitude,
                        point.location.longitude,
                ]);

                const mapSize = map.getSize();

                /*
                 * Popup dimensions.
                 * Keep these in sync with the CSS.
                 */
                const popupWidth = 310;
                const popupHeight = 250;

                const gap = 18;
                const padding = 12;

                /*
                 * Determine which half of the map
                 * the selected point belongs to.
                 */
                const isTopHalf =
                        pointPosition.y < mapSize.y / 2;

                const isLeftHalf =
                        pointPosition.x < mapSize.x / 2;

                /*
                 * Horizontal position
                 *
                 * Left half  → popup to the RIGHT
                 * Right half → popup to the LEFT
                 */
                let left;

                if (isLeftHalf) {
                        left = pointPosition.x + gap;
                } else {
                        left =
                                pointPosition.x -
                                popupWidth -
                                gap;
                }

                /*
                 * Vertical position
                 *
                 * Top half    → popup BELOW
                 * Bottom half → popup ABOVE
                 */
                let top;

                if (isTopHalf) {
                        top = pointPosition.y + gap;
                } else {
                        top =
                                pointPosition.y -
                                popupHeight -
                                gap;
                }

                /*
                 * Final safety checks.
                 *
                 * These prevent the popup from leaving the
                 * map if the point is very close to an edge.
                 */

                if (left < padding) {
                        left = padding;
                }

                if (left + popupWidth > mapSize.x - padding) {
                        left =
                                mapSize.x -
                                popupWidth -
                                padding;
                }

                if (top < padding) {
                        top = padding;
                }

                if (top + popupHeight > mapSize.y - padding) {
                        top =
                                mapSize.y -
                                popupHeight -
                                padding;
                }

                setSelectedPoint(point);

                setSelectedPosition({
                        x: left,
                        y: top,
                });
        };

        const closePopup = () => {
                setSelectedPoint(null);
                setSelectedPosition(null);
        };

        return (
                <div className="traffic-map-wrapper">
                        <MapContainer
                                center={mapCenter}
                                zoom={14}
                                scrollWheelZoom={true}
                                ref={mapRef}
                                style={{
                                        height: "100%",
                                        width: "100%",
                                }}
                        >
                                <MapClickHandler
                                        onMapClick={closePopup}
                                />

                                <TrafficRoads
                                        trafficData={trafficData}
                                />

                                <TileLayer
                                        attribution="&copy; OpenStreetMap contributors"
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {trafficData.map((point) => (
                                        <TrafficPoint
                                                key={point.event_id}
                                                point={point}
                                                onPointClick={handlePointClick}
                                        />
                                ))}
                        </MapContainer>

                        {selectedPoint && selectedPosition && (
                                <SelectedPointPopup
                                        point={selectedPoint}
                                        position={selectedPosition}
                                        onClose={closePopup}
                                />
                        )}

                        <TrafficLegend />
                </div>
        );
}

export default TrafficMap;