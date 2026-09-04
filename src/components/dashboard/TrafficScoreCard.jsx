function TrafficScoreCard({ score = 0 }) {
        return (
                <section className="traffic-score-card dashboard-card">
                        <div className="card-header">
                                <span>AVERAGE TRAFFIC SCORE</span>
                        </div>

                        <div className="traffic-score-value">
                                {score}
                                <span>/ 10</span>
                        </div>

                        <div className="selected-location">
                                Across monitored traffic locations
                        </div>
                </section>
        );
}

export default TrafficScoreCard;