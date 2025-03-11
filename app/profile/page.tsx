import { ProfileForm } from "@/components/profile-form"
import { ResumeUploadSection } from "@/components/resume-upload-section"
import { ProfilePreview } from "@/components/profile/profile-preview"
import { SkillsManager } from "@/components/profile/skills-manager"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Profile Settings</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>
        <div className="space-y-6">
          <ResumeUploadSection showProfileOption={true} />
          <SkillsManager />
          <ProfilePreview />
        </div>
      </div>
    </div>
  )
}

