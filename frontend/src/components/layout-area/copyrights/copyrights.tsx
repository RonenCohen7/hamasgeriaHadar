import "./copyrights.css";

export function Copyrights() {
    return (
        <div className="copyrights">

            <span className="developer-credit">
                עיצוב ופיתוח האתר:{" "}
                <a
                    href="https://ronencohen.dev/#portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ronen Cohen - Full Stack Developer"
                >
                    Ronen Cohen
                </a>
            </span>
            <span className="copyright">
                © {new Date().getFullYear()} 🍺
            </span>

        </div>
    );
}