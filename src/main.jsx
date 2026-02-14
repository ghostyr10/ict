import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===== GLOBAL CSS ===== */
import "./index.css";

/* ===== AUTH ===== */
import Login from "./component/LS/Login.jsx";
import Signup from "./component/LS/Sign.jsx";

/* ===== INTRO + HOME ===== */
import Intro from "./component/Intro.jsx"; // ✅ intro FIRST
import Home from "./component/Pages/Home/Home.jsx";

/* ===== PRODUCT ===== */
import ProductListing from "./component/Pages/ProductListing.jsx";
import ProductDetail from "./component/pages/ProductDetail.jsx";

/* ===== USER ===== */
import CartPage from "./component/Pages/CartPage.jsx";
import WishlistPage from "./component/Pages/WishlistPage.jsx";
import ProfilePage from "./component/profile/ProfilePage.jsx";

/* ===== ORDERS ===== */
import MyOrder from "./component/Pages/MyOrder.jsx";
import OrderDetail from "./component/Pages/OrderDetail.jsx";

/* ===== SELLER ===== */
import SellerPanel from "./component/Seller/Sellp.jsx";
import Seller from "./component/Seller/Seller.jsx";
/* ===== ADMIN ===== */
import AdminDashboard from "./component/Admin/AdminDashboard.jsx";
import AdminAddProduct from "./component/Admin/AdminAddProduct.jsx";
import AdminBanner from "./component/Admin/AdminBanner.jsx";
import AddressPayment from "./component/pages/AddressPayment.jsx";
/* ===== ROUTE GUARDS ===== */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");
  if (!token) return <Navigate to="/login" replace />;
  if (isAdmin !== "true") return <Navigate to="/" replace />;
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ===== INTRO FIRST ===== */}
        <Route path="/" element={<Intro />} />

        {/* ===== AUTH ===== */}
        <Route path="/login" element={<Login />} />
         <Route path="/sell" element={<Seller />} />
        <Route path="/sign" element={<Signup />} />
   <Route path="/checkout" element={<AddressPayment />} />
        {/* ===== HOME ===== */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        {/* ===== PRODUCTS ===== */}
        <Route
          path="/products"
          element={
            <RequireAuth>
              <ProductListing />
            </RequireAuth>
          }
        />

        <Route
          path="/product/:id"
          element={
            <RequireAuth>
              <ProductDetail />
            </RequireAuth>
          }
        />

        {/* ===== USER ===== */}
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <CartPage />
            </RequireAuth>
          }
        />

        <Route
          path="/wishlist"
          element={
            <RequireAuth>
              <WishlistPage />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        {/* ===== ORDERS ===== */}
        <Route
          path="/my-orders"
          element={
            <RequireAuth>
              <MyOrder />
            </RequireAuth>
          }
        />

        <Route
          path="/order/:id"
          element={
            <RequireAuth>
              <OrderDetail />
            </RequireAuth>
          }
        />

        {/* ===== SELLER ===== */}
        <Route
          path="/sellp"
          element={
            <RequireAuth>
              <SellerPanel />
            </RequireAuth>
          }
        />

        {/* ===== ADMIN ===== */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <RequireAdmin>
              <AdminAddProduct />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/banner"
          element={
            <RequireAdmin>
              <AdminBanner />
            </RequireAdmin>
          }
        />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);