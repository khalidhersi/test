import type { AxiosError } from "axios"
import axios from "axios"

interface IpApiResponse {
  city: string
  region: string
  country: string
  loc: string
}

export async function getUserLocation(): Promise<{ city: string; region: string } | null> {
  try {
    // First get the user's IP
    const ipResponse = await axios.get("https://api.ipify.org?format=json")
    const ip = ipResponse.data.ip

    // Then get location from IP using ipapi.co (free tier, 1000 requests per day)
    const locationResponse = await axios.get<IpApiResponse>(`https://ipapi.co/${ip}/json/`)
    const location = locationResponse.data

    return {
      city: location.city,
      region: location.region,
    }
  } catch (error) {
    console.error("Error getting user location:", (error as AxiosError).message)
    return null
  }
}

