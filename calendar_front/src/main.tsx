import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from "./components/App.tsx"
import './styling/styling.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App apiBase = {"https://d3dtsrmp2bd24m.cloudfront.net/api"} />
    </StrictMode>,
)