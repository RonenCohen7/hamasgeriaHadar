import "./header.css";

import { useTranslation } from "react-i18next";



export function Header() {

    const {i18n} = useTranslation();

    async function toggleLanguage(language: "he" | "en"){

        await i18n.changeLanguage(language);

            localStorage.setItem(
                "language",
                language
            );

            document.documentElement.lang = language;

            document.documentElement.dir = language == "he" ? "rtl" : "ltr";
        
    }




    return (
        <div className="header">

			<p>HAMASGERIA - Hadar Pub Management </p>


            <button
                type="button"
                className="language-button"
                onClick={()=>toggleLanguage(i18n.language == "he" ? "en" :"he")}
            >
                <span>🌐</span>
                {i18n.language == "he" ? "English" : "עברית"}
            </button>

        </div>
    );
}
