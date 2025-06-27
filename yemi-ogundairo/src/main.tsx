import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import AOS from 'aos'
import 'aos/dist/aos.css' // AOS styles
import './index.css'     // Tailwind styles (should be after AOS to allow overrides if needed, though usually not an issue)

AOS.init({
  duration: 1000, // values from 0 to 3000, with step 50ms
  once: false,    // whether animation should happen only once - while scrolling down
  mirror: true,   // whether elements should animate out while scrolling past them
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
