import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const API_URL = "http://localhost:8080/products";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const res = await axios.get(`${API_URL}/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="pdp-loading">Loading product...</p>;
  if (!product) return <p className="pdp-notfound">Product not found</p>;

  const imageUrl = product.image
    ? `http://localhost:8080/uploads/products/${product.image}`
    : "/no-image.png";

  const handleAddToCart = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/cart",
        {
          productId: product._id.toString().trim(),
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };

  // ✅ BUY NOW: navigate to checkout with product
  const handleBuyNow = () => {
    navigate("/checkout", { state: { products: [{ ...product, quantity: 1 }] } });
  };

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:8080/wishlist",
        {
          productId: product._id.toString().trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added to wishlist ❤️");
    } catch (err) {
      console.error("Wishlist failed:", err);
      alert("Failed to add to wishlist");
    }
  };

  return (
    <div className="pdp-page">
      <div className="pdp-container">
        <div className="pdp-left">
          <img
            src={imageUrl}
            alt={product.name}
            className="pdp-main-image"
            onError={(e) => (e.target.src = "/no-image.png")}
          />
        </div>

        <div className="pdp-right">
          <h1 className="pdp-title">{product.name}</h1>
          <p className="pdp-category">
            {product.category}{" "}
            {product.subCategory && `> ${product.subCategory}`}
          </p>

          <div className="pdp-rating-stock">
            <span className="pdp-rating">⭐⭐⭐⭐☆</span>
            <span
              className={`pdp-stock ${
                product.quantity > 0 ? "in-stock" : "out-stock"
              }`}
            >
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <h2 className="pdp-price">₹ {product.price}</h2>

          <p className="pdp-description">{product.description}</p>

          <div className="pdp-actions">
            <button
              className="pdp-add-cart"
              disabled={product.quantity === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="pdp-buy-now"
              disabled={product.quantity === 0}
              onClick={handleBuyNow} 
            >
              Buy Now
            </button>

            <button className="pdp-wishlist" onClick={handleWishlist}>
              ❤️ Wishlist
            </button>
          </div>

          <div className="pdp-extra-info">
            <p>
              <b>Category:</b> {product.category}
            </p>
            {product.subCategory && (
              <p>
                <b>Subcategory:</b> {product.subCategory}
              </p>
            )}
            <p>
              <b>Quantity Available:</b> {product.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;