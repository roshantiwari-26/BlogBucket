import { useEffect } from "react";
import styles from "./Toast.module.css";

function Toast({ toast, onClose }) {
  if (!toast) return null;
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, onClose]);
  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <span>{toast.message}</span>

      <button onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
