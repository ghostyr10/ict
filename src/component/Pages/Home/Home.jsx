import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // products
  const [approvedProducts, setApprovedProducts] = useState([]);

  // banner
  const [banner, setBanner] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ✅ FETCH BANNER (from your backend)
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        // If you already have a different endpoint, tell me.
        const res = await fetch("http://localhost:8080/api/home/banners");
        const data = await res.json();

        const picked = Array.isArray(data) ? data?.[0] : data;

        if (picked && (picked.active === undefined || picked.active === true)) {
          setBanner(picked);
        } else {
          setBanner(null);
        }
      } catch (err) {
        console.error("Failed to fetch banner", err);
        setBanner(null);
      }
    };

    fetchBanner();
  }, []);

  // ✅ FETCH APPROVED PRODUCTS
  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/home/products");
        const data = await res.json();
        setApprovedProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch approved products", err);
      }
    };
    fetchApprovedProducts();
  }, []);

  // group products
  const groupedProducts = approvedProducts.reduce((acc, product) => {
    const cat = product.category || "Others";
    const sub = product.subCategory || "General";

    if (!acc[cat]) acc[cat] = {};
    if (!acc[cat][sub]) acc[cat][sub] = [];

    if (acc[cat][sub].length < 6) acc[cat][sub].push(product);
    return acc;
  }, {});

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // ✅ banner image resolve (supports filename or full URL)
  const bannerImage = banner?.image
    ? banner.image.startsWith("http")
      ? banner.image
      : `http://localhost:8080/uploads/banners/${banner.image}`
    : "/hero.jpg";

  const bannerTitle = banner?.title || "Recycle Smart. Earn Better.";
  const bannerSubtitle = banner?.subtitle || "Approved e-waste listings near you";

  return (
    <div className="home-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <button
            className="nav-hamburger-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <i className="ri-menu-line"></i>
          </button>

          <Link to="/intro" className="nav-logo">
            E-<span>COLLECT</span>
          </Link>

          <div className="nav-center">
            <i className="ri-search-line nav-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="nav-search"
            />
          </div>

          <ul className="nav-links">
            <li><Link to="/intro">Home</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/sellp">Sell</Link></li>
            <li><Link to="/wishlist" title="Wishlist">❤️</Link></li>
            <li>
              <Link to="/profile" className="profile-icon" title="Profile">
                <i className="ri-user-line"></i>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* DRAWER */}
      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-title">Menu</div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>

        <ul className="drawer-links">
          <li><Link to="/intro" onClick={() => setDrawerOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setDrawerOpen(false)}>All Products</Link></li>
          <li><Link to="/cart" onClick={() => setDrawerOpen(false)}>Cart</Link></li>
          <li><Link to="/wishlist" onClick={() => setDrawerOpen(false)}>Wishlist</Link></li>
          <li><Link to="/sellp" onClick={() => setDrawerOpen(false)}>Sell</Link></li>
        </ul>
      </div>

      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      {/* HERO / BANNER */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url("${bannerImage}")` }}
        />
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-left">
            <h1>{bannerTitle}</h1>
            <p>{bannerSubtitle}</p>

            <div className="hero-actions">
              <button
                className="hero-btn primary"
                onClick={() => navigate("/products")}
              >
                Explore
              </button>
              <button
                className="hero-btn ghost"
                onClick={() => navigate("/sellp")}
              >
                Start Selling
              </button>
            </div>
          </div>

          
        </div>
      </section>

      {/* PRODUCTS */}
      <main className="home-content">
        {Object.keys(groupedProducts).length === 0 ? (
          <div className="empty-state">
            <h2>No products yet</h2>
            <p>When admin approves products, they will appear here.</p>
            <button className="hero-btn primary" onClick={() => navigate("/products")}>
              Go to Products
            </button>
          </div>
        ) : (
          <section className="approved-section">
            {Object.entries(groupedProducts).map(([category, subCatObj]) => (
              <div key={category} className="category-box">
                <div className="category-head">
                  <h2 className="category-title">{category}</h2>
                  <Link className="category-viewall" to={`/products?category=${encodeURIComponent(category)}`}>
                    View all →
                  </Link>
                </div>

                {Object.entries(subCatObj).map(([subCategory, products]) => (
                  <div key={subCategory} className="subcategory-section">
                    <div className="subcategory-head">
                      <h3 className="subcategory-title">{subCategory}</h3>
                      <Link
                        className="subcategory-viewall"
                        to={`/products?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}`}
                      >
                        See more →
                      </Link>
                    </div>

                    <div className="approved-grid">
                      {products.map((p) => (
                        <Link
                          to={`/product/${p._id}`}
                          key={p._id}
                          className="approved-card-link"
                        >
                          <div className="approved-card">
                            <div className="approved-img-wrapper">
                              <img
                                src={p.image}
                                alt={p.name}
                                onError={(e) => {
                                  e.target.src = "/no-image.png";
                                }}
                              />
                            </div>

                            <div className="approved-info">
                              <h4 className="approved-name">{p.name}</h4>
                              <p className="approved-desc">{p.description}</p>

                              <div className="approved-meta">
                                <span className="approved-price">₹ {p.price}</span>
                                <span className="approved-qty">Qty: {p.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-brand">E-<span>COLLECT</span></div>
          <div className="footer-links">
            <Link to="/products">Products</Link>
            <Link to="/sellp">Sell</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <p className="footer-copy">© 2026 E-Collect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;