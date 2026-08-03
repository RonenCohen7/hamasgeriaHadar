import "./contact-us.css";

import {
    FaPhone,
    FaGlobe,
    FaLinkedin,
    FaUserTie,
    FaCode,
    FaHeadset
} from "react-icons/fa6";

import "./contact-us.css";
import { useTitle } from "../../utils/UseTitle";

export function ContactUs() {

    useTitle("Contact Us");

    return (
        <section className="ContactUs">

            <header className="contact-header">

                <span className="contact-eyebrow">
                    HADAR PUB MANAGEMENT
                </span>

                <h1>Support Center</h1>

                <p>
                    Professional support, maintenance and custom development
                    for the Hadar Pub Management System.
                </p>

            </header>

            <div className="contact-grid">

                <article className="contact-card developer-card">

                    <div className="contact-avatar">
                        <FaUserTie />
                    </div>

                    <h2>Ronen Cohen</h2>

                    <span className="job-title">
                        Full Stack Developer
                    </span>

                    <div className="contact-item">
                        <FaPhone />
                        <span>0526-240604</span>
                    </div>

                    <div className="contact-item">
                        <FaGlobe />
                        <a
                            href="https://www.ronencohen.dev/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            www.ronencohen.dev
                        </a>
                    </div>

                    <div className="contact-item">
                        <FaLinkedin />
                        <a
                            href="https://www.linkedin.com/in/ronen-cohen7"
                            target="_blank"
                            rel="noreferrer"
                        >
                            LinkedIn Profile
                        </a>
                    </div>

                </article>

                <article className="contact-card">

                    <div className="card-icon">
                        <FaHeadset />
                    </div>

                    <h2>Technical Support</h2>

                    <p>
                        Need help with the system?
                        Questions, bug reports, feature requests or
                        deployment assistance are always welcome.
                    </p>

                </article>

                <article className="contact-card">

                    <div className="card-icon">
                        <FaCode />
                    </div>

                    <h2>About this System</h2>

                    <p>
                        Hadar Pub Management System is a modern business
                        management platform built with React, TypeScript,
                        Node.js, Express and MySQL.

                        It includes inventory management, suppliers,
                        events, sales, live synchronization and an
                        administrative dashboard.
                    </p>

                </article>

            </div>

            <footer className="contact-footer">

                <strong>
                    Hadar Pub Management System
                </strong>

                <span>Version 1.0</span>

                <small>
                    Designed & Developed by Ronen Cohen © 2026
                </small>

            </footer>

        </section>
    );
}
