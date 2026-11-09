import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { DataProvider } from "@/providers/data"
import App from './App.tsx'
import { runArrival } from "@/lib/arrival"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <DataProvider>
        <App />
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Wait for the first room and the faces before the arrival plays.
const fontsIn = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 700))]);
fontsIn.then(() => requestAnimationFrame(() => requestAnimationFrame(runArrival)));
