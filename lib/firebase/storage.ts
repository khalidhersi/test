import { storage } from "./config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export const storageService = {
  uploadFile: async (path: string, file: File) => {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  },

  uploadResume: async (userId: string, file: File) => {
    return storageService.uploadFile(`resumes/${userId}/${file.name}`, file)
  },

  getFileUrl: async (path: string) => {
    const storageRef = ref(storage, path)
    return getDownloadURL(storageRef)
  },
}

