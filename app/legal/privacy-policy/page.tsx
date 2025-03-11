import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | JobAI",
  description: "Privacy Policy for JobAI - AI-powered job search platform",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to JobAI ("we," "our," or "us"). We are committed to protecting your privacy and personal
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you use our website and services.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have
            read, understood, and agree to be bound by all the terms of this Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>

          <h3 className="text-xl font-medium">2.1 Personal Information</h3>
          <p>We may collect personal information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact information (name, email address, phone number)</li>
            <li>Account credentials (username, password)</li>
            <li>Profile information (resume, work history, education, skills)</li>
            <li>Job preferences and career goals</li>
            <li>Communication between you and JobAI</li>
          </ul>

          <h3 className="text-xl font-medium">2.2 Usage Information</h3>
          <p>We automatically collect certain information about your device and how you interact with our services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address and device identifiers</li>
            <li>Browser type and settings</li>
            <li>Operating system information</li>
            <li>Usage data (pages visited, features used, search queries)</li>
            <li>Time and date of your visits</li>
            <li>Referring websites or applications</li>
          </ul>

          <h3 className="text-xl font-medium">2.3 Cookies and Similar Technologies</h3>
          <p>
            We use cookies and similar tracking technologies to collect information about your browsing activities. You
            can manage your cookie preferences through our Cookie Consent tool. For more information, please see our
            Cookie Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing and maintaining our services</li>
            <li>Processing job applications and matching you with potential employers</li>
            <li>Personalizing your experience and delivering relevant content</li>
            <li>Improving and developing new features and services</li>
            <li>Communicating with you about our services, updates, and promotions</li>
            <li>Analyzing usage patterns and trends</li>
            <li>Protecting our services and preventing fraud</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. How We Share Your Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Employers and recruiters (with your consent)</li>
            <li>Service providers and business partners who help us deliver our services</li>
            <li>Legal authorities when required by law or to protect our rights</li>
            <li>In connection with a business transaction (merger, acquisition, or sale)</li>
          </ul>
          <p>
            We do not sell your personal information to third parties for their marketing purposes without your explicit
            consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and review your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Delete your personal information</li>
            <li>Restrict or object to certain processing activities</li>
            <li>Data portability (receiving your data in a structured format)</li>
            <li>Withdraw consent for processing based on consent</li>
          </ul>
          <p>To exercise these rights, please contact us at privacy@jobai.com or through your account settings.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
            Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the one in which you reside.
            These countries may have different data protection laws. We ensure appropriate safeguards are in place to
            protect your information when transferred internationally.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 16. We do not knowingly collect personal
            information from children. If you believe we have collected information from a child, please contact us
            immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
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

