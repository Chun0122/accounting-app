import React, { useState } from "react";

import "./ChartSection.css";

function ChartSection() {
  return (
    <section className="chart-section">
      {/* 左上角標題 (已從右上改為左上) */}
      <h2 className="chart-title">收支占比</h2>

      {/* 圓環圖 */}
      <div className="circle-chart">
        <div className="chart-center"></div>
      </div>

      {/* 圓環圖下方顯示「收入 / 支出」文字 */}
      <div className="income-expense-labels">
        <span className="income-label">收入10,000</span>
        <span className="expense-label">支出8,000</span>
      </div>
    </section>
  );
}

export default ChartSection;
