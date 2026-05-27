import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export const ToastItem = ({ id, message, type, closing, onRemove }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-success-icon" size={20} />;
      case 'error':
        return <AlertCircle className="toast-error-icon" size={20} />;
      case 'info':
      default:
        return <Info className="toast-info-icon" size={20} />;
    }
  };

  return (
    <div className={`toast toast-${type} glass-panel ${closing ? 'toast-closing' : ''}`}>
      {getIcon()}
      <div className="toast-message">{message}</div>
      <button className="toast-close-btn" onClick={() => onRemove(id)} aria-label="Close alert">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          closing={toast.closing}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};
