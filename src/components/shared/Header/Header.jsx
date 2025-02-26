import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import useWindowSize from 'components/utils/windowSize/windowSize';
import { header, navItem } from 'data/data.header';
import Link from 'next/link';
import { CartContext, AuthContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import { Nav } from './Nav/Nav';
import { useRouter } from 'next/router';

export const Header = () => {
  const { cart } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const [promo, setPromo] = useState(true);
  const [fixedNav, setFixedNav] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [height, width] = useWindowSize();
  const router = useRouter();

  // Handle navbar scroll effect
  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => window.removeEventListener('scroll', isSticky);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Logged out successfully');
    router.push('/login'); // Redirect to login page
  };

  return (
    <>
      {/* <!-- BEGIN HEADER --> */}
      <header className='header'>
        {/* Promo Banner */}
        {promo && (
          <div className='header-top'>
            <span>🔥 30% OFF ON ALL PRODUCTS - USE CODE: BEShop2020</span>
            <i
              onClick={() => setPromo(false)}
              className='header-top-close js-header-top-close icon-close'
            ></i>
          </div>
        )}

        {/* Main Navbar */}
        <div className={`header-content ${fixedNav ? 'fixed' : ''}`}>
          {/* Logo */}
          <div className='header-logo'>
            <Link href='/'>
              <a>
                <img src={header.logo} alt='Logo' />
              </a>
            </Link>
          </div>

          {/* Navigation and User Options */}
          <div style={{ right: openMenu ? 0 : -360 }} className='header-box'>
            {/* Navigation Menu */}
            <Nav navItem={navItem} />

            {/* User & Cart Options */}
            <ul className='header-options'>
              {/* Search */}
              <li>
                <Link href='/search'>
                  <a>
                    <i className='icon-search'></i>
                  </a>
                </Link>
              </li>

              {/* User Authentication */}
              <li>
                {user ? (
                 
                 <>
                 <Link href='/profile'>
                    <a>
                      <i className='icon-user'>{user.email}</i>
                    </a>
                  </Link>
                 </>
                ) : (
                  <Link href='/login'>
                    <a>
                      <i className='icon-user'></i>
                    </a>
                  </Link>
                )}
              </li>

              {/* Wishlist */}
              <li>
                <Link href='/wishlist'>
                  <a>
                    <i className='icon-heart'></i>
                  </a>
                </Link>
              </li>

              {/* Cart */}
              <li>
                <Link href='/cart'>
                  <a>
                    <i className='icon-cart'></i>
                    <span>{cart.length ?? '0'}</span>
                  </a>
                </Link>
              </li>

              {/* Logout Button (Only for Logged-in Users) */}
              {user && (
                <li>
                  <button className='logout-btn' onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Mobile Menu Toggle */}
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className={`btn-menu js-btn-menu ${openMenu ? 'active' : ''}`}
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
