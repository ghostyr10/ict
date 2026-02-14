import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // store user info

  // ================= FETCH LOGGED-IN USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // not logged in

        const res = await fetch("http://localhost:8080/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  // ================= SECTIONS =================
  const sections = [
    {
      title: "Account Settings",
      items: [
       { name: "My Orders", icon: "📦", onClick: () => navigate("/my-orders") },
        { name: "Edit Profile", icon: "👤", onClick: () => navigate("/account/edit") },
        { name: "Saved Credit / Debit & Gift Cards", icon: "💳", onClick: () => {} },
        { name: "Saved Addresses", icon: "📍", onClick: () => {} },
        { name: "Select Language", icon: "🌐", onClick: () => {} },
        { name: "Notification Settings", icon: "🔔", onClick: () => {} },
        { name: "Privacy Center", icon: "🔒", onClick: () => {} },
      ],
    },
    {
      title: "My Activity",
      items: [
        { name: "Reviews", icon: "📝", onClick: () => {} },
        { name: "Questions & Answers", icon: "💬", onClick: () => {} },
      ],
    },
    {
      title: "Earn with Flipkart",
      items: [{ name: "Sell on Flipkart", icon: "🏪", onClick: () => {} }],
    },
    {
      title: "Feedback & Information",
      items: [
        { name: "Terms, Policies and Licenses", icon: "📄", onClick: () => {} },
        { name: "Browse FAQs", icon: "❓", onClick: () => {} },
      ],
    },
  ];

  return (
    <div className="profile-container">
      {/* ================= PROFILE CARD ================= */}
      <div className="profile-card">
        <h2>{user ? user.name || user.email : "Loading..."}</h2>
        <p>Explore <b>Plus Silver</b></p>
      </div>

      {/* ================= ACCOUNT SECTIONS ================= */}
      {sections.map((section) => (
        <div key={section.title} className="profile-section">
          <div className="section-title">{section.title}</div>
          <div className="section-items">
            {section.items.map((item, idx) => (
              <div
                key={item.name}
                className="section-item"
                onClick={item.onClick}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-name">{item.name}</span>
                <span className="item-arrow">›</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ================= HELP CENTER ================= */}
      <div className="profile-section">
        <div className="section-title">Help Center</div>
        <div className="info-card">
          <p className="info-title">Quick answers to all your queries</p>
          <span className="info-link">Know more ›</span>
        </div>

        <p className="section-subtitle">What issue are you facing?</p>
        <div className="help-list">
          {[
            { title: "I want help with new GST changes" },
            { title: "I want to manage my order", subtitle: "View, cancel or return an order" },
            { title: "I want help with returns & refunds", subtitle: "Manage and track returns" },
            { title: "I want help with other issues", subtitle: "Offers, payment, Plus & more" },
            { title: "I want to contact the seller" },
          ].map((item) => (
            <div key={item.title} className="help-item">
              <div>
                <p className="help-title">{item.title}</p>
                {item.subtitle && <p className="help-sub">{item.subtitle}</p>}
              </div>
              <span className="help-arrow">›</span>
            </div>
          ))}
        </div>

        <div className="browse-card">
          Browse Help Topics <span>›</span>
        </div>
      </div>

      {/* ================= LOGOUT ================= */}
      <div className="logout-btn" onClick={() => navigate("/login")}>
        Log Out
      </div>

      {/* ================= BOTTOM NAV ================= */}
  
        
      
    </div>
  );
}
