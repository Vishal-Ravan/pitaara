import Link from "next/link";
import { useState, useEffect } from "react";

export const Card = ({ wish }) => {
  const { name, image, id, isStocked, productNumber, price } = wish;
  const [alertMessage, setAlertMessage] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  // Show alert message temporarily
  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 2000);
  };

  // Check if item is already in cart
  useEffect(() => {
    const fetchCart = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;
      const guestId = localStorage.getItem("guestId");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              ...(guestId ? { "x-guest-id": guestId } : {}),
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          const productInCart = data?.items?.some(
            (item) => item.product?._id === id
          );
          setIsInCart(productInCart);
        } else {
          console.warn("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [id]);

  // Add item to cart
  const handleAddToCart = async (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    let guestId = localStorage.getItem("guestId");

    if (!token && !guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", guestId);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            productId: id,
            quantity: 1,
            ...(guestId ? { guestId } : {}),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add to cart");

      setIsInCart(true);
      showAlert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showAlert(error.message || "Something went wrong. Please try again.");
    }
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    const guestId = localStorage.getItem("guestId");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...(guestId ? { guestId } : {}),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to remove from wishlist");

      showAlert("Item removed from wishlist");
      window.location.reload();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showAlert(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="cart-table__row">
      <div className="cart-table__col">
        <Link href={`/product/${id}`}>
          <a className="cart-table__img">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image[0]}`}
              className="js-img"
              alt={name || "Product"}
            />
          </a>
        </Link>
        <div className="cart-table__info">
          <Link href={`/product/${id}`}>
            <a className="title5">{name}</a>
          </Link>
          <span className="cart-table__info-num">SKU: {productNumber}</span>
        </div>
      </div>
      <div className="cart-table__col">
        <span className="cart-table__price">₹ {price}</span>
      </div>

      <div className="cart-table__col">
        <button onClick={handleRemoveFromWishlist} className="remove-btn">
          Remove
        </button>
      </div>
      <div className="cart-table__col">
        {/* Conditionally render Add to Cart Button */}
        {!isInCart && (
          <button
            onClick={() => handleAddToCart(id)}
            title="Add to Cart"
            className="remove-btn"
            style={{
              width: "40px",
              height: "40px",
              color: "#fff",
            }}
          >
            <img src="/assets/img/add-to-cart-white.png" alt="" />
          </button>
        )}
      </div>

      {/* Alert Message */}
      {alertMessage && (
        <div
          style={{
            background: "#000",
            color: "#fff",
            padding: "15px",
            textAlign: "center",
            position: "fixed",
            right: "0px",
            zIndex: 999,
            top: "70px",
            borderRadius: "5px",
          }}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
};
