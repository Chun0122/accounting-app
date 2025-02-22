// CategoriesList.js
import React, { useState, useEffect } from "react";
import Modal from "../../Modal/Modal";
import CategoriesForm from "./CategoriesForm";
import { CategoriesApi } from "../../Util/api/CategoriesApi";
import "./CategoriesList.css";

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const data = await CategoriesApi.fetchCategories(token);
      setCategories(data);
    } catch (error) {
      console.error("載入帳務類別資料時發生錯誤:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm(`確定要刪除帳務類別 ID: ${categoryId} 嗎？`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `/api/DropdownOptions/DeleteCategories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API 請求失敗，狀態碼: ${response.status}，訊息: ${
            errorData.message || response.statusText
          }`
        );
      }

      await fetchCategoriesData();
    } catch (error) {
      console.error("刪除帳務類別時發生錯誤:", error);
      setError(error);
      alert(`刪除帳務類別失敗: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
            <th>名稱</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.value}>
              <td>{category.value}</td>
              <td>{category.label}</td>
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
                  onClick={() => handleDeleteCategory(category.value)}
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
