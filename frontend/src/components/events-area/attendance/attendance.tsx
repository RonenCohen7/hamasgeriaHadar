import { useNavigate, useParams } from "react-router-dom";
import "./attendance.css";
import { useTitle } from "../../utils/UseTitle";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { EventModel } from "../../models/event-model";
import type { AttendanceModel } from "../../models/attendance-model";
import { ticketService } from "../../service/ticketService";
import { eventService } from "../../service/eventService";


export function Attendance() {

    const { t } = useTranslation()

    const { idEvent } = useParams()

    useTitle(t("events.attendance.title"));

    const navigate = useNavigate()

    const eventId = Number(idEvent);

    const [attendance, setAttendance] = useState<AttendanceModel[]>([]);

    const [event, setEvent] = useState<EventModel | null>(null);

    const [isLoading, setIsLoading] = useState(true);


    const [error, setError] = useState("");



    useEffect(() => {


        if (!Number.isInteger(eventId) || eventId <= 0) {
            setError("Invalid event")
            setIsLoading(false);
            return;

        }

        async function loadAttendance() {

            try {

                setIsLoading(true);
                setError("");

                const [attendanceResult, eventResult] =
                    await Promise.all([
                        ticketService.getEventAttendance(eventId),
                        eventService.getOneEvent(eventId)
                    ]);

                setAttendance(attendanceResult);
                setEvent(eventResult);

            } catch (err) {

                console.error(
                    "Failed to load attendance:", err

                )

                setError("Failed to load attendance report")

            } finally {
                setIsLoading(false);
            }
        }

        loadAttendance()

    }, [eventId]);

    if (isLoading) {
        return (
            <section className="Attendance">

                <p>{t("events.attendance.loading")}</p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="Attendance">

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    {t("events.attendance.back")}
                </button>
            </section>
        )
    }

    return (
        <section className="Attendance">


            <div className="attendance-top">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    {t("events.attendance.back")}
                </button>

            </div>

            <header className="attendance-header">

                <span>
                    {t("events.attendance.eventAttendance")}
                </span>

                <h1>
                    {event?.eventName}
                </h1>

                <p>
                    {t("events.attendance.description")}
                </p>

            </header>

            <div className="attendance-summary">

                <span>
                    {t("events.attendance.checkedIn")}
                </span>

                <strong>
                    {attendance.length}
                </strong>

            </div>

            {attendance.length === 0 ? (

                <div className="attendance-empty">

                    <h2>
                        {t("events.attendance.noGuests")}
                    </h2>

                    <p>
                        {t("events.attendance.noGuestsDescription")}
                    </p>
                </div>
            ) : (
                <div className="attendance-table-wrapper">


                    <table className="attendance-table">


                        <thead>

                            <tr>

                                <th>{t("events.attendance.customer")}</th>
                                <th>{t("events.attendance.phone")}</th>
                                <th>{t("events.attendance.ticket")}</th>
                                <th>{t("events.attendance.checkInTime")}</th>
                                <th>{t("events.attendance.checkedInBy")}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {attendance.map(item => (

                                <tr key={item.idTicket}>

                                    <td>
                                        {item.customerFirstName}{" "}
                                        {item.customerLastName}
                                    </td>
                                    <td>
                                        {item.customerPhone ?? " - "}
                                    </td>
                                    <td>
                                        {item.ticketNumber}
                                    </td>
                                    <td>
                                        {item.checkedInAt ? new Date(item.checkedInAt).toLocaleString("he-IL") : "-"}
                                    </td>
                                    <td>
                                        {item.employeeFirstName ||
                                            item.employeeLastName
                                            ? `${item.employeeFirstName ?? " "} ${item.employeeLastName ?? ""}`.trim()
                                            : "-"
                                        }
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


        </section>
    );
}
