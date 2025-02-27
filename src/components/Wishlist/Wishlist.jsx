import productData from "data/product/product";
import { Card } from "./Card/Card";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        setWishlistData([]);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Wishlist API Response:", data);

        if (Array.isArray(data)) {
          setWishlistData(data);
        } else if (data?.items && Array.isArray(data.items)) {
          setWishlistData(data.items);
        } else {
          setWishlistData([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
        setWishlistData([]);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <>
      {/* <!-- BEGIN WISHLIST --> */}
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

              {wishlistData?.map((wish) => (
                <Card
                  key={wish.productId._id}
                  wish={{
                    id: wish.productId._id,
                    name: wish.productId.name,
                    image: wish.productId.images?.length > 0 ? wish.productId.images[0] : "/default-image.jpg",
                    isStocked: wish.productId.isStocked || false,
                    productNumber: wish.productId.productNumber || "N/A",
                    price: wish.productId.price,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="wishlist-buttons">
            <a href="#" className="btn btn-grey">
              Clear Wishlist
            </a>
            <Link href="/shop">
              <a className="btn">Go Shopping</a>
            </Link>
          </div>
        </div>
        <img className="promo-video__decor js-img" data-src="/assets/img/promo-video__decor.jpg" alt="" />
      </div>
      {/* <!-- WISHLIST EOF --> */}
    </>
  );
};
