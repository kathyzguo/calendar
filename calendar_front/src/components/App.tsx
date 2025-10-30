import {BrowserRouter, Routes, Route} from "react-router-dom"
import LoginInputs from './LoginHandler/LoginInputs.tsx'
import CreateLogin from './LoginHandler/CreateLogin.tsx'

function App({apiBase}: {apiBase: string}) {
    return (
    <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<LoginInputs base = {apiBase} />}/>
            <Route path = "/create" element = {<CreateLogin base = {apiBase} />}/>
        </Routes>
    </BrowserRouter>
    )
}

export default App
