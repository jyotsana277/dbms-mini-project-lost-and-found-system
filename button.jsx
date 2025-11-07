
// Button.jsx
import React from "react";

export default function Button({ label, onClick, type = "button", style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#3265ddff",
        color: "white",
        cursor: "pointer",
        fontWeight: "500",
        ...style, // Allows custom styling from props
      }}
    >
      {label}
    </button>
  );
}