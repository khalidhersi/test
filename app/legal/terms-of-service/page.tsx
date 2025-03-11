import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service | JobAI",
  description: "Terms of Service for JobAI - AI-powered job search platform",
}

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you and JobAI ("we," "our,"
            or "us") governing your access to and use of the JobAI website, applications, and services (collectively,
            the "Services").
          </p>
          <p>
            By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these
            Terms, you may not access or use the Services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. If we make changes, we will provide notice by posting the updated
            Terms on our website and updating the "Last updated" date. Your continued use of the Services after any such
            changes constitutes your acceptance of the new Terms.
          </p>
          <p>
            It is your responsibility to review the Terms periodically. If you do not agree to the modified Terms, you
            should discontinue your use of the Services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Eligibility</h2>
          <p>
            You must be at least 16 years old to use our Services. By using our Services, you represent and warrant
            that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are at least 16 years old</li>
            <li>You have the legal capacity to enter into these Terms</li>
            <li>You will comply with these Terms and all applicable laws</li>
            <li>
              If you are using the Services on behalf of an organization, you have authority to bind that organization
              to these Terms
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Account Registration and Security</h2>
          <p>
            To access certain features of our Services, you may need to create an account. When registering for an
            account, you agree to provide accurate, current, and complete information. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities that occur under your
            account.
          </p>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create a strong password and keep it confidential</li>
            <li>Restrict access to your account and devices</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Ensure that you log out from your account at the end of each session</li>
          </ul>
          <p>
            We reserve the right to disable any user account if, in our opinion, you have violated any provision of
            these Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. User Content</h2>
          <p>
            Our Services allow you to upload, submit, store, send, or receive content, including but not limited to
            resumes, cover letters, and profile information ("User Content"). You retain ownership rights in your User
            Content.
          </p>
          <p>
            By submitting User Content to our Services, you grant us a worldwide, non-exclusive, royalty-free license to
            use, reproduce, modify, adapt, publish, translate, distribute, and display such User Content for the purpose
            of providing and improving our Services.
          </p>
          <p>You represent and warrant that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You own or have the necessary rights to your User Content</li>
            <li>Your User Content does not violate the rights of any third party</li>
            <li>Your User Content complies with these Terms and all applicable laws</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Services for any illegal purpose or in violation of any laws</li>
            <li>Impersonate any person or entity or falsely state your affiliation</li>
            <li>Interfere with or disrupt the Services or servers connected to the Services</li>
            <li>Attempt to gain unauthorized access to any part of the Services</li>
            <li>Use any robot, spider, or other automated device to access the Services</li>
            <li>Collect or harvest any information from other users</li>
            <li>Post content that is defamatory, obscene, or otherwise objectionable</li>
            <li>Transmit any viruses, worms, or other malicious code</li>
            <li>Engage in any activity that could disable, overburden, or impair the Services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Intellectual Property Rights</h2>
          <p>
            The Services and their entire contents, features, and functionality (including but not limited to all
            information, software, text, displays, images, video, and audio, and the design, selection, and arrangement
            thereof) are owned by JobAI, its licensors, or other providers and are protected by copyright, trademark,
            patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            These Terms do not grant you any rights to use our trademarks, logos, domain names, or other brand features
            without our prior written consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Third-Party Links and Services</h2>
          <p>
            Our Services may contain links to third-party websites or services that are not owned or controlled by
            JobAI. We have no control over, and assume no responsibility for, the content, privacy policies, or
            practices of any third-party websites or services.
          </p>
          <p>
            You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage
            or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content,
            goods, or services available on or through any such websites or services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Termination</h2>
          <p>
            We may terminate or suspend your access to the Services immediately, without prior notice or liability, for
            any reason whatsoever, including without limitation if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Services will immediately cease. If you wish to terminate your
            account, you may simply discontinue using the Services or contact us to request account deletion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Disclaimer of Warranties</h2>
          <p>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
          </p>
          <p>
            JOBAI DOES NOT WARRANT THAT: (A) THE SERVICES WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY
            PARTICULAR TIME OR LOCATION; (B) ANY ERRORS OR DEFECTS WILL BE CORRECTED; (C) THE SERVICES ARE FREE OF
            VIRUSES OR OTHER HARMFUL COMPONENTS; OR (D) THE RESULTS OF USING THE SERVICES WILL MEET YOUR REQUIREMENTS.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL JOBAI, ITS AFFILIATES, DIRECTORS,
            EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER
            INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF, OR INABILITY TO USE, THE SERVICES.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless JobAI and its licensors, service providers, employees,
            agents, officers, and directors from and against any claims, liabilities, damages, judgments, awards,
            losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your
            violation of these Terms or your use of the Services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without
            regard to its conflict of law provisions.
          </p>
          <p>
            Any legal action or proceeding arising out of or relating to these Terms or your use of the Services shall
            be exclusively brought in the courts located in [Your Jurisdiction], and you consent to the personal
            jurisdiction and venue of such courts.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">14. Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid, illegal, or unenforceable for any reason, such
            provision shall be eliminated or limited to the minimum extent necessary, and the remaining provisions of
            the Terms will continue in full force and effect.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">15. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and JobAI regarding your use of the Services and
            supersede all prior and contemporaneous written or oral agreements between you and JobAI.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">16. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>
            Email: legal@jobai.com
            <br />
            Address: 123 AI Street, Tech City, TC 12345
          </p>
        </section>
      </div>
    </div>
  )
}

