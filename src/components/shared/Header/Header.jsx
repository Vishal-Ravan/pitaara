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
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
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
    showAlert("Logout Successfully");
    router.push("/");
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setUser(null);
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

  // Set guestId if not available
  useEffect(() => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID(); // or use any UUID generator
      localStorage.setItem("guestId", guestId);
    }
  }, []);

  const fetchCart = async () => {
    const token = getUserToken();

    try {
      let response;

      if (token) {
        // Authenticated user
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Guest user
        const guestId = localStorage.getItem("guestId");

        if (!guestId) {
          setCartCount(0);
          return;
        }

        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart?guestId=${guestId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status === 401 || response.status === 403) {
        handleLogout();
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
    fetchCart();
    const interval = setInterval(fetchCart, 500);
    return () => clearInterval(interval);
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
        <div className={`header-content ${fixedNav ? "fixed" : ""}`}>
          <div className="header-logo">
            <Link href="/">
              <a>
                <img src={header.logo} alt="Logo" width={120} />
              </a>
            </Link>
          </div>

          <div style={{ right: openMenu ? 0 : -360 }} className="header-box">
            <div className="header-search">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/search?q=${e.target.value}`);
                  }
                }}
              />
              <i
                className="icon-search"
                onClick={() => {
                  const value = document.querySelector(".search-input").value;
                  router.push(`/search?q=${value}`);
                }}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <ul className="header-options">
              <li>
                {user ? (
                  <Link href="/profile">
                    <a className="user-icons">
                      <i className="icon-user">{user.name}</i>
                      <p>Account</p>
                    </a>
                  </Link>
                ) : (
                  <Link href="/login">
                    <a className="user-icons">
                      <i className="icon-user"></i>
                      <p>Account</p>
                    </a>
                  </Link>
                )}
              </li>

              <li>
                <Link href="/wishlist">
                  <a className="user-icons">
                    <i className="icon-heart"></i>
                    <p>Wishlist</p>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/cart">
                  <a className="user-icons">
                    <i className="icon-cart"></i>
                    <span>{cartCount}</span>
                    <p>Cart</p>
                  </a>
                </Link>
              </li>

              {user && (
                <a className="user-icons">
                  <li>
                    <img
                      src="/assets/img/icons/logout.png"
                      className="js-img"
                      alt=""
                      width={23}
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                    />
                    <p>LogOut</p>
                  </li>
                </a>
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

      <div className="header-box-second">
        <Link href={{ pathname: "/shop", query: { category: "rings" } }}>
          <h6>Rings</h6>
        </Link>
        <Link href={{ pathname: "/shop", query: { category: "bracelets" } }}>
          <h6>Bracelets</h6>
        </Link>
        <Link href={{ pathname: "/shop", query: { category: "earrings" } }}>
          <h6>Earrings</h6>
        </Link>
        <Link href={{ pathname: "/shop", query: { category: "necklace" } }}>
          <h6>Necklace</h6>
        </Link>
        <Link href={{ pathname: "/shop", query: { category: "anklet" } }}>
          <h6>Anklet</h6>
        </Link>
      </div>
    </>
  );
};
