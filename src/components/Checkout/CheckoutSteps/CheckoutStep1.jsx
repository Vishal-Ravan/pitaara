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
    setFormData((prevData) => ({
      ...prevData,
      [dataset.type]: {
        ...prevData[dataset.type],
        [name]: value,
      },
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCheckboxChange = () => {
    setSameAsShipping(!sameAsShipping);
    setFormData((prevData) => ({
      ...prevData,
      billingAddress: !sameAsShipping
        ? { ...prevData.shippingAddress }
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
    const token = getUserToken(); // can be null if guest

    const shippingErrors = validateForm(formData.shippingAddress);
    if (Object.keys(shippingErrors).length > 0) {
      setErrors(shippingErrors);
      setLoading(false);
      return;
    }

    try {
      // Prepare headers
      const commonHeaders = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Add token only if logged in
      };

      // ✅ Submit shipping address
      const shippingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipping`,
        {
          method: "POST",
          headers: commonHeaders,
          body: JSON.stringify({ shippingAddress: formData.shippingAddress }),
        }
      );

      const shippingData = await shippingResponse.json();
      if (!shippingResponse.ok)
        throw new Error("Failed to save shipping address");

      console.log("Shipping Address Saved:", shippingData);

      // ✅ Validate billing address
      const billingErrors = validateForm(formData.billingAddress);
      if (Object.keys(billingErrors).length > 0) {
        setErrors(billingErrors);
        setLoading(false);
        return;
      }

      // ✅ Submit billing address
      const billingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/billing`,
        {
          method: "POST",
          headers: commonHeaders,
          body: JSON.stringify({ billingAddress: formData.billingAddress }),
        }
      );

      const billingData = await billingResponse.json();
      if (!billingResponse.ok)
        throw new Error("Failed to save billing address");

      console.log("Billing Address Saved:", billingData);

      // ✅ Continue to next step
      onNext();
    } catch (error) {
      console.error("API Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="checkout-form checkout-form__item">
      <form onSubmit={(e) => e.preventDefault()}>
        <h4>Shipping Address</h4>
        <div className="box-field">
          <input
            type="text"
            name="fullName"
            className="form-control"
            placeholder="Full Name"
            value={formData.shippingAddress.fullName}
            onChange={handleChange}
            required
            data-type="shippingAddress"
          />
        </div>

        <div className="box-field__row">
          <div className="box-field">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.shippingAddress.email}
              onChange={handleChange}
              data-type="shippingAddress"
              required
            />
          </div>
          <div className="box-field">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Phone"
              value={formData.shippingAddress.phone}
              onChange={handleChange}
              data-type="shippingAddress"
              required
            />
          </div>
        </div>

        <div className="box-field__row">
          <div className="box-field">
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Address"
              value={formData.shippingAddress.address}
              onChange={handleChange}
              data-type="shippingAddress"
              required
            />
          </div>
          <div className="box-field">
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="City"
              value={formData.shippingAddress.city}
              onChange={handleChange}
              data-type="shippingAddress"
              required
            />
          </div>
        </div>
        <div className="box-field__row">
          <div className="box-field">
            <input
              type="text"
              name="state"
              className="form-control"
              placeholder="State"
              value={formData.shippingAddress.state}
              onChange={handleChange}
              data-type="shippingAddress"
              required
            />
          </div>
          <div className="box-field">
            <input
              type="text"
              name="postalCode"
              className="form-control"
              placeholder="Postal Code"
              value={formData.shippingAddress.postalCode}
              onChange={handleChange}
              data-type="shippingAddress"
              required
            />
          </div>
        </div>
        <div className="box-field">
          <input
            type="text"
            name="country"
            className="form-control"
            placeholder="Country"
            value={formData.shippingAddress.country}
            onChange={handleChange}
            data-type="shippingAddress"
            required
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={handleCheckboxChange}
          />
          Billing address same as shipping
        </label>

        <h4>Billing Address</h4>
        <div className="box-field">
          <input
            type="text"
            name="fullName"
            className="form-control"
            placeholder="Full Name"
            value={formData.billingAddress.fullName}
            onChange={handleChange}
            data-type="billingAddress"
            required
          />
        </div>
        <div className="box-field__row">
          <div className="box-field">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.billingAddress.email}
              onChange={handleChange}
              data-type="billingAddress"
              required
            />
          </div>
          <div className="box-field">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Phone"
              value={formData.billingAddress.phone}
              onChange={handleChange}
              data-type="billingAddress"
              required
            />
          </div>
        </div>

        <div className="box-field__row">
          <div className="box-field">
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Address"
              value={formData.billingAddress.address}
              onChange={handleChange}
              data-type="billingAddress"
              required
            />
          </div>
          <div className="box-field">
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="City"
              value={formData.billingAddress.city}
              onChange={handleChange}
              data-type="billingAddress"
              required
            />
          </div>
        </div>
        <div className="box-field__row">
          <div className="box-field">
            <input
              type="text"
              name="state"
              className="form-control"
              placeholder="State"
              value={formData.billingAddress.state}
              onChange={handleChange}
              data-type="billingAddress"
              required
            />
          </div>
          <div className="box-field">
            <input
              type="text"
              name="postalCode"
              className="form-control"
              placeholder="Postal Code"
              value={formData.billingAddress.postalCode}
              onChange={handleChange}
              required
              data-type="billingAddress"
            />
          </div>
        </div>
        <div className="box-field">
          <input
            type="text"
            name="country"
            className="form-control"
            placeholder="Country"
            value={formData.billingAddress.country}
            onChange={handleChange}
            required
            data-type="billingAddress"
          />
        </div>
        <div className="checkout-buttons">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-icon btn-next"
            disabled={loading}
          >
            {loading ? "Processing..." : "Next"}
            <i className="icon-arrow"></i>
          </button>
        </div>
      </form>
    </div>
  );
};
