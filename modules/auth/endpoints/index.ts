const PASSPORT_DOMAIN = process.env.NEXT_PUBLIC_PASSPORT_DOMAIN;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const AUTH_ENDPOINTS = {
  AUTHORIZE: `https://${PASSPORT_DOMAIN}/oauth/authorize`,
  TOKEN: `https://${PASSPORT_DOMAIN}/oauth/token`,
  USER_PROFILE: `https://${PASSPORT_DOMAIN}/api/v1/user/profile`,
  ME: `${API_URL}/v1/system/auth/me`,
} as const;
