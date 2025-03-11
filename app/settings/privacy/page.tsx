"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface CookieSettings {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const defaultCookieSettings: CookieSettings = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

export default function PrivacySettingsPage() {
  const { toast } = useToast()
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>(defaultCookieSettings)

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    shareJobActivity: false,
    allowRecruiters: true,
    allowEmailMarketing: false,
    allowPartnerMarketing: false,
    dataSharing: false,
  })

  const [dataExportLoading, setDataExportLoading] = useState(false)
  const [dataDeleteLoading, setDataDeleteLoading] = useState(false)

  // Load cookie settings from localStorage - only run once on mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("cookie-settings")
      if (storedSettings) {
        setCookieSettings(JSON.parse(storedSettings))
      }
    } catch (error) {
      console.error("Error loading cookie settings:", error)
    }
  }, []) // Empty dependency array ensures this only runs once

  // Load privacy settings (mock) - only run once on mount
  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setPrivacySettings({
          profileVisibility: true,
          shareJobActivity: false,
          allowRecruiters: true,
          allowEmailMarketing: false,
          allowPartnerMarketing: false,
          dataSharing: false,
        })
      } catch (error) {
        console.error("Error fetching privacy settings:", error)
      }
    }

    fetchPrivacySettings()
  }, []) // Empty dependency array ensures this only runs once

  const handlePrivacySettingChange = (setting: string, value: boolean) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const savePrivacySettings = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Privacy settings saved",
        description: "Your privacy preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving privacy settings:", error)
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your privacy preferences.",
        variant: "destructive",
      })
    }
  }

  const handleCookieSettingChange = (setting: string, value: boolean) => {
    setCookieSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const saveCookieSettings = () => {
    try {
      // Save to localStorage
      localStorage.setItem("cookie-settings", JSON.stringify(cookieSettings))
      localStorage.setItem("cookie-consent", "true")

      // Notify other components about the change
      try {
        const event = document.createEvent("Event")
        event.initEvent("cookieSettingsChanged", true, true)
        document.dispatchEvent(event)
      } catch (e) {
        console.error("Error dispatching event:", e)
      }

      toast({
        title: "Cookie settings saved",
        description: "Your cookie preferences have been updated successfully.",
      })

      // Reload the page to apply new settings
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Error saving cookie settings:", error)
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your cookie preferences.",
        variant: "destructive",
      })
    }
  }

  const handleDataExport = async () => {
    try {
      setDataExportLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setDataExportLoading(false)
      toast({
        title: "Data export initiated",
        description: "We'll email you when your data is ready to download.",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      setDataExportLoading(false)
      toast({
        title: "Error exporting data",
        description: "There was a problem with your data export request.",
        variant: "destructive",
      })
    }
  }

  const handleDataDeletion = async () => {
    try {
      setDataDeleteLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setDataDeleteLoading(false)
      toast({
        title: "Data deletion requested",
        description: "Your request has been received. We'll process it within 30 days.",
      })
    } catch (error) {
      console.error("Error requesting data deletion:", error)
      setDataDeleteLoading(false)
      toast({
        title: "Error requesting deletion",
        description: "There was a problem with your data deletion request.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your privacy preferences and control how your data is used.</p>
      </div>

      <Tabs defaultValue="privacy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Settings</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Privacy</CardTitle>
              <CardDescription>Control who can see your profile and how your information is shared.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="profile-visibility" className="flex flex-col space-y-1">
                  <span>Profile Visibility</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Make your profile visible to employers and recruiters
                  </span>
                </Label>
                <Switch
                  id="profile-visibility"
                  checked={privacySettings.profileVisibility}
                  onCheckedChange={(checked) => handlePrivacySettingChange("profileVisibility", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="share-job-activity" className="flex flex-col space-y-1">
                  <span>Share Job Activity</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Let your network know when you apply to jobs
                  </span>
                </Label>
                <Switch
                  id="share-job-activity"
                  checked={privacySettings.shareJobActivity}
                  onCheckedChange={(checked) => handlePrivacySettingChange("shareJobActivity", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="allow-recruiters" className="flex flex-col space-y-1">
                  <span>Allow Recruiters</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Let recruiters contact you about job opportunities
                  </span>
                </Label>
                <Switch
                  id="allow-recruiters"
                  checked={privacySettings.allowRecruiters}
                  onCheckedChange={(checked) => handlePrivacySettingChange("allowRecruiters", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketing Preferences</CardTitle>
              <CardDescription>Control what types of marketing communications you receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-marketing" className="flex flex-col space-y-1">
                  <span>Email Marketing</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </span>
                </Label>
                <Switch
                  id="email-marketing"
                  checked={privacySettings.allowEmailMarketing}
                  onCheckedChange={(checked) => handlePrivacySettingChange("allowEmailMarketing", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="partner-marketing" className="flex flex-col space-y-1">
                  <span>Partner Marketing</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive offers from our trusted partners
                  </span>
                </Label>
                <Switch
                  id="partner-marketing"
                  checked={privacySettings.allowPartnerMarketing}
                  onCheckedChange={(checked) => handlePrivacySettingChange("allowPartnerMarketing", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="data-sharing" className="flex flex-col space-y-1">
                  <span>Data Sharing</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Share anonymous usage data to help improve our services
                  </span>
                </Label>
                <Switch
                  id="data-sharing"
                  checked={privacySettings.dataSharing}
                  onCheckedChange={(checked) => handlePrivacySettingChange("dataSharing", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={savePrivacySettings}>Save Privacy Settings</Button>
          </div>
        </TabsContent>

        <TabsContent value="cookies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cookie Preferences</CardTitle>
              <CardDescription>
                Manage how we use cookies on our website. Note that necessary cookies are always enabled as they are
                essential for the website to function properly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="necessary-cookies" className="flex flex-col space-y-1">
                  <span>Necessary Cookies</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Required for the website to function properly
                  </span>
                </Label>
                <Switch id="necessary-cookies" checked={cookieSettings.necessary} disabled />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="analytics-cookies" className="flex flex-col space-y-1">
                  <span>Analytics Cookies</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Help us improve our website by collecting anonymous data using tools like Microsoft Clarity
                  </span>
                </Label>
                <Switch
                  id="analytics-cookies"
                  checked={cookieSettings.analytics}
                  onCheckedChange={(checked) => handleCookieSettingChange("analytics", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing-cookies" className="flex flex-col space-y-1">
                  <span>Marketing Cookies</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Used to track visitors across websites for advertising
                  </span>
                </Label>
                <Switch
                  id="marketing-cookies"
                  checked={cookieSettings.marketing}
                  onCheckedChange={(checked) => handleCookieSettingChange("marketing", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="preference-cookies" className="flex flex-col space-y-1">
                  <span>Preference Cookies</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow the website to remember choices you make
                  </span>
                </Label>
                <Switch
                  id="preference-cookies"
                  checked={cookieSettings.preferences}
                  onCheckedChange={(checked) => handleCookieSettingChange("preferences", checked)}
                />
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  For more information about the cookies we use, please see our{" "}
                  <Link href="/legal/cookie-policy" className="text-primary hover:underline">
                    Cookie Policy
                  </Link>
                  .
                </p>
                <Button onClick={saveCookieSettings}>Save Cookie Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Download a copy of your personal data that we have stored.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You can request a copy of all the personal data we have about you. This includes your profile
                information, job applications, and account activity. The export will be prepared and sent to your email
                address.
              </p>
              <Button onClick={handleDataExport} disabled={dataExportLoading}>
                {dataExportLoading ? "Processing..." : "Request Data Export"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Deletion</CardTitle>
              <CardDescription>Request the deletion of your personal data from our systems.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You can request the deletion of your personal data from our systems. This action cannot be undone and
                will result in the permanent loss of your account and all associated data.
              </p>
              <Button variant="destructive" onClick={handleDataDeletion} disabled={dataDeleteLoading}>
                {dataDeleteLoading ? "Processing..." : "Request Data Deletion"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground mt-8">
        <p>
          For more information about how we handle your data, please see our{" "}
          <Link href="/legal/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/legal/terms-of-service" className="text-primary hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

