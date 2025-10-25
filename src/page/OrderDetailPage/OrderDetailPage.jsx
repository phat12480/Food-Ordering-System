// src/page/OrderDetailPage/OrderDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderDetailPage.css";

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [userName, setUserName] = useState("");

  // Mock order data nếu không có từ navigation
  const mockOrderData = {
    orderId: "FD" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    status: "Đang giao hàng",
    statusColor: "#2ecc71",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 1,
        name: "Combo Burger Phô Mai",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        quantity: 2,
        salePrice: 69000,
      },
      {
        id: 2,
        name: "Pizza Hải Sản",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
        quantity: 1,
        salePrice: 149000,
      },
    ],
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "0901234567",
    note: "Giao trước cổng chính",
    paymentMethod: "COD",
    subtotal: 287000,
    shippingFee: 15000,
    tax: 28700,
    total: 330700,
    shipper: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      vehicle: "Honda Wave • 59A-12345",
    },
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setUserName(userData.name || "User");

    // Get order from navigation state or use mock
    if (location.state && location.state.order) {
      setOrderData(location.state.order);
    } else {
      setOrderData(mockOrderData);
    }
  }, [navigate, location]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleReorder = () => {
    // Add items to cart
    localStorage.setItem("cart", JSON.stringify(orderData.items));
    navigate("/cart");
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-detail-page">
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
      <div className="detail-main">
        <div className="detail-container">
          {/* Header Info */}
          <div className="order-header-card">
            <div className="order-header-left">
              <h1 className="order-title">Chi tiết đơn hàng</h1>
              <div className="order-meta">
                <span className="order-id">
                  Mã đơn: <strong>#{orderData.orderId}</strong>
                </span>
                <span className="order-date">
                  📅 {formatDate(orderData.createdAt)}
                </span>
              </div>
            </div>
            <div className="order-header-right">
              <span
                className="order-status"
                style={{ backgroundColor: orderData.statusColor }}
              >
                {orderData.status}
              </span>
            </div>
          </div>

          {/* Layout */}
          <div className="detail-layout">
            {/* LEFT: Order Items */}
            <div className="items-section">
              <div className="section-card">
                <h2 className="section-title">📦 Danh sách món ăn</h2>
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

              {/* Delivery Address */}
              <div className="section-card">
                <h2 className="section-title">📍 Địa chỉ giao hàng</h2>
                <div className="info-group">
                  <div className="info-row">
                    <span className="info-icon">👤</span>
                    <div className="info-content">
                      <span className="info-label">Người nhận</span>
                      <span className="info-value">{userName}</span>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📍</span>
                    <div className="info-content">
                      <span className="info-label">Địa chỉ</span>
                      <span className="info-value">{orderData.address}</span>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📞</span>
                    <div className="info-content">
                      <span className="info-label">Số điện thoại</span>
                      <span className="info-value">{orderData.phone}</span>
                    </div>
                  </div>
                  {orderData.note && (
                    <div className="info-row">
                      <span className="info-icon">📝</span>
                      <div className="info-content">
                        <span className="info-label">Ghi chú</span>
                        <span className="info-value">{orderData.note}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Summary & Info */}
            <div className="summary-section">
              {/* Shipper Info */}
              {orderData.shipper && (
                <div className="section-card">
                  <h2 className="section-title">🚗 Thông tin tài xế</h2>
                  <div className="shipper-info">
                    <div className="shipper-detail">
                      <span className="shipper-label">Tên tài xế:</span>
                      <span className="shipper-value">
                        {orderData.shipper.name}
                      </span>
                    </div>
                    <div className="shipper-detail">
                      <span className="shipper-label">Phương tiện:</span>
                      <span className="shipper-value">
                        {orderData.shipper.vehicle}
                      </span>
                    </div>
                    <button
                      className="btn-call-shipper"
                      onClick={() =>
                        (window.location.href = `tel:${orderData.shipper.phone}`)
                      }
                    >
                      📞 Gọi tài xế
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="section-card">
                <h2 className="section-title">💰 Thanh toán</h2>
                <div className="summary-rows">
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
                  <div className="summary-row total-row">
                    <span>Tổng cộng:</span>
                    <span className="total-amount">
                      {formatPrice(orderData.total)}
                    </span>
                  </div>
                  <div className="payment-method-info">
                    <span className="payment-label">
                      Phương thức thanh toán:
                    </span>
                    <span className="payment-value">
                      {orderData.paymentMethod === "COD"
                        ? "💵 COD"
                        : "💳 Online"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="btn-track"
                  onClick={() => navigate("/orders")}
                >
                  📍 Theo dõi đơn hàng
                </button>
                <button className="btn-reorder" onClick={handleReorder}>
                  🔄 Đặt lại đơn này
                </button>
                <button className="btn-back" onClick={() => navigate("/home")}>
                  ← Quay lại trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
