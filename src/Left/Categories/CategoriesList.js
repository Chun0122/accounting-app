// CategoriesList.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modal/Modal";
import CategoriesForm from "./CategoriesForm";
import { CategoriesApi } from "../../Util/api/CategoriesApi";
import { createApiClient } from "../../Util/api/apiClient";
import "./CategoriesList.css";

function CategoriesList() {
  const navigate = useNavigate();

  // 初始化 API 客戶端，綁定導航函數
  const [api] = useState(
    () => createApiClient(() => navigate("/login")) // 401 時觸發導向登入頁
  );
  const [categoriesApi] = useState(() => CategoriesApi(api));

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategoriesData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    categoriesApi
      .fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, [categoriesApi]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm(`確定要刪除帳務類別 ID: ${categoryId} 嗎？`)) return;
    setIsLoading(true);
    setError(null);
    categoriesApi
      .deleteCategory(categoryId)
      .then(() => {
        alert("類別刪除成功！");
        fetchCategoriesData();
      })
      .catch((error) => {
        alert(error.message || "刪除失敗，請稍後再試。");
      });
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleFormSuccess = () => {
    fetchCategoriesData();
    handleCloseModal();
  };

  if (isLoading) {
    return <p>載入中...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="categories-list-container">
      <h2>帳務類別管理</h2>
      <div className="categories-list-header">
        <button
          className="add-category-button"
          onClick={() => handleOpenModal()}
        >
          新增帳務類別
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="categories-form-modal-content">
          <h2 className="modal-title">
            {editingCategory ? "編輯帳務類別" : "新增帳務類別"}
          </h2>
          <CategoriesForm
            editingCategory={editingCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      </Modal>

      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>類別</th>
            <th>名稱</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.categoryType === "income" ? "收入" : "支出"}</td>
              <td>{category.categoryName}</td>
              <td>{category.description}</td>
              <td className="actions-column">
                <button
                  className="edit-button"
                  onClick={() => handleOpenModal(category)}
                >
                  編輯
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCategory(category.categoryId)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {categories.length === 0 && !isLoading && !error && (
          <tfoot>
            <tr>
              <td colSpan="4" className="no-data">
                目前沒有帳務類別資料。
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default CategoriesList;
