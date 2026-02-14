import React, { useState, useRef, useEffect } from "react";
import { FaYoutube, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import "./intro.css";

import imgA from "../assets/a.jpg";
import imgB from "../assets/b.jpg";
import imgC from "../assets/c.jpg";

const Intro = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const [activeFeature, setActiveFeature] = useState(0);
  const featureRefs = useRef([]);

  const features = [
    {
      title: "Smart Layout",
      text: "eaasy sell.",
      extraTitle1: "fast",
      extraText1: "10 mins",
      extraTitle2: "Customizable",
      extraText2: "Easily adjust layout to your needs",
      image: imgA,
      bg: "#e9f2ff",
    },
    {
      title: "ewasssste",
      text: "genuine.",
      extraTitle1: "Instant Updates",
      extraText1: "Keep everything updated instantly",
      extraTitle2: "Collaborative",
      extraText2: "Work with your team in real-time",
      image: imgB,
      bg: "#fff0f6",
    },
    {
      title: "amzing",
      text: "sweeeet",
      extraTitle1: "Fast & Reliable",
      extraText1: "Load times are faster than ever",
      extraTitle2: "Optimized",
      extraText2: "Reduces resource usage efficiently",
      image: imgC,
      bg: "#f1fff5",
    },
  ];

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Observe internal scroll (FEATURES ONLY)
  useEffect(() => {
    const scrollContainer = document.querySelector(".features-right");
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveFeature(Number(entry.target.dataset.index));
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.6,
      }
    );

    featureRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="intro-page">
      {/* FIXED BUTTON */}
      <Link to="/login">
        <button className="enter-btn1 fixed">WELCOME</button>
      </Link>

      {/* SECTION 1 */}
      <section className="template template-one">
        <div
          className={`hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </div>

        <div ref={menuRef} className={`menu ${open ? "open" : ""}`}>
          <div className="menu-links">
            <p>About</p>
            <p>Support</p>
            <p>Community</p>
            <p>Urban Connect for Schools</p>
          </div>
          <div className="menu-socials">
            <FaYoutube />
            <FaInstagram />
            <FaXTwitter />
          </div>
        </div>

        <div className="brand-container">
          <div className="brand-wrapper">
            <h1 className="brand animate">E-&nbsp;COLLECT</h1>

            {/* SPARKLES */}
            <div className="sparkles">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="sparkle"></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="template template-two">
        <div className="section-two-content">
          <p>LIFETIME INSTALL</p>
          <h2>+0 DOWNLOAD</h2>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="template template-three">
        <div className="section-three-content">
          <p>TOTAL VISITORS</p>
          <h2>+0 USERS</h2>
        </div>
      </section>

      {/* SECTION 4 — FEATURES */}
      <section
        className="template template-features"
        style={{ backgroundColor: features[activeFeature].bg }}
      >
        <div className="features-inner">
          {/* LEFT — STATIC TABLET */}
          <div className="features-left">
            <div className="tablet">
              <div className="tablet-screen">
                <img src={features[activeFeature].image} alt="feature" />
              </div>
            </div>
          </div>

          {/* RIGHT — INTERNAL SCROLL */}
          <div className="features-right">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-text"
                ref={(el) => (featureRefs.current[i] = el)}
                data-index={i}
              >
                <h3>{f.title}</h3>
                <p>{f.text}</p>

                {/* EXTRA TITLE & TEXT 1 */}
                <h4>{f.extraTitle1}</h4>
                <p className="extra-text">{f.extraText1}</p>

                {/* EXTRA TITLE & TEXT 2 */}
                <h4>{f.extraTitle2}</h4>
                <p className="extra-text">{f.extraText2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="footer-logo">
          E-<span>COLLECT</span>
        </div>

        <div className="footer-container">
          <div className="footer-column">
            <h3>About Econnect</h3>
            <ul>
              <li>waste</li>
              <li>waste</li>
              <li>Government</li>
              <li>Spots</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li>w</li>
              <li>Em Services</li>
              <li>Transport Info</li>
              <li>Community</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Community</h3>
            <ul>
              <li>Local</li>
              <li>Programs</li>
              <li>City News</li>
              <li>Contact Officials</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>©️ 2026 UrbanConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Intro;