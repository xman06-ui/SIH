import { Activity } from "lucide-react";

function Header() {
        return (
                <header className="dashboard-header">
                        <div className="header-title">
                                <h1>URBAN TRAFFIC INTELLIGENCE</h1>
                                <p>AI-Powered Public Transport Traffic Monitoring</p>
                        </div>

                        <div className="header-status">
                                <div className="live-status">
                                        <span className="live-dot"></span>
                                        <span>SYSTEM LIVE</span>
                                </div>

                                <div className="header-icon">
                                        <Activity size={18} />
                                </div>
                        </div>
                </header>
        );
}

export default Header;