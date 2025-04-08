import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SingleProduct } from "./SingleProduct/SingleProduct";

export const Products = ({ products }) => {
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
      if (!response.ok) throw new Error(data.message || "Failed to add to cart");

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

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData?.token;

      if (!token) return;

      try {
        // Fetch Cart
        const cartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCart(cartData.cart || []);
        }

        // Fetch Wishlist
        const wishlistResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json();
          setWishlist(wishlistData.wishlist || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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

      {products.map((product) => (
        <SingleProduct
          key={product.id}
          product={product}
          addedInCart={Array.isArray(cart) && cart.some((pd) => pd.productId === product.id)}
          addedInWishlist={Array.isArray(wishlist) && wishlist.some((pd) => pd.productId === product.id)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      ))}
    </>
  );
};
