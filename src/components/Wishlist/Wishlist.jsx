import { useEffect, useState } from "react";
import { Card } from "./Card/Card";
import Link from "next/link";

export const Wishlist = () => {
  const [wishlistData, setWishlistData] = useState([]);

  // Get user token from localStorage
  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  // Get or create guestId
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getUserToken();
      const guestId = getGuestId();

      const endpoint = token
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist?guestId=${guestId}`;

      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await response.json();
        console.log("Wishlist API Response:", data);

        if (Array.isArray(data)) {
          setWishlistData(data);
        } else if (data?.products && Array.isArray(data.products)) {
          setWishlistData(data.products);
        } else {
          setWishlistData([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistData([]);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="wishlist">
      <div className="wrapper">
        <div className="cart-table">
          <div className="cart-table__box">
            <div className="cart-table__row cart-table__row-head">
              <div className="cart-table__col">Product</div>
              <div className="cart-table__col">Price</div>
              <div className="cart-table__col">Action</div>
              <div className="cart-table__col">Add to Cart</div>
            </div>

            {wishlistData.length > 0 ? (
              wishlistData.map((product) => (
                <Card
                  key={product._id}
                  wish={{
                    id: product._id,
                    name: product.name,
                    image: product.images || "/default-image.jpg",
                    isStocked: product.isStocked || false,
                    productNumber: product.productNumber || "N/A",
                    price: product.price,
                  }}
                />
              ))
            ) : (
              <p>No items in wishlist</p>
            )}
          </div>
        </div>
        <div className="wishlist-buttons">
          <Link href="/shop">
            <a className="btn">Go Shopping</a>
          </Link>
        </div>
      </div>
    </div>
  );
};
