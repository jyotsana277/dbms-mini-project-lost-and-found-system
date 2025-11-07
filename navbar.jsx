
import React from 'react';

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#3265ddff",
      color: "white"
    }}>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        MyApp
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <a href="/posts" style={{ color: "white", textDecoration: "none" }}>Home</a>
        <a href="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</a>
        <a href="/login" style={{ color: "white", textDecoration: "none" }}>Logout</a>
        <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</a>

      </div>
    </nav>
  );
}