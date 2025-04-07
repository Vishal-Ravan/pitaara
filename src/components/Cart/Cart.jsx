import { Card } from "./Card/Card";
import socialData from "data/social";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const socialLinks = [...socialData];
  const router = useRouter();

  // Get user token from localStorage
  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  // Get or create guestId
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  // Fetch cart data on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = getUserToken();
      const guestId = getGuestId();

      const endpoint = token
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart?guestId=${guestId}`;

      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
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

  // Update total whenever cart changes
  useEffect(() => {
    const calculateTotal = (cartItems) => {
      return cartItems.reduce(
        (total, item) =>
          total + Number(item.productId.price) * Number(item.quantity),
        0
      );
    };
    setTotal(calculateTotal(cartData));
  }, [cartData]);

  // Quantity change handler
  const handleQuantityChange = (id, newQuantity) => {
    setCartData((prevCartData) =>
      prevCartData.map((item) =>
        item.productId._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item handler
  const handleRemoveItem = (productId) => {
    setCartData((prevCart) =>
      prevCart.filter((item) => item.productId._id !== productId)
    );
  };

  // Checkout handler for logged-in users
  const handleCheckout = () => {
    const token = getUserToken();
    if (!token) {
      alert("Please log in to proceed with checkout.");
      router.push("/login");
      return;
    }

    router.push({
      pathname: "/checkout",
      query: {
        cart: encodeURIComponent(JSON.stringify(cartData)),
        total: total.toFixed(2),
      },
    });
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
                  onRemove={handleRemoveItem}
                  cart={{
                    id: cartItem.productId._id,
                    name: cartItem.productId.name,
                    image:
                      cartItem.productId.images?.[0] || "/default-image.jpg",
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
                Goods on <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="cart-bottom__total-num">
                Total: <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                className="btn"
                onClick={handleCheckout}
                disabled={cartData.length === 0}
              >
                Checkout
              </button>
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
