import { useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'phishguard_cookie_choice'

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => localStorage.getItem(STORAGE_KEY))

  function saveChoice(nextChoice) {
    localStorage.setItem(STORAGE_KEY, nextChoice)
    setChoice(nextChoice)
  }

  if (choice) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-xl border border-white/10 bg-navy-900 p-4 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-300">
          PhishGuard AI uses local storage for authentication state and cookie preferences. Learn more in the{' '}
          <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/cookie-policy">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button className="secondary-button py-2" type="button" onClick={() => saveChoice('declined')}>
            Decline
          </button>
          <button className="primary-button py-2" type="button" onClick={() => saveChoice('accepted')}>
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
