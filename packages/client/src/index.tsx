import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './tailwind.css'
import './reset.css'

const container = document.getElementById('root') as HTMLElement

const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
