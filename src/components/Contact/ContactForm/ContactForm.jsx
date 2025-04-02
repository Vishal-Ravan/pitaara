import { useState } from "react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Something went wrong");

      setResponseMessage("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });

    } catch (error) {
      setResponseMessage(error.message || "Failed to send message");
    }

    setLoading(false);
  };

  return (
    <div className='discount discount-contacts js-img' style={{ backgroundImage: `url('/assets/img/discount-bg3.jpg')` }}>
      <div className='wrapper'>
        <div className='discount-info'>
          <span className='saint-text'>Write to us</span>
          <span className='main-text'>Leave a message</span>
          <p>Write to us if you have any questions, we will contact you and find a solution.</p>
          <form onSubmit={handleSubmit}>
            <div className='box-field'>
              <input type='text' name='name' className='form-control' placeholder='Enter your name' value={formData.name} onChange={handleChange} required />
            </div>
            <div className='box-field'>
              <input type='email' name='email' className='form-control' placeholder='Enter your email' value={formData.email} onChange={handleChange} required />
            </div>
            <div className='box-field'>
              <input type='tel' name='phone' className='form-control' placeholder='Enter your phone number' value={formData.phone} onChange={handleChange} required />
            </div>
            <div className='box-field box-field__textarea'>
              <textarea name='message' className='form-control' placeholder='Enter your message' value={formData.message} onChange={handleChange} required />
            </div>
            <button type='submit' className='btn' disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
