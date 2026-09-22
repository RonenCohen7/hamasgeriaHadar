class WhatsAppService {

    private initialized = false;

    public loadFacebookSdk(): Promise<void> {

        return new Promise((resolve, reject) => {

            if (this.initialized) {
                resolve();
                return;
            }

            (window as any).fbAsyncInit = () => {

                const FB = (window as any).FB;

                console.log("META APP ID:", import.meta.env.VITE_META_APP_ID);
                console.log("META CONFIG ID:", import.meta.env.VITE_META_CONFIG_ID);

                FB.init({
                    appId: import.meta.env.VITE_META_APP_ID,
                    cookie: true,
                    xfbml: false,
                    version: "v26.0"
                });

                this.initialized = true;

                console.log("Facebook SDK ready");

                resolve();
            };

            const existingScript =
                document.getElementById("facebook-jssdk");

            if (existingScript) {
                return;
            }

            const script = document.createElement("script");

            script.id = "facebook-jssdk";
            script.src =
                "https://connect.facebook.net/en_US/sdk.js";

            script.async = true;
            script.defer = true;
            script.crossOrigin = "anonymous";

            script.onerror = () => {
                reject(
                    new Error("Failed to load Facebook SDK")
                );
            };

            document.body.appendChild(script);
        });
    }


    public connectWhatsapp(): void {

        const FB = (window as any).FB;

        if (!FB || !this.initialized) {

            console.error(
                "Facebook SDK is not ready yet"
            );

            return;
        }

        // extras לפי תיעוד Meta לחיבור מספר קיים מ-WhatsApp Business App
        // (coexistence). לא לשלב featureType זה עם
        // features: [{ name: "app_only_install" }] — Meta כותבים במפורש
        // ש-app_only_install אסור עבור משתמשי WhatsApp Business App.
        const loginOptions = {
            config_id: import.meta.env.VITE_META_CONFIG_ID,
            response_type: "code",
            override_default_response_type: true,
            extras: {
                setup: {},
                featureType: "whatsapp_business_app_onboarding",
                sessionInfoVersion: "3"
            }
        };

        console.log("FB.login options:", loginOptions);

        // רק קריאה אחת ל-FB.login. קריאה שנייה מיד אחריה (עם extras
        // ישנים/שונים) היא בדיוק מה שגרם ל-"Only one navigator.credentials.get
        // request may be outstanding at one time" ול-"Error retrieving a token".
        FB.login(
            (response: any) => {
                console.log(
                    "Embedded Signup status:",
                    response?.status
                );
            },
            loginOptions
        );
    }
}


export const whatsappService = new WhatsAppService();