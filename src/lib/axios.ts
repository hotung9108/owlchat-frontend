import axios, { type AxiosInstance } from "axios";
// import { API_ENDPOINTS } from "@/config/api";
import { API_BASE_URL } from "@/config/api";
import { refreshToken } from "@/services/account-service";
const baseURL = API_BASE_URL;
const apiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    try {
        const urlPath = (config.url || "").toString();
        // endpoint :?
        // const isAuthEndpoint = /\/auth\/(login|register|refresh)$/.test(urlPath);
        const isAuthEndpoint =
            /\/(user-service\/)?api\/auth\/(login|register|refresh)$/.test(
                urlPath,
            );

        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("accessToken")
                : null;
        if (token && !isAuthEndpoint) {
            config.headers = config.headers || {};
            (config.headers as Record<string, string>)["Authorization"] =
                `Bearer ${token}`;
        }
    } catch {}
    return config;
});

// Response interceptor to handle 401 errors and JSON parsing errors
apiClient.interceptors.response.use(
    (response) => {
        // Check if response data is valid JSON
        try {
            if (response.data && typeof response.data === "string") {
                JSON.parse(response.data);
            }
        } catch (jsonError) {
            console.error("Invalid JSON response from server:", jsonError);
            // Return a clean error response
            return Promise.reject(
                new Error("Server returned invalid JSON response"),
            );
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                // const { authService } = await import('@/services/auth-service');
                // await authService.refreshToken();
                console.log("Access token expired. Attempting to refresh token...");
                const refreshTokenValue = localStorage.getItem("refreshToken");
                if (!refreshTokenValue)
                    throw new Error("No refresh token found");
                const response = await refreshToken({
                    refreshToken: refreshTokenValue,
                });
                localStorage.setItem("accessToken", response.accessToken);
                originalRequest.headers["Authorization"] =
                    `Bearer ${response.accessToken}`;
                // Retry the original request

                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                if (typeof window !== "undefined") {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        // Handle other error cases
        if (error.response?.status === 403) {
            error.message = "Bạn không có quyền thực hiện hành động này";
        } else if (error.response?.status === 404) {
            error.message = "Không tìm thấy tài nguyên yêu cầu";
        } else if (error.response?.status >= 500) {
            error.message = "Lỗi server. Vui lòng thử lại sau";
        } else if (error.message.includes("Network Error")) {
            error.message =
                "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng";
        } else if (error.message.includes("JSON")) {
            error.message = "Lỗi định dạng dữ liệu từ server";
        }

        return Promise.reject(error);
    },
);
export default apiClient;
