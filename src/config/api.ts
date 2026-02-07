export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

export const API_ENDPOINTS = {
  USER_SERVICE: `${API_BASE_URL}${import.meta.env.VITE_USER_SERVICE_PREFIX}`,
  CHAT_SERVICE: `${API_BASE_URL}${import.meta.env.VITE_CHAT_SERVICE_PREFIX}`,
  SOCIAL_SERVICE: `${API_BASE_URL}${import.meta.env.VITE_SOCIAL_SERVICE_PREFIX}`,
};

export const WS_ENDPOINTS = {
  CHAT_WS: `${WS_BASE_URL}${import.meta.env.VITE_CHAT_WS_PATH}`,
};