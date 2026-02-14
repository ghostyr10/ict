import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API = "http://localhost:8080/admin";
const UPLOADS = "http://localhost:8080/uploads/products";
const BANNERS = "http://localhost:8080/uploads/banners";
const BANNER_API = "http://localhost:8080/admin/banners"; // ✅ FIXED BASE

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [view, setView] = useState("analytics"); // analytics | pending | approved | rejected | updates | deletes | sellers | trending | banners
  const [loading, setLoading] = useState(false);

  // analytics
  const [analytics, setAnalytics] = useState(null);

  // products lists
  const [products, setProducts] = useState([]);

  // sellers
  const [sellers, setSellers] = useState([]);

  // update requests
  const [updateRequests, setUpdateRequests] = useState([]);

  // delete requests
  const [deleteRequests, setDeleteRequests] = useState([]);

  // pending filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // ✅ banner states
  const [banner, setBanner] = useState({
    title: "",
    subtitle: "",
    image: "",
    active: true,
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const categories = useMemo(() => {
    const set = new Set((products || []).map((p) => p.category).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [products]);

  const subCategories = useMemo(() => {
    const set = new Set((products || []).map((p) => p.subCategory).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [products]);

  // ---------------- LOADERS ----------------
  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/analytics`, { headers: authHeader() });
      setAnalytics(res.data);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (type) => {
    setLoading(true);
    try {
      const url =
        type === "pending"
          ? `${API}/products/pending?search=${encodeURIComponent(search)}&category=${encodeURIComponent(
              category
            )}&subCategory=${encodeURIComponent(subCategory)}`
          : `${API}/products/${type}`;

      const res = await axios.get(url, { headers: authHeader() });
      setProducts(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const loadSellers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/sellers`, { headers: authHeader() });
      setSellers(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const loadUpdateRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/update-requests`, { headers: authHeader() });
      setUpdateRequests(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch update requests");
    } finally {
      setLoading(false);
    }
  };

  const loadDeleteRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/delete-requests`, { headers: authHeader() });
      setDeleteRequests(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch delete requests");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Banner loader (FIXED ENDPOINT)
  const loadBanner = async () => {
    setLoading(true);
    try {
      // ✅ GET /admin/banners
      const res = await axios.get(BANNER_API, { headers: authHeader() });
      const b = res.data || { title: "", subtitle: "", image: "", active: true };
      setBanner(b);
      setBannerPreview(b?.image ? `${BANNERS}/${b.image}` : "");
      setBannerFile(null);
    } catch (e) {
      console.error(e);
      alert("Failed to load banner");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ACTIONS ----------------
  const approveProduct = async (id) => {
    await axios.put(`${API}/products/approve/${id}`, {}, { headers: authHeader() });
    loadProducts(view);
  };

  const rejectProduct = async (id) => {
    await axios.put(`${API}/products/reject/${id}`, {}, { headers: authHeader() });
    loadProducts(view);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API}/products/${id}`, { headers: authHeader() });
    loadProducts(view);
  };

  const toggleBan = async (sellerId, isBanned) => {
    const url = isBanned ? `${API}/seller/unban/${sellerId}` : `${API}/seller/ban/${sellerId}`;
    await axios.put(url, {}, { headers: authHeader() });
    loadSellers();
  };

  const approveUpdateReq = async (id) => {
    await axios.put(`${API}/update-requests/approve/${id}`, {}, { headers: authHeader() });
    loadUpdateRequests();
  };

  const rejectUpdateReq = async (id) => {
    const note = prompt("Reason (optional):") || "";
    await axios.put(`${API}/update-requests/reject/${id}`, { adminNote: note }, { headers: authHeader() });
    loadUpdateRequests();
  };

  const approveDeleteReq = async (id) => {
    await axios.put(`${API}/delete-requests/approve/${id}`, {}, { headers: authHeader() });
    loadDeleteRequests();
  };

  const rejectDeleteReq = async (id) => {
    const note = prompt("Reason (optional):") || "";
    await axios.put(`${API}/delete-requests/reject/${id}`, { adminNote: note }, { headers: authHeader() });
    loadDeleteRequests();
  };

  // ✅ Banner actions
  const pickBanner = (file) => {
    setBannerFile(file || null);
    if (!file) return setBannerPreview(banner?.image ? `${BANNERS}/${banner.image}` : "");
    setBannerPreview(URL.createObjectURL(file));
  };

  const saveBanner = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      if (bannerFile) fd.append("image", bannerFile);
      fd.append("title", banner.title || "");
      fd.append("subtitle", banner.subtitle || "");
      fd.append("active", banner.active ? "true" : "false");

      // ✅ POST /admin/banners/add
      await axios.post(`${BANNER_API}/add`, fd, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });

      alert("Banner saved ✅");
      loadBanner();
    } catch (e) {
      console.error(e);
      alert("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VIEW CHANGES ----------------
  useEffect(() => {
    if (view === "analytics") loadAnalytics();
    if (view === "pending") loadProducts("pending");
    if (view === "approved") loadProducts("approved");
    if (view === "rejected") loadProducts("rejected");
    if (view === "sellers") loadSellers();
    if (view === "updates") loadUpdateRequests();
    if (view === "deletes") loadDeleteRequests();
    if (view === "banners") loadBanner();
    // trending -> you will connect later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // re-fetch pending list when filters change (only if in pending view)
  useEffect(() => {
    if (view === "pending") loadProducts("pending");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, subCategory]);

  // ✅ GLITCH FIX helper: avoid infinite onError loops
  const safeImgError = (e) => {
    if (e.currentTarget.dataset.fallback === "1") return;
    e.currentTarget.dataset.fallback = "1";
    e.currentTarget.src = "/no-image.png";
  };

  return (
    <div className="ad-shell">
      {/* Topbar */}
      <header className="ad-topbar">
        <div className="ad-brand">
          <span className="ad-dot" />
          Admin Panel
          <span className="ad-sub">E-Collect</span>
        </div>

        <div className="ad-top-actions">
          <button
            className="ad-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="ad-body">
        {/* Sidebar */}
        <aside className="ad-sidebar">
          <button className={`ad-nav ${view === "analytics" ? "active" : ""}`} onClick={() => setView("analytics")}>
            📊 Analytics
          </button>

          <button className="ad-nav" onClick={() => navigate("/admin/add-product")}>
            ➕ Add Product
          </button>

          <button className={`ad-nav ${view === "trending" ? "active" : ""}`} onClick={() => setView("trending")}>
            🔥 Trending
          </button>

          <button className={`ad-nav ${view === "banners" ? "active" : ""}`} onClick={() => setView("banners")}>
            🖼 Banner
          </button>

          <div className="ad-section">Products</div>
          <button className={`ad-nav ${view === "pending" ? "active" : ""}`} onClick={() => setView("pending")}>
            ⏳ Pending
          </button>
          <button className={`ad-nav ${view === "approved" ? "active" : ""}`} onClick={() => setView("approved")}>
            ✅ Approved
          </button>
          <button className={`ad-nav ${view === "rejected" ? "active" : ""}`} onClick={() => setView("rejected")}>
            ❌ Rejected
          </button>

          <div className="ad-section">Requests</div>
          <button className={`ad-nav ${view === "updates" ? "active" : ""}`} onClick={() => setView("updates")}>
            ✏️ Update Requests
          </button>
          <button className={`ad-nav ${view === "deletes" ? "active" : ""}`} onClick={() => setView("deletes")}>
            🗑 Delete Requests
          </button>

          <div className="ad-section">Users</div>
          <button className={`ad-nav ${view === "sellers" ? "active" : ""}`} onClick={() => setView("sellers")}>
            🧑‍💼 Sellers
          </button>
        </aside>

        <main className="ad-content" key={view}>
          {/* Header */}
          <div className="ad-head">
            <div>
              <h1 className="ad-title">
                {view === "analytics" && "Admin Analytics"}
                {view === "pending" && "Pending Products"}
                {view === "approved" && "Approved Products"}
                {view === "rejected" && "Rejected Products"}
                {view === "updates" && "Update Requests"}
                {view === "deletes" && "Delete Requests"}
                {view === "sellers" && "Sellers"}
                {view === "trending" && "Trending Management"}
                {view === "banners" && "Home Banner"}
              </h1>
              <p className="ad-muted">
                {view === "pending" && "Approve, reject, search and filter pending listings."}
                {view === "updates" && "Approve or reject seller update requests (including image changes)."}
                {view === "deletes" && "Approve or reject seller delete requests."}
                {view === "analytics" && "Quick overview of store performance."}
                {view === "sellers" && "Manage seller access (ban/unban)."}
                {view === "trending" && "Add / edit / delete trending items for homepage."}
                {view === "banners" && "Upload banner image + title/subtitle for homepage."}
              </p>
            </div>

            {loading && <div className="ad-chip">Loading…</div>}
          </div>

          {/* TRENDING (placeholder UI only — you will connect later) */}
          {view === "trending" && (
            <div className="ad-table-card">
              <div className="ad-empty">
                Trending page is ready ✅ <br />
                Now connect it to backend endpoints (add / list / update / delete).
              </div>
            </div>
          )}

          {/* ✅ BANNER PAGE */}
          {view === "banners" && (
            <div className="ad-table-card" style={{ padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div className="ad-muted" style={{ marginBottom: 8 }}>Title</div>
                  <input
                    value={banner.title || ""}
                    onChange={(e) => setBanner((p) => ({ ...p, title: e.target.value }))}
                    style={{ width: "100%", padding: 10, borderRadius: 10 }}
                  />

                  <div className="ad-muted" style={{ margin: "12px 0 8px" }}>Subtitle</div>
                  <input
                    value={banner.subtitle || ""}
                    onChange={(e) => setBanner((p) => ({ ...p, subtitle: e.target.value }))}
                    style={{ width: "100%", padding: 10, borderRadius: 10 }}
                  />

                  <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                    <input
                      type="checkbox"
                      checked={!!banner.active}
                      onChange={(e) => setBanner((p) => ({ ...p, active: e.target.checked }))}
                    />
                    Active
                  </label>

                  <button className="ad-btn" style={{ marginTop: 14 }} onClick={saveBanner}>
                    Save Banner
                  </button>
                </div>

                <div>
                  <div className="ad-muted" style={{ marginBottom: 8 }}>Preview</div>
                  <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)" }}>
                    <img
                      src={bannerPreview || "/hero.jpg"}
                      alt="banner"
                      style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                      onError={safeImgError}
                    />
                  </div>

                  <label className="ad-btn ghost" style={{ display: "inline-block", marginTop: 12 }}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => pickBanner(e.target.files?.[0])}
                    />
                    Upload New Image
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {view === "analytics" && (
            <div className="ad-grid">
              <div className="ad-card">
                <div className="ad-card-row">
                  <div>
                    <p className="ad-kicker">Total Products</p>
                    <h2 className="ad-num">{analytics?.totalProducts ?? "—"}</h2>
                  </div>
                  <div className="ad-icon">📦</div>
                </div>
              </div>

              <div className="ad-card">
                <div className="ad-card-row">
                  <div>
                    <p className="ad-kicker">Total Pending</p>
                    <h2 className="ad-num">{analytics?.totalPending ?? "—"}</h2>
                  </div>
                  <div className="ad-icon">⏳</div>
                </div>
              </div>

              <div className="ad-card">
                <div className="ad-card-row">
                  <div>
                    <p className="ad-kicker">Total Orders</p>
                    <h2 className="ad-num">{analytics?.totalOrders ?? "—"}</h2>
                  </div>
                  <div className="ad-icon">🧾</div>
                </div>
              </div>

              <div className="ad-card ad-wide">
                <p className="ad-kicker">Quick Actions</p>
                <div className="ad-actions-row">
                  <button className="ad-btn" onClick={() => setView("pending")}>Review Pending</button>
                  <button className="ad-btn ghost" onClick={() => setView("updates")}>Update Requests</button>
                  <button className="ad-btn ghost" onClick={() => setView("deletes")}>Delete Requests</button>
                </div>
              </div>
            </div>
          )}

          {/* PENDING FILTER BAR */}
          {view === "pending" && (
            <div className="ad-filters">
              <div className="ad-search">
                <span>🔎</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name / category / subcategory / description"
                />
              </div>

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c || "All Categories"}</option>
                ))}
              </select>

              <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                {subCategories.map((s) => (
                  <option key={s} value={s}>{s || "All Subcategories"}</option>
                ))}
              </select>

              <button className="ad-btn ghost" onClick={() => { setSearch(""); setCategory(""); setSubCategory(""); }}>
                Reset
              </button>
            </div>
          )}

          {/* PRODUCT LISTS (pending/approved/rejected) */}
          {(view === "pending" || view === "approved" || view === "rejected") && (
            <div className="ad-table-card">
              <div className="ad-table-head">
                <span className="ad-muted">{products.length} items</span>
              </div>

              <div className="ad-table">
                <div className="ad-tr ad-th">
                  <div>Product</div>
                  <div>Category</div>
                  <div>Price</div>
                  <div>Qty</div>
                  <div>Seller</div>
                  <div className="right">Actions</div>
                </div>

                {products.map((p) => {
                  const img = p.image
                    ? (p.image.startsWith("http") ? p.image : `${UPLOADS}/${p.image}`)
                    : "/no-image.png";

                  return (
                    <div className="ad-tr" key={p._id}>
                      <div className="ad-prod">
                        <img src={img} alt={p.name} onError={safeImgError} />
                        <div>
                          <div className="ad-prod-name">{p.name}</div>
                          <div className="ad-prod-sub">
                            {p.subCategory ? p.subCategory : "—"} • {p.description?.slice(0, 48) || "—"}
                          </div>
                        </div>
                      </div>

                      <div>{p.category}</div>
                      <div>₹{p.price}</div>
                      <div>{p.quantity}</div>
                      <div className="ad-seller">
                        <div className="ad-seller-name">{p.seller?.name || "—"}</div>
                        <div className="ad-muted">{p.seller?.email || ""}</div>
                      </div>

                      <div className="right">
                        <div className="ad-btn-row">
                          {view !== "approved" && (
                            <button className="ad-btn" onClick={() => approveProduct(p._id)}>Approve</button>
                          )}
                          {view !== "rejected" && (
                            <button className="ad-btn danger ghost" onClick={() => rejectProduct(p._id)}>Reject</button>
                          )}
                          <button className="ad-btn danger" onClick={() => deleteProduct(p._id)}>Delete</button>

                          {p.seller && (
                            <button
                              className={`ad-btn ghost ${p.seller.isBanned ? "ok" : ""}`}
                              onClick={() => toggleBan(p.seller._id, p.seller.isBanned)}
                            >
                              {p.seller.isBanned ? "Unban" : "Ban"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!loading && products.length === 0 && (
                  <div className="ad-empty">No items found.</div>
                )}
              </div>
            </div>
          )}

          {/* UPDATE REQUESTS */}
          {view === "updates" && (
            <div className="ad-table-card">
              <div className="ad-table">
                <div className="ad-tr ad-th">
                  <div>Request</div>
                  <div>Seller</div>
                  <div>Changes</div>
                  <div className="right">Actions</div>
                </div>

                {updateRequests.map((r) => {
                  const product = r.product || {};
                  const seller = r.seller || {};
                  const oldImg = product.image ? `${UPLOADS}/${product.image}` : "/no-image.png";
                  const newImg = r.newImage
                    ? (r.newImage.startsWith("http") ? r.newImage : `${UPLOADS}/${r.newImage}`)
                    : null;

                  return (
                    <div className="ad-tr" key={r._id}>
                      <div className="ad-prod">
                        <img src={newImg || oldImg} alt="preview" onError={safeImgError} />
                        <div>
                          <div className="ad-prod-name">{product.name || "Product"}</div>
                          <div className="ad-prod-sub">
                            {newImg ? "New image included" : "No image change"} • {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="ad-seller">
                        <div className="ad-seller-name">{seller.name || "—"}</div>
                        <div className="ad-muted">{seller.email || ""}</div>
                      </div>

                      <div className="ad-changes">
                        {Object.keys(r.updates || {}).length === 0 ? (
                          <span className="ad-muted">No field changes (only image maybe)</span>
                        ) : (
                          Object.entries(r.updates).map(([k, v]) => (
                            <div key={k} className="ad-pill">
                              <b>{k}</b>: {String(v)}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="right">
                        <div className="ad-btn-row">
                          <button className="ad-btn" onClick={() => approveUpdateReq(r._id)}>Approve</button>
                          <button className="ad-btn danger" onClick={() => rejectUpdateReq(r._id)}>Reject</button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!loading && updateRequests.length === 0 && (
                  <div className="ad-empty">No update requests.</div>
                )}
              </div>
            </div>
          )}

          {/* DELETE REQUESTS */}
          {view === "deletes" && (
            <div className="ad-table-card">
              <div className="ad-table">
                <div className="ad-tr ad-th">
                  <div>Product</div>
                  <div>Seller</div>
                  <div>Requested</div>
                  <div className="right">Actions</div>
                </div>

                {deleteRequests.map((r) => {
                  const p = r.product || {};
                  const s = r.seller || {};
                  const img = p.image ? `${UPLOADS}/${p.image}` : "/no-image.png";

                  return (
                    <div className="ad-tr" key={r._id}>
                      <div className="ad-prod">
                        <img src={img} alt={p.name} onError={safeImgError} />
                        <div>
                          <div className="ad-prod-name">{p.name || "Product"}</div>
                          <div className="ad-prod-sub">{p.category || "—"} • {p.subCategory || "—"}</div>
                        </div>
                      </div>

                      <div className="ad-seller">
                        <div className="ad-seller-name">{s.name || "—"}</div>
                        <div className="ad-muted">{s.email || ""}</div>
                      </div>

                      <div className="ad-muted">{new Date(r.createdAt).toLocaleString()}</div>

                      <div className="right">
                        <div className="ad-btn-row">
                          <button className="ad-btn danger" onClick={() => approveDeleteReq(r._id)}>Approve Delete</button>
                          <button className="ad-btn ghost" onClick={() => rejectDeleteReq(r._id)}>Reject</button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!loading && deleteRequests.length === 0 && (
                  <div className="ad-empty">No delete requests.</div>
                )}
              </div>
            </div>
          )}

          {/* SELLERS */}
          {view === "sellers" && (
            <div className="ad-table-card">
              <div className="ad-table">
                <div className="ad-tr ad-th">
                  <div>User</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div className="right">Actions</div>
                </div>

                {sellers.map((u) => (
                  <div className="ad-tr" key={u._id}>
                    <div className="ad-seller">
                      <div className="ad-seller-name">{u.name}</div>
                      <div className="ad-muted">{u.email}</div>
                    </div>
                    <div>{u.isAdmin ? "Admin" : "Seller/User"}</div>
                    <div>
                      <span className={`ad-badge ${u.isBanned ? "bad" : "good"}`}>
                        {u.isBanned ? "BANNED" : "ACTIVE"}
                      </span>
                    </div>
                    <div className="right">
                      {!u.isAdmin && (
                        <button
                          className={`ad-btn ${u.isBanned ? "ok" : "danger"}`}
                          onClick={() => toggleBan(u._id, u.isBanned)}
                        >
                          {u.isBanned ? "Unban" : "Ban"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {!loading && sellers.length === 0 && (
                  <div className="ad-empty">No users found.</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}