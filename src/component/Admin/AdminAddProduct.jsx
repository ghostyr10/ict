import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminAddProduct.css";

const API = "http://localhost:8080/admin";
const UPLOADS = "http://localhost:8080/uploads/products";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return form.name && form.category && form.price && form.quantity;
  }, [form]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onPickImage = (file) => {
    setImage(file || null);
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const submit = async () => {
    if (!canSubmit) return alert("Fill Name, Category, Price, Quantity");

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      await axios.post(`${API}/products/add-direct`, fd, {
        headers: { ...authHeader() },
      });

      alert("Product added ✅");
      navigate("/admin");
    } catch (e) {
      console.error(e);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aa-shell">
      <header className="aa-top">
        <Link className="aa-back" to="/admin">← Back</Link>
        <div>
          <h1>Admin Add Product</h1>
          <p>Direct publish (no approval needed)</p>
        </div>
      </header>

      <div className="aa-grid">
        <div className="aa-card">
          <h2>Product Details</h2>

          <div className="aa-row">
            <label>Name</label>
            <input name="name" value={form.name} onChange={onChange} placeholder="Product name" />
          </div>

          <div className="aa-row">
            <label>Category</label>
            <input name="category" value={form.category} onChange={onChange} placeholder="Category" />
          </div>

          <div className="aa-row">
            <label>Subcategory</label>
            <input name="subCategory" value={form.subCategory} onChange={onChange} placeholder="Subcategory" />
          </div>

          <div className="aa-two">
            <div className="aa-row">
              <label>Price</label>
              <input name="price" value={form.price} onChange={onChange} placeholder="₹" />
            </div>
            <div className="aa-row">
              <label>Quantity</label>
              <input name="quantity" value={form.quantity} onChange={onChange} placeholder="Qty" />
            </div>
          </div>

          <div className="aa-row">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Short description" />
          </div>

          <div className="aa-actions">
            <button className="aa-btn" disabled={!canSubmit || loading} onClick={submit}>
              {loading ? "Adding…" : "Add Product"}
            </button>
            <Link className="aa-btn ghost" to="/admin">Cancel</Link>
          </div>
        </div>

        <div className="aa-card">
          <h2>Product Image</h2>

          <div className="aa-uploader">
            <div className="aa-preview">
              <img
                src={preview || "/no-image.png"}
                alt="preview"
               
              />
            </div>

            <label className="aa-file">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickImage(e.target.files?.[0])}
              />
              Upload Image
            </label>

            <p className="aa-hint">PNG/JPG. This image will show in products & homepage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
