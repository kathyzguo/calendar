import {useState, useEffect} from "react"
import {Link, useNavigate} from 'react-router-dom'
import type {CalendarListed} from "../../interfaces/CalendarInterface"
import {loadCalendar} from "../Calendar/CalendarAPI"
import Taskbar from "./Taskbar"

const MainPage = ({base, userID}: {base: string, userID: number}) => {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("");
    const [listOfCalendars, setListOfCalendars] = useState<Set<CalendarListed>>(new Set<CalendarListed>());

    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        async function loadName() {
            try {
                const jsonObj = {id: userID};
                const response = await fetch(`${base}/main/getName`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(jsonObj)
                });
                const results = await response.json();
                if (response.ok && results.status) {
                    setDisplayName(results.name)
                }
            }
            catch (err) {
                if (err instanceof Error) alert("Network Error:" + err.message);
            }    
        }
        loadName();
    }, [])

    useEffect(() => {
        const setCalendars = async () => {
            setListOfCalendars(await loadCalendar(userID, base));
        }
        setCalendars();
    }, []);

    return (
        <div>
            <Taskbar type = {0}/>
            <div className = "mainTitle">
                <h1>Welcome back, {displayName}</h1>
                <h2>What would you like to track today?</h2>
            </div>
            <div className = "mainFlowBlock">
                <div className = "mainBlock" style = 
                {{backgroundColor: "#D28FFF", borderColor: "#8923cdff"}}>
                    <div className = "mainBlockTitle" style = 
                    {{backgroundImage: "linear-gradient(to bottom, #CD81FF, #BB61F7)", borderColor: "#AA2BFF"}}>
                        <h2>Calendars</h2>
                    </div>
                    <div className = "mainBlockListing">
                        {Array.from(listOfCalendars).sort((a, b) => a.calendar_id - b.calendar_id).map(c => (
                        <div className = "mainExistingItem" key = {"displayCalendar" + c.calendar_id}>
                            <h4>{c.name}</h4>
                            <p>{c.description}</p>
                        </div>))}
                        <div className = "mainNewStart" style = {{backgroundColor: "#c87ff9"}}>
                            <Link to = "/calendars">Start new calendar</Link>
                        </div>
                    </div>
                </div>
                <div className = "mainBlock" style = 
                {{backgroundColor: "#94A1FF", borderColor: "#2c3ec4ff"}}>
                    <div className = "mainBlockTitle" style = 
                    {{backgroundImage: "linear-gradient(to bottom, #6B7CFF, #4F64FF)", borderColor: "#3B52FF"}}>
                        <h2>Goals</h2>
                    </div>
                    <div className = "mainBlockListing">
                        <div className = "mainNewStart">
                            <Link to = "/goals">Log new goal</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MainPage

/*
Continued work with time tracker and custom tracker:
TBD (?)
<div className = "mainBlock" style = 
{{backgroundColor: "#7DC4FF", borderColor: "#1478d0ff"}}>
    <div className = "mainBlockTitle" style = 
    {{backgroundImage: "linear-gradient(to bottom, #6EB7FF, #42A6FF)", borderColor: "#1794FF"}}>
        <h2>Time Tracker</h2>
    </div>
    <div className = "mainBlockListing">
        <div className = "mainNewStart">
            <Link to = "/time_tracker">Log time spent</Link>
        </div>
    </div>
</div>
<div className = "mainBlock" style = 
{{backgroundColor: "#6CF9DF", borderColor: "rgb(37, 191, 158)"}}>
    <div className = "mainBlockTitle" style = 
    {{backgroundImage: "linear-gradient(to bottom, #68EDCD, #3FE0BA)", borderColor: "#20D4AC"}}>
        <h2>Custom Trackers</h2>
    </div>
    <div className = "mainBlockListing">
        <div className = "mainNewStart">
            <Link to = "/custom_trackers">Create new tracker</Link>
        </div>
    </div>
</div>
*/