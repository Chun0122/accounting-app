import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesForm.css";
import { CategoriesApi } from "../../Util/api/CategoriesApi";
import { createApiClient } from "../../Util/api/apiClient";

function CategoriesForm({ editingCategory, onSuccess, onCancel }) {
  const navigate = useNavigate();

  // 初始化 API 客戶端，綁定導航函數
  const [api] = useState(
    () => createApiClient(() => navigate("/login")) // 401 時觸發導向登入頁
  );
  const [categoriesApi] = useState(() => CategoriesApi(api));

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryType: editingCategory.categoryType || "",
        categoryName: editingCategory.categoryName || "",
        description: editingCategory.description || "",
      });
    } else {
      setFormData({
        categoryName: "",
        description: "",
      });
    }
    setFormErrors({});
  }, [editingCategory]);

  const validateForm = () => {
    const errors = {};
    if (!formData.categoryName) {
      errors.categoryName = "「帳務類別名稱」為必填欄位。";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      categoriesApi
        .submitCategory(editingCategory, formData)
        .then(() => {
          alert(editingCategory ? "帳務類別更新成功！" : "帳務類別新增成功！");
          onSuccess();
        })
        .catch((error) => {
          setFormErrors({ apiError: error.message });
          alert(
            editingCategory
              ? `帳務類別更新失敗: ${error.message}`
              : `帳務類別新增失敗: ${error.message}`
          );
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="categoryType">交易類別</label>
        <select
          id="categoryType"
          className="form-control"
          value={formData.categoryType || ""}
          onChange={(e) =>
            setFormData({ ...formData, categoryType: e.target.value })
          }
        >
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
        {formErrors.categoryType && (
          <p className="error-message">{formErrors.categoryType}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="categoryName">帳務類別名稱</label>
        <input
          type="text"
          id="categoryName"
          className="form-control"
          value={formData.categoryName}
          onChange={(e) =>
            setFormData({ ...formData, categoryName: e.target.value })
          }
        />
        {formErrors.categoryName && (
          <p className="error-message">{formErrors.categoryName}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">描述 (選填)</label>
        <textarea
          id="description"
          className="form-control"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows="3"
        />
      </div>

      {formErrors.apiError && (
        <p className="error-message api-error">
          API 錯誤: {formErrors.apiError}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="save-button" disabled={isSubmitting}>
          {isSubmitting ? "儲存中..." : "儲存"}
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </button>
      </div>
    </form>
  );
}

export default CategoriesForm;
