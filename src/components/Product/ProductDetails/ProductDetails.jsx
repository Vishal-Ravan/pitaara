import productData from "data/product/product";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import socialData from "data/social";
import { Reviews } from "../Reviews/Reviews";
import { ReviewFrom } from "../ReviewForm/ReviewFrom";
import { useRouter } from "next/router";
import { CartContext } from "pages/_app";
import { NewArrivals } from "components/landing/NewArrivals/NewArrivals";

export const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    if (id) {
      setProductId(id); // Store the id in productId
    }
  }, [id]);

  const { cart, setCart } = useContext(CartContext);

  const socialLinks = [...socialData];
  const products = [...productData];
  const [product, setProduct] = useState(null);
  const [addedInCart, setAddedInCart] = useState(false);

  useEffect(() => {
    if (router.query.id) {
      const data = products.find((pd) => pd.id === router.query.id);
      setProduct(data);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (product) {
      setAddedInCart(Boolean(cart?.find((pd) => pd.id === product.id)));
    }
  }, [product, cart]);

  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(2);
  const [activeColor, setActiveColor] = useState(2);
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const [alertMessage, setAlertMessage] = useState(null); // State for alert messages

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000); // Hide alert after 3 seconds
  };

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${id}`
          );
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const addToCart = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;
      let guestId = localStorage.getItem("guestId");

      // Generate guest ID if not available
      if (!token && !guestId) {
        guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("guestId", guestId);
      }

      if (!productId) {
        console.error("Product ID is missing");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            productId,
            quantity,
            ...(guestId ? { guestId } : {}),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      showAlert("Added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };
  useEffect(() => {
    if (product && quantity > product.quantity) {
      setQuantity(product.quantity > 0 ? product.quantity : 1);
    }
  }, [product]);

  const addToWishlist = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;
      let guestId = localStorage.getItem("guestId");

      // Generate guest ID if not available
      if (!token && !guestId) {
        guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("guestId", guestId);
      }

      if (!productId) {
        console.error("Product ID is missing");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            productId,
            quantity,
            ...(guestId ? { guestId } : {}),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      showAlert(data.message);
    } catch (error) {
      console.error("Error adding to wishlist:", error.message);
    }
  };

  if (!product) return <></>;

  return (
    <>
      <div className="product">
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
        <div className="wrapper" style={{ marginBottom: "70px" }}>
          <div className="product-content">
            {/* Product Main Slider */}
            <div className="product-slider">
              <div className="product-slider__main">
                <Slider
                  fade={true}
                  asNavFor={nav2}
                  arrows={false}
                  lazyLoad={true}
                  ref={(slider1) => setNav1(slider1)}
                >
                  {product.images.map((img, index) => (
                    <div key={index} className="product-slider__main-item">
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${img}`}
                        alt="Product"
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              <div className="product-slider__nav">
                <Slider
                  arrows={false}
                  asNavFor={nav1}
                  ref={(slider2) => setNav2(slider2)}
                  slidesToShow={
                    product.images.length >= 4 ? 4 : product.images.length
                  }
                  swipeToSlide={true}
                  focusOnSelect={true}
                >
                  {product.images.map((image, index) => (
                    <div key={index} className="product-slider__nav-item">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image}`}
                        alt="Product"
                        height={80}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <span
  className={`product-stock ${
    product.stock > 0 ? "in-stock" : "out-of-stock"
  }`}
>
  {product.stock === 1
    ? "1 product left"
    : product.stock === 0
    ? "Out of Stock"
    : "In Stock"}
</span>


              {/* <span className="product-num">Quantity: {product.quantity}</span> */}
              <span className="product-num">
                Dimension : {product.dimensions}
              </span>
              <span className="product-price"> ₹{product.price} </span>

              <p>{product.description}</p>

              <div className="product-options">
                <div className="product-info__color">
                  <span>Color:</span>
                  <h5>
                    <span>{product.color}</span>
                  </h5>
                </div>

                <div className="product-info__color">
                  <span>Material:</span>
                  <h5>
                    <span>{product.material}</span>
                  </h5>
                </div>
                <div className="product-info__quantity">
                  <span className="product-info__quantity-title">
                    Quantity:
                  </span>
                  <div className="counter-box">
                    <span
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                      className="counter-link counter-link__prev"
                    >
                      -
                    </span>
                    <input
                      type="text"
                      className="counter-input"
                      disabled
                      value={quantity}
                    />
                    <span
                      onClick={() => {
                        if (quantity < product.quantity) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="counter-link counter-link__next"
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>

              <div className="product-buttons">
                <div className="product-buttons">
                  <button
                    onClick={addToCart}
                    className="btn btn-icon"
                    disabled={product.quantity === 0}
                  >
                    <i className="icon-cart"></i> cart
                  </button>

                  <button
                    className="btn btn-grey btn-icon"
                    onClick={addToWishlist}
                  >
                    <i className="icon-heart"></i> wish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="new">
          <NewArrivals />
        </div>{" "}
      </div>
    </>
  );
};
