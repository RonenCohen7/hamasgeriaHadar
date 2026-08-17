import {
    FaBuilding,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaMusic,
    FaUsers,
    FaTree
} from "react-icons/fa";

import "./about.css";

export function About() {
    return (
        <section className="about-page">

            <header className="about-hero">
                <div className="about-hero-content">

                    <span className="about-eyebrow">
                        About HAMASGERIA
                    </span>

                    <h1>
                        פאב המסגריה
                    </h1>

                    <p>
                        מתחם בילוי ואירועים בקיבוץ חצרים, המארח קהל
                        מכל אזור הדרום במסיבות, אירועים וערבי בילוי.
                    </p>

                    <div className="about-location">
                        <FaMapMarkerAlt />
                        <span>קיבוץ חצרים</span>
                    </div>

                </div>

                <div className="about-hero-icon">
                    🍺
                </div>
            </header>

            <div className="about-stats">

                <article className="about-stat-card">
                    <div className="about-stat-icon">
                        <FaUsers />
                    </div>

                    <div>
                        <strong>כ־700</strong>
                        <span>אורחים במתחם</span>
                    </div>
                </article>

                <article className="about-stat-card">
                    <div className="about-stat-icon">
                        <FaBuilding />
                    </div>

                    <div>
                        <strong>2</strong>
                        <span>אולמות פעילים</span>
                    </div>
                </article>

                <article className="about-stat-card">
                    <div className="about-stat-icon">
                        <FaTree />
                    </div>

                    <div>
                        <strong>1</strong>
                        <span>רחבת קיץ פתוחה</span>
                    </div>
                </article>

            </div>

            <div className="about-content-grid">

                <article className="about-panel about-story">
                    <span className="about-section-label">
                        הסיפור שלנו
                    </span>

                    <h2>
                        מקום גדול לאירועים וחיי לילה
                    </h2>

                    <p>
                        פאב המסגריה בקיבוץ חצרים הוא מתחם גדול
                        שיכול לאכלס כ־700 איש.
                    </p>

                    <p>
                        למקום מגיעים מבקרים מכל האזור כדי לבלות
                        במסיבות הליין המתקיימות בימי שישי
                        ובאירועים מגוונים נוספים.
                    </p>

                    <p>
                        במתחם קיימים שני אולמות, ובעונת הקיץ
                        נפתחת רחבה נוספת תחת כיפת השמיים.
                    </p>
                </article>

                <aside className="about-panel about-highlights">
                    <span className="about-section-label">
                        מה תמצאו אצלנו
                    </span>

                    <div className="about-highlight">
                        <FaMusic />

                        <div>
                            <strong>מסיבות ליין</strong>
                            <span>מסיבות קבועות בימי שישי</span>
                        </div>
                    </div>

                    <div className="about-highlight">
                        <FaCalendarAlt />

                        <div>
                            <strong>אירועים מגוונים</strong>
                            <span>אירועים ומפגשים לקהלים שונים</span>
                        </div>
                    </div>

                    <div className="about-highlight">
                        <FaBuilding />

                        <div>
                            <strong>שני אולמות</strong>
                            <span>חללים נפרדים בתוך המתחם</span>
                        </div>
                    </div>

                    <div className="about-highlight">
                        <FaTree />

                        <div>
                            <strong>רחבה תחת כיפת השמיים</strong>
                            <span>נפתחת במהלך עונת הקיץ</span>
                        </div>
                    </div>
                </aside>

            </div>

        </section>
    );
}