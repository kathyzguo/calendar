import {useEffect, useState} from "react"
import type {CalendarListed, CalendarCreate} from "../../interfaces/CalendarInterface"
import {editCalendar} from "./CalendarAPI"

const CreateCalendar = ({calendar_info, setCal, base, calendarL, setCalendarL, allCalendarL, setAllCalendarL}: 
    {calendar_info: CalendarCreate | undefined, setCal: (c: CalendarCreate |undefined) => void, base: string, 
    calendarL: Set<CalendarListed>, setCalendarL: (c: Set<CalendarListed>) => void,
    allCalendarL: Set<CalendarListed>, setAllCalendarL: (c: Set<CalendarListed>) => void}) => {
    const [errorTogether, setErrorTogether] = useState("");
    const [success, setSuccess] = useState("");
    const [createCal, setCreateCal] = useState<CalendarCreate>(generate());

    function generate(): CalendarCreate {
        if (calendar_info)
        return {calendar_id: calendar_info.calendar_id, user_id: calendar_info.user_id, name: calendar_info.name, description: calendar_info.description, is_default: false};
        return {calendar_id: 0, user_id: 0, name: "", description: "", is_default: false};
    }

    useEffect(() => {
        if (calendar_info) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    useEffect(() => {
        const keyEscHandle = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setCal(undefined);
                document.body.style.overflow = "unset"
            }
        };
        document.addEventListener("keydown", keyEscHandle)
        return () => document.removeEventListener("keydown", keyEscHandle);
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setCreateCal(prev => ({...prev, [name]: value}))
        if (errorTogether !== "") setErrorTogether("");
        if (success !== "") setSuccess("");
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (calendar_info) {
            if (!createCal.name || createCal.name === "") {setErrorTogether("Please enter a name"); return}
            if (!createCal.description || createCal.description === "") {setErrorTogether("Please enter a description"); return}
            setErrorTogether("");
            const newCL = await editCalendar(createCal, base, allCalendarL, calendarL);
            if (newCL) {
                setCalendarL(new Set(calendarL));
                setAllCalendarL(new Set(allCalendarL));
                setSuccess("Calendar successfully edited");
            }
            else setSuccess("Unable to edit calendar");
        }
    }

    return (
        calendar_info &&
        <div className = "popupDiv">
            <div className = "border border-5 rounded-3 popupContainer">
                <h2>Edit Calendar</h2>
                {success !== "" && <p style = {{color: "#4400FF"}}>{success}</p>}
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    {errorTogether !== "" && <p className = "text-danger">{errorTogether}</p>}
                    <div className = "mb-3">
                        <label htmlFor = "calendarName" className = "form-label">Calendar name</label>
                        <input name = "name" type = "text" className = "form-control" id = "calendarName" 
                        value = {createCal.name} onChange = {handleInputChange}/>
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "calendarDesc" className = "form-label">Calendar description</label>
                        <input name = "description" type = "text" className = "form-control" id = "calendarDesc" 
                        value = {createCal.description} onChange = {handleInputChange}/>
                    </div>
                    <button type = "submit" className = "btn btn-primary purpBack">Submit</button>
                </form>
                <hr/>
            </div>
        </div>
    )
}

export default CreateCalendar;