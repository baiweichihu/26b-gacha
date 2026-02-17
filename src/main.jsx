import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GachaProvider } from './context/GachaContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GachaProvider>
      <App />
    </GachaProvider>
  </StrictMode>,
)
