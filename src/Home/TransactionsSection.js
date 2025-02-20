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
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "日期格式錯誤";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    };
    return date
      .toLocaleDateString("zh-TW", options)
      .replace(/(\d+)年(\d+)月(\d+)日/, "$1/$2/$3");
  };

  const calculateDailyTotal = (transactions) => {
    if (!transactions?.length)
      return { amount: 0, color: "#000", formatted: "0" };
    const total = transactions.reduce(
      (sum, t) =>
        t.transactionType === "income" ? sum + t.amount : sum - t.amount,
      0
    );
    return {
      amount: total,
      color: total >= 0 ? "#28a745" : "#dc3545",
      formatted: `${total >= 0 ? "+" : "-"}${Math.abs(total).toLocaleString()}`,
    };
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.transactionDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <section className="transactions-section">
      <div className="transactions-header">
        <h2>交易記錄</h2>
        <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
          新增交易
        </button>
      </div>
      {Object.entries(groupedTransactions)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, transactions]) => (
          <div className="daily-group" key={date}>
            <div className="daily-header">
              {formatDate(date)}
              <span
                className="daily-total"
                style={{ color: calculateDailyTotal(transactions).color }}
              >
                {calculateDailyTotal(transactions).formatted}
              </span>
            </div>
            <ul className="transactions-list">
              {transactions.map((item) => {
                const isIncome = item.transactionType === "income";
                const isSelected = selectedTransactionId === item.transactionId;
                return (
                  <li
                    key={item.transactionId}
                    className="transaction-item"
                    onClick={() => {
                      setSelectedTransactionId(item.transactionId);
                      setIsAddModalOpen(true, item);
                    }}
                  >
                    <div className="transaction-info">
                      <span className="transaction-name">
                        {item.categoryName}
                        {item.description && (
                          <span className="transaction-desc">
                            {" "}
                            - {item.description}
                          </span>
                        )}
                      </span>
                    </div>
                    <span
                      className={`transaction-amount ${
                        isIncome ? "income" : "expense"
                      }`}
                    >
                      {isIncome ? `+${item.amount}` : `-${item.amount}`}
                    </span>
                    {isSelected && (
                      <div className="transaction-options">
                        <button
                          className="edit-button"
                          onClick={() => setIsAddModalOpen(true, item)}
                        >
                          編輯
                        </button>
                        <button className="delete-button">刪除</button>
                      </div>
                    )}
                  </li>
                );
              })}
              {!transactions.length && (
                <li className="no-transactions">目前尚無交易紀錄</li>
              )}
            </ul>
          </div>
        ))}
    </section>
  );
}

export default TransactionsSection;
