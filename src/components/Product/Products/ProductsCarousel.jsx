import { useState } from 'react';
import Slider from 'react-slick'; import { useRouter } from "next/router";
import { SingleProduct } from './SingleProduct/SingleProduct';
import {
  SlickArrowPrev,
  SlickArrowNext,
} from 'components/utils/SlickArrows/SlickArrows';

export const ProductsCarousel = ({ productsdata = [] }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null); // State for alert messages
  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000); // Hide alert after 3 seconds
  };
  const router = useRouter();
  const handleAddToCart = async (id) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = userData?.token;

    if (!token) {
      showAlert('You need to be logged in to add items to the cart.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to cart');

      setCart(data.cart);
      showAlert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showAlert(error.message || 'Something went wrong. Please try again.');
    }
  };

  const handleAddToWishlist = async (id) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = userData?.token;

    if (!token) {
      showAlert('You need to be logged in to add items to the wishlist.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to wishlist');

      setWishlist(data.wishlist);
      showAlert('Item added to wishlist successfully!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showAlert(error.message || 'Something went wrong. Please try again.');
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <SlickArrowPrev />,
    nextArrow: <SlickArrowNext />,
    lazyLoad: 'progressive',
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 1023, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 650, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <>
      {/* Alert Message Div */}
      {alertMessage && (
        <div style={{
          background: '#000',
          color: '#fff',
          padding: '15px',
          textAlign: 'center',
          position: 'fixed',
          right: '0px',
          zIndex: 999,
          top: "70px",
          borderRadius: '5px'
        }}>
          {alertMessage}
        </div>
      )}

      <Slider {...settings}>
        {productsdata.map((product) => (
          <SingleProduct
            key={product.id}
            product={product}
            addedInCart={Array.isArray(cart) && cart.some((pd) => pd.productId === product.id)}
            addedInWishlist={Array.isArray(wishlist) && wishlist.some((pd) => pd.productId === product.id)}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        ))}
      </Slider>
    </>
  );
};
