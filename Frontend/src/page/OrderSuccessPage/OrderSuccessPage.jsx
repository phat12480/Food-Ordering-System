// src/page/OrderSuccessPage/OrderSuccessPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderSuccessPage.css";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check login
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setUserName(userData.name || "User");

    // Get order data from navigation state
    if (location.state && location.state.order) {
      setOrderData(location.state.order);
    } else {
      // Nếu không có data, redirect về home
      navigate("/");
    }
  }, [navigate, location]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-success-page">
      {/* HEADER */}
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate("/home")}>
            <div className="logo-icon">🍔</div>
            <span className="logo-text">FastFood</span>
          </div>

          <nav className="nav">
            <a href="/home" className="nav-link">
              Trang chủ
            </a>
            <a href="/menu" className="nav-link">
              Đặt món
            </a>
            <a href="/orders" className="nav-link">
              Theo dõi đơn
            </a>
            <a href="/cart" className="nav-link">
              Giỏ hàng
            </a>
          </nav>

          <div className="user-dropdown">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{userName}</span>
            <div className="dropdown-menu">
              <a href="/profile">👤 Trang cá nhân</a>
              <a href="/orders">📦 Đơn hàng của tôi</a>
              <hr />
              <a href="#logout" onClick={handleLogout}>
                🚪 Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="success-main">
        <div className="success-container">
          {/* Success Message */}
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h1 className="success-title">Thanh toán thành công!</h1>
            <p className="success-subtitle">
              Cảm ơn bạn đã đặt hàng. Chúng tôi đang chuẩn bị món ăn và sẽ giao
              đến bạn sớm nhất.
            </p>
            <div className="order-id">
              Mã đơn hàng:{" "}
              <strong>
                #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </strong>
            </div>
          </div>

          {/* Layout */}
          <div className="order-layout">
            {/* LEFT: Order Items */}
            <div className="order-items-section">
              <h2 className="section-title">📦 Danh sách món đã đặt</h2>
              {orderData.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">
                      {formatPrice(item.salePrice)} × {item.quantity}
                    </p>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.salePrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Delivery Info + Summary */}
            <div className="order-details-section">
              {/* Delivery Info */}
              <div className="delivery-info-card">
                <h2 className="section-title">📍 Thông tin giao hàng</h2>
                <div className="info-row">
                  <span className="info-label">Người nhận:</span>
                  <span className="info-value">{userName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Địa chỉ:</span>
                  <span className="info-value">{orderData.address}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Số điện thoại:</span>
                  <span className="info-value">{orderData.phone}</span>
                </div>
                {orderData.note && (
                  <div className="info-row">
                    <span className="info-label">Ghi chú:</span>
                    <span className="info-value">{orderData.note}</span>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="summary-card">
                <h2 className="section-title">💰 Tóm tắt đơn hàng</h2>
                <div className="summary-row">
                  <span>Tổng giá món:</span>
                  <span>{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí giao hàng:</span>
                  <span>{formatPrice(orderData.shippingFee)}</span>
                </div>
                <div className="summary-row">
                  <span>Thuế (10%):</span>
                  <span>{formatPrice(orderData.tax)}</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Tổng thanh toán:</span>
                  <span className="total-price">
                    {formatPrice(orderData.total)}
                  </span>
                </div>
                <div className="payment-info">
                  <span className="payment-label">Phương thức thanh toán:</span>
                  <span className="payment-value">
                    {orderData.paymentMethod === "COD"
                      ? "💵 Thanh toán khi nhận hàng (COD)"
                      : "💳 Thanh toán trực tuyến"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="btn-back-menu"
                  onClick={() => navigate("/home")}
                >
                  ← Quay lại trang chủ
                </button>
                <button
                  className="btn-track-order"
                  onClick={() => navigate("/orders")}
                >
                  📍 Theo dõi đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="footer-logo">
              <div className="logo-icon">🍔</div>
              <span>FastFood</span>
            </div>
            <p>
              Dịch vụ đặt đồ ăn nhanh, giao hàng tận nơi. Chất lượng - Nhanh
              chóng - Uy tín.
            </p>
          </div>

          <div className="footer-col">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li>
                <a href="/">Về chúng tôi</a>
              </li>
              <li>
                <a href="/">Đặt món</a>
              </li>
              <li>
                <a href="/">Theo dõi đơn hàng</a>
              </li>
              <li>
                <a href="/">Khuyến mãi</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>
                <a href="/">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="/">Chính sách giao hàng</a>
              </li>
              <li>
                <a href="/">Chính sách đổi trả</a>
              </li>
              <li>
                <a href="/">Điều khoản dịch vụ</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Liên hệ</h4>
            <ul>
              <li>📍 123 Nguyễn Huệ, Q.1, TP.HCM</li>
              <li>📞 1900-xxxx</li>
              <li>✉️ support@fastfood.vn</li>
              <li>🕐 8:00 - 22:00 hàng ngày</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 FastFood Online. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default OrderSuccessPage;
