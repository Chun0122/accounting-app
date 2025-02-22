import React, { useState, useEffect } from "react";
import "./CategoriesForm.css";

function CategoriesForm({ editingCategory, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        categoryName: editingCategory.label || "",
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

      try {
        const token = localStorage.getItem("authToken");
        const apiUrl = editingCategory
          ? `/api/Categories/${editingCategory.value}`
          : "/api/Categories";
        const method = editingCategory ? "PUT" : "POST";

        const response = await fetch(apiUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `API 請求失敗，狀態碼: ${response.status}，訊息: ${
              errorData.message || response.statusText
            }`
          );
        }

        const responseData = await response.json();
        console.log(
          editingCategory ? "更新帳務類別成功:" : "新增帳務類別成功:",
          responseData
        );

        alert(editingCategory ? "帳務類別更新成功！" : "帳務類別新增成功！");
        onSuccess();
      } catch (error) {
        console.error(
          editingCategory ? "更新帳務類別失敗:" : "新增帳務類別失敗:",
          error
        );
        setFormErrors({ apiError: error.message });
        alert(
          editingCategory
            ? `帳務類別更新失敗: ${error.message}`
            : `帳務類別新增失敗: ${error.message}`
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
