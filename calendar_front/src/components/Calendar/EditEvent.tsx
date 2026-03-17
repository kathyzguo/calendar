import {useEffect, useState} from "react"
import type {CalendarListed, Event, EventCreateS} from "../../interfaces/CalendarInterface"
import {editEvent, deleteEvent} from "./CalendarAPI"

const EditEvent = ({event, setEvent, base, calendarL, setCalendarL, allCalendarL, setAllCalendarL}: 
    {event: Event | undefined, setEvent: (c : Event | undefined) => void, base: string, 
    calendarL: Set<CalendarListed>, setCalendarL: (c: Set<CalendarListed>) => void,
    allCalendarL: Set<CalendarListed>, setAllCalendarL: (c: Set<CalendarListed>) => void}) => {
    const [showEdit, setShowEdit] = useState(false);
    const [recurring, setRecurring] = useState(event && event.recurrence !== "NONE");
    const [allDay, setAllDay] = useState((event) ? event.all_day : false);
    const [errorTime, setErrorTime] = useState("");
    const [errorDate, setErrorDate] = useState("");
    const [errorTogether, setErrorTogether] = useState("");
    const [success, setSuccess] = useState("");
    const [editedEvent, setEditedEvent] = useState<EventCreateS>(fromEventToS(event));
    const [deleted, setDeleted] = useState(false);
    const oddmonths = [1, 3, 5, 8, 10];

    function fromEventToS(eventS: Event | undefined): EventCreateS {
        if (eventS) {
            const newEvent: EventCreateS = {event_id: eventS.event_id,
                calendar_id: eventS.calendar_id, name: eventS.name, description: eventS.description, 
                start_date: eventS.start_time.toLocaleDateString("sv-SE"),
                start_time: eventS.start_time.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hour12: false}),
                end_date: (eventS.end_time) ? eventS.end_time.toLocaleDateString("sv-SE") : "",
                end_time: (eventS.end_time) ? eventS.end_time.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hour12: false}) : "",
                all_day: eventS.all_day, recurrence: eventS.recurrence,
                re_date: (eventS.recurrence_end) ? eventS.recurrence_end.toLocaleDateString("sv-SE") : ""
            }
            return newEvent;
        } else return {event_id: 0, calendar_id: 0, name: "", description: "", start_date: "", start_time: "", end_date: "", end_time: "",
            all_day: false, recurrence: "NONE", re_date: ""};
    }

    function fromSToEvent(eventCS: EventCreateS): Event {
        const real_s_time: Date = (eventCS.all_day) ? new Date(eventCS.start_date + "T00:00:00") : 
        new Date(eventCS.start_date + "T" + eventCS.start_time + ":00");
        const real_e_time: Date | undefined = (eventCS.end_date === "") ? undefined : 
        new Date(eventCS.end_date + "T" + eventCS.end_time + ":00");
        const recur: string = (recurring) ? eventCS.recurrence : "NONE";
        const real_rs_time: Date | undefined = (eventCS.recurrence !== "NONE") ? real_s_time : undefined;
        const real_re_time: Date | undefined = (eventCS.re_date === "") ? undefined : 
        new Date(eventCS.re_date + "T00:00:00");
        const newEvent: Event = {event_id: eventCS.event_id, calendar_id: eventCS.calendar_id, name: eventCS.name, description: eventCS.description,
            start_time: real_s_time, end_time: real_e_time, all_day: eventCS.all_day, recurrence: recur,
            recurrence_start: real_rs_time, recurrence_end: real_re_time};
        return newEvent;
    }

    function determineDays(month: number, year: number): number {
        if (oddmonths.indexOf(month) >= 0) {
            if (oddmonths.indexOf(month) == 0) {
                if (year % 4 == 0) {
                    return 29;
                }
                else {
                    return 28;
                }
            }
            else {
                return 30;
            }
        }
        else {
            return 31;
        }
    }

    useEffect(() => {
        if (event) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    useEffect(() => {
        const keyEscHandle = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setEvent(undefined);
                document.body.style.overflow = "unset"
            }
        };
        document.addEventListener("keydown", keyEscHandle)
        return () => document.removeEventListener("keydown", keyEscHandle);
    }, [])

    const checkTimeInput = (value: string, type: string): string => {
        if (type === "TIME") {
            if (value === "") {
                setErrorTime(""); 
                return "";
            }
            if (value.length === 5 && value.charAt(2) === ":") {
                const hour: number = parseInt(value);
                const min: number = parseInt(value.substring(3, 5));
                if (!Number.isNaN(hour) && !Number.isNaN(min)) {
                    if (hour < 0 || hour > 23) return "Please enter a valid hour";
                    else if (min < 0 || min > 59) {
                        return "Please enter a valid minute";
                    }
                    else setErrorTime("");
                }
                else return "Please enter a time in the 24 hour format XX:XX";
            }
            else return "Please enter a time in the 24 hour format XX:XX";
        }
        else if (type === "DATE") {
            if (value === "") {
                setErrorDate(""); 
                return "";
            }
            if (value.length === 10 && value.charAt(4) === "-" && value.charAt(7) === "-") {
                const year: number = parseInt(value);
                const month: number = parseInt(value.substring(5, 7));
                const day: number = parseInt(value.substring(8));
                if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
                    if (year < 0) return "Please enter a valid year";
                    if (month < 1 || month > 12) return "Please enter a valid month";
                    else if (day < 1 || day > determineDays(month - 1, year)) return "Please enter a valid day";
                    else setErrorDate("");
                }
                else return "Please enter a date in the format [YEAR-MONTH-DAY] XXXX-XX-XX";
            }
            else return "Please enter a date in the format [YEAR-MONTH-DAY] XXXX-XX-XX";
        }
        return "";
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedEvent(prev => ({...prev, [name]: value}))
        if (errorTime !== "") setErrorTime("");
        if (errorDate !== "") setErrorDate("");
        if (errorTogether !== "") setErrorTogether("");
        if (success !== "") setSuccess("");
    }

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEvent(prev => ({...prev, all_day: !editedEvent.all_day}))
        setAllDay(!allDay);
    }

    const handleRecurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecurring(!recurring);
    }

    const handleRecurType = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedEvent(prev => ({...prev, [name]: value}));
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editedEvent && event && !deleted) {
            if (!editedEvent.name || editedEvent.name === "") {setErrorTogether("Please enter a name"); return}
            if (!editedEvent.description || editedEvent.description === "") {setErrorTogether("Please enter a description"); return}
            if (!editedEvent.start_date) {setErrorTogether("Please enter a start date"); return}
            else {
                const newDateCheck = checkTimeInput(editedEvent.start_date, "DATE");
                if (newDateCheck !== "") {setErrorDate(newDateCheck); return}
            }
            if (!editedEvent.start_time && !allDay) {setErrorTogether("Please enter a start time"); return}
            else {
                const newTimeCheck = checkTimeInput(editedEvent.start_time, "TIME");
                if (newTimeCheck !== "") {setErrorTime(newTimeCheck); return}
            }
            if (!allDay) {
                if (!editedEvent.end_date) {setErrorTogether("Please enter an end date"); return}
                else {
                    const newDateCheck = checkTimeInput(editedEvent.end_date, "DATE");
                    if (newDateCheck !== "") {setErrorDate(newDateCheck); return}
                }
                if (!editedEvent.end_time) {setErrorTogether("Please enter an end time"); return}
                else {
                    const newTimeCheck = checkTimeInput(editedEvent.end_time, "TIME");
                    if (newTimeCheck !== "") {setErrorTime(newTimeCheck); return}
                }
            }
            if (recurring && editedEvent.recurrence !== "NONE") {
                if (!editedEvent.re_date) {setErrorTogether("Please enter an end recurrence date"); return}
                else {
                    const newDateCheck = checkTimeInput(editedEvent.re_date, "DATE");
                    if (newDateCheck !== "") {setErrorDate(newDateCheck); return}
                }
            }
            setErrorDate("");
            setErrorTime("");
            setErrorTogether("");
            const newCL = await editEvent(fromSToEvent(editedEvent), base, allCalendarL);
            if (newCL) {
                setCalendarL(new Set(calendarL));
                setAllCalendarL(new Set(allCalendarL));
                setSuccess("Event successfully edited");
            }
            else setSuccess("Unable to edit event");
        }
    }

    const handleDelete = async (c_id: number, e_id: number, base: string, listCal: Set<CalendarListed>) => {
        if (event) {
            const responseString: string = await deleteEvent(c_id, e_id, base, listCal);
            if (responseString === "Event successfully deleted") {
                setCalendarL(new Set(calendarL));
                setAllCalendarL(new Set(allCalendarL));
            }
            setSuccess(responseString);
        }
    }

    return (
        event &&
        <div className = "popupDiv">
            <div className = "border border-5 rounded-3 popupContainer">
                <h2>Event Info</h2>
                <h4>{event.name}</h4>
                <p>{event.description}</p>
                <br/>
                <button className = "btn btn-primary purpBack" style = {{marginRight: "12px"}} onClick = {() => setShowEdit(true)}>Edit Event</button>
                <button className = "btn btn-primary purpBack" onClick = {() => handleDelete(event.calendar_id, event.event_id, base, allCalendarL)}>Delete Event</button>
                {success !== "" && <p style = {{color: "#4400FF"}}>{success}</p>}
                {showEdit && 
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    {errorTime !== "" && <p className = "text-danger">{errorTime}</p>}
                    {errorDate !== "" && <p className = "text-danger">{errorDate}</p>}
                    {errorTogether !== "" && <p className = "text-danger">{errorTogether}</p>}
                    <div className = "mb-3">
                        <label htmlFor = "eventName" className = "form-label">Event name</label>
                        <input name = "name" type = "text" className = "form-control purpText" id = "eventName" 
                        value = {editedEvent.name} onChange = {handleInputChange}/>
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "eventDesc" className = "form-label">Event description</label>
                        <input name = "description" type = "text" className = "form-control purpText" id = "eventDesc" 
                        value = {editedEvent.description} onChange = {handleInputChange}/>
                    </div>
                    {!allDay &&
                    <div className = "mb-3">
                        <label htmlFor = "eventSTime" className = "form-label">Start time</label>
                        <input type = "text" className = "form-control purpText" id = "eventSTime" onChange = {handleInputChange}
                        name = "start_time" maxLength = {5} value = {editedEvent.start_time}/>
                    </div>}
                    <div className = "mb-3">
                        <label htmlFor = "eventSDate" className = "form-label">Start date</label>
                        <input type = "text" className = "form-control purpText" id = "eventSDate" onChange = {handleInputChange}
                        name = "start_date" maxLength = {10} value = {editedEvent.start_date}/>
                    </div>
                    {!allDay &&
                    <div>
                        <div className = "mb-3">
                            <label htmlFor = "eventETime" className = "form-label">End time</label>
                            <input type = "text" className = "form-control purpText" id = "eventETime" onChange = {handleInputChange}
                            name = "end_time" maxLength = {5} value = {(editedEvent.end_time) ? editedEvent.end_time : ""}/>
                        </div>
                        <div className = "mb-3">
                            <label htmlFor = "eventEDate" className = "form-label">End date</label>
                            <input type = "text" className = "form-control purpText" id = "eventEDate" onChange = {handleInputChange}
                            name = "end_date" maxLength = {10} value = {(editedEvent.end_date) ? editedEvent.end_date : ""}/>
                        </div>
                    </div>
                    }
                    <div className = "mb-3">
                        <div className = "form-check">
                            <input name = "all_day" type = "checkbox" className = "form-check-input purpCheck" id = "allDayCheck" 
                            checked = {allDay} onChange = {handleDayChange}/>
                            <label className = "form-check-label" htmlFor = "allDayCheck">All day</label>
                        </div>
                    </div>
                    <div className = "mb-3">
                        <div className = "form-check">
                            <input name = "recurrence" type = "checkbox" className = "form-check-input purpCheck" id = "recurrence" 
                            checked = {recurring} onChange = {handleRecurChange}/>
                            <label className = "form-check-label" htmlFor = "recurrence">Recurring</label>
                        </div>
                    </div>
                    {recurring &&
                    <div>
                        <div style = {{marginBottom: "8px"}}>
                            <input type = "radio" name = "recurrence" id = "recurDay" value = "DAILY" className = "purpCheck"
                            style = {{margin: "5px"}} onChange = {handleRecurType} checked = {editedEvent.recurrence === "DAILY"}/>
                            <label htmlFor = "recurDay" style = {{paddingRight: "5px"}}>Daily</label>
                            <input type = "radio" name = "recurrence" id = "recurWeek" value = "WEEKLY" className = "purpCheck"
                            style = {{margin: "5px"}} onChange = {handleRecurType} checked = {editedEvent.recurrence === "WEEKLY"}/>
                            <label htmlFor = "recurWeek" style = {{paddingRight: "5px"}}>Weekly</label>
                            <input type = "radio" name = "recurrence" id = "recurMonth" value = "MONTHLY" className = "purpCheck"
                            style = {{margin: "5px"}} onChange = {handleRecurType} checked = {editedEvent.recurrence === "MONTHLY"}/>
                            <label htmlFor = "recurMonth">Monthly</label>
                        </div>
                        <div className = "mb-3">
                            <label htmlFor = "eventREDate" className = "form-label">Recurrence end date</label>
                            <input type = "text" className = "form-control purpText" id = "eventREDate" onChange = {handleInputChange}
                            name = "re_date" maxLength = {10} value = {(editedEvent.re_date) ? editedEvent.re_date : ""}/>
                        </div>
                    </div>
                    }
                    <button type = "submit" className = "btn btn-primary purpBack">Submit</button>
                </form>
                }
                <hr/>
            </div>
        </div>
    )
}

export default EditEvent;