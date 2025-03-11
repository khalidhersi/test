"use client"

import { useEffect } from "react"
import Script from "next/script"

// Declare global types
declare global {
  interface Window {
    clarityEnabled?: boolean
    checkClarityConsent?: () => boolean
    clarity?: any
  }
}

export function ClarityProvider({ clarityKey = "qjywtayv6p" }: { clarityKey?: string }) {
  // Only run this effect once on mount
  useEffect(() => {
    // Define a function to check if analytics is enabled
    function checkConsent() {
      try {
        const storedSettings = localStorage.getItem("cookie-settings")
        if (storedSettings) {
          const settings = JSON.parse(storedSettings)
          return settings.analytics === true
        }
      } catch (e) {
        console.error("Error checking clarity consent:", e)
      }
      return false
    }

    // Set up the global function
    window.checkClarityConsent = checkConsent

    // Initial check - only set once
    window.clarityEnabled = checkConsent()

    // Listen for the custom event
    function handleSettingsChanged() {
      const newConsent = checkConsent()

      // Only update if the value has changed to avoid loops
      if (window.clarityEnabled !== newConsent) {
        window.clarityEnabled = newConsent

        // If settings changed, reload the page to apply changes
        // This is the safest way to handle Clarity loading/unloading
        window.location.reload()
      }
    }

    // Add event listener
    document.addEventListener("cookieSettingsChanged", handleSettingsChanged)

    // Clean up
    return () => {
      document.removeEventListener("cookieSettingsChanged", handleSettingsChanged)
    }
  }, []) // Empty dependency array ensures this only runs once

  return (
    <>
      {/* This script sets up the global variables */}
      <Script id="clarity-globals" strategy="beforeInteractive">
        {`
          window.clarityEnabled = false;
        `}
      </Script>

      {/* This script loads Clarity conditionally */}
      <Script id="clarity-script" strategy="afterInteractive">
        {`
          (function() {
            try {
              // Only initialize Clarity if consent is given
              if (window.clarityEnabled) {
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityKey}");
              }
            } catch (e) {
              console.error("Error initializing Clarity:", e);
            }
          })();
        `}
      </Script>
    </>
  )
}

