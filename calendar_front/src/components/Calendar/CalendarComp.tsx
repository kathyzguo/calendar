import {useState} from "react"
import {createPortal} from "react-dom"
import type {CalendarListed, Event} from "../../interfaces/CalendarInterface"
import EditEvent from "./EditEvent"

const CalendarComp = ({base, calendars, setCalendars, allCalendars, setAllCalendars}: {base: string, calendars: Set<CalendarListed>, 
    setCalendars: (c: Set<CalendarListed>) => void, allCalendars: Set<CalendarListed>, setAllCalendars: (c: Set<CalendarListed>) => void}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [eventClicked, setEventClicked] = useState<Event | undefined>(undefined);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"]
    const oddmonths = [1, 3, 5, 8, 10];

    function determineDays(month: number): number {
        if (oddmonths.indexOf(month) >= 0) {
            if (oddmonths.indexOf(month) == 0) {
                if (currentYear % 4 == 0) {
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

    function determineEvents(year: number, month: number, calendars: Set<CalendarListed>): Event[] {
        const activeEvents: Event[] = [];
        for (const c of calendars) {
            for (const event of c.events) {
                if (year === event.start_time.getFullYear() && month === event.start_time.getMonth()) activeEvents.push(event);
                else if (year > event.start_time.getFullYear() || month > event.start_time.getMonth()) {
                    if (event.recurrence_end && ((event.recurrence_end.getMonth() >= month && event.recurrence_end.getFullYear() === year)
                    || event.recurrence_end.getFullYear() > year)) {
                        activeEvents.push(event);
                    }
                }
            }
        }
        return activeEvents;
    }

    function determineDayWEvent(year: number, day: number, month: number, dayOfWeek: number, events: Event[]): Event[] {
        const listOfEvents: Event[] = [];
        for (const event of events) {
            if (event.start_time.getDate() === day && event.recurrence === "NONE") {
                listOfEvents.push(event);
            }
            if (event.recurrence_start && event.recurrence_end) {
                if (event.recurrence === "DAILY") {
                    if (event.recurrence_end.getFullYear() > year) {
                        if (event.start_time.getFullYear() < year) listOfEvents.push(event);
                        else if (event.recurrence_start.getMonth() === month && event.recurrence_start.getDate() <= day) listOfEvents.push(event);
                        else if (event.recurrence_start.getMonth() !== month) listOfEvents.push(event);
                    }
                    else if (event.recurrence_start.getMonth() === event.recurrence_end.getMonth() &&
                    event.recurrence_start.getDate() <= day && event.recurrence_end.getDate() >= day) listOfEvents.push(event);
                    else if (event.recurrence_start.getMonth() === month && event.recurrence_end.getMonth() !== month &&
                    event.recurrence_start.getDate() <= day) listOfEvents.push(event);
                    else if (event.recurrence_end.getMonth() === month && event.recurrence_start.getMonth() !== month &&
                    event.recurrence_end.getDate() >= day) listOfEvents.push(event);
                    else if (event.recurrence_end.getMonth() > month && event.recurrence_start.getMonth() < month) listOfEvents.push(event);
                }
                else if (event.recurrence === "WEEKLY") {
                    if (event.recurrence_end.getFullYear() > year && event.recurrence_start.getDay() === dayOfWeek) {
                        if (event.start_time.getFullYear() < year) listOfEvents.push(event);
                        else if (event.start_time.getFullYear() === year && event.recurrence_start.getMonth() === month 
                        && event.recurrence_start.getDate() <= day) listOfEvents.push(event);
                        else if (event.recurrence_start.getMonth() !== month) listOfEvents.push(event);
                    }
                    else if (event.recurrence_start.getMonth() === event.recurrence_end.getMonth() && 
                    event.recurrence_start.getDate() <= day && event.recurrence_end.getDate() >= day &&
                    event.recurrence_start.getDay() === dayOfWeek) listOfEvents.push(event);
                    else if (event.recurrence_start.getMonth() === month && event.recurrence_end.getMonth() !== month &&
                    event.recurrence_start.getDate() <= day && event.recurrence_start.getDay() === dayOfWeek) listOfEvents.push(event);
                    else if (event.recurrence_end.getMonth() === month && event.recurrence_start.getMonth() !== month &&
                    event.recurrence_end.getDate() >= day && event.recurrence_start.getDay() === dayOfWeek) listOfEvents.push(event);
                    else if (event.recurrence_end.getMonth() > month && event.recurrence_start.getMonth() < month &&
                    event.recurrence_start.getDay() === dayOfWeek) listOfEvents.push(event);
                }
                else if (event.recurrence === "MONTHLY") {
                    if (event.recurrence_end.getFullYear() > year && event.recurrence_start.getDate() === day) {
                        if (event.start_time.getFullYear() < year) listOfEvents.push(event);
                        else if (event.recurrence_start.getMonth() === month && event.recurrence_start.getDate() <= day) listOfEvents.push(event);
                        else if (event.recurrence_start.getMonth() !== month) listOfEvents.push(event);
                    }
                    else if (event.recurrence_end.getMonth() === month && day <= event.recurrence_end.getDate()
                    && event.recurrence_start.getDate() === day) listOfEvents.push(event);
                    else if (event.recurrence_end.getMonth() > month && event.recurrence_start.getDate() === day) listOfEvents.push(event);
                }
            }
        }
        return listOfEvents
    }

    const numOfDays = determineDays(currentMonth);
    let dayStart = 4;
    if (currentYear >= 2026) {
        let multiplier = currentYear - 2026;
        for (let i = multiplier - 1; i >= 0; i--) {
            for (let j = 0; j < 12; j++) {
                dayStart = (dayStart + determineDays(j)) % 7;
            }
        }
        for (let i = 0; i < currentMonth; i++) {
            dayStart = (dayStart + determineDays(i)) % 7;
        }
    }
    else {
        let multiplier = 2026 - currentYear;
        for (let i = multiplier - 2; i >= 0; i--) {
            for (let j = 11; j >= 0; j--) {
                dayStart = (dayStart + 42 - determineDays(j)) % 7;
            }
        }
        for (let i = 11; i >= currentMonth; i--) {
            dayStart = (dayStart + 42 - determineDays(i)) % 7;
        }
    }

    const activeEvents = determineEvents(currentYear, currentMonth, calendars);

    let gridTemplateRows = "6fr 3fr repeat(5, 12fr)";
    let aspectRatio = "1.217";
    let numRows = 35;
    if (dayStart + numOfDays > 35) {
        gridTemplateRows = "6fr 3fr repeat(6, 12fr)";
        aspectRatio = "1.037";
        numRows = 42;
    }
    else if (dayStart + numOfDays <= 28) {
        gridTemplateRows = "6fr 3fr repeat(4, 12fr)";
        aspectRatio = "1.474";
        numRows = 28;
    }

    return (
            <div key = {"calendarFrame" + currentMonth} className = "calendarFrame" style = {{
                gridTemplateRows: `${gridTemplateRows}`, aspectRatio: `${aspectRatio}`}}>
                <div className = "topHeaderCal">
                    <img src = "ArrowIcon_Left.png" id = "calLeftArrow" onClick = {() => {
                        if (currentMonth > 0) {setCurrentMonth(currentMonth - 1)} else {setCurrentMonth(11); setCurrentYear(currentYear - 1)}}}/>
                    <h2 id = "monthHeading">{months[currentMonth] + " " + currentYear}</h2>
                    <img src = "ArrowIcon_Right.png" id = "calRightArrow" onClick = {() => {
                        if (currentMonth < 11) {setCurrentMonth(currentMonth + 1)} else {setCurrentMonth(0); setCurrentYear(currentYear + 1)}}}/>
                </div>
                <h3>Sunday</h3>
                <h3>Monday</h3>
                <h3>Tuesday</h3>
                <h3>Wednesday</h3>
                <h3>Thursday</h3>
                <h3>Friday</h3>
                <h3>Saturday</h3>
                {Array.from({length: dayStart}, (j2, i2) => (
                    <div className = "dateFrame"  key = {"blankDate" + i2}></div>
                ))}
                {Array.from({length: numOfDays}, (j2, i2) => {
                    const borderRight = ((i2 + dayStart + 1) % 7 == 0) ? "dashed #c489ff 3px" : "";
                    const borderBottom = ((i2 + dayStart) >= numRows - 7) ? "dashed #c489ff 3px" : "";
                    const events = determineDayWEvent(currentYear, i2 + 1, currentMonth, (dayStart + i2) % 7, activeEvents);
                    return (
                    <div className = "dateFrame" key = {"withNumDate" + i2} style = {{
                        borderRight: `${borderRight}`, borderBottom: `${borderBottom}`}}>
                        <h4>{i2 + 1}</h4>
                        {Array.from(events).sort((a, b) => a.start_time.getTime() - b.start_time.getTime()).map(event => (
                        <button key = {"clickFor" + event.event_id} onClick = {() => setEventClicked(event)}>
                            {event.name}
                            <br/>
                            {(event.all_day) ? "All day" : ""}
                            {(!event.all_day) ? event.start_time.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hour12: false}) : ""}
                            {(event.end_time && !event.all_day) ? " to " + event.end_time.toLocaleTimeString("en-US", 
                            {hour: "2-digit", minute: "2-digit", hour12: false}) : ""}
                        </button>)
                    )}
                    </div>
                    )
                })}
                {Array.from({length: numRows - (dayStart + numOfDays)}, (j2, i2) => {
                    const x = dayStart + numOfDays + i2;
                    const borderRight = ((x + 1) % 7 == 0) ? "dashed #c489ff 3px" : "";
                    const borderBottom = (x > numRows - 7) ? "dashed #c489ff 3px" : "";
                    return <div className = "dateFrame"  key = {"blankDateAfter" + i2} style = {{
                        borderRight: `${borderRight}`, borderBottom: `${borderBottom}`}}></div>
                })}
                {eventClicked && createPortal(<div>
                    <EditEvent event = {eventClicked} setEvent = {setEventClicked} base = {base} calendarL = {calendars} setCalendarL = {setCalendars}
                    allCalendarL = {allCalendars} setAllCalendarL = {setAllCalendars}/></div>, document.body)}
            </div>
    )
}

export default CalendarComp;