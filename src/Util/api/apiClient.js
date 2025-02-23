// src/util/api/apiClient.js
export const createApiClient = (onUnauthorized) => {
  // 封裝 fetch 的基礎方法
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("authToken");

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
    get: (url) => authFetch(url, { method: "GET" }),
    post: (url, data) =>
      authFetch(url, { method: "POST", body: JSON.stringify(data) }),
    put: (url, data) =>
      authFetch(url, { method: "PUT", body: JSON.stringify(data) }),
    delete: (url) => authFetch(url, { method: "DELETE" }),
  };
};
