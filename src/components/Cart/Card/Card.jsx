import Link from "next/link";
import { useState, useEffect } from "react";

export const Card = ({ cart, onChangeQuantity }) => {
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

  return (
    <div className="cart-table__row">
      <div className="cart-table__col">
        <Link href={`/product/${id}`}>
          <a className="cart-table__img">
            <img src={`http://localhost:5000${image}`} className="js-img" alt="" />
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
          <span className="cart-table__price">${price}</span>
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
        <span className="cart-table__total">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};
