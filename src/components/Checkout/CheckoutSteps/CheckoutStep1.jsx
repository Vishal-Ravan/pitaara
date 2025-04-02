import { useState } from "react";

const getUserToken = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData?.token || null;
};

export const CheckoutStep1 = ({ onNext }) => {
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    billingAddress: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData({
      ...formData,
      [dataset.type]: {
        ...formData[dataset.type],
        [name]: value,
      },
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (data) => {
    const newErrors = {};
    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        newErrors[key] = `${key} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = getUserToken();
    if (!token) {
      alert("Please log in to proceed with checkout.");
      setLoading(false);
      return;
    }

    // Validate Shipping Address
    const shippingErrors = validateForm(formData.shippingAddress);
    if (Object.keys(shippingErrors).length > 0) {
      setErrors(shippingErrors);
      setLoading(false);
      return;
    }

    try {
      // Call Shipping Address API
      const shippingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress: formData.shippingAddress }),
      });

      const shippingData = await shippingResponse.json();
      if (!shippingResponse.ok) throw new Error("Failed to save shipping address");

      console.log("Shipping Address Saved:", shippingData);

      // Validate Billing Address
      const billingErrors = validateForm(formData.billingAddress);
      if (Object.keys(billingErrors).length > 0) {
        setErrors(billingErrors);
        setLoading(false);
        return;
      }

      // Call Billing Address API
      const billingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/billing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billingAddress: formData.billingAddress }),
      });

      const billingData = await billingResponse.json();
      if (!billingResponse.ok) throw new Error("Failed to save billing address");

      console.log("Billing Address Saved:", billingData);

      onNext(); // Move to the next step

    } catch (error) {
      console.error("API Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="checkout-form">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* SHIPPING ADDRESS */}
        <h4>Shipping Address</h4>
        {Object.keys(formData.shippingAddress).map((key) => (
          <div key={key} className="box-field">
            <input
              type="text"
              name={key}
              className="form-control"
              placeholder={`Enter ${key}`}
              value={formData.shippingAddress[key]}
              onChange={handleChange}
              data-type="shippingAddress"
            />
            {errors[key] && <span className="error">{errors[key]}</span>}
          </div>
        ))}

        {/* BILLING ADDRESS */}
        <h4>Billing Address</h4>
        {Object.keys(formData.billingAddress).map((key) => (
          <div key={key} className="box-field">
            <input
              type="text"
              name={key}
              className="form-control"
              placeholder={`Enter ${key}`}
              value={formData.billingAddress[key]}
              onChange={handleChange}
              data-type="billingAddress"
            />
            {errors[key] && <span className="error">{errors[key]}</span>}
          </div>
        ))}

        <div className="checkout-buttons">
          <button type="button" onClick={handleSubmit} className="btn btn-next" disabled={loading}>
            {loading ? "Processing..." : "Next"} <i className="icon-arrow"></i>
          </button>
        </div>
      </form>
    </div>
  );
};
