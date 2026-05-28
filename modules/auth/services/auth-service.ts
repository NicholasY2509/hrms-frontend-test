import axios from "axios"
import { AUTH_ENDPOINTS } from "../endpoints"
import { AuthToken, User } from "../types"

const CLIENT_ID = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID
const CLIENT_SECRET = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/login/callback`

export const authService = {
  getAuthorizeUrl: () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID!,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "*",
    })
    return `${AUTH_ENDPOINTS.AUTHORIZE}?${params.toString()}`
  },

  exchangeCodeForToken: async (code: string): Promise<AuthToken> => {
    const response = await axios.post(AUTH_ENDPOINTS.TOKEN, {
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    })
    return response.data
  },

  getUserProfile: async (accessToken: string): Promise<User> => {
    const response = await axios.get(AUTH_ENDPOINTS.ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data.data
  },

  logout: async (accessToken: string): Promise<void> => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/v1/system/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  refreshToken: async (refreshToken: string): Promise<AuthToken> => {
    const response = await axios.post(AUTH_ENDPOINTS.TOKEN, {
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      scope: "*",
    })
    return response.data
  },
}
