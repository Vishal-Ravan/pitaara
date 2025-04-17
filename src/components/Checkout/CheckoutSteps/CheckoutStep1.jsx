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
  const [sameAsShipping, setSameAsShipping] = useState(false);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const section = dataset.type;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [`${section}_${name}`]: "",
    }));
  };

  const handleCheckboxChange = () => {
    setSameAsShipping(!sameAsShipping);

    setFormData((prev) => ({
      ...prev,
      billingAddress: !sameAsShipping
        ? { ...prev.shippingAddress }
        : {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
    }));
  };

  const validateForm = (data, prefix) => {
    const newErrors = {};
    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        newErrors[`${prefix}_${key}`] = `${key} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = getUserToken();
    const isGuest = !token;
    const guestId = isGuest
      ? localStorage.getItem("guestId") || `guest_${Date.now()}`
      : null;
  
    if (isGuest && !localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }
  
    const shippingErrors = validateForm(formData.shippingAddress, "shippingAddress");
    const billingErrors = validateForm(formData.billingAddress, "billingAddress");
    const allErrors = { ...shippingErrors, ...billingErrors };
  
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setLoading(false);
      return;
    }
  
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
  
      const shippingPayload = {
        shippingAddress: formData.shippingAddress,
        ...(isGuest && { guestId }),
      };
  
      const billingPayload = {
        billingAddress: formData.billingAddress,
        ...(isGuest && { guestId }),
      };
  
      const shippingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipping`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(shippingPayload),
        }
      );
  
      const shippingData = await shippingRes.json();
      if (!shippingRes.ok) throw new Error(shippingData.message || "Failed to save shipping address");
  
      const billingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/billing`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(billingPayload),
        }
      );
  
      const billingData = await billingRes.json();
      if (!billingRes.ok) throw new Error(billingData.message || "Failed to save billing address");
  
      onNext();
    } catch (err) {
      console.error("CheckoutStep1 API Error:", err.message);
    }
  
    setLoading(false);
  };
  

  const renderInput = (label, name, section, type = "text") => (
    <div className="box-field">
      <input
        type={type}
        name={name}
        className="form-control"
        placeholder={label}
        value={formData[section][name]}
        onChange={handleChange}
        data-type={section}
        required
      />
      {errors[`${section}_${name}`] && (
        <p className="error">{errors[`${section}_${name}`]}</p>
      )}
    </div>
  );

  return (
    <div className="checkout-form checkout-form__item">
      <form onSubmit={(e) => e.preventDefault()}>
        <h4>Shipping Address</h4>
        {renderInput("Full Name", "fullName", "shippingAddress")}
        <div className="box-field__row">
          {renderInput("Email", "email", "shippingAddress", "email")}
          {renderInput("Phone", "phone", "shippingAddress")}
        </div>
        <div className="box-field__row">
          {renderInput("Address", "address", "shippingAddress")}
          {renderInput("City", "city", "shippingAddress")}
        </div>
        <div className="box-field__row">
          {renderInput("State", "state", "shippingAddress")}
          {renderInput("Postal Code", "postalCode", "shippingAddress")}
        </div>
        {renderInput("Country", "country", "shippingAddress")}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={handleCheckboxChange}
          />{" "}
          Billing address same as shipping
        </label>

        <h4>Billing Address</h4>
        {renderInput("Full Name", "fullName", "billingAddress")}
        <div className="box-field__row">
          {renderInput("Email", "email", "billingAddress", "email")}
          {renderInput("Phone", "phone", "billingAddress")}
        </div>
        <div className="box-field__row">
          {renderInput("Address", "address", "billingAddress")}
          {renderInput("City", "city", "billingAddress")}
        </div>
        <div className="box-field__row">
          {renderInput("State", "state", "billingAddress")}
          {renderInput("Postal Code", "postalCode", "billingAddress")}
        </div>
        {renderInput("Country", "country", "billingAddress")}

        <div className="checkout-buttons">
          <button
            type="button"
            className="btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};