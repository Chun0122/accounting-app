import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";
import Modal from "../Modal/Modal";
import Sidebar from "../SideBar/Sidebar";
import ChartSection from "./ChartSection";
import TransactionsSection from "./TransactionsSection";
import TransactionForm from "./TransactionForm";
import { fetchOptions, fetchTransactions } from "../Util/api"; // 假設有一個 api.js 檔案

function HomeScreen() {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const loadTransactions = useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTransactions(token)
      .then((data) => setTransactions(data))
      .catch((error) => console.error("獲取交易資料失敗:", error));
  }, [navigate]);

  const loadOptions = useCallback((endpoint, setter) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetchOptions(endpoint, token)
      .then((data) =>
        setter(
          data.map((item) => ({ value: String(item.value), label: item.label }))
        )
      )
      .catch((error) => console.error(`載入${endpoint}選項失敗:`, error));
  }, []);

  // 計算總收入和總支出
  const totalIncome = transactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    loadTransactions();
    loadOptions("Categories", setCategoryOptions);
    loadOptions("Subcategories", setSubcategoryOptions);
    loadOptions("PaymentMethods", setPaymentMethodOptions);
    loadOptions("Currencies", setCurrencyOptions);
  }, [loadTransactions, loadOptions, navigate]);

  const handleSetIsAddModalOpen = (isOpen, transactionData = null) => {
    setIsAddModalOpen(isOpen);
    setEditingTransaction(transactionData);
  };

  return (
    <div className="home-page">
      <Sidebar />
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
