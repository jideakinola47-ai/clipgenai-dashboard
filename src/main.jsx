import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { registerSW, promptInstall } from './utils/pwa';
import './index.css'
const isCodespaces = window.location.hostname.includes('github.dev') || 
                     window.location.hostname.includes('app.github.dev');

if (!isCodespaces && window.location.protocol === 'https:') {
  import('./utils/pwa').then(({ registerSW, promptInstall }) => {
    registerSW();
    promptInstall();
  });
}
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
