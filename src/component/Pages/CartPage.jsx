import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CartPage.css";

const API_URL = "http://localhost:8080/api/cart";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCart(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemove = (productId) => {
    const newCart = cart.filter((item) => item.product._id !== productId);
    setCart(newCart);
  };

  const handleQuantityChange = (productId, value) => {
    const newCart = cart.map((item) =>
      item.product._id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + value) }
        : item
    );
    setCart(newCart);
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">
             E-CONNECT
          </Link>
        </div>

        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>

        <div className="nav-right">
          <Link to="/cart" className="cart-pill">
            🛒 Cart
            {cart.length > 0 && <span>{cart.length}</span>}
          </Link>
        </div>
      </nav>

      {/* ===== CART PAGE ===== */}
      <div className="cart-wrapper">
        <div className="cart-header">
          <Link to="/products" className="back-link">
            ← Continue Shopping
          </Link>
          <h1>Shopping Cart</h1>
        </div>

        <div className="cart-layout">
          {/* LEFT – CART ITEMS */}
          <div className="cart-items">
            {loading ? (
              <p className="empty">Loading...</p>
            ) : !cart.length ? (
              <p className="empty">Your cart is empty 😢</p>
            ) : (
              cart.map((item) => {
                const imageUrl = item.product.image
                  ? `http://localhost:8080/uploads/products/${item.product.image}`
                  : "/no-image.png";

                return (
                  <div className="cart-card" key={item.product._id}>
                    <img src={imageUrl} alt={item.product.name} />

                    <div className="cart-info">
                      <h3>{item.product.name}</h3>
                      <p className="category">{item.product.category}</p>
                      <p className="price">₹{item.product.price}</p>

                      <div className="qty">
                        <button onClick={() => handleQuantityChange(item.product._id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.product._id, 1)}>+</button>
                      </div>

                      <button
                        className="remove"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        🗑 Remove
                      </button>
                    </div>

                    <div className="item-total">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT – SUMMARY */}
          {!loading && cart.length > 0 && (
            <div className="summary">
              <h2>Order Summary</h2>

              <div className="row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>

              <div className="row total">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <button
                className="checkout"
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      products: cart.map((i) => ({
                        ...i.product,
                        quantity: i.quantity,
                      })),
                    },
                  })
                }
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}