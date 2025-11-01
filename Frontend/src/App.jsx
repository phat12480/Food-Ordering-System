import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage/LoginPage";
import HomePage from "./page/HomePage/HomePage";
import GuestHomePage from "./page/GuestHomePage/GuestHomePage";
import CartPage from "./page/CartPage/CartPage";
import OrderSuccessPage from "./page/OrderSuccessPage/OrderSuccessPage";
import OrderTrackingPage from "./page/OrderTrackingPage/OrderTrackingPage";
import OrderDetailPage from "./page/OrderDetailPage/OrderDetailPage";
import AllFoodsPage from "./page/AllFoodsPage/AllFoodsPage";
import OrderManagementPage from "./page/OrderManagementPage/OrderManagementPage";
import DashBoard from "./page/DashBoard/DashBoard";
import ProfilePage from "./page/ProfilePage/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestHomePage />} />{" "}
        <Route path="/home" element={<HomePage />} />{" "}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/menu" element={<AllFoodsPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/order-detail" element={<OrderDetailPage />} />
        <Route path="/orders" element={<OrderTrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/order-management" element={<OrderManagementPage />} />
        <Route
          path="*"
          element={
            <div style={{ padding: "40px", textAlign: "center" }}>
              <h1>404 - Trang không tồn tại</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
