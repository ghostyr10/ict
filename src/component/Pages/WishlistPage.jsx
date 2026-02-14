import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./WishlistPage.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((p) => p._id !== id));
    // backend remove API can be wired later
  };

  return (
    <>
      {/* ===== NAVBAR (SAME AS CART) ===== */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">
            ⬢ ShopHub
          </Link>
        </div>

        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/wishlist" className="active">
            Wishlist
          </Link>
          <Link to="/my-orders">My Orders</Link>
        </div>

        <div className="nav-right">
          <Link to="/cart" className="cart-pill">
            🛒 Cart
          </Link>
        </div>
      </nav>

      {/* ===== WISHLIST PAGE ===== */}
      <div className="wishlist-wrapper">
        <div className="wishlist-header">
          <Link to="/products" className="back-link">
            ← Continue Shopping
          </Link>
          <h1>My Wishlist</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty">
            <p>Your wishlist is empty 💔</p>
            <Link to="/products" className="shop-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((p) => {
              const imageUrl = p.image
                ? `http://localhost:8080/uploads/products/${p.image}`
                : "/no-image.png";

              return (
                <div className="wishlist-card" key={p._id}>
                  <img src={imageUrl} alt={p.name} />

                  <div className="wishlist-info">
                    <h3>{p.name}</h3>
                    <p className="price">₹{p.price}</p>

                    <div className="wishlist-actions">
                      <Link
                        to={`/product/${p._id}`}
                        className="view-btn"
                      >
                        View Product
                      </Link>

                      <button
                        className="remove"
                        onClick={() => handleRemove(p._id)}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}