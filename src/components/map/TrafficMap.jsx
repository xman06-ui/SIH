import { useRef, useState, useEffect } from "react";

import {
        MapContainer,
        TileLayer,
        useMapEvents,
        useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

import TrafficPoint from "./TrafficPoint";
import TrafficRoads from "./TrafficRoads";
import SelectedPointPopup from "./SelectedPointPopup";
import TrafficLegend from "./TrafficLegend";


/* =========================================================
   MAP CLICK HANDLER
   ========================================================= */

function MapClickHandler({ onMapClick }) {
        useMapEvents({
                click: (event) => {
                        const target = event.originalEvent?.target;

                        // Do not close popup when clicking a traffic point
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


/* =========================================================
   SMOOTH TRAFFIC HEAT LAYER
   ========================================================= */

function TrafficHeatLayer({ trafficData }) {
        const map = useMap();

        useEffect(() => {
                if (!map || !trafficData?.length) {
                        return;
                }

                /*
                 * Convert your traffic data into:
                 *
                 * [latitude, longitude, intensity]
                 *
                 * Intensity is normalized from 0 → 1.
                 */

                const heatPoints = trafficData
                        .filter(
                                (point) =>
                                        point.location &&
                                        typeof point.location.latitude === "number" &&
                                        typeof point.location.longitude === "number"
                        )
                        .map((point) => [
                                point.location.latitude,
                                point.location.longitude,

                                // Traffic score is 0–10
                                // Convert it to 0–1
                                Math.max(
                                        0,
                                        Math.min(
                                                1,
                                                (point.trafficScore ?? 0) / 10
                                        )
                                ),
                        ]);

                if (heatPoints.length === 0) {
                        return;
                }

                /*
                 * Create smooth gradient heat layer.
                 */

                const heatLayer = L.heatLayer(heatPoints, {
                        radius: 50,
                        blur: 40,

                        /*
                         * Controls how visible the heat layer is.
                         */
                        minOpacity: 0.30,

                        /*
                         * Maximum zoom at which heat points
                         * are scaled.
                         */
                        maxZoom: 17,

                        /*
                         * Smooth traffic gradient
                         */
                        gradient: {
                                0.00: "#22c55e", // Green
                                0.35: "#eab308", // Yellow
                                0.60: "#f97316", // Orange
                                0.80: "#ef4444", // Red
                                1.00: "#dc2626", // Dark red
                        },
                });

                /*
                 * Add heat layer to the map.
                 */
                heatLayer.addTo(map);

                /*
                 * Remove old heat layer when data changes
                 * or component is unmounted.
                 */
                return () => {
                        map.removeLayer(heatLayer);
                };

        }, [map, trafficData]);

        return null;
}


/* =========================================================
   MAIN TRAFFIC MAP
   ========================================================= */

function TrafficMap({ trafficData = [] }) {

        const mapRef = useRef(null);

        const [selectedPoint, setSelectedPoint] = useState(null);
        const [selectedPosition, setSelectedPosition] = useState(null);


        /* =====================================================
           MAP CENTER
           ===================================================== */

        const mapCenter =
                trafficData.length > 0
                        ? [
                                trafficData[0].location.latitude,
                                trafficData[0].location.longitude,
                        ]
                        : [21.1702, 72.8311];


        /* =====================================================
           TRAFFIC POINT CLICK
           ===================================================== */

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
                 * Keep these synchronized with CSS.
                 */

                const popupWidth = 310;
                const popupHeight = 250;

                const gap = 18;
                const padding = 12;


                /* =================================================
                   DETERMINE POINT POSITION
                   ================================================= */

                const isTopHalf =
                        pointPosition.y < mapSize.y / 2;

                const isLeftHalf =
                        pointPosition.x < mapSize.x / 2;


                /* =================================================
                   HORIZONTAL POPUP POSITION
                   ================================================= */

                let left;

                if (isLeftHalf) {
                        // Point on left → popup to right
                        left = pointPosition.x + gap;
                } else {
                        // Point on right → popup to left
                        left =
                                pointPosition.x -
                                popupWidth -
                                gap;
                }


                /* =================================================
                   VERTICAL POPUP POSITION
                   ================================================= */

                let top;

                if (isTopHalf) {
                        // Point on top → popup below
                        top = pointPosition.y + gap;
                } else {
                        // Point on bottom → popup above
                        top =
                                pointPosition.y -
                                popupHeight -
                                gap;
                }


                /* =================================================
                   EDGE SAFETY
                   ================================================= */

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


                /* =================================================
                   SET SELECTED POINT
                   ================================================= */

                setSelectedPoint(point);

                setSelectedPosition({
                        x: left,
                        y: top,
                });
        };


        /* =====================================================
           CLOSE POPUP
           ===================================================== */

        const closePopup = () => {
                setSelectedPoint(null);
                setSelectedPosition(null);
        };


        /* =====================================================
           RENDER
           ===================================================== */

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

                                {/* Map click handling */}
                                <MapClickHandler
                                        onMapClick={closePopup}
                                />


                                {/* =================================================
                                    BASE MAP
                                    ================================================= */}

                                <TileLayer
                                        attribution="&copy; OpenStreetMap contributors"
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />


                                {/* =================================================
                                    ROAD LAYER
                                    ================================================= */}

                                <TrafficRoads
                                        trafficData={trafficData}
                                />


                                {/* =================================================
                                    SMOOTH GRADIENT HEAT LAYER
                                    ================================================= */}

                                <TrafficHeatLayer
                                        trafficData={trafficData}
                                />


                                {/* =================================================
                                    INDIVIDUAL TRAFFIC POINTS
                                    ================================================= */}

                                {trafficData.map((point) => (
                                        <TrafficPoint
                                                key={point.event_id}
                                                point={point}
                                                onPointClick={handlePointClick}
                                        />
                                ))}

                        </MapContainer>


                        {/* =====================================================
                            SELECTED LOCATION POPUP
                            ===================================================== */}

                        {selectedPoint && selectedPosition && (
                                <SelectedPointPopup
                                        point={selectedPoint}
                                        position={selectedPosition}
                                        onClose={closePopup}
                                />
                        )}


                        {/* =====================================================
                            TRAFFIC LEGEND
                            ===================================================== */}

                        <TrafficLegend />

                </div>
        );
}

export default TrafficMap;