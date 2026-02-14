import React, { useEffect } from "react";
import "./Sellp.css"; // move all CSS here
import { Link } from "react-router-dom";

const Sellp = () => {
  useEffect(() => {
    // COUNT UP ANIMATION
    document.querySelectorAll("[data-count]").forEach((el) => {
      let target = +el.dataset.count;
      let count = 0;
      let inc = target / 120;

      let interval = setInterval(() => {
        count += inc;
        if (count >= target) {
          el.innerText = target.toLocaleString();
          clearInterval(interval);
        } else {
          el.innerText = Math.floor(count).toLocaleString();
        }
      }, 20);
    });
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCTA = () => {
    alert("Next Page: Seller Registration");
  };

  return (
    <>
      {/* STATS */}
      <section className="stats">
        <div className="stat-box">
          <span data-count="158000">0</span>
          <br />
          Registered Brands
        </div>
        <div className="stat-box">
          <span data-count="95000">0</span>
          <br />
          Active Sellers
        </div>
        <div className="stat-box">
          <span data-count="18000">0</span>
          <br />
          Pincodes Served
        </div>
      </section>

      {/* HERO */}
      <section className="hero" id="start">
        <div className="hero-card">
         
  <h1>Start selling today</h1>
 
  <Link to="/sell" className="btn">
    SELL YOUR PRODUCTS
  </Link>
</div>
        

        <div>
          <h2>Sell across India</h2>
          <p>
            Reach customers from 18,000+ pincodes with fast logistics support.
          </p>
        </div>
      </section>

      {/* FEE HIGHLIGHTS */}
      <section className="features">
        <div className="feature">
          <h2>0%</h2>
          <p>Referral fees on selected categories</p>
        </div>
        <div className="feature">
          <h2>₹65</h2>
          <p>Flat national shipping rate</p>
        </div>
        <div className="feature">
          <h2>Up to 90%</h2>
          <p>Savings on selling fees</p>
        </div>
      </section>

      {/* WHY SELL */}
      <section>
        <h2>Why become a seller?</h2>
        <div className="features">
          <div className="feature">
            <h3>Massive Reach</h3>
            <p>Access millions of verified buyers.</p>
          </div>
          <div className="feature">
            <h3>Fast Payments</h3>
            <p>Secure and timely settlements.</p>
          </div>
          <div className="feature">
            <h3>Seller Support</h3>
            <p>Dedicated onboarding & growth help.</p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="steps">
        <h2>How to become a seller</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">📝</div>
            <h3>Register Account</h3>
            <p>Submit basic business & bank details.</p>
          </div>
          <div className="step">
            <div className="step-icon">📦</div>
            <h3>Storage & Shipping</h3>
            <p>Choose fulfillment and logistics options.</p>
          </div>
          <div className="step">
            <div className="step-icon">🛒</div>
            <h3>List Products</h3>
            <p>Add product info, images & pricing.</p>
          </div>
          <div className="step">
            <div className="step-icon">💰</div>
            <h3>Earn & Grow</h3>
            <p>Deliver orders and get paid fast.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h1>Ready to grow your business?</h1>
        <button className="btn" onClick={handleCTA}>
          WELCOME TO E-CONNECT
        </button>
      </section>
    </>
  );
};

export default Sellp;
