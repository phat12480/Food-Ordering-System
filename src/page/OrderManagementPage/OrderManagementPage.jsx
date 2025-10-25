// src/page/OrderManagementPage/OrderManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderManagementPage.css";

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Mock orders data
  const mockOrders = [
    {
      id: "FD12345",
      date: "2025-01-08 14:30",
      total: 330700,
      status: "delivering",
      statusText: "Đang giao hàng",
      statusColor: "#2ecc71",
      items: [
        {
          id: 1,
          name: "Combo Burger Phô Mai",
          quantity: 2,
          price: 69000,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
        },
        {
          id: 2,
          name: "Pizza Hải Sản",
          quantity: 1,
          price: 149000,
          image:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200",
        },
      ],
      address: "123 Nguyễn Huệ, Q.1, TP.HCM",
      phone: "0901234567",
      paymentMethod: "COD",
      rated: false,
    },
    {
      id: "FD12344",
      date: "2025-01-07 12:15",
      total: 247000,
      status: "delivered",
      statusText: "Đã giao",
      statusColor: "#10b981",
      items: [
        {
          id: 3,
          name: "Gà Rán Giòn Tan",
          quantity: 1,
          price: 99000,
          image:
            "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200",
        },
        {
          id: 5,
          name: "Phở Bò Đặc Biệt",
          quantity: 2,
          price: 49000,
          image:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200",
        },
      ],
      address: "456 Lê Lợi, Q.1, TP.HCM",
      phone: "0901234567",
      paymentMethod: "Online",
      rated: true,
      review: { rating: 5, comment: "Rất ngon, giao hàng nhanh!" },
    },
    {
      id: "FD12343",
      date: "2025-01-06 18:45",
      total: 189000,
      status: "cancelled",
      statusText: "Đã hủy",
      statusColor: "#ef4444",
      items: [
        {
          id: 4,
          name: "Mì Ý Bò Bằm",
          quantity: 2,
          price: 59000,
          image:
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200",
        },
      ],
      address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
      phone: "0901234567",
      paymentMethod: "COD",
      rated: false,
      cancelReason: "Khách hàng thay đổi ý định",
    },
    {
      id: "FD12342",
      date: "2025-01-05 10:20",
      total: 415000,
      status: "delivered",
      statusText: "Đã giao",
      statusColor: "#10b981",
      items: [
        {
          id: 2,
          name: "Pizza Hải Sản",
          quantity: 2,
          price: 149000,
          image:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200",
        },
        {
          id: 6,
          name: "Trà Sữa Trân Châu",
          quantity: 2,
          price: 35000,
          image:
            "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=200",
        },
      ],
      address: "321 Võ Văn Tần, Q.3, TP.HCM",
      phone: "0901234567",
      paymentMethod: "COD",
      rated: false,
    },
  ];

  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);

  const filters = [
    { id: "all", label: "Tất cả đơn", icon: "📋", count: orders.length },
    {
      id: "delivering",
      label: "Đang giao",
      icon: "🚚",
      count: orders.filter((o) => o.status === "delivering").length,
    },
    {
      id: "delivered",
      label: "Đã giao",
      icon: "✅",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      id: "cancelled",
      label: "Đã hủy",
      icon: "❌",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setUserName(userData.name || "User");
  }, [navigate]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === selectedFilter)
      );
    }
  }, [selectedFilter, orders]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    if (order.review) {
      setRating(order.review.rating);
      setComment(order.review.comment);
    } else {
      setRating(0);
      setComment("");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setRating(0);
    setComment("");
  };

  const handleReorder = (order) => {
    const cartItems = order.items.map((item) => ({
      ...item,
      salePrice: item.price,
      quantity: item.quantity,
    }));
    localStorage.setItem("cart", JSON.stringify(cartItems));
    navigate("/cart");
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    // Update order with review
    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          rated: true,
          review: { rating, comment },
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    alert("Cảm ơn bạn đã đánh giá!");
    handleCloseModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivering":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "🕓";
    }
  };

  return (
    <div className="order-management-page">
      {/* HEADER */}
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-icon">🍔</div>
            <span className="logo-text">FastFood</span>
          </div>

          <nav className="nav">
            <a href="/" className="nav-link">
              Trang chủ
            </a>
            <a href="/menu" className="nav-link">
              Đặt món
            </a>
            <a href="/order-management" className="nav-link active">
              Quản lý đơn hàng
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
              <a href="/order-management">📦 Đơn hàng của tôi</a>
              <hr />
              <a href="#logout" onClick={handleLogout}>
                🚪 Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="management-main">
        <div className="management-container">
          <h1 className="page-title">📦 Quản lý đơn hàng</h1>

          {/* Filter Bar */}
          <div className="filter-bar">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${
                  selectedFilter === filter.id ? "active" : ""
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-label">{filter.label}</span>
                <span className="filter-count">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="empty-orders">
                <p>😔 Không có đơn hàng nào</p>
                <button
                  className="btn-order-now"
                  onClick={() => navigate("/menu")}
                >
                  Đặt món ngay
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-header-left">
                      <span className="order-id">
                        Mã: <strong>#{order.id}</strong>
                      </span>
                      <span className="order-date">📅 {order.date}</span>
                    </div>
                    <div className="order-header-right">
                      <span
                        className="order-status"
                        style={{ backgroundColor: order.statusColor }}
                      >
                        {getStatusIcon(order.status)} {order.statusText}
                      </span>
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={item.image}
                          alt={item.name}
                          className="item-thumb"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="more-items">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="order-info">
                      <p className="order-total">
                        Tổng: <strong>{formatPrice(order.total)}</strong>
                      </p>
                      <p className="order-payment">💳 {order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button
                      className="btn-view-detail"
                      onClick={() => handleViewDetail(order)}
                    >
                      📄 Xem chi tiết
                    </button>
                    {order.status === "delivered" && !order.rated && (
                      <button
                        className="btn-rate"
                        onClick={() => handleViewDetail(order)}
                      >
                        ⭐ Đánh giá
                      </button>
                    )}
                    <button
                      className="btn-reorder"
                      onClick={() => handleReorder(order)}
                    >
                      🔄 Mua lại
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ✕
            </button>

            <h2 className="modal-title">
              Chi tiết đơn hàng #{selectedOrder.id}
            </h2>

            <div className="modal-section">
              <h3>📦 Danh sách món</h3>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="modal-item">
                  <img src={item.image} alt={item.name} />
                  <div className="modal-item-info">
                    <p className="modal-item-name">{item.name}</p>
                    <p className="modal-item-price">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="modal-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="modal-section">
              <h3>📍 Thông tin giao hàng</h3>
              <p>Địa chỉ: {selectedOrder.address}</p>
              <p>SĐT: {selectedOrder.phone}</p>
              <p>Thanh toán: {selectedOrder.paymentMethod}</p>
            </div>

            <div className="modal-section">
              <h3>💰 Tổng thanh toán</h3>
              <p className="modal-total">{formatPrice(selectedOrder.total)}</p>
            </div>

            {selectedOrder.status === "delivered" && (
              <div className="modal-section">
                <h3>⭐ Đánh giá</h3>
                {selectedOrder.rated ? (
                  <div className="review-display">
                    <p className="review-stars">
                      {"⭐".repeat(selectedOrder.review.rating)}
                    </p>
                    <p className="review-comment">
                      {selectedOrder.review.comment}
                    </p>
                  </div>
                ) : (
                  <div className="review-form">
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${rating >= star ? "filled" : ""}`}
                          onClick={() => setRating(star)}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <textarea
                      placeholder="Nhập bình luận của bạn..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                    />
                    <button
                      className="btn-submit-review"
                      onClick={handleSubmitReview}
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
