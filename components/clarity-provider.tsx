"use client"

import type React from "react"

import { useEffect } from "react"
import { useCookieConsent } from "./cookie-consent-provider"

declare global {
  interface Window {
    clarity?: any
  }
}

export default function ClarityProvider({ children }: { children: React.ReactNode }) {
  const { cookiesAccepted } = useCookieConsent()

  useEffect(() => {
    // Only load Clarity if cookies are accepted
    if (cookiesAccepted) {
      const clarityScript = document.createElement("script")
      clarityScript.type = "text/javascript"
      clarityScript.text = `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "jw4wd3v4ky");
      `
      document.head.appendChild(clarityScript)

      return () => {
        // Clean up script when component unmounts
        if (document.head.contains(clarityScript)) {
          document.head.removeChild(clarityScript)
        }
      }
    }
  }, [cookiesAccepted])

  return <>{children}</>
}

