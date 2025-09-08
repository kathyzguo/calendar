import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginInputs from './components/LoginInputs.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LoginInputs />
    </StrictMode>,
)