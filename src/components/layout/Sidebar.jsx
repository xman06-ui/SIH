import {
        LayoutDashboard,
        Map,
        BarChart3,
        AlertTriangle,
        Settings,
} from "lucide-react";

function Sidebar() {
        return (
                <aside className="dashboard-sidebar">
                        <div className="sidebar-logo">
                                <div className="logo-mark">
                                        <Map size={22} />
                                </div>
                                <span>UTI</span>
                        </div>

                        <nav className="sidebar-nav">
                                <button className="nav-item active">
                                        <LayoutDashboard size={19} />
                                        <span>Dashboard</span>
                                </button>

                                <button className="nav-item">
                                        <Map size={19} />
                                        <span>Traffic Map</span>
                                </button>

                                <button className="nav-item">
                                        <BarChart3 size={19} />
                                        <span>Analytics</span>
                                </button>

                                <button className="nav-item">
                                        <AlertTriangle size={19} />
                                        <span>Incidents</span>
                                </button>

                                <button className="nav-item">
                                        <Settings size={19} />
                                        <span>Settings</span>
                                </button>
                        </nav>
                </aside>
        );
}

export default Sidebar;