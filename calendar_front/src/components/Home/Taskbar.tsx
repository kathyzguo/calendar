import {Link} from 'react-router-dom'

const Taskbar = (({type} : {type: number}) => {
    return (
        <nav className = "taskbar">
            <div>
                <button className = {`taskButton ${type === 0 ? "activeTaskButton" : ""}`}>
                    <Link to = "/home">Home</Link>
                </button>
            </div>
            <div>
                <button className = {`taskButton ${type === 1 ? "activeTaskButton" : ""}`}>
                    <Link to = "/calendars">Calendars</Link>
                </button>
            </div>
            <div>
                <button className = {`taskButton ${type === 2 ? "activeTaskButton" : ""}`}>
                    <Link to = "/goals">Goals</Link>
                </button>
            </div>
        </nav>
    )
});

export default Taskbar

/*
Cont TBD (?)
<div>
    <button className = {`taskButton ${type === 3 ? "activeTaskButton" : ""}`}>
        <Link to = "/time_tracker">Time Tracker</Link>
    </button>
</div>
<div>
    <button className = {`taskButton ${type === 4 ? "activeTaskButton" : ""}`}>
        <Link to = "/custom_trackers">Custom Trackers</Link>
    </button>
</div>
*/