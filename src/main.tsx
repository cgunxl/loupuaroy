import React from 'react'
import { createRoot } from 'react-dom/client'
import { ProfessionalApp } from './ui/ProfessionalApp'
import { ErrorBoundary } from './ui/ErrorBoundary'
import './styles/professional.css'

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
    <ProfessionalApp />
  </ErrorBoundary>
)