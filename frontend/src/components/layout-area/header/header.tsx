import "./header.css";
import "./header.css";
import { useTranslation } from "react-i18next";



export function Header() {

    const {i18n} = useTranslation();

    function toggleLanguage(){
        const newLanguage = i18n.language == "he" ? "en" : "he";

            i18n.changeLanguage(newLanguage);

        document.documentElement.lang = newLanguage;
        document.documentElement.dir = 
            newLanguage == "he" ? "rtl" : "ltr"

    }




    return (
        <div className="header">

			<p>HAMASGERIA - Hadar Pub Management </p>


            <button
                type="button"
                className="language-button"
                onClick={toggleLanguage}
            >
                <span>🌐</span>
                {i18n.language == "he" ? "English" : "עברית"}
            </button>

        </div>
    );
}
