import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useWindowSize from "components/utils/windowSize/windowSize";
import { header, navItem } from "data/data.header";
import Link from "next/link";
import { CartContext, AuthContext } from "pages/_app";
import { useContext, useEffect, useState } from "react";
import { Nav } from "./Nav/Nav";
import { useRouter } from "next/router";

export const Header = () => {
  const { cart } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const [promo, setPromo] = useState(true);
  const [fixedNav, setFixedNav] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [height, width] = useWindowSize();
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  console.log(user, "koooooo");
  // Handle navbar scroll effect
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => window.removeEventListener("scroll", isSticky);
  }, []);

  const isSticky = () => {
    setFixedNav(window.scrollY > 10);
  };

  // Handle body scroll when menu is open
  useEffect(() => {
    if (openMenu && height < 767) {
      disableBodyScroll(document);
    } else {
      enableBodyScroll(document);
    }
  }, [openMenu, height]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    alert("Session expired. Please log in again.");
    router.push("/login"); // Redirect to login page
  };

  // Auto logout if token is missing or expired
  useEffect(() => {
    const checkToken = () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (!token) {
        handleLogout();
      }
    };

    const interval = setInterval(checkToken, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  const fetchCart = async () => {
    const token = getUserToken();
    if (!token) {
      setCartCount(0);
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
      console.log("Cart API Response:", data);

      let count = 0;
      if (Array.isArray(data)) {
        count = data.length;
      } else if (data?.items && Array.isArray(data.items)) {
        count = data.items.length;
      }

      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart(); // Initial fetch

    // Polling mechanism - fetch cart data every 5 seconds
    const interval = setInterval(fetchCart, 100);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      {/* <!-- BEGIN HEADER --> */}
      <header className="header">
        {/* Promo Banner */}
        {promo && (
          <div className="header-top">
            <span>🔥 30% OFF ON ALL PRODUCTS - USE CODE: BEShop2020</span>
            <i
              onClick={() => setPromo(false)}
              className="header-top-close js-header-top-close icon-close"
            ></i>
          </div>
        )}

        {/* Main Navbar */}
        <div className={`header-content ${fixedNav ? "fixed" : ""}`}>
          {/* Logo */}
          <div className="header-logo">
            <Link href="/">
              <a>
                <img src={header.logo} alt="Logo" />
              </a>
            </Link>
          </div>

          {/* Navigation and User Options */}
          <div style={{ right: openMenu ? 0 : -360 }} className="header-box">
            {/* Navigation Menu */}
            <Nav navItem={navItem} />

            {/* User & Cart Options */}
            <ul className="header-options">
              {/* Search */}
              {/* <li>
                <Link href='/search'>
                  <a>
                    <i className='icon-search'></i>
                  </a>
                </Link>
              </li> */}

              {/* User Authentication */}
              <li>
                {user ? (
                  <Link href="/profile">
                    <a>
                      <i className="icon-user">{user.name}</i>
                    </a>
                  </Link>
                ) : (
                  <Link href="/login">
                    <a>
                      <i className="icon-user"></i>
                    </a>
                  </Link>
                )}
              </li>

              {/* Wishlist */}
              <li>
                <Link href="/wishlist">
                  <a>
                    <i className="icon-heart"></i>
                  </a>
                </Link>
              </li>

              {/* Cart */}
              <li>
                <Link href="/cart">
                  <a>
                    <i className="icon-cart"></i>
                    <span>{cartCount}</span>
                  </a>
                </Link>
              </li>

              {/* Logout Button (Only for Logged-in Users) */}
              {user && (
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Mobile Menu Toggle */}
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className={`btn-menu js-btn-menu ${openMenu ? "active" : ""}`}
          >
            {[1, 2, 3].map((i) => (
              <span key={i}>&nbsp;</span>
            ))}
          </div>
        </div>
      </header>
      {/* <!-- HEADER EOF   --> */}
    </>
  );
};
