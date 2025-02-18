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

  //  下拉選單選項 (假資料，之後會從後端 API 取得)
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "1", label: "餐飲" },
    { value: "2", label: "交通" },
    { value: "3", label: "娛樂" },
    { value: "4", label: "薪資" },
    { value: "5", label: "獎金" },
  ]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([
    { value: "1", label: "早餐" },
    { value: "2", label: "午餐" },
    { value: "3", label: "晚餐" },
    { value: "4", label: "捷運" },
    { value: "5", label: "公車" },
    { value: "6", label: "電影" },
    { value: "7", label: "KTV" },
    { value: "8", label: "主業收入" },
    { value: "9", label: "兼職收入" },
    { value: "10", label: "年終獎金" },
    { value: "11", label: "績效獎金" },
  ]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([
    { value: "1", label: "現金" },
    { value: "2", label: "信用卡" },
    { value: "3", label: "Line Pay" },
    { value: "4", label: "悠遊卡" },
    { value: "5", label: "街口支付" },
  ]);
  const [currencyOptions, setCurrencyOptions] = useState([
    { value: 1, label: "新台幣 (TWD)" },
    { value: 2, label: "美元 (USD)" },
    { value: 3, label: "日圓 (JPY)" },
  ]);

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
          setIsAddModalOpen={setIsAddModalOpen}
        />
      </div>
      {/* 新增交易 Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2>新增交易</h2>
        <TransactionForm
          transactionDate={transactionDate}
          setTransactionDate={setTransactionDate}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          subcategoryId={subcategoryId}
          setSubcategoryId={setSubcategoryId}
          paymentMethodId={paymentMethodId}
          setPaymentMethodId={setPaymentMethodId}
          currencyId={currencyId}
          setCurrencyId={setCurrencyId}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
          notes={notes}
          setNotes={setNotes}
          categoryOptions={categoryOptions}
          subcategoryOptions={subcategoryOptions}
          paymentMethodOptions={paymentMethodOptions}
          currencyOptions={currencyOptions}
          setIsAddModalOpen={setIsAddModalOpen}
          fetchTransactions={fetchTransactions}
        />
      </Modal>
    </div>
  );
}

export default HomeScreen;
