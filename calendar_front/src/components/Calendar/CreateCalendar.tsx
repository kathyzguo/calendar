import {useEffect, useState} from "react"
import type {CalendarListed, CalendarCreate} from "../../interfaces/CalendarInterface"
import {makeNewCalendar} from "./CalendarAPI"

const CreateCalendar = ({user_id, base, calendarL, setCalendarL, allCalendarL, setAllCalendarL}: {user_id: number | undefined, base: string, 
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
        <div style = {{minHeight: "100vh", minWidth: "100vw", display: "flex", position: "fixed", top: "0", right: "0", left: "0", bottom: "0",
            zIndex: "4", justifyContent: "center", alignItems: "center", backgroundColor: "#00000097", border: "0"}}>
            <div className = "border border-5 rounded-3" style = {{width: "470px", padding: "20px", backgroundColor: "white", position: "relative",
                maxHeight: "650px", overflow: "scroll"}}>
                <h2>Create Calendar</h2>
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
                    <button type = "submit" className = "btn btn-primary">Submit</button>
                </form>
                <hr/>
            </div>
        </div>
    )
}

export default CreateCalendar;