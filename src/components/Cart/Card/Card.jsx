import Link from "next/link";
import { useState, useEffect } from "react";

export const Card = ({ cart, onChangeQuantity, onRemove }) => {
  const {
    name,
    image,
    id,
    oldPrice,
    price,
    quantity,
  } = cart;
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(price * quantity);
  const [alertMessage, setAlertMessage] = useState(""); // State to manage the alert message

  useEffect(() => {
    setTotalPrice(price * currentQuantity);
  }, [currentQuantity, price]);

  const handleQuantityChange = (type) => {
    let newQuantity = currentQuantity;

    if (type === "increment") {
      newQuantity += 1;
    } else if (type === "decrement" && currentQuantity > 1) {
      newQuantity -= 1;
    }

    setCurrentQuantity(newQuantity);
    onChangeQuantity(id, newQuantity);
  };

  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  const removeFromCart = async (productId) => {
    const token = getUserToken();
    const guestId = localStorage.getItem("guestId");

    const endpoint = token
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove?guestId=${guestId}`;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Item removed successfully", data);
        onRemove(productId);
      } else {
        console.error("Error removing item:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleAddToWishlist = async (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    let guestId = localStorage.getItem("guestId");

    if (!token && !guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", guestId);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            productId: id,
            ...(guestId ? { guestId } : {}),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add to wishlist");

      setAlertMessage("Item added to wishlist successfully!");
      setTimeout(() => setAlertMessage(""), 3000); // Clear the alert after 3 seconds
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setAlertMessage(
        error.message || "Something went wrong. Please try again."
      );
      setTimeout(() => setAlertMessage(""), 3000); // Clear the alert after 3 seconds
    }
  };

  return (
    <div>
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

      <div className="cart-table__row">
      <Link href={`/product/${id}`}>
            <a className="cart-table__img">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image}`}
                className="js-img"
                alt={name}
              />
            </a>
          </Link>
          <div className="cart-table-data">
        <div className="cart-table__col">
      
          <div className="cart-table__info">
            <Link href={`/product/${id}`}>
              <a className="title5">{name}</a>
            </Link>
        
          </div>
        </div>
        <div className="cart-table__col price-cart">
          {oldPrice ? (
            <span className="cart-table__price">
               ₹{price}
            </span>
          ) : (
            <span className="cart-table__price">₹{price}</span>
          )}
        </div>
        <div className="cart-table__col">
          <div className="cart-table__quantity">
            <div className="counter-box">
              <span
                onClick={() => handleQuantityChange("decrement")}
                className="counter-link counter-link__prev"
              >
               -
              </span>
              <input
                type="text"
                className="counter-input"
                disabled
                value={currentQuantity}
              />
              <span
                onClick={() => handleQuantityChange("increment")}
                className="counter-link counter-link__next"
              >
               +
              </span>
            </div>
          </div>
        </div>
        
        <div className="cart-table__col">
          <span className="cart-table__total">₹{totalPrice.toFixed(2)}</span>
        </div>
        <div style={{ margin: "0px 10px", display: "flex", gap: "10px" }}>
          <button onClick={() => removeFromCart(id)} className="remove-btn">
            Remove
          </button>
          <button
          title="Add To  Wishlist"
            style={{  width:"40px"}}
            onClick={() => handleAddToWishlist(id)}
            className="remove-btn"
          >
            <i className="icon-heart"></i>
          </button>
        </div></div>
      </div>
    </div>
  );
};
