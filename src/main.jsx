import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { IconContext } from 'react-icons'
// console.log("Convex URL:", import.meta.env.VITE_CONVEX_URL);

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <IconContext.Provider value={{ className: 'react-icons', color: "white" }}>
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProvider client={convexClient}>
        <App />
      </ConvexProvider>
    </ClerkProvider>
  </StrictMode>
  </IconContext.Provider>
)
