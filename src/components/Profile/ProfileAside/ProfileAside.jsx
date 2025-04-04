import Link from "next/link";
import productData from "data/product/product";
import { useState } from "react";

export const ProfileAside = () => {
  const recentlyViewed = [...productData].slice(0, 3);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

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
      <div className="profile-aside">
        <div className="profile-aside__subscribe">
          <h3>Stay in touch</h3>
          <form onSubmit={handleSubmit}>
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
          </form>
          <img
            src="/assets/img/subscribe-img-decor-sm.png"
            className="js-img"
            alt=""
          />
          {message && <p className="subscribe-message">{message}</p>}
        </div>
        {/* <div className='profile-aside__viewed'>
          <h5>You have viewed</h5>
          {recentlyViewed.map((product) => (
            <div key={product.id} className='profile-aside__viewed-item'>
              <Link href={`/product/${product.id}`}>
                <a className='profile-aside__viewed-item-img'>
                  <img src={product.image} className='js-img' alt='' />
                </a>
              </Link>
              <div className='profile-aside__viewed-item-info'>
                <Link href={`/product/${product.id}`}>
                  <a className='profile-aside__viewed-item-title'>
                    {product.name}
                  </a>
                </Link>
                <span className='profile-aside__viewed-item-price'>
                  ${product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          className='profile-aside__discount js-img'
          style={{ backgroundImage: `url('/assets/img/discount-bg-sm.jpg')` }}
        >
          <div className='profile-aside__discount-title'>
            Get Your
            <br />
            <span>50%</span> Off
          </div>
          <Link href='/shop'>
            <a className='btn'>
              get now!
            </a>
          </Link>
        </div> */}
      </div>
    </>
  );
};
