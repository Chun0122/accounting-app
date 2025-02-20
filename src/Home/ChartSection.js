import React, { useState, useRef } from "react";
import "./ChartSection.css";

function ChartSection({ totalIncome, totalExpense }) {
  const total = totalIncome + totalExpense;
  const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePercentage = total > 0 ? (totalExpense / total) * 100 : 0;
  const [hoveredSection, setHoveredSection] = useState(null);
  const chartRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!chartRef.current) return;

    // 獲取環形圖的邊界和中心點
    const rect = chartRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 計算鼠標相對於中心的偏移量
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    // 計算角度（0 到 360 度），加上 90 度的偏移以對齊 conic-gradient 的起始位置
    let angle = ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360;

    // 根據收入百分比計算分界角度（0 到 360 度）
    const incomeAngleRange = (incomePercentage / 100) * 360;

    // 判斷懸停區域
    if (angle <= incomeAngleRange) {
      setHoveredSection("income");
    } else {
      setHoveredSection("expense");
    }
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  return (
    <section className="chart-section">
      <h2 className="chart-title">收支占比</h2>
      <div className="chart-container">
        <div
          className="circle-chart"
          ref={chartRef}
          style={{
            background: `conic-gradient(
              #28a745 0% ${incomePercentage}%,
              #dc3545 ${incomePercentage}% 100%
            )`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="chart-center">
            {hoveredSection && (
              <div className="percentage-display">
                {hoveredSection === "income"
                  ? incomePercentage.toFixed(2)
                  : expensePercentage.toFixed(2)}
                %
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="income-expense-labels">
        <span className="income-label">
          收入 {totalIncome.toLocaleString()}
        </span>
        <span className="expense-label">
          支出 {totalExpense.toLocaleString()}
        </span>
      </div>
    </section>
  );
}

export default ChartSection;
