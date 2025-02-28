// src/util/api/apiClient.js
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:7258";
export const createApiClient = (onUnauthorized) => {
  // 封裝 fetch 的基礎方法
  const authFetch = async (path, options = {}) => {
    const token = localStorage.getItem("authToken");

    const url = `${BASE_URL}${path}`;

    // 統一設定 headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      // 處理非 200 狀態碼
      if (!response.ok) {
        const error = new Error(`API 請求失敗: ${response.statusText}`);
        error.status = response.status;

        // 如果是 401，觸發登出流程
        if (error.status === 401) {
          localStorage.removeItem("authToken");
          onUnauthorized(); // 觸發導向登入頁
        }
        throw error;
      }

      return await response.json();
    } catch (error) {
      // 統一處理網路錯誤或解析錯誤
      console.error("API 請求錯誤:", error);
      throw error;
    }
  };

  // 返回封裝後的 API 方法
  return {
    get: (path) => authFetch(path, { method: "GET" }),
    post: (path, data) =>
      authFetch(path, { method: "POST", body: JSON.stringify(data) }),
    put: (path, data) =>
      authFetch(path, { method: "PUT", body: JSON.stringify(data) }),
    delete: (path) => authFetch(path, { method: "DELETE" }),
  };
};
