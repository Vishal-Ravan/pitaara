import { useState } from "react";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { SingleProduct } from "./SingleProduct/SingleProduct";
import {
  SlickArrowPrev,
  SlickArrowNext,
} from "components/utils/SlickArrows/SlickArrows";

export const ProductsCarousel = ({ productsdata = [] }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const router = useRouter();

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleAddToCart = async (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    let guestId = localStorage.getItem("guestId");

    // Generate guest ID if not available
    if (!token && !guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", guestId);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            productId: id,
            quantity: 1,
            ...(guestId ? { guestId } : {}),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add to cart");

      // Optional: update cart state if needed
      setCart(data.cart || []);
      showAlert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showAlert(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleAddToWishlist = async (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;
    let guestId = localStorage.getItem("guestId");
  
    if (!token && !guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", guestId);
    }
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            productId: id,
            ...(guestId ? { guestId } : {}),
          }),
        }
      );
  
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add to wishlist");
  
      setWishlist(data.wishlist.products || []);
      showAlert(data.message);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      showAlert(error.message || "Something went wrong. Please try again.");
    }
  };
  

  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <SlickArrowPrev />,
    nextArrow: <SlickArrowNext />,
    lazyLoad: "progressive",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 1023, settings: { slidesToShow: 3 } },
      { breakpoint: 650, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
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

      <Slider {...settings}>
        {productsdata.map((product) => (
          <SingleProduct
            key={product.id}
            product={product}
            addedInCart={
              Array.isArray(cart) &&
              cart.some((pd) => pd.productId === product.id)
            }
            addedInWishlist={
              Array.isArray(wishlist) &&
              wishlist.some((pd) => pd.productId === product.id)
            }
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        ))}
      </Slider>
    </>
  );
};
