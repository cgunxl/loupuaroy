import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './ui/App'
import { ErrorBoundary } from './ui/ErrorBoundary'
import './styles/theme.css'

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)