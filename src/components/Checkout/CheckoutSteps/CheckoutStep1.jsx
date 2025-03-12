import { useState } from 'react';

const getUserToken = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData?.token || null;
};

export const CheckoutStep1 = ({ onNext }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear errors on change
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return; // Stop if validation fails
  
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
          Authorization: `Bearer ${token}`, // Include token in request
        },
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
  
      if (response.ok) {
        onNext(); // Move to the next step
      } else {
        console.error("Failed to save shipping address", responseData);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };
  

  return (
    <>
      <div className='checkout-form'>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='checkout-form__item'>
            <h4>Info about you</h4>
            <div className='box-field'>
              <input
                type='text'
                name='fullName'
                className='form-control'
                placeholder='Enter your full name'
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className='error'>{errors.fullName}</span>}
            </div>
            <div className='box-field__row'>
              <div className='box-field'>
                <input
                  type='tel'
                  name='phone'
                  className='form-control'
                  placeholder='Enter your phone'
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className='error'>{errors.phone}</span>}
              </div>
              <div className='box-field'>
                <input
                  type='email'
                  name='email'
                  className='form-control'
                  placeholder='Enter your mail'
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className='error'>{errors.email}</span>}
              </div>
            </div>
          </div>

          <div className='checkout-form__item'>
            <h4>Delivery Info</h4>
            <div className='box-field__row'>
              <div className='box-field'>
                <input
                  type='text'
                  name='address'
                  className='form-control'
                  placeholder='Enter address'
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <span className='error'>{errors.address}</span>}
              </div>
              <div className='box-field'>
                <input
                  type='text'
                  name='city'
                  className='form-control'
                  placeholder='Enter the city'
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <span className='error'>{errors.city}</span>}
              </div>
            </div>

            <div className='box-field__row'>
              <div className='box-field'>
                <input
                  type='text'
                  name='state'
                  className='form-control'
                  placeholder='Enter the state'
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && <span className='error'>{errors.state}</span>}
              </div>
              <div className='box-field'>
                <input
                  type='number'
                  name='postalCode'
                  className='form-control'
                  placeholder='Enter the postalCode'
                  value={formData.postalCode}
                  onChange={handleChange}
                />
                {errors.postalCode && <span className='error'>{errors.postalCode}</span>}
              </div>
            </div>

            <div className='box-field'>
              <input
                type='text'
                name='country'
                className='form-control'
                placeholder='Enter the country'
                value={formData.country}
                onChange={handleChange}
              />
              {errors.country && <span className='error'>{errors.country}</span>}
            </div>
          </div>

          <div className='checkout-buttons'>
            <button type='button' onClick={handleSubmit} className='btn btn-icon btn-next'>
              next <i className='icon-arrow'></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
