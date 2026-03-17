import {useEffect, useState} from "react"
import type {CalendarListed, CalendarCreate} from "../../interfaces/CalendarInterface"
import {makeNewCalendar} from "./CalendarAPI"

const CreateCalendar = ({user_id, setUserID, base, calendarL, setCalendarL, allCalendarL, setAllCalendarL}: 
    {user_id: number | undefined, setUserID: (c: number | undefined) => void, base: string, 
    calendarL: Set<CalendarListed>, setCalendarL: (c: Set<CalendarListed>) => void,
    allCalendarL: Set<CalendarListed>, setAllCalendarL: (c: Set<CalendarListed>) => void}) => {
    const [errorTogether, setErrorTogether] = useState("");
    const [success, setSuccess] = useState("");
    const [createCal, setCreateCal] = useState<CalendarCreate>(generate());

    function generate(): CalendarCreate {
        if (user_id)
        return {calendar_id: 0, user_id: user_id, name: "", description: "", is_default: false};
        return {calendar_id: 0, user_id: 0, name: "", description: "", is_default: false};
    }

    useEffect(() => {
        if (user_id) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    useEffect(() => {
        const keyEscHandle = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setUserID(undefined);
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
        if (user_id) {
            if (!createCal.name || createCal.name === "") {setErrorTogether("Please enter a name"); return}
            if (!createCal.description || createCal.description === "") {setErrorTogether("Please enter a description"); return}
            setErrorTogether("");
            const newCL = await makeNewCalendar(createCal, base, allCalendarL);
            if (typeof newCL !== "string") {
                setCalendarL(new Set(calendarL));
                setAllCalendarL(new Set(allCalendarL));
                setSuccess("Calendar successfully created");
            }
            else setSuccess(newCL);
        }
    }

    return (
        user_id &&
        <div className = "popupDiv">
            <div className = "border border-5 rounded-3 popupContainer">
                <h2>Create Calendar</h2>
                {success !== "" && <p style = {{color: "#4400FF"}}>{success}</p>}
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    {errorTogether !== "" && <p className = "text-danger">{errorTogether}</p>}
                    <div className = "mb-3">
                        <label htmlFor = "calendarName" className = "form-label">Calendar name</label>
                        <input name = "name" type = "text" className = "form-control purpText" id = "calendarName" 
                        value = {createCal.name} onChange = {handleInputChange}/>
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "calendarDesc" className = "form-label">Calendar description</label>
                        <input name = "description" type = "text" className = "form-control purpText" id = "calendarDesc" 
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