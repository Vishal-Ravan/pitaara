import { useEffect, useState } from "react";
import { Card } from "./Card/Card";
import Link from "next/link";

export const Wishlist = () => {
  const [wishlistData, setWishlistData] = useState([]);

  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getUserToken();
      if (!token) {
        console.log("No token found, setting empty wishlist.");
        setWishlistData([]);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/wishlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Wishlist API Raw Response:", data);

        if (data && Array.isArray(data.products)) {
          console.log("Wishlist Data Set:", data.products);
          setWishlistData(data.products);
        } else {
          console.error("Unexpected API Response Format:", data);
          setWishlistData([]); // Fallback to empty
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistData([]);
      }
    };

    fetchWishlist();
  }, []);

  console.log("Wishlist Data in State:", wishlistData);

  return (
    <>
      <div className="wishlist">
        <div className="wrapper">
          <div className="cart-table">
            <div className="cart-table__box">
              <div className="cart-table__row cart-table__row-head">
                <div className="cart-table__col">Product</div>
                <div className="cart-table__col">Price</div>
                <div className="cart-table__col">Status</div>
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
            {/* <a href="#" className="btn btn-grey">
              Clear Wishlist
            </a> */}
            <Link href="/shop">
              <a className="btn">Go Shopping</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
