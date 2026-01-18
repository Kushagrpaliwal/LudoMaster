"use client";
import React from "react";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

const typeStyles = {
  success: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: <Info className="w-5 h-5 text-blue-600" />,
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  },
};

const MessageBox = ({ message, type = "info", children }) => {
  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className={`flex items-start gap-3 p-3 z-999 rounded-md ${style.bg} ${style.text}`}>
      <div className="mt-1">{style.icon}</div>
      <div className="text-sm font-medium">
        {message && <p>{message}</p>}
        {children}
      </div>
    </div>
  );
};

export default MessageBox;