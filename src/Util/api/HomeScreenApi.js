export const HomeScreenApi = {
  fetchTransactions: async (token) => {
    return await fetch("/api/Transactions/GetTransactions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(`API request failed with status ${res.status}`);
        return res.json();
      })
      .catch((error) => {
        error.status === 401 && localStorage.removeItem("authToken");
        throw error;
      });
  },
  fetchOptions: async (endpoint, token) => {
    return await fetch(`/api/DropdownOptions/${endpoint}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .catch((error) => {
        error.status === 401 && localStorage.removeItem("authToken");
        throw error;
      });
  },
  submitTransaction: async (editingTransaction, token, data) => {
    const apiUrl = editingTransaction
      ? `/api/Transactions/UpdateTransaction/${editingTransaction.transactionId}`
      : "/api/Transactions/CreateTransaction";
    return await fetch(apiUrl, {
      method: editingTransaction ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update transaction");
        return res.json();
      })
      .catch((error) => {
        error.status === 401 && localStorage.removeItem("authToken");
        throw error;
      });
  },
  deleteTransaction: async (transactionId, token) => {
    return await fetch(`/api/Transactions/DeleteTransaction/${transactionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete transaction");
        return res.json();
      })
      .catch((error) => {
        error.status === 401 && localStorage.removeItem("authToken");
        throw error;
      });
  },
};
