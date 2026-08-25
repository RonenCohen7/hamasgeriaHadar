
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import he from "./he.json";
import en from "./en.json";

const savedLanguage = localStorage.getItem("language") || "he"

i18n
   
    .use(initReactI18next)
    .init({
        resources: {
            he: {
                translation: he
            },
            en: {
                translation: en
            }
        },
        lng: savedLanguage,

        fallbackLng: "he",

        interpolation: {
            escapeValue: false
        }
    });

    document.documentElement.lang = savedLanguage;

    document.documentElement.dir = savedLanguage == "he" ? "rtl" : "lft";

    export default i18n;