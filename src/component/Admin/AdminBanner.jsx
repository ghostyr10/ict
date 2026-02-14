import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/admin/banners";

export default function AdminBanner() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const saveBanner = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      if (image) formData.append("image", image);

      await axios.post(`${API}/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Banner uploaded successfully");
      setTitle("");
      setSubtitle("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Home Banner</h2>

      <input
        placeholder="Banner title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: 10, padding: 8, width: "100%" }}
      />

      <input
        placeholder="Banner subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        style={{ display: "block", marginBottom: 10, padding: 8, width: "100%" }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginBottom: 10 }}
      />

      <button onClick={saveBanner} disabled={loading}>
        {loading ? "Saving..." : "Save Banner"}
      </button>
    </div>
  );
}