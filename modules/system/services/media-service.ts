import apiClient from "@/lib/api-client"
import { SYSTEM_ENDPOINTS } from "../endpoints"

export const mediaService = {
  /**
   * Generates a GCP Signed URL for direct-to-storage upload.
   */
  generateUploadUrl: async (filename: string, contentType: string) => {
    const response = await apiClient.post<{
      data: { url: string; path: string }
    }>(SYSTEM_ENDPOINTS.MEDIA.GENERATE_UPLOAD_URL, {
      filename,
      content_type: contentType,
    })
    return response.data.data
  },
}
