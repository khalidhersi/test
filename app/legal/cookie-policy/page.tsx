import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Cookie Policy | JobAI",
  description: "Cookie Policy for JobAI - AI-powered job search platform",
}

export default function CookiePolicyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            This Cookie Policy explains how JobAI ("we," "our," or "us") uses cookies and similar technologies to
            recognize you when you visit our website. It explains what these technologies are and why we use them, as
            well as your rights to control our use of them.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. What Are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well
            as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, JobAI) are called "first-party cookies." Cookies set by
            parties other than the website owner are called "third-party cookies." Third-party cookies enable
            third-party features or functionality to be provided on or through the website (e.g., advertising,
            interactive content, and analytics).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Types of Cookies We Use</h2>

          <h3 className="text-xl font-medium">3.1 Necessary Cookies</h3>
          <p>
            These cookies are essential for the website to function properly. They enable core functionality such as
            security, network management, and account access. You may disable these by changing your browser settings,
            but this may affect how the website functions.
          </p>

          <h3 className="text-xl font-medium">3.2 Analytics Cookies</h3>
          <p>
            These cookies allow us to count visits and traffic sources so we can measure and improve the performance of
            our site. They help us know which pages are the most and least popular and see how visitors move around the
            site.
          </p>

          <h3 className="text-xl font-medium">3.3 Marketing Cookies</h3>
          <p>
            These cookies track your browsing habits to enable us to show advertising which is more likely to be of
            interest to you. These cookies use information about your browsing history to group you with other users who
            have similar interests. Based on that information, third-party advertisers can place cookies to enable them
            to show advertisements which we think will be relevant to your interests while you are on third-party
            websites.
          </p>

          <h3 className="text-xl font-medium">3.4 Preference Cookies</h3>
          <p>
            These cookies enable a website to remember information that changes the way the website behaves or looks,
            like your preferred language or the region that you are in.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. How to Manage Cookies</h2>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access
            cookies. If you disable or refuse cookies, please note that some parts of this website may become
            inaccessible or not function properly.
          </p>
          <p>
            You can also manage your cookie preferences through our Cookie Consent tool, which appears when you first
            visit our website. You can change your preferences at any time by clicking on the "Cookie Settings" link in
            the footer of our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Specific Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Purpose</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm">auth-token</td>
                  <td className="px-4 py-3 text-sm">Used for authentication purposes</td>
                  <td className="px-4 py-3 text-sm">Session</td>
                  <td className="px-4 py-3 text-sm">Necessary</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">cookie-consent</td>
                  <td className="px-4 py-3 text-sm">Stores your cookie preferences</td>
                  <td className="px-4 py-3 text-sm">1 year</td>
                  <td className="px-4 py-3 text-sm">Necessary</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">_ga</td>
                  <td className="px-4 py-3 text-sm">Used by Google Analytics to distinguish users</td>
                  <td className="px-4 py-3 text-sm">2 years</td>
                  <td className="px-4 py-3 text-sm">Analytics</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">_gid</td>
                  <td className="px-4 py-3 text-sm">Used by Google Analytics to distinguish users</td>
                  <td className="px-4 py-3 text-sm">24 hours</td>
                  <td className="px-4 py-3 text-sm">Analytics</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">_fbp</td>
                  <td className="px-4 py-3 text-sm">Used by Facebook to deliver advertisements</td>
                  <td className="px-4 py-3 text-sm">3 months</td>
                  <td className="px-4 py-3 text-sm">Marketing</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">ui-theme</td>
                  <td className="px-4 py-3 text-sm">Stores your theme preference (light/dark)</td>
                  <td className="px-4 py-3 text-sm">1 year</td>
                  <td className="px-4 py-3 text-sm">Preference</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our
            business practices. Any changes will become effective when we post the revised Cookie Policy on our website.
            We encourage you to periodically review this page for the latest information on our cookie practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Contact Us</h2>
          <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us at:</p>
          <p>
            Email: privacy@jobai.com
            <br />
            Address: 123 AI Street, Tech City, TC 12345
          </p>
        </section>
      </div>
    </div>
  )
}

