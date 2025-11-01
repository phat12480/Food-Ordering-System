// src/page/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvan.a@gmail.com",
    phone: "0912345678",
    gender: "Nam",
    dob: "1998-05-15",
    defaultAddress: 1,
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Nhà",
      address: "123 Đường Nguyễn Huệ, Q.1, TP.HCM",
      isDefault: true,
    },
    {
      id: 2,
      label: "Công ty",
      address: "456 Đường Trần Hưng Đạo, Q.5, TP.HCM",
      isDefault: false,
    },
  ]);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(userInfo);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });
  const [activeTab, setActiveTab] = useState("info");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setUserName(userData.name || "User");
  }, [navigate]);

  const showMessage = (type, text) => {
    setMessages({ type, text });
    setTimeout(() => setMessages({}), 3000);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    setUserInfo(editForm);
    setEditMode(false);
    showMessage("success", "✓ Lưu thay đổi thành công!");
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      showMessage("error", "✗ Mật khẩu xác nhận không khớp");
      return;
    }
    if (passwordForm.new.length < 6) {
      showMessage("error", "✗ Mật khẩu mới phải ít nhất 6 ký tự");
      return;
    }
    showMessage("success", "✓ Đổi mật khẩu thành công!");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      showMessage("error", "✗ Vui lòng điền đầy đủ thông tin");
      return;
    }
    const newId = Math.max(...addresses.map((a) => a.id), 0) + 1;
    setAddresses([
      ...addresses,
      { id: newId, ...newAddress, isDefault: false },
    ]);
    setNewAddress({ label: "", address: "" });
    showMessage("success", "✓ Thêm địa chỉ thành công!");
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showMessage("success", "✓ Xóa địa chỉ thành công!");
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    setUserInfo((prev) => ({ ...prev, defaultAddress: id }));
    showMessage("success", "✓ Đặt địa chỉ mặc định thành công!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="profile-page">
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
            <a href="/order-management" className="nav-link">
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
            <span className="user-name-header">{userName}</span>
            <div className="dropdown-menu">
              <a href="/profile" className="active">
                👤 Trang cá nhân
              </a>
              <a href="/order-management">📦 Đơn hàng của tôi</a>
              <hr />
              <a href="#logout" onClick={handleLogout}>
                🚪 Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Message Notification */}
      {messages.text && (
        <div className={`message-notification ${messages.type}`}>
          <span className="message-icon">
            {messages.type === "success" ? "✓" : "✗"}
          </span>
          {messages.text}
        </div>
      )}

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-container">
          <h1 className="page-title">👤 Trang cá nhân</h1>

          <div className="content-wrapper">
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-card">
                <div className="avatar-section">
                  <div className="avatar">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="user-name">{userInfo.name}</h3>
                  <p className="user-role">Khách hàng</p>
                  <button className="avatar-btn">✎ Thay ảnh đại diện</button>
                </div>

                <nav className="sidebar-menu">
                  <button
                    className={`menu-item ${
                      activeTab === "info" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("info")}
                  >
                    👤 Thông tin cá nhân
                  </button>
                  <button
                    className={`menu-item ${
                      activeTab === "address" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("address")}
                  >
                    📍 Địa chỉ giao hàng
                  </button>
                  <button
                    className={`menu-item ${
                      activeTab === "password" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    🔐 Đổi mật khẩu
                  </button>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Đăng xuất
                </button>
              </div>
            </aside>

            {/* Main Section */}
            <section className="main-section">
              {/* Tab: Thông Tin Cá Nhân */}
              {activeTab === "info" && (
                <div className="tab-content">
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">Thông Tin Cá Nhân</h2>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditMode(!editMode);
                          setEditForm(userInfo);
                        }}
                      >
                        ✎ {editMode ? "Hủy" : "Chỉnh sửa"}
                      </button>
                    </div>

                    {!editMode ? (
                      <div className="info-grid">
                        <div className="info-item">
                          <label className="info-label">Họ và tên</label>
                          <p className="info-value">{userInfo.name}</p>
                        </div>
                        <div className="info-item">
                          <label className="info-label">Email</label>
                          <p className="info-value">{userInfo.email}</p>
                        </div>
                        <div className="info-item">
                          <label className="info-label">Số điện thoại</label>
                          <p className="info-value">{userInfo.phone}</p>
                        </div>
                        <div className="info-item">
                          <label className="info-label">Giới tính</label>
                          <p className="info-value">{userInfo.gender}</p>
                        </div>
                        <div className="info-item">
                          <label className="info-label">Ngày sinh</label>
                          <p className="info-value">
                            {new Date(userInfo.dob).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="form-container">
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label">Họ và tên</label>
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Số điện thoại</label>
                            <input
                              type="tel"
                              name="phone"
                              value={editForm.phone}
                              onChange={handleEditChange}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Giới tính</label>
                            <select
                              name="gender"
                              value={editForm.gender}
                              onChange={handleEditChange}
                              className="form-input"
                            >
                              <option>Nam</option>
                              <option>Nữ</option>
                              <option>Khác</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Ngày sinh</label>
                            <input
                              type="date"
                              name="dob"
                              value={editForm.dob}
                              onChange={handleEditChange}
                              className="form-input"
                            />
                          </div>
                        </div>
                        <div className="form-actions">
                          <button
                            onClick={handleSaveChanges}
                            className="btn btn-primary"
                          >
                            💾 Lưu thay đổi
                          </button>
                          <button
                            onClick={() => setEditMode(false)}
                            className="btn btn-secondary"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Địa Chỉ Giao Hàng */}
              {activeTab === "address" && (
                <div className="tab-content">
                  <div className="card">
                    <h2 className="card-title">Địa Chỉ Giao Hàng</h2>
                    <div className="address-list">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="address-item">
                          <div className="address-content">
                            <div className="address-header">
                              <span className="address-label">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="badge-default">
                                  ⭐ Mặc định
                                </span>
                              )}
                            </div>
                            <p className="address-value">{addr.address}</p>
                          </div>
                          <div className="address-actions">
                            <button className="action-link">Sửa</button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="action-link delete"
                            >
                              Xóa
                            </button>
                          </div>
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="set-default-btn"
                            >
                              Đặt làm mặc định
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card card-green">
                    <h3 className="card-title">➕ Thêm Địa Chỉ Mới</h3>
                    <div className="form-container">
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">
                            Nhãn (vd: Nhà, Công ty)
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập nhãn địa chỉ"
                            value={newAddress.label}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                label: e.target.value,
                              })
                            }
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Địa chỉ đầy đủ</label>
                          <input
                            type="text"
                            placeholder="Nhập địa chỉ đầy đủ"
                            value={newAddress.address}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                address: e.target.value,
                              })
                            }
                            className="form-input"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleAddAddress}
                        className="btn btn-primary"
                      >
                        ➕ Thêm địa chỉ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Đổi Mật Khẩu */}
              {activeTab === "password" && (
                <div className="tab-content">
                  <div className="card password-card">
                    <h2 className="card-title">🔐 Đổi Mật Khẩu</h2>
                    <div className="form-container">
                      <div className="form-group">
                        <label className="form-label">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          value={passwordForm.current}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              current: e.target.value,
                            })
                          }
                          className="form-input"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mật khẩu mới</label>
                        <input
                          type="password"
                          value={passwordForm.new}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              new: e.target.value,
                            })
                          }
                          className="form-input"
                          placeholder="Nhập mật khẩu mới"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirm}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirm: e.target.value,
                            })
                          }
                          className="form-input"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </div>
                      <button
                        onClick={handleChangePassword}
                        className="btn btn-primary"
                      >
                        🔐 Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
