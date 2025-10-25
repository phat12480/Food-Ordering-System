// src/page/OrderTrackingPage/OrderTrackingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderTrackingPage.css";

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [currentStatus, setCurrentStatus] = useState(2); // 0-3: Confirmed -> Preparing -> Delivering -> Delivered

  // Mock data đơn hàng
  const orderData = {
    orderId: "FD" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    total: 249000,
    paymentMethod: "COD",
    createdAt: new Date().toISOString(),
    eta: "15-20 phút",
  };

  // Mock data shipper
  const shipperData = {
    name: "Nguyễn Văn A",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=2ecc71&color=fff&size=200",
    phone: "0901234567",
    licensePlate: "59A-12345",
    vehicle: "Honda Wave",
  };

  // Mock locations
  const locations = {
    restaurant: {
      lat: 10.762622,
      lng: 106.660172,
      name: "FastFood Restaurant",
    },
    shipper: { lat: 10.772622, lng: 106.670172, name: "Shipper" },
    customer: { lat: 10.782622, lng: 106.680172, name: "Địa chỉ giao hàng" },
  };

  const statusSteps = [
    { id: 0, label: "Đã xác nhận", icon: "✅" },
    { id: 1, label: "Đang chuẩn bị", icon: "👨‍🍳" },
    { id: 2, label: "Đang giao hàng", icon: "🚗" },
    { id: 3, label: "Đã giao xong", icon: "🎉" },
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setUserName(userData.name || "User");

    // Simulate status progression
    const interval = setInterval(() => {
      setCurrentStatus((prev) => (prev < 3 ? prev + 1 : prev));
    }, 10000); // Change status every 10 seconds for demo

    return () => clearInterval(interval);
  }, [navigate]);

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

  const handleCallShipper = () => {
    window.location.href = `tel:${shipperData.phone}`;
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 0:
        return "Đơn hàng đã được xác nhận";
      case 1:
        return "Nhà hàng đang chuẩn bị món";
      case 2:
        return "Shipper đang trên đường giao hàng";
      case 3:
        return "Đơn hàng đã được giao thành công";
      default:
        return "";
    }
  };

  return (
    <div className="order-tracking-page">
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
            <a href="/orders" className="nav-link active">
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
      <div className="tracking-main">
        <div className="tracking-container">
          <h1 className="page-title">📍 Theo dõi đơn hàng</h1>

          <div className="tracking-layout">
            {/* LEFT: Google Map */}
            <div className="map-section">
              <div className="map-container">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31355.08!2d${locations.shipper.lng}!3d${locations.shipper.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzQ1LjQiTiAxMDbCsDM5JzM2LjYiRQ!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Order Tracking Map"
                ></iframe>
                <div className="eta-badge">⏱️ Dự kiến: {orderData.eta}</div>
              </div>

              {/* Map Legend */}
              <div className="map-legend">
                <div className="legend-item">
                  <span className="legend-marker restaurant">📍</span>
                  <span>Cửa hàng</span>
                </div>
                <div className="legend-item">
                  <span className="legend-marker shipper">🚗</span>
                  <span>Shipper</span>
                </div>
                <div className="legend-item">
                  <span className="legend-marker customer">🏠</span>
                  <span>Địa chỉ giao hàng</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Info Cards */}
            <div className="info-section">
              {/* Shipper Info */}
              <div className="shipper-card">
                <h2 className="section-title">🚗 Thông tin tài xế</h2>
                <div className="shipper-info">
                  <img
                    src={shipperData.avatar}
                    alt={shipperData.name}
                    className="shipper-avatar"
                  />
                  <div className="shipper-details">
                    <h3 className="shipper-name">{shipperData.name}</h3>
                    <p className="shipper-vehicle">
                      {shipperData.vehicle} • {shipperData.licensePlate}
                    </p>
                    <div className="shipper-status">
                      <span className="status-badge">{getStatusText()}</span>
                    </div>
                  </div>
                </div>
                <button className="btn-call" onClick={handleCallShipper}>
                  📞 Gọi tài xế
                </button>
              </div>

              {/* Order Status Timeline */}
              <div className="status-card">
                <h2 className="section-title">📋 Trạng thái đơn hàng</h2>
                <div className="status-timeline">
                  {statusSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`timeline-step ${
                        currentStatus >= step.id ? "active" : ""
                      } ${currentStatus === step.id ? "current" : ""}`}
                    >
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-content">
                        <div className="step-label">{step.label}</div>
                        {currentStatus === step.id && (
                          <div className="step-time">Đang thực hiện...</div>
                        )}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className="step-line"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="summary-card">
                <h2 className="section-title">💰 Tóm tắt đơn hàng</h2>
                <div className="summary-row">
                  <span>Mã đơn hàng:</span>
                  <span className="order-id">#{orderData.orderId}</span>
                </div>
                <div className="summary-row">
                  <span>Tổng tiền:</span>
                  <span className="total-price">
                    {formatPrice(orderData.total)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Thanh toán:</span>
                  <span>
                    {orderData.paymentMethod === "COD" ? "💵 COD" : "💳 Online"}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Thời gian đặt:</span>
                  <span>{formatDate(orderData.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="btn-view-detail"
                  onClick={() => {
                    window.location.href = "/order-detail"; // ← Dùng native navigation
                  }}
                >
                  📄 Xem chi tiết đơn hàng
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

export default OrderTrackingPage;
