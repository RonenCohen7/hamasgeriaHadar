import { useEffect, useState } from "react";
import "./whatsapp-connect.css";
import { whatsappService } from "../../service/whatsappService";



export function WhatsappConnect() {

    const [sdkReady, setSdkReady] =
        useState(false);

  useEffect(() => {

    const handleMessage = (event: MessageEvent) => {
        console.log("postMessage origin:", event.origin);
        if (
            event.origin !== "https://www.facebook.com" &&
            event.origin !== "https://web.facebook.com"
        ) {
            return;
        }

        console.log(
            "Facebook postMessage:",
            event.data
        );

        try {

            const data =
                typeof event.data === "string"
                    ? JSON.parse(event.data)
                    : event.data;

            if (data?.type !== "WA_EMBEDDED_SIGNUP") {
                return;
            }

            console.log(
                "WA_EMBEDDED_SIGNUP event:",
                data.event
            );

            console.log(
                "WA_EMBEDDED_SIGNUP data:",
                data.data
            );

        }
        catch {
            // Ignore unrelated Facebook messages
        }
    };

    window.addEventListener(
        "message",
        handleMessage
    );

    whatsappService
        .loadFacebookSdk()
        .then(() => setSdkReady(true))
        .catch(console.error);

    return () => {
        window.removeEventListener(
            "message",
            handleMessage
        );
    };

}, []);


    function connectWhatsapp() {

        console.log(
            "Connect WhatsApp clicked"
        );

        whatsappService.connectWhatsapp();
    }


    return (
        <div className="WhatsappConnect">

            <h2>WhatsApp Business</h2>

            <button
                onClick={connectWhatsapp}
                disabled={!sdkReady}
            >
                {sdkReady
                    ? "Connect WhatsApp Business"
                    : "Loading Meta..."}
            </button>

        </div>
    );
}