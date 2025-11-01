// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ cartCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        {/* logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-icon">🍔</div>
          <span className="logo-text">FastFood</span>
        </div>

        {/* nav */}
        <nav className="nav">
          <a href="/" className="nav-link active">
            Trang chủ
          </a>
          <a href="/menu" className="nav-link">
            Đặt món
          </a>
          <a href="/orders" className="nav-link">
            Theo dõi đơn
          </a>
          <a href="/promotions" className="nav-link">
            Khuyến mãi
          </a>
        </nav>

        {/* actions: cart + auth */}
        <div className="header-actions">
          <button className="cart-btn" onClick={() => navigate("/cart")}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <div className="auth-btns">
            <button className="btn-login" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
            <button
              className="btn-signup"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
