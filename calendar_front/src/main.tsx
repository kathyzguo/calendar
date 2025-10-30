import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./components/App.tsx"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App apiBase = {"http://localhost:3000/api"} />
    </StrictMode>,
)