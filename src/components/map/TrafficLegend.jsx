function TrafficLegend() {
        return (
                <div className="traffic-legend">
                        <div className="legend-title">TRAFFIC LEVEL</div>

                        <div className="legend-gradient">
                                <span className="legend-dot low" />
                                <span className="legend-label">LOW</span>

                                <span className="legend-dot medium" />
                                <span className="legend-label">MEDIUM</span>

                                <span className="legend-dot high" />
                                <span className="legend-label">HIGH</span>
                        </div>
                </div>
        );
}

export default TrafficLegend;