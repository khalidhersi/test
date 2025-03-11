"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import CookieConsent from "./cookie-consent"

type CookieConsentContextType = {
  cookiesAccepted: boolean
  acceptCookies: () => void
  rejectCookies: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider")
  }
  return context
}

export default function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("cookieConsent")
    if (cookieChoice === "true") {
      setCookiesAccepted(true)
    } else {
      // If no choice has been made, show the banner
      setShowBanner(true)
      setCookiesAccepted(false)
    }
  }, [])

  const acceptCookies = () => {
    setCookiesAccepted(true)
    setShowBanner(false)
  }

  const rejectCookies = () => {
    setCookiesAccepted(false)
    setShowBanner(false)
  }

  return (
    <CookieConsentContext.Provider value={{ cookiesAccepted: !!cookiesAccepted, acceptCookies, rejectCookies }}>
      {children}
      {showBanner && <CookieConsent onAccept={acceptCookies} onReject={rejectCookies} />}
    </CookieConsentContext.Provider>
  )
}

