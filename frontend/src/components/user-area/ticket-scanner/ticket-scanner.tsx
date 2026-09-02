import { useTranslation } from "react-i18next";
import { useTitle } from "../../utils/UseTitle";
import "./ticket-scanner.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/inventory-store";
import { useEffect, useRef, useState } from "react";
import type { TicketModel } from "../../models/ticket-model";
import { dialogService } from "../../service/dialogService";
import { ticketService } from "../../service/ticketService";
import { Html5Qrcode } from "html5-qrcode";



export function TicketScanner() {


    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language == "he";

    useTitle(t("ticketScanner.pageTitle"));

    const user = useSelector((state: RootState) => state.auth.user);

    const [qrToken, setQrToken] = useState("");

    const [ticket, setTicket] = useState<TicketModel | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const lastScannedTokenRef = useRef<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isCameraRunning, setIsCameraRunning] = useState(false);



    useEffect(() => {
        return () => {
            const scanner = scannerRef.current;
            scannerRef.current = null;

            if (scanner?.isScanning) {
                scanner.stop()
                    .then(() => scanner.clear())
                    .catch(() => { });
            } else {
                scanner?.clear();
            }
        };

    }, []);


    async function startCamera() {

        let scanner = scannerRef.current;

        if (!scanner)

            try {
                scanner = new Html5Qrcode("qr-reader");
                scannerRef.current = scanner;

            } catch (error) {
                console.error("Failed starting QR camera:", error);
                return;
            }
        if (scanner.isScanning) return;

        try {

            const cameras = await Html5Qrcode.getCameras();

            console.log("Available cameras: ", cameras);

            if (!cameras || cameras.length == 0) {
                dialogService.error(
                    "Camera Error", "No Camera was found"
                )
                return;
            }

            //Prefer rear camera on phone
            const preferredCamera = cameras.find(camera =>
                /back|rear|environment/i.test(camera.label)
            ) ?? cameras[0]

            console.log("using camera", preferredCamera);

            await scanner.start(
                preferredCamera.id,
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },
                (decodedText) => {
                    if (
                        lastScannedTokenRef.current == decodedText
                    ) return;

                    lastScannedTokenRef.current = decodedText;

                    setQrToken(decodedText);

                    searchTicket(decodedText);
                },
                () => { }
            );
            setIsCameraRunning(true)

            } catch(error) {
             console.error("Failed starting QR camera",
                 error)
            };
            setIsCameraRunning(false);
    }



    async function stopCamera() {
        const scanner = scannerRef.current;

        if (!scanner?.isScanning) return;

        try {
            await scanner.stop();
            setIsCameraRunning(false);
        } catch (error) {
            console.error("Failed stopping QR camera:", error);
        }
    }



    async function searchTicket(scannedToken?: string) {

        const token = (scannedToken ?? qrToken).trim();

        if (!token) {

            dialogService.error(
                t("Ticket Scanner Error"), t("ℹ️")
            )
            return;
        }

        try {

            setIsLoading(true)

            setTicket(null);

            const ticketFromApi =
                await ticketService.getTicketByQrToken(token);

            setTicket(ticketFromApi);

        } catch (err: any) {
            dialogService.error(
                "Ticket lookup Failed", "😞"
            )
        } finally {
            setIsLoading(false);
        }
    }

    async function checkInTicket() {

        if (!ticket) return;

        if (!user?.idUser) {
            dialogService.error(
                t("Ticket Scanner Not fount Customer "), t("👤")
            )
            return;
        }

        try {

            setIsCheckingIn(true);

            const updatedTicket =
                await ticketService.checkInTicket(
                    ticket.qrToken,
                    user.idUser
                )
            setTicket(updatedTicket);

            dialogService.success(
                t("Ticket Scanner: Check in success"), t("🧑‍💻")
            )
        } catch (err: any) {

            console.log(err);

            if (err.response?.status === 409) {
                dialogService.error(
                    t("Ticket Scanner error"), t("ticket Already CheckedIn")
                )
            }

        }

        try {
            const updateTicket =
                await ticketService.getTicketByQrToken(ticket.qrToken);

            setTicket(updateTicket);

        } catch (refreshError) {

            console.error("Failed refreshing ticket", refreshError);

            return;

        } finally {


            setIsCheckingIn(false)

        }
    }


    function clearScanner() {

        setQrToken("");

        setTicket(null);

        lastScannedTokenRef.current = null;
    }

    function getTicketStatusText(status: TicketModel["ticketStatus"]): string {

        return t(`ticketScanner.status.${status}`,
            {
                defaultValue: status
            }
        );
    }





    function formatDate(date: string): string {

        return new Date(date).toLocaleString(
            isHebrew ? "he-IL" : "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        )
    }






    return (
        <div className="TicketScanner" dir={isHebrew ? "rtl" : "ltr"}>

            <header className="ticket-scanner-header">

                <div>

                    <span className="ticket-scanner-eyebrow">
                        {t("ticketScanner.eyebrow")}
                    </span>


                    <h1>
                        {t("ticketScanner.title")}
                    </h1>

                    <p>
                        {t("ticketScanner.description")}
                    </p>

                </div>

                <div className="ticket-scanner-employee">

                    <span>
                        {t("ticketScanner.employee")}
                    </span>

                    <strong>
                        {user?.firstName} {user?.lastName}
                    </strong>
                </div>

            </header>

            <div className="ticket-scanner-content">

                {/*==================== SCANNER ===================*/}

                <section className="ticket-scanner-panel scanner panel">


                    <div className="ticket-scanner-panel-header">

                        <span>
                            {t("ticketScanner.scanner.eyebrow")}
                        </span>


                        <h2>
                            {t("ticketScanner.scanner.title")}
                        </h2>

                        <p>
                            {t("ticketScanner.scanner.description")}
                        </p>

                    </div>


                    {/* <div className="ticket-camera-placeholder">

                        <div className="ticket-camera-frame">

                            <div className="scanner-corner corner-top-left" />
                            <div className="scanner-corner corner-top-right" />
                            <div className="scanner-corner corner-bottom-left" />
                            <div className="scanner-corner corner-bottom-right" />

                            <div className="ticket-camera-icon">
                                📸
                            </div>

                            <strong>
                                {t("ticketScanner.scanner.camera")}
                            </strong>

                            <span>
                                {t("ticketScanner.scanner.cameraComingSoon")}
                            </span>

                        </div>

                    </div> */}
                    <div className="ticket-camera-section">
                        <div className="ticket-camera-view">
                            <div id="qr-reader"></div>
                        </div>

                        <div className="ticket-camera-actions">
                            {!isCameraRunning ? (
                                <button
                                    type="button"
                                    className="ticket-camera-start-button"
                                    onClick={startCamera}
                                >
                                    📷 {isHebrew ? "הפעל מצלמה" : "Start Camera"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="ticket-camera-stop-button"
                                    onClick={stopCamera}
                                >
                                    ⏹ {isHebrew ? "עצור מצלמה" : "Stop Camera"}
                                </button>
                            )}
                        </div>
                    </div>


                    <div className="ticket-token-area">

                        <label htmlFor="qrToken">

                            {t("ticketScanner.scanner.tokenLabel")}
                        </label>


                        <input
                            id="qrToken"
                            className="ticket-scanner-input"
                            type="text"
                            value={qrToken}
                            autoComplete="off"
                            placeholder={
                                t("ticketScanner.scanner.tokenPlaceholder")
                            }
                            onChange={event =>
                                setQrToken(event.target.value)
                            }
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    searchTicket();
                                }
                            }}
                        />

                        <div className="ticket-scanner-actions">

                            <button
                                type="button"
                                className="ticket-search-button"
                                onClick={() => searchTicket()}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? t("ticketScanner.scanner.checking"

                                    )
                                    : t("ticketScanner.scanner.checkTicket")
                                }
                            </button>

                            <button
                                type="button"
                                className="ticket-clear-button"
                                onClick={clearScanner}
                                disabled={
                                    isLoading || isCheckingIn
                                }
                            >
                                {t("ticketScanner.scanner.clear")}

                            </button>

                        </div>

                    </div>

                </section>


                {/* ====================== RESULT =================*/}

                <section className="ticket-scanner-panel result-panel">

                    {!ticket ? (
                        <div className="ticket-empty-result">

                            <div className="ticket-empty-icon">
                                📋
                            </div>

                            <h2>
                                {t("ticketScanner.result.emptyTitle")}
                            </h2>

                            <p>
                                {t(
                                    "ticketScanner.result.emptyDescription"
                                )}
                            </p>

                        </div>
                    ) : (
                        <>

                            <div className="ticket-result-header">

                                <div>

                                    <span>
                                        {t("ticketScanner.result.eyebrow")}
                                    </span>

                                    <h2>
                                        {ticket.eventName}
                                    </h2>

                                    <p className="ticket-result-number">

                                        {ticket.ticketNumber}

                                    </p>
                                </div>

                                <span
                                    className={`ticket-status ticket-status-${ticket.ticketStatus}`}>
                                    {getTicketStatusText(ticket.ticketStatus)}
                                </span>
                            </div>


                            <div className="ticket-details-section">

                                <h3>
                                    {t(
                                        "ticketScanner.sections.guest"
                                    )}
                                </h3>


                                <div className="ticket-details-grid">

                                    <div className="ticket-detail-card">

                                        <span>
                                            {t(
                                                "ticketScanner.fields.guestName"
                                            )}
                                        </span>

                                        <strong>
                                            {
                                                ticket.customerFirstName ?? "-"
                                            }
                                            {" "}
                                            {
                                                ticket.customerLastName ?? ""
                                            }
                                        </strong>
                                    </div>


                                    <div className="ticket-detail-card">

                                        <span>

                                            {t(
                                                "ticketScanner.fields.phone"
                                            )}
                                        </span>

                                        <strong>
                                            {
                                                ticket.customerPhone ?? "-"
                                            }
                                        </strong>

                                    </div>

                                    <div className="ticket-detail-card ticket-details-wide">

                                        <span>
                                            {t(
                                                "ticketScanner.fields.email"
                                            )}
                                        </span>

                                        <strong>
                                            {
                                                ticket.customerEmail ?? "-"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>

                            <div className="ticket-details-section">

                                <h3>
                                    {t("ticketScanner.sections.event")}
                                </h3>

                                <div className="ticket-details-grid">

                                    <div className="ticket-detail-card">

                                        <span>
                                            {t("ticketScanner.fields.event")}
                                        </span>

                                        <strong>
                                            {ticket.eventName}
                                        </strong>

                                    </div>

                                    <div className="ticket-detail-card">

                                        <span>
                                            {t("ticketScanner.fields.eventDate")}
                                        </span>

                                        <strong>
                                            {formatDate(ticket.eventStart)}
                                        </strong>

                                    </div>

                                    <div className="ticket-detail-card ticket-detail-wide">

                                        <span>
                                            {t("ticketScanner.fields.location")}
                                        </span>

                                        <strong>
                                            {ticket.eventLocation ?? "-"}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                            {ticket.ticketStatus === "valid" && (

                                <div className="ticket-checkin-area">

                                    <div>

                                        <strong>

                                            {t(
                                                "ticketScanner.checkIn.readyTitle"
                                            )}
                                        </strong>


                                        <span>
                                            {t(
                                                "ticketScanner.checkIn.readyDescription"
                                            )}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="ticket-checkin-button"
                                        onClick={checkInTicket}
                                        disabled={isCheckingIn}
                                    >
                                        {isCheckingIn
                                            ? t(
                                                "ticketScanner.checkIn.processing"
                                            )
                                            : t(
                                                "ticketScanner.checkIn.button"
                                            )
                                        }
                                    </button>

                                </div>
                            )}


                            {ticket.ticketStatus === "checked_in" && (
                                <div className="ticket-already-used">

                                    <div className="ticket-result-state-icon">
                                        ✔️
                                    </div>

                                    <div>

                                        <strong>
                                            {t(
                                                "ticketScanner.checkIn.alreadyTitle"
                                            )}
                                        </strong>

                                        <span>
                                            {t(
                                                "ticketScanner.checkIn.alreadyDescription"
                                            )}
                                        </span>

                                        {ticket.checkedInAt && (
                                            <small>

                                                {t(
                                                    "ticketScanner.checkIn.time"
                                                )}
                                                : {" "}
                                                {formatDate(ticket.checkedInAt)}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(
                                ticket.ticketStatus === "cancelled" ||
                                ticket.ticketStatus === "refunded"
                            ) && (
                                    <div className="ticket-invalid-state">

                                        <div className="ticket-result-state-icon">
                                            ！
                                        </div>

                                        <div>
                                            <strong>
                                                {t(
                                                    "ticketScanner.invalid.title"
                                                )}
                                            </strong>

                                            <span>
                                                {t(
                                                    "ticketScanner.invalid.description"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}



                        </>
                    )}

                </section>

            </div>



        </div>
    );
}
