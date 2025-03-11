"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CookieSettings {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const defaultSettings: CookieSettings = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

export function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>(defaultSettings)

  // Initialize settings and check if banner should be shown - only run once on mount
  useEffect(() => {
    try {
      // Get stored settings
      const storedSettings = localStorage.getItem("cookie-settings")
      if (storedSettings) {
        setCookieSettings(JSON.parse(storedSettings))
      }

      // Check if consent has been given
      const hasConsent = localStorage.getItem("cookie-consent") === "true"
      setShowBanner(!hasConsent)
    } catch (error) {
      console.error("Error initializing cookie settings:", error)
      setShowBanner(true)
    }
  }, []) // Empty dependency array ensures this only runs once

  // Save settings and notify other components
  const saveSettings = (settings: CookieSettings) => {
    try {
      // Update state
      setCookieSettings(settings)

      // Save to localStorage
      localStorage.setItem("cookie-settings", JSON.stringify(settings))
      localStorage.setItem("cookie-consent", "true")

      // Notify other components about the change
      try {
        const event = document.createEvent("Event")
        event.initEvent("cookieSettingsChanged", true, true)
        document.dispatchEvent(event)
      } catch (e) {
        console.error("Error dispatching event:", e)
      }
    } catch (error) {
      console.error("Error saving cookie settings:", error)
    }
  }

  const acceptAll = () => {
    const newSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    saveSettings(newSettings)
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    const newSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    saveSettings(newSettings)
    setShowBanner(false)
  }

  const savePreferences = () => {
    saveSettings(cookieSettings)
    setShowBanner(false)
    setOpen(false)
  }

  if (!showBanner) return null

  return (
  
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-sm border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-lg">Cookie Consent</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
              traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Customize</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cookie Settings</DialogTitle>
                  <DialogDescription>
                    Customize your cookie preferences. Necessary cookies help make a website usable by enabling basic
                    functions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Necessary Cookies</h4>
                      <p className="text-sm text-muted-foreground">Required for the website to function properly</p>
                    </div>
                    <Switch checked={cookieSettings.necessary} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Help us improve our website by collecting anonymous data using tools like Microsoft Clarity
                      </p>
                    </div>
                    <Switch
                      checked={cookieSettings.analytics}
                      onCheckedChange={(checked) => setCookieSettings((prev) => ({ ...prev, analytics: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Marketing Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Used to track visitors across websites for advertising
                      </p>
                    </div>
                    <Switch
                      checked={cookieSettings.marketing}
                      onCheckedChange={(checked) => setCookieSettings((prev) => ({ ...prev, marketing: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Preference Cookies</h4>
                      <p className="text-sm text-muted-foreground">Allow the website to remember choices you make</p>
                    </div>
                    <Switch
                      checked={cookieSettings.preferences}
                      onCheckedChange={(checked) => setCookieSettings((prev) => ({ ...prev, preferences: checked }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={savePreferences}>Save Preferences</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={acceptNecessary}>
              Necessary Only
            </Button>
            <Button onClick={acceptAll}>Accept All</Button>
          </div>
        </div>
      </div>
    </div>

  )
}

