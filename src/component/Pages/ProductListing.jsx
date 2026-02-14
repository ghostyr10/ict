import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // ✅ Link added
import axios from "axios";
import "./productListing.css";

const API_URL = "http://localhost:8080/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductListing() {
  const query = useQuery();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const category = query.get("category");
  const subCategory = query.get("subCategory");
  const search = query.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`, {
          params: { category, subCategory, search },
        });
        setProducts(res.data.products);
      } catch (error) {
        console.error("PLP ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subCategory, search]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <div className="plp-page">
      {/* ====== NAVBAR ====== */}
      <nav className="plp-navbar">
        <div className="plp-nav-left">
          <span className="plp-hamburger" onClick={() => setDrawerOpen(true)}>
            ☰
          </span>
          <span className="plp-logo">E-COLLECT</span>
        </div>

        <div className="plp-search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="plp-nav-links">
          <span>Home</span>
          <span>Features</span>
          <span>Sell</span>
          <span>Support</span>
        </div>
      </nav>

      {/* ====== DRAWER ====== */}
      <div className={`plp-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="plp-drawer-header">
          <span>Menu</span>
        </div>
        <ul className="plp-drawer-links">
          <li>🔥 Trending</li>
          <li>🔋 Batteries</li>
          <li>📱 Mobiles</li>
          <li>💻 Laptops</li>
          <li>⚡ Accessories</li>
        </ul>
      </div>

      {drawerOpen && (
        <div
          className="plp-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* ====== TITLE ====== */}
      <h1 className="plp-title">
        {search
          ? `Results for "${search}"`
          : category
          ? category
          : "All Products"}
      </h1>

      {loading ? (
        <p className="plp-loading">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="plp-no-products">No products found.</p>
      ) : (
        <div className="plp-grid">
          {products.map((p) => {
            const imageUrl = p.image
              ? `http://localhost:8080/uploads/products/${p.image}`
              : "/no-image.png";

            return (
              // ✅ ONLY ADDITION — clickable card
              <Link
                to={`/product/${p._id}`}
                key={p._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="plp-card">
                  <div className="plp-img-wrapper">
                    <img
                      src={imageUrl}
                      alt={p.name}
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />
                  </div>

                  <div className="plp-info">
                    <h3 className="plp-name">{p.name}</h3>
                    <p className="plp-category">
                      {p.category}
                      {p.subCategory && ` > ${p.subCategory}`}
                    </p>
                    <p className="plp-desc">{p.description}</p>
                    <div className="plp-meta">
                      <span className="plp-price">₹ {p.price}</span>
                      <span className="plp-qty">Qty: {p.quantity}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}