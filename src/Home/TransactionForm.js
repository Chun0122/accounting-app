import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TransactionForm.css"; //  引入 TransactionForm 的 CSS 樣式

function TransactionForm({
  transactionDate,
  setTransactionDate,
  transactionType,
  setTransactionType,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  paymentMethodId,
  setPaymentMethodId,
  currencyId,
  setCurrencyId,
  amount,
  setAmount,
  description,
  setDescription,
  notes,
  setNotes,
  categoryOptions,
  subcategoryOptions,
  paymentMethodOptions,
  currencyOptions,
  setIsAddModalOpen,
  fetchTransactions,
}) {
  const navigate = useNavigate();
  //  新增 state 用於儲存表單驗證錯誤訊息
  const [formErrors, setFormErrors] = useState({});

  //  使用 fetch API 呼叫後端 API  (取代原本的 Placeholder 函式)
  const submitTransactionData = (formData) => {
    //  後端 API 端點 URL (請務必替換成您後端實際的 API 端點 URL)
    console.log("Sending data:", JSON.stringify(formData));
    const apiUrl = "/api/Transactions/CreateTransaction";

    //  從 localStorage 取得 Token
    const token = localStorage.getItem("authToken");

    //  檢查 Token 是否存在 (如果 Token 不存在，可能是使用者未登入或 Token 已過期)
    if (!token) {
      //  Token 不存在，處理 Token 遺失的情況 (例如：導引使用者重新登入)
      console.error(
        "Token not found in localStorage. User might not be logged in."
      );
      alert("您尚未登入或登入已過期，請重新登入。");
      navigate("/login");

      return Promise.reject({
        success: false,
        message: "Token遺失，請重新登入。",
        error: "Token not found",
      }); //  Reject Promise，並回傳錯誤訊息
    }

    return fetch(apiUrl, {
      method: "POST", //  HTTP 方法為 POST
      headers: {
        "Content-Type": "application/json", //  設定請求 Header，Content-Type 為 application/json
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData), //  將表單資料轉換成 JSON 字串作為請求 Body
    })
      .then((response) => {
        //  檢查 HTTP response 狀態碼
        if (!response.ok) {
          //  如果 response 狀態碼不是 2xx，表示 API 呼叫失敗
          console.error("API 呼叫失敗，HTTP 狀態碼:", response.status);
          return response.json().then((errorData) => {
            // 解析 JSON 格式的錯誤訊息
            console.error("API 呼叫失敗，錯誤訊息:", errorData);
            // 將錯誤訊息一起 reject，方便 catch 區塊處理
            return Promise.reject({
              success: false,
              message: "交易新增失敗，請稍後再試。",
              error: errorData,
            });
          });
        }
        //  如果 response 狀態碼是 2xx，表示 API 呼叫成功
        return response.json(); //  解析 JSON 格式的回應資料
      })
      .then((responseData) => {
        //  API 呼叫成功，responseData 為後端 API 回傳的資料
        console.log("API 呼叫成功，後端 API 回應資料:", responseData);
        return { success: true, message: "交易新增成功！", data: responseData }; // Resolve Promise，並回傳成功訊息和資料
      })
      .catch((error) => {
        //  Fetch API 發生錯誤 (例如網路連線錯誤)
        console.error("Fetch API 錯誤:", error);
        // 將錯誤訊息一起 reject，方便 catch 區塊處理
        return Promise.reject({
          success: false,
          message: "交易新增失敗，請稍後再試。",
          error: error,
        });
      });
  };

  //  表單驗證函式
  const validateForm = () => {
    let errors = {}; //  儲存錯誤訊息的物件，Key 為欄位名稱，Value 為錯誤訊息

    //  驗證交易日期 (必填)
    if (!transactionDate) {
      errors.transactionDate = "「交易日期」為必填欄位。";
    }

    //  驗證交易類別 (必填)
    if (!transactionType) {
      errors.transactionType = "「交易類別」為必填欄位。";
    }

    //  驗證帳務類別 (必填)
    if (!categoryId) {
      errors.categoryId = "「帳務類別」為必填欄位。";
    }

    //  驗證付款方式 (必填)
    if (!paymentMethodId) {
      errors.paymentMethodId = "「付款方式」為必填欄位。";
    }

    //  驗證金額 (必填、數字、大於 0)
    if (!amount) {
      errors.amount = "「金額」為必填欄位。";
    } else if (isNaN(amount)) {
      errors.amount = "「金額」必須為有效數字。";
    } else if (parseFloat(amount) <= 0) {
      errors.amount = "「金額」必須大於 0。";
    }

    //  驗證描述 (選填，長度限制)
    if (description && description.length > 50) {
      errors.description = "「描述」長度請勿超過 50 個字元。";
    }

    //  驗證備註 (選填，長度限制)
    if (notes && notes.length > 200) {
      errors.notes = "「備註」長度請勿超過 200 個字元。";
    }

    //  ...  未來可以加入更多欄位的驗證 ...

    return errors; //  回傳錯誤訊息物件
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      //  表單驗證通過，準備提交資料

      //  取得表單資料
      const formData = {
        transactionDate: transactionDate
          ? new Date(transactionDate).toISOString()
          : null,
        transactionType: transactionType === "expense" ? "Expense" : "Income",
        categoryId: categoryId ? parseInt(categoryId) : null,
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
        paymentMethodId: paymentMethodId ? parseInt(paymentMethodId) : null,
        currencyId: currencyId ? parseInt(currencyId) : null,
        amount: amount ? parseFloat(amount) : null,
        description,
        notes,
      };

      console.log("formData (修正後):", formData);

      //  呼叫 API 提交資料 (使用 fetch API 函式)
      submitTransactionData(formData)
        .then((response) => {
          //  API 呼叫成功，response 已經是包含 success, message, data 屬性的物件
          console.log("API 呼叫成功 response:", response);
          alert(response.message); //  彈出成功訊息視窗 (使用 response.message)

          setIsAddModalOpen(false);

          // 更新交易記錄列表，顯示新加入的交易 (與之前程式碼相同)
          fetchTransactions();
        })
        .catch((errorResponse) => {
          //  API 呼叫失敗，errorResponse 已經是包含 success, message, error 屬性的物件
          console.error("API 呼叫失敗 errorResponse:", errorResponse);
          alert(errorResponse.message); //  彈出錯誤訊息視窗 (使用 errorResponse.message)

          //  [重要]  保持 Modal 開啟 (與之前程式碼相同)
        });
    } else {
      //  表單驗證失敗 (與之前程式碼相同)
      console.log("表單驗證失敗！", errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 交易日期 */}
      <div className="form-group">
        <label htmlFor="transactionDate">交易日期</label>
        <input
          type="date"
          id="transactionDate"
          className="form-control"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
        />
        {formErrors.transactionDate && ( // 判斷 formErrors.transactionDate 是否存在
          <p className="error-message">{formErrors.transactionDate}</p> // 顯示錯誤訊息
        )}
      </div>

      {/* 交易類別 (收入/支出) */}
      <div className="form-group">
        <label htmlFor="transactionType">交易類別</label>
        <select
          id="transactionType"
          className="form-control"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
        {formErrors.transactionType && ( // 判斷 formErrors.transactionType 是否存在
          <p className="error-message">{formErrors.transactionType}</p> // 顯示錯誤訊息
        )}
      </div>

      {/* 帳務類別 */}
      <div className="form-group">
        <label htmlFor="categoryId">帳務類別</label>
        <select
          id="categoryId"
          className="form-control"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">請選擇帳務類別</option> {/*  預設選項 */}
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {formErrors.categoryId && ( // 判斷 formErrors.categoryId 是否存在
          <p className="error-message">{formErrors.categoryId}</p> // 顯示錯誤訊息
        )}
      </div>

      {/* 帳務子類別 (可選) */}
      <div className="form-group">
        <label htmlFor="subcategory">帳務子類別 (選填)</label>
        <select
          id="subcategory"
          className="form-control"
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
        >
          <option value="">請選擇子類別 (選填)</option> {/*  預設選項 */}
          {subcategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 付款方式 */}
      <div className="form-group">
        <label htmlFor="paymentMethod">付款方式</label>
        <select
          id="paymentMethod"
          className="form-control"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(e.target.value)}
        >
          <option value="">請選擇付款方式</option> {/*  預設選項 */}
          {paymentMethodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {formErrors.paymentMethodId && ( // 判斷 formErrors.paymentMethodId 是否存在
          <p className="error-message">{formErrors.paymentMethodId}</p> // 顯示錯誤訊息
        )}
      </div>

      {/* 幣別 */}
      <div className="form-group">
        <label htmlFor="currency">幣別</label>
        <select
          id="currency"
          className="form-control"
          value={currencyId}
          onChange={(e) => setCurrencyId(e.target.value)}
        >
          {currencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 金額 */}
      <div className="form-group">
        <label htmlFor="amount">金額</label>
        <input
          type="number"
          id="amount"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {formErrors.amount && ( // 判斷 formErrors.amount 是否存在
          <p className="error-message">{formErrors.amount}</p> // 顯示錯誤訊息
        )}
      </div>

      {/* 描述 (選填) */}
      <div className="form-group">
        <label htmlFor="description">描述 (選填)</label>
        <input
          type="text"
          id="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {formErrors.description && ( // 判斷 formErrors.description 是否存在
          <p className="error-message">{formErrors.description}</p> // 顯示錯誤訊息
        )}
      </div>

      {/* 備註 (選填) */}
      <div className="form-group">
        <label htmlFor="notes">備註 (選填)</label>
        <textarea
          id="notes"
          className="form-control"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
        />
        {formErrors.notes && ( // 判斷 formErrors.notes 是否存在
          <p className="error-message">{formErrors.notes}</p> // 顯示錯誤訊息
        )}
      </div>

      {/* 儲存和取消按鈕 (保持不變) */}
      <div className="form-actions">
        <button type="submit" className="save-button">
          儲存
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => setIsAddModalOpen(false)}
        >
          取消
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
