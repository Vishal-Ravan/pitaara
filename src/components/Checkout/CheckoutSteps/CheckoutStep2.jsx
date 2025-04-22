import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const { total, guestId, isGuest } = router.query; // Get parameters from the URL
    if (total) {
      setTotalAmount(parseFloat(total));
    }
    if (isGuest && guestId) {
      console.log("Guest ID from URL:", guestId); // Debugger for guest ID
      localStorage.setItem("guestId", guestId); // Optionally, save it to localStorage if needed
    }
    return () => {
      isMounted.current = false;
    };
  }, [router.query]);

  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    if (token) {
      return token; // Return logged-in user's token if available
    }
    return localStorage.getItem("guestId"); // Return the guestId from localStorage if available
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
  };

  const placeOrder = async () => {
    if (!isMounted.current) return;
    setLoading(true);

    const token = getUserToken();
    const isGuest = token?.startsWith("guest_");

    const billingData = JSON.parse(localStorage.getItem("billingAddress"));
    const cartItems = JSON.parse(localStorage.getItem("cartData")) || [];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isGuest ? {} : { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          paymentMethod: "Online",
          billingAddress: billingData,
          items: cartItems, // 🛒 Include cart items here
          ...(isGuest ? { guestId: "1c3d8278-ea26-4549-9f83-5b90089937f5" } : {}),
        }),
      });

      const data = await response.json();
      console.log("Order Response:", data);

      if (response.ok) {
        if (isMounted.current) {
          setAlertMessage("Order placed successfully!");
          clearCart();
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

    const token = getUserToken();
    const isGuest = token?.startsWith("guest_");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isGuest ? {} : { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          ...(isGuest ? { guestId: token } : {}),
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const orderData = await response.json();
      console.log("Order Created:", orderData);

      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: "rzp_test_fqpkJvzLDTe1y3", // Use your real Razorpay Key
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
                  ...(isGuest ? {} : { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                  ...paymentResponse,
                  ...(isGuest ? { guestId: token } : {}),
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
