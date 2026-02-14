import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Seller.css";

const API = "http://localhost:8080/api/seller";
const UPLOADS = "http://localhost:8080/uploads/products";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export default function Seller() {
  const [view, setView] = useState("dashboard"); // dashboard | add | products | orders
  const [loading, setLoading] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // add product form (seller normal add -> pending approval)
  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState("");

  // edit request modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState("");

  const canAdd = useMemo(() => form.name && form.category && form.price && form.quantity, [form]);

  // load by view
  useEffect(() => {
    if (view === "dashboard") loadDashboard();
    if (view === "products") loadMyProducts();
    if (view === "orders") loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/dashboard`, { headers: authHeader() });
      setDashboard(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadMyProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/my-products`, { headers: authHeader() });
      setMyProducts(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/orders-simple`, { headers: authHeader() });
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ---------- add product ----------
  const onAddChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const pickAddImage = (file) => {
    setAddImage(file || null);
    if (!file) return setAddPreview("");
    setAddPreview(URL.createObjectURL(file));
  };

  const submitAdd = async () => {
    if (!canAdd) return alert("Fill Name, Category, Price, Quantity");

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (addImage) fd.append("image", addImage);

      // seller add route is /products/add in your backend
      await axios.post(`http://localhost:8080/products/add`, fd, { headers: authHeader() });

      alert("Submitted for admin approval ✅");
      setForm({ name: "", category: "", subCategory: "", price: "", quantity: "", description: "" });
      setAddImage(null);
      setAddPreview("");
      setView("products");
      loadMyProducts();
    } catch (e) {
      console.error(e);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // ---------- edit request ----------
  const openEdit = (p) => {
    setEditForm({
      _id: p._id,
      name: p.name,
      category: p.category,
      subCategory: p.subCategory || "",
      price: p.price,
      quantity: p.quantity,
      description: p.description || "",
      currentImage: p.image || null,
      status: p.status,
    });

    setEditImage(null);
    setEditPreview(p.image ? `${UPLOADS}/${p.image}` : "");
    setEditOpen(true);
  };

  const onEditChange = (e) => setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const pickEditImage = (file) => {
    setEditImage(file || null);
    if (!file) {
      setEditPreview(editForm?.currentImage ? `${UPLOADS}/${editForm.currentImage}` : "");
      return;
    }
    setEditPreview(URL.createObjectURL(file));
  };

  const sendUpdateRequest = async () => {
    if (!editForm?._id) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", editForm.name);
      fd.append("category", editForm.category);
      fd.append("subCategory", editForm.subCategory);
      fd.append("price", editForm.price);
      fd.append("quantity", editForm.quantity);
      fd.append("description", editForm.description);
      if (editImage) fd.append("image", editImage);

      await axios.put(`${API}/my-products/${editForm._id}/request-update`, fd, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });

      alert("Update request sent to admin ✅");
      setEditOpen(false);
      loadMyProducts();
    } catch (e) {
      console.error(e);
      alert("Update request failed");
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = async (productId) => {
    if (!window.confirm("Send delete request to admin?")) return;

    try {
      setLoading(true);
      await axios.put(`${API}/my-products/${productId}/request-delete`, {}, { headers: authHeader() });
      alert("Delete request sent ✅");
    } catch (e) {
      console.error(e);
      alert("Delete request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sp-shell">
      <header className="sp-topbar">
        <div className="sp-brand">
          <span className="sp-dot" />
          Seller Panel <span className="sp-sub">E-Collect</span>
        </div>

        <div className="sp-top-actions">
          <button className="sp-btn ghost" onClick={() => setView("add")}>+ Add</button>
          <button
            className="sp-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="sp-body">
        <aside className="sp-sidebar">
          <button className={`sp-nav ${view === "dashboard" ? "active" : ""}`} onClick={() => setView("dashboard")}>
            📊 Analytics
          </button>
          <button className={`sp-nav ${view === "add" ? "active" : ""}`} onClick={() => setView("add")}>
            ➕ Add Product
          </button>
          <button className={`sp-nav ${view === "products" ? "active" : ""}`} onClick={() => setView("products")}>
            📦 My Products
          </button>
          <button className={`sp-nav ${view === "orders" ? "active" : ""}`} onClick={() => setView("orders")}>
            🧾 Orders
          </button>

          {loading && <div className="sp-chip">Loading…</div>}
        </aside>

        <main className="sp-content">
          {/* DASHBOARD */}
          {view === "dashboard" && (
            <>
              <div className="sp-head">
                <div>
                  <h1 className="sp-title">Seller Dashboard</h1>
                  <p className="sp-muted">Revenue + sold quantity is calculated from orders (backend).</p>
                </div>
              </div>

              <div className="sp-grid">
                <Card label="Total Products" value={dashboard?.totalProducts} icon="📦" />
                <Card label="Approved" value={dashboard?.approvedProducts} icon="✅" />
                <Card label="Pending" value={dashboard?.pendingProducts} icon="⏳" />
                <Card label="Rejected" value={dashboard?.rejectedProducts} icon="❌" />

                <div className="sp-card sp-wide">
                  <div className="sp-card-row">
                    <div>
                      <p className="sp-kicker">Total Sold Qty</p>
                      <h2 className="sp-num">{dashboard?.totalSoldQty ?? "—"}</h2>
                    </div>
                    <div className="sp-icon">📈</div>
                  </div>

                  <div className="sp-divider" />

                  <div className="sp-card-row">
                    <div>
                      <p className="sp-kicker">Total Revenue</p>
                      <h2 className="sp-num">₹ {dashboard?.totalRevenue ?? "—"}</h2>
                    </div>
                    <div className="sp-icon">💰</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ADD PRODUCT */}
          {view === "add" && (
            <div className="sp-form-grid">
              <div className="sp-card">
                <h2 className="sp-h2">Add Product (Approval Needed)</h2>

                <div className="sp-field">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={onAddChange} placeholder="Product name" />
                </div>

                <div className="sp-field">
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={onAddChange} placeholder="Category" />
                </div>

                <div className="sp-field">
                  <label>Subcategory</label>
                  <input name="subCategory" value={form.subCategory} onChange={onAddChange} placeholder="Subcategory" />
                </div>

                <div className="sp-two">
                  <div className="sp-field">
                    <label>Price</label>
                    <input name="price" value={form.price} onChange={onAddChange} placeholder="₹" />
                  </div>
                  <div className="sp-field">
                    <label>Quantity</label>
                    <input name="quantity" value={form.quantity} onChange={onAddChange} placeholder="Qty" />
                  </div>
                </div>

                <div className="sp-field">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={onAddChange} placeholder="Short description" />
                </div>

                <button className="sp-btn" disabled={!canAdd || loading} onClick={submitAdd}>
                  {loading ? "Submitting…" : "Submit for Approval"}
                </button>
              </div>

              <div className="sp-card">
                <h2 className="sp-h2">Image</h2>

                <div className="sp-preview">
                  <img
                    src={addPreview || "/no-image.png"}
                    alt="preview"
                   
                  />
                </div>

                <label className="sp-file">
                  <input type="file" accept="image/*" onChange={(e) => pickAddImage(e.target.files?.[0])} />
                 <span>Upload</span>
                </label>

                <p className="sp-muted">Use a clear image. Admin will review before approval.</p>
              </div>
            </div>
          )}

          {/* MY PRODUCTS */}
          {view === "products" && (
            <>
              <div className="sp-head">
                <div>
                  <h1 className="sp-title">My Products</h1>
                  <p className="sp-muted">Editing sends request to admin (image included).</p>
                </div>
              </div>

              <div className="sp-list">
                {myProducts.length === 0 ? (
                  <div className="sp-empty">No products yet.</div>
                ) : (
                  myProducts.map((p) => {
                    const img = p.image ? `${UPLOADS}/${p.image}` : "/no-image.png";
                    return (
                      <div className="sp-item" key={p._id}>
                        <img src={img} alt={p.name} onError={(e) => (e.target.src = "/no-image.png")} />
                        <div className="sp-item-mid">
                          <div className="sp-item-title">{p.name}</div>
                          <div className="sp-item-sub">
                            {p.category} {p.subCategory ? `• ${p.subCategory}` : ""} • ₹{p.price} • Qty {p.quantity}
                          </div>
                          <div className={`sp-badge ${p.status === "approved" ? "good" : p.status === "pending" ? "warn" : "bad"}`}>
                            {p.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="sp-item-actions">
                          <button className="sp-btn ghost" onClick={() => openEdit(p)}>Edit</button>
                          <button className="sp-btn danger" onClick={() => requestDelete(p._id)}>Request Delete</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* ORDERS */}
          {view === "orders" && (
            <>
              <div className="sp-head">
                <div>
                  <h1 className="sp-title">Orders</h1>
                  <p className="sp-muted">Only buyer name, product, quantity.</p>
                </div>
              </div>

              <div className="sp-card">
                {orders.length === 0 ? (
                  <div className="sp-empty">No orders yet.</div>
                ) : (
                  <div className="sp-orders">
                    {orders.map((o, idx) => (
                      <div className="sp-order" key={idx}>
                        <div><b>Buyer:</b> {o.buyerName}</div>
                        <div><b>Product:</b> {o.productName}</div>
                        <div><b>Quantity:</b> {o.quantity}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* EDIT MODAL */}
      {editOpen && editForm && (
        <div className="sp-modal-backdrop" onClick={() => setEditOpen(false)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-head">
              <h2>Edit (Request to Admin)</h2>
              <button className="sp-x" onClick={() => setEditOpen(false)}>✕</button>
            </div>

            <div className="sp-modal-grid">
              <div>
                <div className="sp-field">
                  <label>Name</label>
                  <input name="name" value={editForm.name} onChange={onEditChange} />
                </div>
                <div className="sp-field">
                  <label>Category</label>
                  <input name="category" value={editForm.category} onChange={onEditChange} />
                </div>
                <div className="sp-field">
                  <label>Subcategory</label>
                  <input name="subCategory" value={editForm.subCategory} onChange={onEditChange} />
                </div>

                <div className="sp-two">
                  <div className="sp-field">
                    <label>Price</label>
                    <input name="price" value={editForm.price} onChange={onEditChange} />
                  </div>
                  <div className="sp-field">
                    <label>Quantity</label>
                    <input name="quantity" value={editForm.quantity} onChange={onEditChange} />
                  </div>
                </div>

                <div className="sp-field">
                  <label>Description</label>
                  <textarea name="description" value={editForm.description} onChange={onEditChange} />
                </div>

                <button className="sp-btn" disabled={loading} onClick={sendUpdateRequest}>
                  {loading ? "Sending…" : "Send Update Request"}
                </button>
              </div>

              <div>
                <div className="sp-modal-preview">
                  <img src={editPreview || "/no-image.png"} alt="preview" onError={(e) => (e.target.src = "/no-image.png")} />
                </div>

                <label className="sp-file">
                  <input type="file" accept="image/*" onChange={(e) => pickEditImage(e.target.files?.[0])} />
                  Change Image
                </label>

                <p className="sp-muted">Admin will approve/reject this change.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, value, icon }) {
  return (
    <div className="sp-card">
      <div className="sp-card-row">
        <div>
          <p className="sp-kicker">{label}</p>
          <h2 className="sp-num">{value ?? "—"}</h2>
        </div>
        <div className="sp-icon">{icon}</div>
      </div>
    </div>
  );
}
