import type {CalendarListed, CalendarCreate} from "../../interfaces/CalendarInterface"
import {useRef, useState, useEffect} from "react"
import {createPortal} from "react-dom"
import {useNavigate} from 'react-router-dom'
import Taskbar from "../Home/Taskbar"
import {loadCalendar, deleteCalendar} from "./CalendarAPI"
import CalendarComp from "./CalendarComp";
import CreateEvent from "./CreateEvent";
import CreateCalendar from "./CreateCalendar";
import EditCalendar from "./EditCalendar";

const Calendars = ({base, userID} : {base: string, userID: number}) => {
    const navigate = useNavigate();
    const [activeCalendars, setActiveCalendars] = useState<Set<CalendarListed>>(new Set<CalendarListed>());
    const [listOfCalendars, setListOfCalendars] = useState<Set<CalendarListed>>(new Set<CalendarListed>());
    const taskbarDiv = useRef<HTMLDivElement>(null);
    const [heightOfTask, setHeightOfTask] = useState(0);
    const [showCreateE, setShowCreateE] = useState<number | undefined>(undefined);
    const [showCreateC, setShowCreateC] = useState<number | undefined>(undefined);
    const [showEditC, setShowEditC] = useState<CalendarCreate | undefined>(undefined);

    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        const setCalendars = async () => {
            setListOfCalendars(await loadCalendar(userID, base));
        }
        setCalendars();
    }, []);

    useEffect(() => {
        if (taskbarDiv.current) setHeightOfTask(taskbarDiv.current.offsetHeight);
        const resizing = () => {
            if (taskbarDiv.current) setHeightOfTask(taskbarDiv.current.offsetHeight);
        }
        window.addEventListener("resize", resizing);
        return () => {
            window.removeEventListener("resize", resizing);
        }
    }, []);

    const handleCreateSubmission = () => {
        if (activeCalendars.size === 1) {
            for (const c of activeCalendars) {
                setShowCreateE(c.calendar_id);
            }
        }
    }

    const handleEditSubmission = () => {
        if (activeCalendars.size === 1) {
            for (const c of activeCalendars) {
                setShowEditC({calendar_id: c.calendar_id, user_id: userID,
                    name: c.name, description: c.description, is_default: c.is_default});
            }
        }
    }

    const handleDeleteSubmission = async () => {
        if (activeCalendars.size >= 1) {
            for (const c of activeCalendars) {
                await deleteCalendar(c.calendar_id, base, listOfCalendars, activeCalendars);
            }
            setListOfCalendars(new Set(listOfCalendars));
            setActiveCalendars(new Set(activeCalendars));
        }
    }

    return (
        <div>
            <div ref = {taskbarDiv}>
                <Taskbar type = {1}/>
            </div>
            <div className = "forNav">
                <nav className = "leftnav" style = {{top: `${heightOfTask}px`}}>
                    <h2>Active Calendars</h2>
                    {Array.from(listOfCalendars).sort((a, b) => a.calendar_id - b.calendar_id).map(c => (
                        <label key = {"keyCalendar" + c.calendar_id}>
                            <input type = "checkbox" id = {"calendar" + c.calendar_id} onChange = {(e) => {
                                for (const testC of listOfCalendars) {
                                    if (testC.calendar_id === c.calendar_id) {
                                        const newActiveCalendars = new Set<CalendarListed>(activeCalendars);
                                        (e.target.checked) ? newActiveCalendars.add(testC) : newActiveCalendars.delete(testC);
                                        setActiveCalendars(newActiveCalendars);
                                    }
                                }
                            }}/>
                            {c.name}
                        </label>
                    ))}
                    <div className = "leftNavDiv" style = {{marginTop: "10px"}}>
                        <button onClick = {() => setShowCreateC(userID)}>Create calendar</button>
                    </div>
                    <div className = "leftNavDiv">
                        <button onClick = {() => handleEditSubmission()}>Edit selected calendar</button>
                    </div>
                    <div className = "leftNavDiv">
                        <button onClick = {() => handleDeleteSubmission()}>Delete selected calendars</button>
                    </div>
                    <div className = "leftNavDiv">
                        <button onClick = {() => handleCreateSubmission()}>Create event on selected calendar</button>
                    </div>                    
                </nav>
                <CalendarComp base = {base} calendars = {activeCalendars} setCalendars = {setActiveCalendars} 
                allCalendars = {listOfCalendars} setAllCalendars = {setListOfCalendars}/>
            </div>
            {showCreateE && createPortal(<div>
                    <CreateEvent calendar_id = {showCreateE} base = {base} calendarL = {activeCalendars} setCalendarL = {setActiveCalendars}
                    allCalendarL = {listOfCalendars} setAllCalendarL = {setListOfCalendars}/>
                    <button style = {{position: "fixed", top: "0", right: "0", fontSize: "20px", height: "40px", 
                    width: "40px", backgroundColor: "transparent", border: "2px #ffffff solid", color: "#ffffff", 
                    boxShadow: "none", zIndex: 5}} onClick = {() => {setShowCreateE(undefined); document.body.style.overflow = "unset"}}>X</button>
                </div>, document.body)}
            {showCreateC && createPortal(<div>
                    <CreateCalendar user_id = {showCreateC} base = {base} calendarL = {activeCalendars} setCalendarL = {setActiveCalendars}
                    allCalendarL = {listOfCalendars} setAllCalendarL = {setListOfCalendars}/>
                    <button style = {{position: "fixed", top: "0", right: "0", fontSize: "20px", height: "40px", 
                    width: "40px", backgroundColor: "transparent", border: "2px #ffffff solid", color: "#ffffff", 
                    boxShadow: "none", zIndex: 5}} onClick = {() => {setShowCreateC(undefined); document.body.style.overflow = "unset"}}>X</button>
                </div>, document.body)}
            {showEditC && createPortal(<div>
                    <EditCalendar calendar_info = {showEditC} base = {base} calendarL = {activeCalendars} setCalendarL = {setActiveCalendars}
                    allCalendarL = {listOfCalendars} setAllCalendarL = {setListOfCalendars}/>
                    <button style = {{position: "fixed", top: "0", right: "0", fontSize: "20px", height: "40px", 
                    width: "40px", backgroundColor: "transparent", border: "2px #ffffff solid", color: "#ffffff", 
                    boxShadow: "none", zIndex: 5}} onClick = {() => {setShowEditC(undefined); document.body.style.overflow = "unset"}}>X</button>
                </div>, document.body)}
        </div>
    )
};

export default Calendars