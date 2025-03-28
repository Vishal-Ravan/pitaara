import { useState } from 'react';

const getUserToken = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData?.token || null;
};

export const CheckoutStep1 = ({ onNext }) => {
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    billingAddress: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    sameAsShipping: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e, section) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [e.target.name]: e.target.value,
      },
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData.shippingAddress).forEach((key) => {
      if (!formData.shippingAddress[key]) {
        newErrors[`shippingAddress.${key}`] = `${key} is required`;
      }
    });
    if (!formData.sameAsShipping) {
      Object.keys(formData.billingAddress).forEach((key) => {
        if (!formData.billingAddress[key]) {
          newErrors[`billingAddress.${key}`] = `${key} is required`;
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = getUserToken();
    if (!token) {
      alert("Please log in to proceed with checkout.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
        }),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        onNext();
      } else {
        console.error("Failed to save shipping address", responseData);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <div className='checkout-form'>
      <form onSubmit={(e) => e.preventDefault()}>
        <h4>Shipping Address</h4>
        {Object.keys(formData.shippingAddress).map((key) => (
          <div key={key} className='box-field'>
            <input
              type='text'
              name={key}
              className='form-control'
              placeholder={`Enter ${key}`}
              value={formData.shippingAddress[key]}
              onChange={(e) => handleChange(e, 'shippingAddress')}
            />
            {errors[`shippingAddress.${key}`] && <span className='error'>{errors[`shippingAddress.${key}`]}</span>}
          </div>
        ))}
        
        <div className='box-field'>
          <input
            type='checkbox'
            checked={formData.sameAsShipping}
            onChange={() => setFormData({ ...formData, sameAsShipping: !formData.sameAsShipping })}
          /> Use shipping address as billing address
        </div>

        {!formData.sameAsShipping && (
          <>
            <h4>Billing Address</h4>
            {Object.keys(formData.billingAddress).map((key) => (
              <div key={key} className='box-field'>
                <input
                  type='text'
                  name={key}
                  className='form-control'
                  placeholder={`Enter ${key}`}
                  value={formData.billingAddress[key]}
                  onChange={(e) => handleChange(e, 'billingAddress')}
                />
                {errors[`billingAddress.${key}`] && <span className='error'>{errors[`billingAddress.${key}`]}</span>}
              </div>
            ))}
          </>
        )}

        <div className='checkout-buttons'>
          <button type='button' onClick={handleSubmit} className='btn btn-icon btn-next'>
            Next <i className='icon-arrow'></i>
          </button>
        </div>
      </form>
    </div>
  );
};
