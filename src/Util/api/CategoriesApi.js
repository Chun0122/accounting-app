export const CategoriesApi = {
  fetchCategories: async (token) => {
    const response = await fetch("/api/DropdownOptions/Categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },

  createCategory: async (data, token) => {
    const response = await fetch("/api/Categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create category");
    return response.json();
  },

  updateCategory: async (id, data, token) => {
    const response = await fetch(`/api/Categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update category");
    return response.json();
  },

  deleteCategory: async (id, token) => {
    const response = await fetch(
      `/api/DropdownOptions/DeleteCategories/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to delete category");
    return response.json();
  },
};
