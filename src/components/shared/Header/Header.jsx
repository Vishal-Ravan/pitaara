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
  const [searchInput, setSearchInput] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [height, width] = useWindowSize();
  const [cartCount, setCartCount] = useState(0);
  const [whishlistCount, setWhishlistCount] = useState(0);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${searchInput}`);
  };
  const handleCategoryClick = (category) => {
    router.push({
      pathname: "/shop",
      query: { category },
    });
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
  const searchProduct = async (query) => {
    try {
      const trimmedQuery = query.trim().toLowerCase();

      if (!trimmedQuery) {
        showAlert("Please enter a search term.");
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      // Local filtering if needed
      const filteredResults = data.filter((item) =>
        item.name?.toLowerCase().includes(trimmedQuery)
      );

      if (filteredResults.length > 0) {
        router.push(`/shop?q=${trimmedQuery}`);
      } else {
        showAlert("No products found.");
      }
    } catch (error) {
      console.error("Error during search:", error);
      showAlert("Something went wrong while searching.");
    }
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

  const fetchWhishlist = async () => {
    const token = getUserToken();

    try {
      let response;

      if (token) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist`,
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
          setWhishlistCount(0);
          return;
        }

        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist?guestId=${guestId}`,
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
      let counts = 0;
      if (Array.isArray(data)) {
        counts = data.length;
      } else if (data?.products && Array.isArray(data.products)) {
        counts = data.products.length;
      }

      setWhishlistCount(counts); // Update state immediately
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWhishlistCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
    const interval = setInterval(fetchCart, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWhishlist();
    const interval = setInterval(fetchWhishlist, 100);
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
        <div className={`header-content `}>
          <div className="header-logo">
            <Link href="/">
              <a>
                <img src="/assets/img/logo.png" alt="Logo" width={180} />
              </a>
            </Link>
          </div>
          <div className="header-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="search-input"
              />
              <button type="submit" className="">  <i
                className="icon-search"
              ></i></button>
            
            </form>
          </div>
     
          <div style={{ right: openMenu ? 0 : -360 }} className="header-box">
            <ul className="header-options">
              <li>
                {user ? (
                  <Link href="/profile">
                    <a className="user-icons">
                      <i className="icon-user">{user.name}</i>
                      {/* <p>Account</p> */}
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
                  <a className="user-icons wh">
                    <i className="icon-heart"></i>
                    <span>{whishlistCount}</span>
                    <p>Wishlist</p>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/cart">
                  <a className="user-icons">
                    <img src="/assets/img/add-to-cart.png" alt="" width={25} />
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
        <h6
          onClick={() => handleCategoryClick("rings")}
          style={{ cursor: "pointer" }}
        >
          Rings
        </h6>
        <h6
          onClick={() => handleCategoryClick("bracelets")}
          style={{ cursor: "pointer" }}
        >
          Bracelets
        </h6>
        <h6
          onClick={() => handleCategoryClick("earrings")}
          style={{ cursor: "pointer" }}
        >
          Earrings
        </h6>
        <h6
          onClick={() => handleCategoryClick("necklaces")}
          style={{ cursor: "pointer" }}
        >
          Necklace
        </h6>
        {/* <h6 onClick={() => handleCategoryClick("anklet")} style={{ cursor: "pointer" }}>
        Anklet
      </h6> */}
      </div>
    </>
  );
};
