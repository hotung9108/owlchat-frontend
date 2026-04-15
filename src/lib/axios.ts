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
        const contentType = response.headers["content-type"] || "";

        if (typeof response.data === "string" && response.data.trim() !== "") {
            if (contentType.includes("application/json")) {
                // Content-Type says JSON but body is still a raw string → try to parse
                try {
                    response.data = JSON.parse(response.data);
                } catch {
                    // Couldn't parse → treat as a plain-text message object
                    response.data = { message: response.data };
                }
            } else {
                // Plain text / no content-type → wrap in a consistent shape
                response.data = { message: response.data };
            }
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Normalise a plain-string error body so callers can always do
        // err?.response?.data?.message
        if (error.response && typeof error.response.data === "string" && error.response.data.trim() !== "") {
            const raw = error.response.data.trim();
            error.response.data = { message: raw };
            // Preserve the server message on error.message as well
            if (!error.message || error.message === "Request failed with status code " + error.response.status) {
                error.message = raw;
            }
        }

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
                if (typeof window !== "undefined") {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    window.dispatchEvent(new CustomEvent("auth-logout", { detail: { redirect: "/login" } }));
                }
                return Promise.reject(refreshError);
            }
        }
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
