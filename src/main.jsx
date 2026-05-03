import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { registerSW, promptInstall } from './utils/pwa';
import './index.css'
registerSW();
promptInstall();
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
