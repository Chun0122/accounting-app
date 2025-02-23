export const HomeScreenApi = (api) => ({
  fetchTransactions: () => api.get("/api/Transactions/GetTransactions"),

  fetchOptions: (endpoint) => api.get(`/api/DropdownOptions/${endpoint}`),

  submitTransaction: (editingTransaction, data) =>
    editingTransaction
      ? api.put(
          `/api/Transactions/UpdateTransaction/${editingTransaction.transactionId}`,
          data
        )
      : api.post("/api/Transactions/CreateTransaction", data),

  deleteTransaction: (transactionId) =>
    api.delete(`/api/Transactions/DeleteTransaction/${transactionId}`),
});
