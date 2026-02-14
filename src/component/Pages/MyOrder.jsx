import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyOrder.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("My Orders Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="myorders-page">
      <div className="myorders-header">
        <h2>My Orders</h2>
        <p className="myorders-subtitle">Track your orders and view details</p>
      </div>

      {loading ? (
        <div className="myorders-empty">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="myorders-empty">
          No orders yet.
          <Link className="myorders-shoplink" to="/products">
            Go Shopping →
          </Link>
        </div>
      ) : (
        <div className="myorders-grid">
          {orders.map((order) => (
            <div key={order._id} className="myorders-card">
              <div className="myorders-cardtop">
                <div>
                  <p className="myorders-label">Order Total</p>
                  <p className="myorders-total">₹{order.totalAmount}</p>
                </div>

                <span
                  className={`myorders-badge ${
                    (order.orderStatus || "").toLowerCase()
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="myorders-divider" />

              <div className="myorders-actions">
                <Link className="myorders-btn" to={`/order/${order._id}`}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}