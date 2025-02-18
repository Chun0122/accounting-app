// Modal.js
import React, { useRef, useEffect } from "react";
import "./Modal.css"; //  引入 Modal 的 CSS 樣式

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null); //  用於 Modal 容器的 ref
  const firstInputRef = useRef(null); //  用於 Modal 內第一個 input 元素的 ref //  Modal 關閉時，將焦點返回到觸發 Modal 開啟的元素 (可選) // const triggerElementRef = useRef(null);  //  如果您需要更精細的焦點管理，可以加入這個 ref

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open"); //  Modal 開啟時，為 body 加上 modal-open class，可以用 CSS 鎖定背景捲動 // triggerElementRef.current = document.activeElement; //  記錄觸發 Modal 開啟的元素 (可選)
      if (firstInputRef.current) {
        firstInputRef.current.focus(); //  Modal 開啟後，自動 focus 到 Modal 內的第一個 input 元素 (如果有)
      }
    } else {
      document.body.classList.remove("modal-open"); //  Modal 關閉時，移除 body 的 modal-open class // triggerElementRef.current && triggerElementRef.current.focus(); //  Modal 關閉後，將焦點返回到觸發 Modal 開啟的元素 (可選)
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onClose(); //  點擊 Modal 遮罩層時，關閉 Modal
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.keyCode === 27 && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; //  Modal 未開啟時，不 render 任何內容

  return (
    <div className="modal-overlay" ref={modalRef} onClick={handleOverlayClick}>
      <div className="modal-content">
        {children} {/*  Modal 內容，由父元件傳入 */}
      </div>
    </div>
  );
};

export default Modal;
