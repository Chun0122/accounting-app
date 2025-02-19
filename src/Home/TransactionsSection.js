import React, { useState, useEffect } from "react";
import "./TransactionsSection.css";

function TransactionsSection({ transactions, setIsAddModalOpen }) {
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".transaction-item")) {
        setSelectedTransactionId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formatDate = (dateString) => {
    const dateParts = dateString.split("-"); //  使用 split('-') 分割日期字串
    console.log(dateString);
    if (dateParts.length !== 3) {
      //  如果分割後的日期部分數量不是 3 (年、月、日)，表示日期格式錯誤
      console.error("日期字串格式錯誤 (YYYY-MM-DD):", dateString);
      return "日期格式錯誤"; //  或者返回其他預設值
    }

    const year = parseInt(dateParts[0], 10); //  解析年份 (字串轉數字)
    const month = parseInt(dateParts[1], 10); //  解析月份 (字串轉數字)
    const day = parseInt(dateParts[2], 10); //  解析日期 (字串轉數字)

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      //  如果年、月、日任何一個解析失敗，表示日期格式錯誤
      console.error("日期部分解析失敗:", dateString);
      return "日期格式錯誤"; //  或者返回其他預設值
    }

    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      timeZone: "UTC",
    };
    return date
      .toLocaleDateString("zh-TW", options)
      .replace(/(\d+)年(\d+)月(\d+)日/, "$1/$2/$3");
  };

  // 計算每日總額
  const calculateDailyTotal = (transactions) => {
    const total = transactions.reduce(
      (sum, t) =>
        t.transactionType === "income" ? sum + t.amount : sum - t.amount,
      0
    );
    console.log(total);
    return {
      amount: total,
      // 如果淨額大於等於 0 顯示綠色，否則顯示紅色
      color: total >= 0 ? "#28a745" : "#dc3545",
      // 格式化金額顯示，根據正負決定加號或減號
      formatted: `${total >= 0 ? "+" : "-"}${Math.abs(total).toLocaleString()}`,
    };
  };

  // 新增分組邏輯 (放在 return 之前)
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    console.log(transaction);
    const date = transaction.transactionDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <section className="transactions-section">
      <div className="transactions-header">
        <h2>交易記錄</h2>
        <button
          className="add-button"
          onClick={() => setIsAddModalOpen(true)} //  使用 props 傳遞下來的 setIsAddModalOpen 函式
        >
          新增交易
        </button>
      </div>

      {/* 按日期分組的區塊 (與之前程式碼相同) */}
      {Object.entries(groupedTransactions)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, transactions]) => (
          <div className="daily-group" key={date}>
            {/* 日期標題 */}
            <div className="daily-header">
              {formatDate(date)}
              <span
                className="daily-total"
                style={{ color: calculateDailyTotal(transactions).color }}
              >
                {calculateDailyTotal(transactions).formatted}
              </span>
            </div>

            {/* 交易列表 */}
            <ul className="transactions-list">
              {transactions.map((item, index) => {
                const isIncome = item.transactionType === "income";
                const isSelected = selectedTransactionId === item.transactionId;
                return (
                  <li
                    key={index}
                    className="transaction-item"
                    onClick={() => {
                      setSelectedTransactionId(item.transactionId);
                      setIsAddModalOpen(true, item); // 傳遞整個交易項目資料
                    }}
                  >
                    <div className="transaction-info">
                      <span className="transaction-name">
                        {item.categoryName}
                        {item.description && (
                          <span className="transaction-desc">
                            - {item.description}
                          </span>
                        )}
                      </span>
                    </div>
                    <span
                      className={
                        "transaction-amount " +
                        (isIncome ? "income" : "expense")
                      }
                    >
                      {isIncome ? `+${item.amount}` : `-${item.amount}`}
                    </span>
                    {/*  條件式渲染編輯選單  */}
                    {isSelected && (
                      <div className="transaction-options">
                        <button
                          className="edit-button"
                          onClick={() => setIsAddModalOpen(true, item)} // 修改編輯按鈕 onClick 事件處理器
                        >
                          編輯
                        </button>
                        <button className="delete-button">刪除</button>
                      </div>
                    )}
                  </li>
                );
              })}
              {transactions.length === 0 && ( // 如果 transactions 陣列為空，顯示提示訊息
                <li className="no-transactions">目前尚無交易紀錄</li>
              )}
            </ul>
          </div>
        ))}
    </section>
  );
}

export default TransactionsSection;
