import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";
import Modal from "../Modal/Modal";
import ChartSection from "./ChartSection";
import TransactionsSection from "./TransactionsSection";
import TransactionForm from "./TransactionForm";
import { HomeScreenApi } from "../Util/api/HomeScreenApi";
import { createApiClient } from "../Util/api/apiClient";

function HomeScreen() {
  const navigate = useNavigate();

  // 初始化 API 客戶端，綁定導航函數
  const [api] = useState(
    () => createApiClient(() => navigate("/login")) // 401 時觸發導向登入頁
  );
  const [homeApi] = useState(() => HomeScreenApi(api));

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const loadTransactions = useCallback(() => {
    homeApi
      .fetchTransactions()
      .then((res) => setTransactions(res.data))
      .catch((error) => console.error("獲取交易資料失敗:", error));
  }, [homeApi]);

  const loadOptions = useCallback(
    (endpoint, setter) => {
      homeApi
        .fetchOptions(endpoint)
        .then((res) => {
          if (endpoint === "Subcategories") {
            setter(
              res.data.map((item) => ({
                value: String(item.value),
                label: item.label,
                categoryId: String(item.categoryId),
              }))
            );
          } else {
            setter(
              res.data.map((item) => ({
                value: String(item.value),
                label: item.label,
              }))
            );
          }
        })
        .catch((error) => console.error(`載入${endpoint}選項失敗:`, error));
    },
    [homeApi]
  );

  // 計算總收入和總支出
  const totalIncome = transactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  useEffect(() => {
    loadTransactions();
    loadOptions("Categories", setCategoryOptions);
    loadOptions("Subcategories", setSubcategoryOptions);
    loadOptions("PaymentMethods", setPaymentMethodOptions);
    loadOptions("Currencies", setCurrencyOptions);
  }, [loadTransactions, loadOptions]);

  const handleSetIsAddModalOpen = (isOpen, transactionData = null) => {
    setIsAddModalOpen(isOpen);
    setEditingTransaction(transactionData);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <ChartSection totalIncome={totalIncome} totalExpense={totalExpense} />
        <TransactionsSection
          transactions={transactions}
          setIsAddModalOpen={handleSetIsAddModalOpen}
        />
      </div>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2>{editingTransaction ? "編輯交易" : "新增交易"}</h2>
        <TransactionForm
          categoryOptions={categoryOptions}
          subcategoryOptions={subcategoryOptions}
          paymentMethodOptions={paymentMethodOptions}
          currencyOptions={currencyOptions}
          setIsAddModalOpen={handleSetIsAddModalOpen}
          fetchTransactions={loadTransactions}
          editingTransaction={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default HomeScreen;
