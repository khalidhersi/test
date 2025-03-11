import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { UserProfile } from "./profile-service"

// Function to check if we have a valid API key
const hasValidApiKey = () => {
  // In a real app, this would check for a valid environment variable
  return false // For now, always return false to use mock data
}

export async function generateApplicationContent(jobDescription: string, userProfile: UserProfile) {
  // If we don't have a valid API key, use mock data immediately
  if (!hasValidApiKey()) {
    return generateMockApplicationContent(jobDescription, userProfile)
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: `
        As an AI assistant, help create a personalized job application for the following position and candidate:
        
        Job Description:
        ${jobDescription}
        
        Candidate Profile:
        Name: ${userProfile.fullName}
        Title: ${userProfile.title || ""}
        Experience: ${userProfile.experience}
        Skills: ${userProfile.skills.join(", ")}
        Current Salary: ${userProfile.currentSalary || "Not specified"}
        Expected Salary Range: $${userProfile.expectedSalaryMin || ""} - $${userProfile.expectedSalaryMax || ""}
        Education: ${userProfile.education?.degree || ""} from ${userProfile.education?.school || ""}
        Bio: ${userProfile.bio || ""}
        
        Please generate:
        1. A personalized cover letter highlighting relevant experience and skills
        2. Key achievements that match the job requirements
        3. Suggested answers to common screening questions
        
        Format the response as JSON with sections for coverLetter, achievements, and screeningAnswers.
        Make sure to reference specific details from the candidate's profile and match them to the job requirements.
      `,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating application content:", error)
    return generateMockApplicationContent(jobDescription, userProfile)
  }
}

export async function analyzeSalaryAndSkills(
  jobDescription: string,
  userProfile: any,
): Promise<{ salary: SalaryAnalysis; skills: SkillsMatch }> {
  // If we don't have a valid API key, use mock data immediately
  if (!hasValidApiKey()) {
    return generateMockAnalysis(jobDescription, userProfile)
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: `
        Analyze this job description and candidate profile for salary expectations and skills match:
        
        Job Description:
        ${jobDescription}
        
        Candidate Profile:
        Current Salary: ${userProfile.currentSalary || "Not specified"}
        Expected Salary Range: ${userProfile.expectedSalaryRange || "Not specified"}
        Experience: ${userProfile.experience}
        Skills: ${userProfile.skills.join(", ")}
        
        Please provide:
        1. Salary analysis with recommended range and market context
        2. Skills analysis showing matching skills, missing skills, and recommendations
        
        Format as JSON with sections for salary and skills.
      `,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing salary and skills:", error)
    return generateMockAnalysis(jobDescription, userProfile)
  }
}

interface SalaryAnalysis {
  recommendedRange: string
  marketContext: string
  factors: string[]
}

interface SkillsMatch {
  matching: string[]
  missing: string[]
  recommendations: string[]
  relevanceScore: number
}

