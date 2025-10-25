import React from "react";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Xin chào, {user.name}!</p>
      <p>Role: {user.role}</p>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default DashBoard;
