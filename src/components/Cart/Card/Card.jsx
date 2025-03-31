import Link from "next/link";
import { useState, useEffect } from "react";

export const Card = ({ cart, onChangeQuantity, onRemove }) => {
  const { name, image, id, isStocked, productNumber, oldPrice, price, quantity } = cart;
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(price * quantity);

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
    if (!token) {
      console.error("User not authenticated");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Item removed successfully", data);
        
        // Refresh the page after successful removal
        window.location.reload();
        
      } else {
        console.error("Error removing item:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  

  return (
    <div className="cart-table__row">
      <div className="cart-table__col">
        <Link href={`/product/${id}`}>
          <a className="cart-table__img">
            <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image}`} className="js-img" alt={name} />
          </a>
        </Link>
        <div className="cart-table__info">
          <Link href={`/product/${id}`}>
            <a className="title5">{name}</a>
          </Link>
          {isStocked && <span className="cart-table__info-stock">In stock</span>}
          <span className="cart-table__info-num">SKU: {productNumber}</span>
        </div>
      </div>
      <div className="cart-table__col">
        {oldPrice ? (
          <span className="cart-table__price">
            <span>₹{oldPrice}</span> ₹{price}
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
              <i className="icon-arrow"></i>
            </span>
            <input type="text" className="counter-input" disabled value={currentQuantity} />
            <span
              onClick={() => handleQuantityChange("increment")}
              className="counter-link counter-link__next"
            >
              <i className="icon-arrow"></i>
            </span>
          </div>
        </div>
      </div>
      <div className="cart-table__col">
        <span className="cart-table__total">₹{totalPrice.toFixed(2)}</span>
      </div>
      <div className="cart-table__col">
        <button onClick={() => removeFromCart(id)} className="remove-btn">
          Remove
        </button>
      </div>
    </div>
  );
};