// Helper function to generate mock application content for testing
function generateMockApplicationContent(jobDescription: string, userProfile: any) {
  const jobTitle = jobDescription.split("\n")[0] || "Software Developer"
  const skills = userProfile.skills || ["JavaScript", "React", "Node.js"]
  const currentSalary = userProfile.currentSalary ? `$${userProfile.currentSalary}` : "competitive"
  const expectedSalaryMin = userProfile.expectedSalaryMin ? `$${userProfile.expectedSalaryMin}` : ""
  const expectedSalaryMax = userProfile.expectedSalaryMax ? `$${userProfile.expectedSalaryMax}` : ""
  const salaryExpectations =
    expectedSalaryMin && expectedSalaryMax ? `$${expectedSalaryMin}-${expectedSalaryMax}` : "competitive range"

  return {
    coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at your company. With ${userProfile.experience}, I am confident in my ability to make significant contributions to your team.

My background includes extensive experience with ${skills.slice(0, 3).join(", ")}, which directly aligns with your requirements. Currently earning ${currentSalary}, I am seeking opportunities in the ${salaryExpectations} range, which I believe reflects my experience and the value I can bring to your organization.

I am particularly drawn to your company's innovative approach and commitment to quality. Throughout my career, I have consistently delivered high-impact results, and I am excited about the possibility of bringing my expertise to your team.

I look forward to discussing how my background, skills, and experience would be an asset to your organization.

Best regards,
${userProfile.fullName}`,

    achievements: `• Led development of a mission-critical application that increased user engagement by 45% and reduced load times by 60%
• Implemented automated testing framework reducing bug reports by 75% and improving deployment confidence
• Mentored junior developers and conducted technical training sessions, improving team productivity by 35%
• Successfully migrated legacy systems to modern architecture, resulting in 40% cost savings
• Received recognition for exceptional problem-solving skills and delivering projects ahead of schedule
• Contributed to open-source projects and maintained a 4.8/5 rating on freelance platforms
• Developed innovative solutions that generated $1.2M in additional revenue
• Streamlined deployment processes, reducing release time from 2 days to 2 hours`,

    screeningAnswers: `Q: Why are you interested in this position?
A: I'm passionate about ${jobTitle.toLowerCase()} roles that allow me to leverage my expertise in ${skills[0]} and ${skills[1]}. Your company's focus on innovation and quality aligns perfectly with my professional goals. Currently at ${currentSalary}, I see this role as an opportunity to grow while contributing significant value within my expected range of ${salaryExpectations}.

Q: Describe a challenging project you worked on.
A: I recently led a complex project to modernize our core application infrastructure. We faced tight deadlines and technical challenges, but through effective leadership and innovative problem-solving, we delivered a solution that increased system performance by 45% and reduced operational costs by 30%. This project showcased my ability to manage large-scale initiatives while maintaining high-quality standards.

Q: How do you handle tight deadlines?
A: I employ a strategic approach to deadline management. First, I break down projects into manageable components and prioritize critical features. I maintain transparent communication with stakeholders about progress and potential challenges. For example, when we needed to deliver a major platform upgrade in half the usual time, I implemented parallel development tracks and automated testing processes, allowing us to meet the deadline while maintaining code quality.

Q: What are your salary expectations?
A: Based on my experience and current market rates, I'm seeking compensation in the range of ${salaryExpectations}. This aligns with my current salary of ${currentSalary} and reflects my expertise and the value I can bring to the role. However, I'm open to discussing the total compensation package, including benefits and growth opportunities.

Q: How do you stay current with technology trends?
A: I maintain a proactive approach to professional development through continuous learning and practical application. I regularly contribute to open-source projects, attend tech conferences, and participate in online courses. Recently, I completed advanced certifications in ${skills.slice(0, 2).join(" and ")}, demonstrating my commitment to staying at the forefront of technology.`,
  }
}

function generateMockAnalysis(jobDescription: string, userProfile: any) {
  const description = jobDescription.toLowerCase()
  const userSkills = userProfile.skills || []
  const currentSalary = Number.parseInt(userProfile.currentSalary) || 100000
  const expectedMin = Number.parseInt(userProfile.expectedSalaryMin) || currentSalary
  const expectedMax = Number.parseInt(userProfile.expectedSalaryMax) || currentSalary * 1.2

  // Calculate recommended range based on user's expectations and market data
  const marketMin = Math.round((expectedMin * 0.9) / 1000) * 1000
  const marketMax = Math.round((expectedMax * 1.1) / 1000) * 1000

  const salaryAnalysis: SalaryAnalysis = {
    recommendedRange: `$${marketMin.toLocaleString()} - $${marketMax.toLocaleString()}`,
    marketContext: `Based on your current salary of $${currentSalary.toLocaleString()} and expected range of $${expectedMin.toLocaleString()}-${expectedMax.toLocaleString()}, this position's compensation aligns with market rates for your experience level. The recommended range factors in your current compensation, desired growth, and industry standards.`,
    factors: [
      `Current salary of $${currentSalary.toLocaleString()} suggests strong market value`,
      `Expected range of $${expectedMin.toLocaleString()}-${expectedMax.toLocaleString()} aligns with role requirements`,
      "Industry demand for your skill set",
      "Location and cost of living adjustments",
      "Years of relevant experience",
    ],
  }

  const skillsMatch: SkillsMatch = {
    matching: userSkills.filter((skill: string) => description.includes(skill.toLowerCase())),
    missing: ["Kubernetes", "GraphQL", "System Design", "CI/CD"].filter(
      (skill) => !userSkills.includes(skill) && description.includes(skill.toLowerCase()),
    ),
    recommendations: [
      "Consider getting certified in Kubernetes",
      "Build a project using GraphQL",
      "Take an advanced system design course",
      "Practice implementing CI/CD pipelines",
    ],
    relevanceScore: 85,
  }

  return { salary: salaryAnalysis, skills: skillsMatch }
}

