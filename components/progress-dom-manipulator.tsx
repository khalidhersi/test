"use client"

import { useEffect } from "react"

export function ProgressDOMManipulator() {
  useEffect(() => {
    try {
      console.log("ProgressDOMManipulator running")

      // Create the Progress section directly in the DOM
      const progressSection = document.createElement("div")
      progressSection.id = "progress-section-injected"
      progressSection.style.marginTop = "2rem"
      progressSection.style.paddingTop = "2rem"
      progressSection.style.borderTop = "1px solid #e5e7eb"

      // Add heading
      const heading = document.createElement("h2")
      heading.textContent = "Progress"
      heading.style.fontSize = "1.5rem"
      heading.style.fontWeight = "bold"
      heading.style.marginBottom = "1.5rem"
      progressSection.appendChild(heading)

      // Create grid container
      const grid = document.createElement("div")
      grid.style.display = "grid"
      grid.style.gridTemplateColumns = "repeat(2, 1fr)"
      grid.style.gap = "1.5rem"

      // Applications card
      const applicationsLink = document.createElement("a")
      applicationsLink.href = "/applications"
      applicationsLink.style.display = "block"
      applicationsLink.style.textDecoration = "none"

      const applicationsCard = document.createElement("div")
      applicationsCard.style.border = "1px solid #e5e7eb"
      applicationsCard.style.borderRadius = "0.5rem"
      applicationsCard.style.padding = "1.5rem"
      applicationsCard.style.display = "flex"
      applicationsCard.style.flexDirection = "column"
      applicationsCard.style.alignItems = "center"
      applicationsCard.style.justifyContent = "center"
      applicationsCard.style.height = "8rem"
      applicationsCard.style.backgroundColor = "white"
      applicationsCard.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)"

      applicationsCard.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin-bottom: 1rem; color: #3b82f6">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <span style="font-size: 1.25rem; font-weight: 500">Applications</span>
      `

      applicationsLink.appendChild(applicationsCard)
      grid.appendChild(applicationsLink)

      // Analytics card
      const analyticsLink = document.createElement("a")
      analyticsLink.href = "/analytics"
      analyticsLink.style.display = "block"
      analyticsLink.style.textDecoration = "none"

      const analyticsCard = document.createElement("div")
      analyticsCard.style.border = "1px solid #e5e7eb"
      analyticsCard.style.borderRadius = "0.5rem"
      analyticsCard.style.padding = "1.5rem"
      analyticsCard.style.display = "flex"
      analyticsCard.style.flexDirection = "column"
      analyticsCard.style.alignItems = "center"
      analyticsCard.style.justifyContent = "center"
      analyticsCard.style.height = "8rem"
      analyticsCard.style.backgroundColor = "white"
      analyticsCard.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)"

      analyticsCard.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin-bottom: 1rem; color: #3b82f6">
          <path d="M3 3v18h18"></path>
          <path d="M18 9V3H12"></path>
          <path d="M18 3l-6 6"></path>
          <path d="M9 18l3-3"></path>
          <path d="M14 18l3-3"></path>
          <path d="M14 12l3-3"></path>
          <path d="M9 12l3-3"></path>
        </svg>
        <span style="font-size: 1.25rem; font-weight: 500">Analytics</span>
      `

      analyticsLink.appendChild(analyticsCard)
      grid.appendChild(analyticsLink)

      // Add grid to progress section
      progressSection.appendChild(grid)

      // Find the dashboard container and append the progress section
      const dashboardContainer = document.querySelector(".dashboard-container") || document.body
      dashboardContainer.appendChild(progressSection)

      console.log("ProgressDOMManipulator completed")
    } catch (err) {
      console.error("Error in ProgressDOMManipulator:", err)
    }

    return () => {
      // Cleanup if needed
      const injectedSection = document.getElementById("progress-section-injected")
      if (injectedSection) {
        injectedSection.remove()
      }
    }
  }, [])

  return null
}

