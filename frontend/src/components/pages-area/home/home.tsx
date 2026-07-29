import {
    FaBoxOpen,
    FaCalendarAlt,
    FaChartLine,
    FaTruck
} from "react-icons/fa";

import "./home.css";
import { useTitle } from "../../utils/UseTitle";

export function Home() {

    useTitle("Home");
    
    return (
        <section className="home-page">

            <div className="home-heading">
                <div>
                    <h1>
                         HAMASGERIYA 
                    </h1>

                    <p>
                        Track products, suppliers, events and sales
                        from one management dashboard.
                    </p>
                </div>

                <div className="home-date">
                    Today
                    <strong>
                        {new Date().toLocaleDateString("en-GB")}
                    </strong>
                </div>
            </div>

            <div className="stats-grid">

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaBoxOpen />
                    </div>

                    <div>
                        <span>Total Products</span>
                        <strong>10</strong>
                        <small>Available in inventory</small>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaTruck />
                    </div>

                    <div>
                        <span>Suppliers</span>
                        <strong>10</strong>
                        <small>Active business partners</small>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaCalendarAlt />
                    </div>

                    <div>
                        <span>Events</span>
                        <strong>10</strong>
                        <small>Registered pub events</small>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon">
                        <FaChartLine />
                    </div>

                    <div>
                        <span>Sales Activity</span>
                        <strong>Live</strong>
                        <small>Connected to the management API</small>
                    </div>
                </article>

            </div>

            <div className="home-content-grid">

                <article className="dashboard-panel">
                    <div className="panel-heading">
                        <div>
                            <span>Inventory</span>
                            <h2>Stock overview</h2>
                        </div>

                        <button type="button">
                            View products
                        </button>
                    </div>

                    <div className="stock-list">

                        <div className="stock-row">
                            <div>
                                <strong>Cabernet Saovinon</strong>
                                <span>Wine</span>
                            </div>

                            <div className="stock-value">
                                35 units
                            </div>
                        </div>

                        <div className="stock-row">
                            <div>
                                <strong>Chardonnay</strong>
                                <span>Wine</span>
                            </div>

                            <div className="stock-value">
                                29 units
                            </div>
                        </div>

                        <div className="stock-row">
                            <div>
                                <strong>Cola 330ml</strong>
                                <span>Soft Drinks</span>
                            </div>

                            <div className="stock-value">
                                145 units
                            </div>
                        </div>

                    </div>
                </article>

                <article className="dashboard-panel activity-panel">
                    <div className="panel-heading">
                        <div>
                            <span>Activity</span>
                            <h2>System status</h2>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span className="activity-dot" />
                        <div>
                            <strong>Backend API</strong>
                            <small>Running on port 4000</small>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span className="activity-dot" />
                        <div>
                            <strong>MySQL database</strong>
                            <small>Docker container is healthy</small>
                        </div>
                    </div>

                    <div className="activity-item">
                        <span className="activity-dot" />
                        <div>
                            <strong>Frontend</strong>
                            <small>React development server is active</small>
                        </div>
                    </div>
                </article>

            </div>

        </section>
    );
}