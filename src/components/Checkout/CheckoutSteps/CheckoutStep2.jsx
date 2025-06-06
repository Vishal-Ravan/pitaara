import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// Generate or retrieve guest ID
const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// Checkout Step for Guest Users and Logged-in Users
export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const { total } = router.query;
    if (total) {
      setTotalAmount(parseFloat(total));
    }
    return () => {
      isMounted.current = false;
    };
  }, [router.query]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartData")) || [];
    console.log(cartItems, 'cart items for guest');
  }, []);

  const clearCart = () => {
    localStorage.removeItem("cart");
  };

  // Function to get user token (Auth token or Guest ID)
  const getUserToken = () => {
    // Check if user is logged in (assuming token is stored in localStorage)
    const authToken = JSON.parse(localStorage.getItem("user"));
    if (authToken) {
      return authToken; // Logged-in user, use authToken
    } else {
      return getGuestId(); // Guest checkout, use guest ID
    }
  };
useEffect(()=>{
  const token = getUserToken(); // Get either authToken or guestId
console.log(token.id,'ko')

},[])
  const placeOrder = async () => {
    if (!isMounted.current) return;
    setLoading(true);
  
    const token = getUserToken(); // Get either authToken or guestId
    const isGuest = !localStorage.getItem("user"); // Check if it's a guest checkout
  
    const cartItems = JSON.parse(localStorage.getItem("cartData")) || [];
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "Online",
          items: cartItems, // 🛒 Include cart items here
          guestId: isGuest ? token : undefined, // Use guestId only for guest users
          authToken: !isGuest ? token : undefined, // Use authToken only for logged-in users
          id:token.id
        }),
      });
  
      const data = await response.json();
      console.log("Order Response:", data);
  
      if (response.ok) {
        if (isMounted.current) {
          setAlertMessage("Order placed successfully!");
          if (isGuest) {
            clearCart(); // Only clear cart for guests
          }
          localStorage.setItem("orderDetails", JSON.stringify(data));
          router.push("/orderconfirm");
          setTimeout(() => isMounted.current && setAlertMessage(""), 3000);
        }
      } else {
        if (isMounted.current) setAlertMessage(data.message || "Checkout failed");
      }
    } catch (error) {
      if (isMounted.current) setAlertMessage("Something went wrong. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };
  

  const handlePayment = async () => {
    if (!isMounted.current) return;
    setLoading(true);

    const token = getUserToken(); // Get either authToken or guestId
    const isGuest = !localStorage.getItem("authToken"); // Check if it's a guest checkout

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          guestId: isGuest ? token : undefined, // Use guestId only for guest users
          authToken: !isGuest ? token : undefined, // Use authToken only for logged-in users
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const orderData = await response.json();
      console.log("Order Created:", orderData);

      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: "rzp_live_Zx37ebQvBSKo25", // Use your real Razorpay Key
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Pittara",
          description: "Payment for your order",
          order_id: orderData.id,
          handler: async (paymentResponse) => {
            try {
              console.log("Payment Response:", paymentResponse);

              const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/verify-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...paymentResponse,
                  guestId: isGuest ? token : undefined, // Use guestId only for guest users
                  authToken: !isGuest ? token : undefined, // Use authToken only for logged-in users
                }),
              });

              const verifyData = await verifyResponse.json();
              console.log("Payment Verification Response:", verifyData);

              if (verifyData.success && isMounted.current) {
                setAlertMessage("Payment successful! Placing your order...");
                placeOrder();
              } else if (isMounted.current) {
                setAlertMessage("Payment verification failed.");
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              if (isMounted.current) setAlertMessage("Something went wrong. Please try again.");
            }
          },
          theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        if (isMounted.current) setAlertMessage("Razorpay SDK not loaded. Please check your script.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      if (isMounted.current) setAlertMessage("Something went wrong. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <>
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

      <div className="checkout-payment checkout-form">
        <h4>Payment Method</h4>

        <div className="checkout-payment__item active">
          <div className="checkout-payment__item-head">
            <label className="radio-box">
              Online Payment
              <input type="radio" checked={true} readOnly />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Secure online payment using your credit/debit card or UPI.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="checkout-buttons">
          <button onClick={onPrev} className="btn btn-grey btn-icon" disabled={loading}>
            <i className="icon-arrow"></i> Back
          </button>
          <button onClick={handlePayment} className="btn btn-icon btn-next" disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${totalAmount}`} <i className="icon-arrow"></i>
          </button>
        </div>
      </div>
    </>
  );
};
