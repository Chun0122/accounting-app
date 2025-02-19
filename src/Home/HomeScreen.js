import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

import Modal from "../Modal/Modal";
import Sidebar from "../SideBar/Sidebar";
import ChartSection from "./ChartSection";
import TransactionsSection from "./TransactionsSection";
import TransactionForm from "./TransactionForm";

function HomeScreen() {
  const navigate = useNavigate();
  //  新增 state 來控制 Modal 的顯示與隱藏
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  //  新增 state 用於管理新增交易表單的各個欄位值
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 10)
  ); //  預設為今天日期 (YYYY-MM-DD 格式)
  const [transactionType, setTransactionType] = useState("expense"); //  預設為支出
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [currencyId, setCurrencyId] = useState(1); // 預設幣別
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const fetchTransactions = useCallback(() => {
    const apiUrl = "/api/Transactions/GetTransactions";
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token not found in localStorage.");
      navigate("/login");
      return;
    }

    fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("API 請求失敗，HTTP 狀態碼:", response.status);
          throw new Error(`API request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("成功從 API 獲取交易資料:", data);
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Fetch API 錯誤:", error);
      });
  }, [navigate, setTransactions]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("使用者未登入，導向到登入頁面");
      navigate("/login");
    } else {
      console.log("使用者已登入，Token:", token);
      fetchTransactions();
    }
  }, [navigate, fetchTransactions]);

  // 新增 useEffect Hook 載入 帳務類別 選項
  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "/api/DropdownOptions/Categories", //  請替換成 帳務類別 API 端點 URL
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  如果 API 需要 Token，請加入
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); //  假設 API 回傳的資料格式為 [{ id: 1, name: "餐飲" }, ...] //  需要將 API 資料轉換成 <Select> 元件可用的格式 [{ value: "1", label: "餐飲" }, ...]
        const options = data.map((item) => ({
          value: String(item.value), //  value 屬性通常是字串，確保轉換
          label: item.label, //  label 屬性通常是顯示名稱
        }));
        setCategoryOptions(options);
      } catch (error) {
        console.error("載入帳務類別選項時發生錯誤:", error); //  可以加入錯誤處理，例如顯示錯誤訊息給使用者
      }
    };
    fetchCategoryOptions();
  }, []); // dependency array 為空，確保只在元件 Mount 時執行一次 // 新增 useEffect Hook 載入 帳務子類別 選項 (程式碼結構與上方類似，請自行完成)

  useEffect(() => {
    const fetchSubcategoryOptions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "/api/DropdownOptions/Subcategories", //  請替換成 帳務子類別 API 端點 URL
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  如果 API 需要 Token，請加入
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); //  假設 API 回傳的資料格式為 [{ subcategory_id: 1, subcategory_name: "早餐" }, ...] //  需要將 API 資料轉換成 <Select> 元件可用的格式 [{ value: "1", label: "早餐" }, ...]
        const options = data.map((item) => ({
          value: String(item.value), //  value 屬性通常是字串，確保轉換
          label: item.label, //  label 屬性通常是顯示名稱
        }));
        setSubcategoryOptions(options);
      } catch (error) {
        console.error("載入帳務子類別選項時發生錯誤:", error); //  可以加入錯誤處理，例如顯示錯誤訊息給使用者
      }
    };
    fetchSubcategoryOptions();
  }, []); // dependency array 為空，確保只在元件 Mount 時執行一次 // 新增 useEffect Hook 載入 付款方式 選項 (程式碼結構與上方類似，請自行完成)

  useEffect(() => {
    const fetchPaymentMethodOptions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "/api/DropdownOptions/PaymentMethods", //  請替換成 付款方式 API 端點 URL
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  如果 API 需要 Token，請加入
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); //  假設 API 回傳的資料格式為 [{ payment_method_id: 1, payment_method_name: "現金" }, ...] //  需要將 API 資料轉換成 <Select> 元件可用的格式 [{ value: "1", label: "現金" }, ...]
        const options = data.map((item) => ({
          value: String(item.value), //  value 屬性通常是字串，確保轉換
          label: item.label, //  label 屬性通常是顯示名稱
        }));
        setPaymentMethodOptions(options);
      } catch (error) {
        console.error("載入付款方式選項時發生錯誤:", error); //  可以加入錯誤處理，例如顯示錯誤訊息給使用者
      }
    };
    fetchPaymentMethodOptions();
  }, []); // dependency array 為空，確保只在元件 Mount 時執行一次 // 新增 useEffect Hook 載入 幣別 選項 (程式碼結構與上方類似，請自行完成)

  useEffect(() => {
    const fetchCurrencyOptions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "/api/DropdownOptions/Currencies", //  請替換成 幣別 API 端點 URL
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, //  如果 API 需要 Token，請加入
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); //  假設 API 回傳的資料格式為 [{ currency_id: 1, currency_name: "新台幣", currency_code: "TWD" }, ...] //  需要將 API 資料轉換成 <Select> 元件可用的格式 [{ value: 1, label: "新台幣 (TWD)" }, ...]
        const options = data.map((item) => ({
          value: item.value, //  value 屬性通常是數字，保持數字類型
          label: item.label, //  label 屬性通常是顯示名稱
        }));
        setCurrencyOptions(options);
      } catch (error) {
        console.error("載入幣別選項時發生錯誤:", error); //  可以加入錯誤處理，例如顯示錯誤訊息給使用者
      }
    };
    fetchCurrencyOptions();
  }, []); // dependency array 為空，確保只在元件 Mount 時執行一次

  //  修改 setIsAddModalOpen 函式，使其可以接收 editingTransaction 參數
  const handleSetIsAddModalOpen = (isOpen, transactionData = null) => {
    setIsAddModalOpen(isOpen);
    setEditingTransaction(transactionData); // 設定 editingTransaction state
  };

  return (
    <div className="home-page">
      {/* 左上方的選單按鈕 */}
      <Sidebar />
      {/* 主內容區域 */}
      <div className="home-container">
        {/* 收支占比區塊 */}
        <ChartSection />

        {/* 交易記錄列表 */}
        <TransactionsSection
          transactions={transactions}
          setIsAddModalOpen={handleSetIsAddModalOpen}
        />
      </div>
      {/* 新增交易 Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2>{editingTransaction ? "編輯交易" : "新增交易"}</h2>
        <TransactionForm
          transactionDate={
            editingTransaction
              ? editingTransaction.transactionDate
              : transactionDate
          }
          setTransactionDate={setTransactionDate}
          transactionType={
            editingTransaction
              ? editingTransaction.transactionType.toLowerCase()
              : transactionType
          }
          setTransactionType={setTransactionType}
          categoryId={
            editingTransaction ? editingTransaction.categoryId : categoryId
          }
          setCategoryId={setCategoryId}
          subcategoryId={
            editingTransaction
              ? editingTransaction.subcategoryId
              : subcategoryId
          }
          setSubcategoryId={setSubcategoryId}
          paymentMethodId={
            editingTransaction
              ? editingTransaction.paymentMethodId
              : paymentMethodId
          }
          setPaymentMethodId={setPaymentMethodId}
          currencyId={
            editingTransaction ? editingTransaction.currencyId : currencyId
          }
          setCurrencyId={setCurrencyId}
          amount={editingTransaction ? editingTransaction.amount : amount}
          setAmount={setAmount}
          description={
            editingTransaction ? editingTransaction.description : description
          }
          setDescription={setDescription}
          notes={editingTransaction ? editingTransaction.notes : notes}
          setNotes={setNotes}
          categoryOptions={categoryOptions}
          subcategoryOptions={subcategoryOptions}
          paymentMethodOptions={paymentMethodOptions}
          currencyOptions={currencyOptions}
          setIsAddModalOpen={handleSetIsAddModalOpen}
          fetchTransactions={fetchTransactions}
          editingTransaction={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default HomeScreen;
