function CongestionCard({ count = 0 }) {
        return (
                <section className="congestion-card dashboard-card">
                        <div className="card-header">
                                <span>HIGH CONGESTION POINTS</span>
                        </div>

                        <div className="congestion-value">
                                {count}
                        </div>

                        <div className="congestion-description">
                                Locations currently experiencing high
                                congestion
                        </div>
                </section>
        );
}

export default CongestionCard;