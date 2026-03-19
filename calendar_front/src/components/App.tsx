import {BrowserRouter, Routes, Route} from "react-router-dom"
import {useState} from "react"
import LoginInputs from './LoginHandler/LoginInputs.tsx'
import CreateLogin from './LoginHandler/CreateLogin.tsx'
import MainPage from './Home/MainPage.tsx'
import Calendars from './Calendar/Calendars.tsx'
import Goals from './Goals/Goals.tsx'
import Settings from './Settings/Settings.tsx'
import Front from "./Home/Front.tsx"

function App({apiBase}: {apiBase: string}) {
    const [userID, setUserID] = useState<number>(-1)
    return (
    <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Front base = {apiBase} setID = {setUserID}/>}/>
            <Route path = "/login" element = {<LoginInputs base = {apiBase} setID = {setUserID}/>}/>
            <Route path = "/create" element = {<CreateLogin base = {apiBase}/>}/>
            <Route path = "/home" element = {<MainPage base = {apiBase} userID = {userID}/>}/>
            <Route path = "/calendars" element = {<Calendars base = {apiBase} userID = {userID}/>}/>
            <Route path = "/goals" element = {<Goals base = {apiBase} userID = {userID}/>}/>
            <Route path = "/settings" element = {<Settings base = {apiBase} userID = {userID}/>}/>
        </Routes>
    </BrowserRouter>
    )
}

export default App

/*
import TTracker from './Home/TTracker.tsx'
import CTrackers from './Home/CTrackers.tsx'
...
Legacy
<Route path = "/time_tracker" element = {<TTracker base = {apiBase} userID = {userID}/>}/>
<Route path = "/custom_trackers" element = {<CTrackers base = {apiBase} userID = {userID}/>}/>
*/
