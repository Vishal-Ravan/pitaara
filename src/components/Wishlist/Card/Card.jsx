import Link from "next/link";
import { useState } from "react";

export const Card = ({ wish }) => {
  const { name, image, id, isStocked, productNumber, price } = wish;
  const [alertMessage, setAlertMessage] = useState(null);

  // Function to show the alert message
  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 2000);
  };

  // Function to handle adding an item to the cart
  const handleAddToCart = async (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    let guestId = localStorage.getItem("guestId");

    // Generate guest ID if not available
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

      // Optional: Update cart state if needed
      showAlert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showAlert(error.message || "Something went wrong. Please try again.");
    }
  };

  // Function to handle removing an item from the wishlist
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
      console.log("Response Data:", data); // Debug the response here
      if (!response.ok)
        throw new Error(data.message || "Failed to remove from wishlist");

      // Show success message and reload the page
      showAlert("Item removed from wishlist");
      window.location.reload(); // This will reload the current page to reflect the changes
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
        {/* Add to Cart Button */}
        <button
          onClick={() => handleAddToCart(id)}
          title="Add to Cart"
          style={{
            background: "#3c3434",
            border: "1px solid #3c3434",
            width: "40px",
            height: "40px",
            color: "#fff",
          }}
        >
          <i className="icon-cart"></i>
        </button>
        {/* Remove from Wishlist Button */}
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
