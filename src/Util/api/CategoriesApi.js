export const CategoriesApi = (api) => ({
  fetchCategories: () => api.get("/api/CategoriesList/GetCategories"),

  submitCategory: (editingCategory, data) => {
    editingCategory
      ? api.put(
          `/api/CategoriesList/UpdateCategory/${editingCategory.transactionId}`,
          data
        )
      : api.post("/api/Transactions/CreateTransaction", data);
  },

  deleteCategory: (id) =>
    api.delete(`/api/CategoriesList/DeleteCategory/${id}`),
});
