import { useState } from "react";

export const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to subscribe");

      setMessage("Subscription successful!");
      setEmail(""); // Clear input field
    } catch (error) {
      setMessage("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <!-- BEGIN SUBSCRIBE --> */}
      <div className="subscribe">
        <div className="wrapper">
          <div className="subscribe-form">
            <div className="subscribe-form__img">
              <img src="/assets/img/subscribe-img.png" className="js-img" alt="" />
            </div>
            <form onSubmit={handleSubmit}>
              <h3>Stay in touch</h3>
              <p>Nourish your skin with toxin-free cosmetic products.</p>
              <div className="box-field__row">
                <div className="box-field">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              {message && <p className="subscribe-message">{message}</p>}
            </form>
          </div>
        </div>
      </div>
      {/* <!-- SUBSCRIBE EOF   --> */}
    </>
  );
};
