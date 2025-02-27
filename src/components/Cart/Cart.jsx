import { Card } from "./Card/Card";
import socialData from "data/social";
import { CartContext } from "pages/_app";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

export const Cart = () => {
  const { cart, setCart } = useContext(CartContext);
  const [cartData, setCartData] = useState([]);
  const socialLinks = [...socialData];

  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  useEffect(() => {
    const fetchCart = async () => {
      const token = getUserToken();
      if (!token) {
        setCart([]);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Cart API Response:", data);

        if (Array.isArray(data)) {
          setCartData(data);
        } else if (data?.items && Array.isArray(data.items)) {
          setCartData(data.items);
        } else {
          setCartData([]);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartData([]);
      }
    };

    fetchCart();
  }, []);

  // Calculate total price dynamically
  const calculateTotal = (cartItems) => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.productId.price) * Number(item.quantity),
      0
    );
  };

  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(calculateTotal(cartData));
  }, [cartData]);

  const handleQuantityChange = (id, newQuantity) => {
    setCartData((prevCartData) =>
      prevCartData.map((item) =>
        item.productId._id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  return (
    <>
      <div className="cart">
        <div className="wrapper">
          <div className="cart-table">
            <div className="cart-table__box">
              <div className="cart-table__row cart-table__row-head">
                <div className="cart-table__col">Product</div>
                <div className="cart-table__col">Price</div>
                <div className="cart-table__col">Quantity</div>
                <div className="cart-table__col">Total</div>
              </div>

              {cartData?.map((cartItem) => (
                <Card
                  key={cartItem._id}
                  cart={{
                    id: cartItem.productId._id,
                    name: cartItem.productId.name,
                    image:
                      cartItem.productId.images?.length > 0
                        ? cartItem.productId.images[0]
                        : "/default-image.jpg",
                    isStocked: cartItem.productId.isStocked || false,
                    productNumber: cartItem.productId.productNumber || "N/A",
                    oldPrice: cartItem.productId.oldPrice || null,
                    price: cartItem.productId.price,
                    quantity: cartItem.quantity,
                  }}
                  onChangeQuantity={handleQuantityChange}
                />
              ))}
            </div>
          </div>
          <div className="cart-bottom">
            <div className="cart-bottom__promo">
              {/* <form className="cart-bottom__promo-form">
                <div className="box-field__row">
                  <div className="box-field">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter promo code"
                    />
                  </div>
                  <button type="submit" className="btn btn-grey">
                    apply code
                  </button>
                </div>
              </form>
              <h6>How to get a promo code?</h6>
              <p>
                Follow our news on the website, as well as subscribe to our
                social networks. So you will not only be able to receive
                up-to-date codes, but also learn about new products and
                promotional items.
              </p> */}
              <div className="contacts-info__social">
                <span>Find us here:</span>
                <ul>
                  {socialLinks.map((social, index) => (
                    <li key={index}>
                      <a href={social.path} target="_blank">
                        <i className={social.icon}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="cart-bottom__total">
              <div className="cart-bottom__total-goods">
                Goods on
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="cart-bottom__total-promo">
                Discount on promo code
                <span>No</span>
              </div>
              <div className="cart-bottom__total-num">
                Total:
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <a className="btn">Checkout</a>
              </Link>
            </div>
          </div>
        </div>
        <img
          className="promo-video__decor js-img"
          src="assets/img/promo-video__decor.jpg"
          alt=""
        />
      </div>
    </>
  );
};
