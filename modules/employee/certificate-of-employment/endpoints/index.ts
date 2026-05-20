export const CERTIFICATE_OF_EMPLOYMENT_ENDPOINTS = {
  PORTAL: {
    MANAGEMENT: {
      LIST: "/v1/certificateofemployment/portal/management/certificate-of-employments",
      CREATE: "/v1/certificateofemployment/portal/management/certificate-of-employments",
      DETAIL: (id: string | number) => `/v1/certificateofemployment/portal/management/certificate-of-employments/${id}`,
      SETTLE: (id: string | number) => `/v1/certificateofemployment/portal/management/certificate-of-employments/${id}/settle`,
      EXPORT: (id: string | number) => `/v1/certificateofemployment/portal/management/certificate-of-employments/${id}/export`,
    },
  },
} as const;
