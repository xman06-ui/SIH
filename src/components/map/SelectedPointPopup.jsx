function SelectedPointPopup({ point, onClose, position }) {
        if (!point || !position) {
                return null;
        }

        const { latitude, longitude, name } = point.location;

        const {
                traffic_score,
                congestion_level,
                vehicle_count,
        } = point.traffic;

        return (
                <div
                        className={`selected-point-popup ${position.placement}`}
                        style={{
                                left: `${position.x}px`,
                                top: `${position.y}px`,
                        }}
                        onClick={(event) => {
                                event.stopPropagation();
                        }}
                >
                        <div className="popup-header">
                                <div>
                                        <span className="popup-label">
                                                TRAFFIC LOCATION
                                        </span>

                                        <h3>
                                                {name || "Detected Location"}
                                        </h3>
                                </div>

                                <button
                                        onClick={onClose}
                                        className="popup-close"
                                        aria-label="Close popup"
                                >
                                        ×
                                </button>
                        </div>

                        <div className="popup-score">
                                <span>TRAFFIC SCORE</span>

                                <strong>
                                        {traffic_score.toFixed(1)}/10
                                </strong>
                        </div>

                        <div className="popup-congestion">
                                <span
                                        className={`congestion-indicator ${congestion_level.toLowerCase()}`}
                                />

                                <div>
                                        <span>CONGESTION</span>

                                        <strong>
                                                {congestion_level}
                                        </strong>
                                </div>
                        </div>

                        <div className="popup-info-grid">
                                <div>
                                        <span>AVERAGE VEHICLES</span>

                                        <strong>
                                                {vehicle_count} vehicles
                                        </strong>
                                </div>

                                <div>
                                        <span>GPS COORDINATES</span>

                                        <strong>
                                                {latitude.toFixed(5)},{" "}
                                                {longitude.toFixed(5)}
                                        </strong>
                                </div>
                        </div>
                </div>
        );
}

export default SelectedPointPopup;