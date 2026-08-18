
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTitle } from "../../utils/UseTitle";
import { LoginUserDto } from "../../models/user-model";
import { authService } from "../../service/authService";
import { notificationService } from "../../service/notificationService";
import { FaHome } from "react-icons/fa";

import { useTranslation } from "react-i18next";

export function Login() {

    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language === "he";

    console.log("current language:", i18n.language);
    console.log("welcomeBack:", t("login.welcomeBack"));

    useTitle(t("login.pageTitle"));
    const { register, handleSubmit, reset } = useForm<LoginUserDto>();
    const navigate = useNavigate();

    async function send(credentials: LoginUserDto) {
        try {
            await authService.login(credentials);
            notificationService.success(t("login.success"));
            navigate("/")

        } catch (err: any) {
            notificationService.error(err.message)
        }
    }




    return (
        <section className="login-page" dir={isHebrew ? "rtl" : "ltr"}>
            <div className="login-card">
                <div className="login-header">
                    <span>{t("login.welcomeBack")}</span>
                    <h1>{t("login.title")}</h1>
                    <p>{t("login.description")}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit(send)}>
                    <div className="form-group">
                        <label>{t("login.email")}</label>
                        <input
                            type="email"
                            placeholder={t("login.emailPlaceholder")}
                            {...register("email", { required: true })}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("login.password")}</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder={t("login.passwordPlaceholder")}
                            {...register("password", { required: true })}
                        />
                    </div>
                    <button type="submit">
                        {t("login.login")}
                    </button>

                    <div className="register-link">
                        <span>{t("login.noAccount")}</span>
                        <Link to="/register">
                            {t("login.createAccount")}
                        </Link>
                    </div>

                </form>

                <p className="customer-access">
                    {t("login.customer")}

                    <button
                        type="button"
                        onClick={() => navigate("/customer-login")}
                    >
                        {t("login.customerLogin")}
                    </button>
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                >
                    <FaHome size={15} color="red" />

                </button>
            </div>


        </section>
    );
}
