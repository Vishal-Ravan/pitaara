import { Card } from "./Card/Card";
import socialData from "data/social";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [gst, setGst] = useState(0);
  const [token, setToken] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const socialLinks = [...socialData];
  const router = useRouter();

  // Get token and guestId only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      const t = userData?.token || null;
      setToken(t);

      let guest = localStorage.getItem("guestId");
      if (!guest) {
        guest = `guest_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("guestId", guest);
      }
      setGuestId(guest);
    }
  }, []);

  // Fetch cart data
  useEffect(() => {
    if (token === null && guestId === null) return;

    const fetchCart = async () => {
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

        const data = await response.json();
        const items = Array.isArray(data) ? data : data?.items || [];
        setCartData(items);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartData([]);
      }
    };

    fetchCart();
  }, [token, guestId]);

  // Calculate totals
  useEffect(() => {
    const calculateTotal = (cartItems) => {
      return cartItems.reduce(
        (total, item) =>
          total + Number(item.productId.price) * Number(item.quantity),
        0
      );
    };

    const totalAmount = calculateTotal(cartData);
    setTotal(totalAmount);

    // Apply GST on discounted total if promo applied, otherwise on full total
    const amountForGst = discount > 0 ? totalAmount - discount : totalAmount;
    const gstAmount = amountForGst * 0.03;
    setGst(gstAmount);
  }, [cartData, discount]);

  // Update quantity
  const handleQuantityChange = (id, newQuantity) => {
    setCartData((prev) =>
      prev.map((item) =>
        item.productId._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const handleRemoveItem = (productId) => {
    setCartData((prevCart) =>
      prevCart.filter((item) => item.productId._id !== productId)
    );
  };

  // Apply promo code
  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    const code = promoCode.trim().toLowerCase();

    if (!token) {
      setPromoMessage("Please log in to apply a promo code.");
      return;
    }

    let discountAmount = 0;
    let message = "Invalid code. Please enter a valid promo code.";

    if (code === "g-15") {
      discountAmount = total * 0.15;
      message = `Promo code applied! You saved ₹${discountAmount.toFixed(2)}`;
    }

    setDiscount(discountAmount);
    setPromoMessage(message);

    // Log promo usage
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/promocode-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: token ? JSON.parse(localStorage.getItem("user"))._id : null,
          guestId: token ? null : guestId,
          promoCode: code,
          cartItems: cartData.map((item) => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
          })),
          timestamp: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Promo usage logged successfully");
    } catch (err) {
      console.error("Error logging promo usage:", err);
    }
  };

  // Checkout
  const handleCheckout = () => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
  
    router.push({
      pathname: "/checkout",
      query: {
        total: (total - discount + gst).toFixed(2),
        isGuest: !token,
        guestId,
      },
    });
  };
  

  return (
    <div className="cart">
      <div className="wrapper">
        <div className="cart-table">
          <div className="cart-table__box">
            <div className="cart-table__row cart-table__row-head">
              <div className="cart-table__col">Product</div>
              <div className="cart-table__col">Price</div>
              <div className="cart-table__col">Quantity</div>
              <div className="cart-table__col">Total</div>
              <div className="cart-table__col">Action</div>
            </div>

            {cartData.map((cartItem) => (
              <>
              <Card
                key={cartItem._id}
                onRemove={handleRemoveItem}
                cart={{
                  id: cartItem.productId._id,
                  name: cartItem.productId.name,
                  image: cartItem.productId.images?.[0] || "/default-image.jpg",
                  isStocked: cartItem.productId.isStocked || false,
                  productNumber: cartItem.productId.productNumber || "N/A",
                  oldPrice: cartItem.productId.oldPrice || null,
                  price: cartItem.productId.price,
                  stock: cartItem.productId.stock ,
                  quantity: cartItem.quantity,
                }}
                onChangeQuantity={handleQuantityChange}
              />
           </> ))}
          </div>
        </div>

        <div className="cart-bottom">
          <div className="cart-bottom__promo">
            <form className="cart-bottom__promo-form" onSubmit={handlePromoSubmit}>
              <div className="box-field__row">
                <div className="box-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-grey">apply code</button>
              </div>
              {promoMessage && (
                <div
                  style={{
                    marginTop: "10px",
                    color: promoMessage.includes("Invalid") || promoMessage.includes("log in") ? "red" : "green",
                  }}
                >
                  {promoMessage}
                </div>
              )}
            </form>

            <h6>How to get a promo code?</h6>
            <p>Follow our news and social media for the latest codes and offers.</p>
            {/* <div className="contacts-info__social">
              <span>Find us here:</span>
              <ul>
                {socialLinks.map((social, index) => (
                  <li key={index}>
                    <a href={social.path} target="_blank" rel="noopener noreferrer">
                      <i className={social.icon}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>

          <div className="cart-bottom__total">
            <div className="cart-bottom__total-goods">
              Goods on <span>₹{total.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <>
                <div className="cart-bottom__total-promo">
                  Discount (g-15): <span>- ₹{discount.toFixed(2)}</span>
                </div>
                <div className="cart-bottom__total-discount-percent">
                  You saved <strong>15%</strong> of your total amount!
                </div>
              </>
            )}

            <div className="cart-bottom__total-promo">
              GST (3%): <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="cart-bottom__total-num">
              Total to Pay: <span>₹{(total - discount + gst).toFixed(2)}</span>
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
    </div>
  );
};
