\`\`\`typescript
// firebase/job-posting-service.ts
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { firebaseConfig } from "./firebaseConfig"

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Interfaces
interface JobPosting {
  title: string
  description: string
  company: string
  location: string
  salary: number
  postedDate: Date
  userId: string
}

// Function to create a new job posting
async function createJobPosting(jobPosting: JobPosting) {
  try {
    const docRef = await addDoc(collection(db, "jobPostings"), jobPosting)
    console.log("Document written with ID: ", docRef.id)
    return docRef.id
  } catch (e) {
    console.error("Error adding document: ", e)
    throw e
  }
}

// Function to get all job postings
async function getAllJobPostings() {
  const jobPostings: (JobPosting & { id: string })[] = []
  const querySnapshot = await getDocs(collection(db, "jobPostings"))
  querySnapshot.forEach((doc) => {
    jobPostings.push({ id: doc.id, ...doc.data() } as JobPosting & { id: string })
  })
  return jobPostings
}

// Function to get a job posting by ID
async function getJobPostingById(id: string) {
  const docRef = doc(db, "jobPostings", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as JobPosting & { id: string }
  } else {
    console.log("No such document!")
    return null
  }
}

// Function to update a job posting
async function updateJobPosting(id: string, updates: Partial<JobPosting>) {
  const docRef = doc(db, "jobPostings", id)
  try {
    await updateDoc(docRef, updates)
    console.log("Document updated with ID: ", id)
    return true
  } catch (e) {
    console.error("Error updating document: ", e)
    return false
  }
}

// Function to delete a job posting
async function deleteJobPosting(id: string) {
  const docRef = doc(db, "jobPostings", id)
  try {
    await deleteDoc(docRef)
    console.log("Document deleted with ID: ", id)
    return true
  } catch (e) {
    console.error("Error deleting document: ", e)
    return false
  }
}

// Function to get job postings by user ID
async function getJobPostingsByUserId(userId: string) {
  const jobPostings: (JobPosting & { id: string })[] = []
  const q = query(collection(db, "jobPostings"), where("userId", "==", userId))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    jobPostings.push({ id: doc.id, ...doc.data() } as JobPosting & { id: string })
  })
  return jobPostings
}

export {
  db,
  auth,
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingsByUserId,
}
\`\`\`

