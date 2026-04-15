import { defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
// https://vite.dev/config/
export default defineConfig({
    plugins: [
      tailwindcss(),
      
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      global:{},
    "process.env": {
      VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
      VITE_WS_BASE_URL: process.env.VITE_WS_BASE_URL,
      VITE_USER_SERVICE_PREFIX: process.env.VITE_USER_SERVICE_PREFIX,
      VITE_CHAT_SERVICE_PREFIX: process.env.VITE_CHAT_SERVICE_PREFIX,
      VITE_SOCIAL_SERVICE_PREFIX: process.env.VITE_SOCIAL_SERVICE_PREFIX,
      VITE_CHAT_WS_PATH: process.env.VITE_CHAT_WS_PATH,
    },
  },
});
