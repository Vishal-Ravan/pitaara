import { useState } from "react";

export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [payment, setPayment] = useState("online");
  const [loading, setLoading] = useState(false);
  const amount = 1000; // Set actual order amount

  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = getUserToken();
      if (!token) {
        alert("Please log in to proceed with checkout.");
        setLoading(false);
        return;
      }

      // Step 1: Create Order in Razorpay
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, currency: "INR" }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const orderData = await response.json();
      console.log("Order Created:", orderData);

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please check your script.");
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay Payment Modal
      const options = {
        key: "rzp_test_fqpkJvzLDTe1y3", // Use from .env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your Website Name",
        description: "Payment for your order",
        order_id: orderData.id,
        handler: async (paymentResponse) => {
          try {
            console.log("Payment Response:", paymentResponse);

            // Step 3: Verify Payment on Backend
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(paymentResponse),
            });

            const verifyData = await verifyResponse.json();
            console.log("Payment Verification Response:", verifyData);

            if (verifyData.success) {
              alert("Payment successful! Placing your order...");

              // Step 4: Auto Place Order After Payment
              const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ paymentMethod: "Online" }),
              });

              const orderResult = await orderResponse.json();
              console.log("Order Placement Response:", orderResult);

              if (orderResponse.ok) {
                alert("Order placed successfully!");
                window.location.href = "/order-success"; // Redirect to success page
              } else {
                alert("Order placement failed: " + orderResult.message);
              }
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Something went wrong. Please try again.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    const token = getUserToken();
    if (!token) {
      alert("Please log in to proceed with checkout.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethod: "COD" }),
      });

      const data = await response.json();
      console.log("COD Order Response:", data);

      if (response.ok) {
        alert("Order placed successfully!");
        onNext();
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (payment === "online") {
      handlePayment();
    } else {
      handleCODOrder();
    }
  };

  return (
    <>
      <div className="checkout-payment checkout-form">
        <h4>Payment Methods</h4>

        <div className={`checkout-payment__item ${payment === "online" ? "active" : ""}`}>
          <div className="checkout-payment__item-head">
            <label className="radio-box">
              Credit card
              <input type="radio" checked={payment === "online"} name="radio" onChange={() => setPayment("online")} />
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

        <div className={`checkout-payment__item ${payment === "COD" ? "active" : ""}`}>
          <div className="checkout-payment__item-head">
            <label className="radio-box">
              COD payment
              <input type="radio" checked={payment === "COD"} name="radio" onChange={() => setPayment("COD")} />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Pay cash on delivery when you receive your order.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="checkout-buttons">
          <button onClick={onPrev} className="btn btn-grey btn-icon" disabled={loading}>
            <i className="icon-arrow"></i> back
          </button>
          <button onClick={handleCheckout} className="btn btn-icon btn-next" disabled={loading}>
            {loading ? "Processing..." : "Next"} <i className="icon-arrow"></i>
          </button>
        </div>
      </div>
    </>
  );
};
