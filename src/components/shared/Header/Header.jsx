import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useWindowSize from "components/utils/windowSize/windowSize";
import { header, navItem } from "data/data.header";
import Link from "next/link";
import { CartContext, AuthContext } from "pages/_app";
import { useContext, useEffect, useState } from "react";
import { Nav } from "./Nav/Nav";
import { useRouter } from "next/router";

export const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [promo, setPromo] = useState(true);
  const [fixedNav, setFixedNav] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [height, width] = useWindowSize();
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState(null); // Alert message state

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000); // Hide alert after 3 seconds
  };

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => window.removeEventListener("scroll", isSticky);
  }, []);

  const isSticky = () => {
    setFixedNav(window.scrollY > 10);
  };

  useEffect(() => {
    if (openMenu && height < 767) {
      disableBodyScroll(document);
    } else {
      enableBodyScroll(document);
    }
  }, [openMenu, height]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    showAlert("Session expired. Redirecting to home...");

    // Redirect to home page after logout
    router.push("/");
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setUser(null); // User stays logged out but can access all pages
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        if (!parsedUser?.token) {
          handleLogout();
          return;
        }

        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        handleLogout();
      }
    };

    checkUserStatus();
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
    console.log(token,'kkko')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout(); // Auto logout if token is invalid or expired
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
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

    const interval = setInterval(fetchCart, 500);

    return () => clearInterval(interval); // Cleanup interval on component unmount
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
      <header className="header">
        {promo && (
          <div className="header-top">
            <span>🔥 30% OFF ON ALL PRODUCTS - USE CODE: BEShop2020</span>
            <i
              onClick={() => setPromo(false)}
              className="header-top-close js-header-top-close icon-close"
            ></i>
          </div>
        )}

        <div className={`header-content ${fixedNav ? "fixed" : ""}`}>
          <div className="header-logo">
            <Link href="/">
              <a>
                <img src={header.logo} alt="Logo" />
              </a>
            </Link>
          </div>

          <div style={{ right: openMenu ? 0 : -360 }} className="header-box">
            <Nav navItem={navItem} />

            <ul className="header-options">
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

              <li>
                <Link href="/wishlist">
                  <a>
                    <i className="icon-heart"></i>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/cart">
                  <a>
                    <i className="icon-cart"></i>
                    <span>{cartCount}</span>
                  </a>
                </Link>
              </li>

              {user && (
                <li>
                  <img
                    src="/assets/img/icons/logout.png"
                    className="js-img"
                    alt=""
                    width={23}
                    style={{ cursor: "pointer" }}
                    onClick={handleLogout}
                  />
                </li>
              )}
            </ul>
          </div>

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
    </>
  );
};
