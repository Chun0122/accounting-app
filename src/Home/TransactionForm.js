import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TransactionForm.css";

import { HomeScreenApi } from "../Util/api/HomeScreenApi";

function TransactionForm({
  categoryOptions,
  subcategoryOptions,
  paymentMethodOptions,
  currencyOptions,
  setIsAddModalOpen,
  fetchTransactions,
  editingTransaction,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // 初始化或編輯時設定表單數據
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        transactionDate: editingTransaction.transactionDate || "",
        transactionType:
          editingTransaction.transactionType.toLowerCase() || "expense",
        categoryId: editingTransaction.categoryId || "",
        subcategoryId: editingTransaction.subcategoryId || "",
        paymentMethodId: editingTransaction.paymentMethodId || "",
        currencyId: editingTransaction.currencyId || "",
        amount: editingTransaction.amount || "",
        description: editingTransaction.description || "",
        notes: editingTransaction.notes || "",
      });
    } else {
      setFormData({
        transactionDate: new Date().toISOString().slice(0, 10),
        transactionType: "expense",
        categoryId: "",
        subcategoryId: "",
        paymentMethodId: "",
        currencyId: "1",
        amount: "",
        description: "",
        notes: "",
      });
    }
  }, [editingTransaction]);

  // 提交表單數據
  const submitTransactionData = (data) => {
    const token = localStorage.getItem("authToken");
    return HomeScreenApi.submitTransaction(editingTransaction, token, data);
  };

  // 刪除處理（僅在編輯模式下顯示）
  const handleDelete = () => {
    if (!editingTransaction) return;
    if (!window.confirm("確定要刪除這筆交易嗎？")) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("您尚未登入或登入已過期，請重新登入。");
      navigate("/login");
      return;
    }
    HomeScreenApi.deleteTransaction(editingTransaction.transactionId, token)
      .then(() => {
        alert("交易刪除成功！");
        setIsAddModalOpen(false);
        fetchTransactions();
      })
      .catch((error) => {
        alert(error.message || "刪除失敗，請稍後再試。");
      });
  };

  // 根據所選的 categoryId 過濾子類別選項
  const filteredSubcategoryOptions = formData.categoryId
    ? subcategoryOptions.filter(
        (option) => option.categoryId === String(formData.categoryId)
      )
    : [];

  // 表單驗證
  const validateForm = () => {
    const errors = {};
    const {
      transactionDate,
      transactionType,
      categoryId,
      paymentMethodId,
      amount,
      description,
      notes,
    } = formData;
    if (!transactionDate) errors.transactionDate = "「交易日期」為必填欄位。";
    if (!transactionType) errors.transactionType = "「交易類別」為必填欄位。";
    if (!categoryId) errors.categoryId = "「帳務類別」為必填欄位。";
    if (!paymentMethodId) errors.paymentMethodId = "「付款方式」為必填欄位。";
    if (!amount) errors.amount = "「金額」為必填欄位。";
    else if (isNaN(amount) || parseFloat(amount) <= 0)
      errors.amount = "「金額」必須為有效正數。";
    if (description?.length > 50)
      errors.description = "「描述」長度請勿超過 50 個字元。";
    if (notes?.length > 200) errors.notes = "「備註」長度請勿超過 200 個字元。";
    return errors;
  };

  // 提交處理
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const submitData = {
      ...formData,
      transactionDate: new Date(formData.transactionDate).toISOString(),
      transactionType:
        formData.transactionType === "expense" ? "Expense" : "Income",
      categoryId: parseInt(formData.categoryId) || null,
      subcategoryId: parseInt(formData.subcategoryId) || null,
      paymentMethodId: parseInt(formData.paymentMethodId) || null,
      currencyId: parseInt(formData.currencyId) || null,
      amount: parseFloat(formData.amount) || null,
    };

    submitTransactionData(submitData)
      .then(() => {
        alert(`交易${editingTransaction ? "更新" : "新增"}成功！`);
        setIsAddModalOpen(false);
        fetchTransactions();
      })
      .catch((error) => alert(error.message || "交易提交失敗，請稍後再試。"));
  };

  // 當更改帳務類別時，同時重置子類別欄位
  const handleChange = (field) => (e) => {
    if (field === "categoryId") {
      setFormData({
        ...formData,
        categoryId: e.target.value,
        subcategoryId: "",
      });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="transactionDate">交易日期</label>
        <input
          type="date"
          id="transactionDate"
          className="form-control"
          value={formData.transactionDate || ""}
          onChange={handleChange("transactionDate")}
        />
        {formErrors.transactionDate && (
          <p className="error-message">{formErrors.transactionDate}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="transactionType">交易類別</label>
        <select
          id="transactionType"
          className="form-control"
          value={formData.transactionType || ""}
          onChange={handleChange("transactionType")}
        >
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
        {formErrors.transactionType && (
          <p className="error-message">{formErrors.transactionType}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="categoryId">帳務類別</label>
        <select
          id="categoryId"
          className="form-control"
          value={formData.categoryId || ""}
          onChange={handleChange("categoryId")}
        >
          <option value="">請選擇帳務類別</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {formErrors.categoryId && (
          <p className="error-message">{formErrors.categoryId}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="subcategoryId">帳務子類別 (選填)</label>
        <select
          id="subcategoryId"
          className="form-control"
          value={formData.subcategoryId || ""}
          onChange={handleChange("subcategoryId")}
        >
          <option value="">請選擇子類別 (選填)</option>
          {filteredSubcategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="paymentMethodId">付款方式</label>
        <select
          id="paymentMethodId"
          className="form-control"
          value={formData.paymentMethodId || ""}
          onChange={handleChange("paymentMethodId")}
        >
          <option value="">請選擇付款方式</option>
          {paymentMethodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {formErrors.paymentMethodId && (
          <p className="error-message">{formErrors.paymentMethodId}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="currencyId">幣別</label>
        <select
          id="currencyId"
          className="form-control"
          value={formData.currencyId || ""}
          onChange={handleChange("currencyId")}
        >
          {currencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="amount">金額</label>
        <input
          type="number"
          id="amount"
          className="form-control"
          value={formData.amount || ""}
          onChange={handleChange("amount")}
        />
        {formErrors.amount && (
          <p className="error-message">{formErrors.amount}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="description">描述 (選填)</label>
        <input
          type="text"
          id="description"
          className="form-control"
          value={formData.description || ""}
          onChange={handleChange("description")}
        />
        {formErrors.description && (
          <p className="error-message">{formErrors.description}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="notes">備註 (選填)</label>
        <textarea
          id="notes"
          className="form-control"
          value={formData.notes || ""}
          onChange={handleChange("notes")}
          rows="3"
        />
        {formErrors.notes && (
          <p className="error-message">{formErrors.notes}</p>
        )}
      </div>
      <div className="form-actions">
        {editingTransaction && (
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            刪除
          </button>
        )}
        <div className="right-buttons">
          <button type="submit" className="save-button">
            {editingTransaction ? "更新" : "儲存"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setIsAddModalOpen(false)}
          >
            取消
          </button>
        </div>
      </div>
    </form>
  );
}

export default TransactionForm;
