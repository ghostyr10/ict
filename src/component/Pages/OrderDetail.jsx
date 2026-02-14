import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./OrderDetail.css";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`http://localhost:8080/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data);
      } catch (err) {
        console.error("Order detail error:", err.response || err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="od-page">
        <div className="od-wrap">
          <div className="od-card">
            <p className="od-loading">Loading order…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="od-page">
        <div className="od-wrap">
          <div className="od-card">
            <h2 className="od-title">Order Details</h2>
            <p className="od-muted">Order not found / failed to load.</p>

            <Link className="od-back" to="/my-orders">
              ← Back to My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safe reads (because backend can vary)
  const paymentStatus = order.paymentStatus || "PENDING";
  const orderStatus = order.orderStatus || "PLACED";
  const totalAmount =
    order.totalAmount ??
    order.total ??
    (order.products || []).reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
      0
    );

  const products = Array.isArray(order.products) ? order.products : [];

  return (
    <div className="od-page">
      <div className="od-wrap">
        {/* Header */}
        <div className="od-header">
          <div>
            <h2 className="od-title">Order Details</h2>
            <p className="od-sub">
              Order ID: <span className="od-mono">{order._id}</span>
            </p>
          </div>

          <Link className="od-back" to="/my-orders">
            ← Back
          </Link>
        </div>

        {/* Top summary */}
        <div className="od-grid">
          <div className="od-card">
            <h3 className="od-card-title">Status</h3>

            <div className="od-status-row">
              <span className={`od-pill ${orderStatus.toLowerCase()}`}>
                {orderStatus}
              </span>

              <span className={`od-pill ${paymentStatus.toLowerCase()}`}>
                {paymentStatus}
              </span>
            </div>

            <div className="od-kv">
              <div className="od-kv-row">
                <span>Total Amount</span>
                <b>₹ {totalAmount}</b>
              </div>
              <div className="od-kv-row">
                <span>Items</span>
                <b>{products.length}</b>
              </div>
              <div className="od-kv-row">
                <span>Placed</span>
                <b>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</b>
              </div>
            </div>
          </div>

          <div className="od-card">
            <h3 className="od-card-title">Delivery</h3>
            <p className="od-muted">
              (Optional) Show address here if you save address in the order.
            </p>

            <div className="od-kv">
              <div className="od-kv-row">
                <span>Name</span>
                <b>{order.address?.name || "—"}</b>
              </div>
              <div className="od-kv-row">
                <span>Phone</span>
                <b>{order.address?.phone || "—"}</b>
              </div>
              <div className="od-kv-row">
                <span>City</span>
                <b>{order.address?.city || "—"}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="od-card od-items">
          <h3 className="od-card-title">Items</h3>

          <div className="od-table">
            <div className="od-tr od-head">
              <div>Product</div>
              <div>Price</div>
              <div>Qty</div>
              <div>Total</div>
            </div>

            {products.map((item, idx) => {
              // ✅ IMPORTANT: item.product may be populated object OR only id OR missing
              const name =
                item?.product?.name ||
                item?.name ||
                item?.productName ||
                item?.product?._id ||
                item?.product ||
                "Unknown product";

              const image =
                item?.product?.image || item?.image || null;

              const price = Number(item?.price) || 0;
              const qty = Number(item?.quantity) || 1;
              const lineTotal = price * qty;

              return (
                <div className="od-tr" key={item._id || item.product || idx}>
                  <div className="od-prod">
                    <div className="od-img">
                      {image ? (
                        <img
                          src={`http://localhost:8080/uploads/products/${image}`}
                          alt={name}
                        />
                      ) : (
                        <div className="od-img-fallback">🛒</div>
                      )}
                    </div>

                    <div className="od-prod-info">
                      <div className="od-prod-name">{name}</div>
                      <div className="od-muted od-small">
                        {item?.product?._id || item?.product || ""}
                      </div>
                    </div>
                  </div>

                  <div>₹ {price}</div>
                  <div>{qty}</div>
                  <div className="od-strong">₹ {lineTotal}</div>
                </div>
              );
            })}
          </div>

          <div className="od-footer">
            <div className="od-footer-row">
              <span>Grand Total</span>
              <b>₹ {totalAmount}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}