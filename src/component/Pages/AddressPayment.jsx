import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddressPayment.css";

export default function AddressPayment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Products from cart or BuyNow
  const products = location.state?.products || [];

  // ---------------- ADDRESS ----------------
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ---------------- PAYMENT ----------------
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  // ---------------- TOTAL ----------------
  const totalAmount = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (products.length === 0) return alert("No products to order");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");

      const orderProducts = products.map((p) => ({
        _id: p._id,
        price: p.price,
        quantity: p.quantity || 1,
      }));

      await axios.post(
        "http://localhost:8080/api/orders/create",
        { products: orderProducts },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      console.error("Order Error:", err.response || err);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          {/* ADDRESS */}
          <section className="checkout-card">
            <h2>Delivery Address</h2>
            <div className="address-grid">
              {Object.keys(address).map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={address[field]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>

          {/* PAYMENT */}
          <section className="checkout-card">
            <h2>Payment Method</h2>
            <div className="payment-options">
              {["Cash on Delivery", "UPI", "Debit / Credit Card"].map(
                (method) => (
                  <label
                    key={method}
                    className={
                      paymentMethod === method ? "active" : ""
                    }
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    {method}
                  </label>
                )
              )}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <section className="checkout-card">
            <h2>Order Summary</h2>

            {products.map((p) => (
              <div key={p._id} className="summary-row">
                <div className="summary-left">
                  <img
                    src={`http://localhost:8080/uploads/products/${p.image}`}
                    alt={p.name}
                  />
                  <div>
                    <p className="product-name">{p.name}</p>
                    <small>Qty: {p.quantity}</small>
                  </div>
                </div>
                <p className="price">₹ {p.price * p.quantity}</p>
              </div>
            ))}

            <div className="summary-total">
              <span>Total</span>
              <span>₹ {totalAmount}</span>
            </div>

            <button
              className="place-order-btn"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}