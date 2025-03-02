import { useEffect, useState } from 'react';
import { SingleProduct } from './SingleProduct/SingleProduct';
import { useRouter } from 'next/router';

export const Products = ({ products }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Wishlist state
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState(null); // State for alert messages
  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000); // Hide alert after 3 seconds
  };
  // Fetch Cart & Wishlist Items When Component Mounts
  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem('user')); // Parse stored user data
      const token = userData?.token; // Extract token safely

      if (!token) return;

      try {
        // Fetch Cart
   

        // Fetch Wishlist
        const wishlistResponse = await fetch('http://localhost:5000/api/wishlist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json();
          setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle Adding to Cart

  const handleAddToCart = async (id) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = userData?.token;

    if (!token) {
      showAlert('You need to be logged in to add items to the wishlist');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id ,quantity: 1}),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add to cart');

      setCart(data.wishlist);
      showAlert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showAlert(error.message || 'Something went wrong. Please try again.');
    }
  };


  // Handle Adding to Wishlist
  const handleAddToWishlist = async (id) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = userData?.token;

    if (!token) {
      showAlert('You need to be logged in to add items to the wishlist');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/wishlist/add', {
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

  return (
    <>
      {alertMessage && (
        <div style={{
          background: '#000', 
          color: '#fff', 
          padding: '15px', 
          textAlign: 'center', 
          position:'fixed',
          right:'0px',
          zIndex:999,
          top:"70px",
          borderRadius: '5px'
        }}>
          {alertMessage}
        </div>
      )}

      {products.map((product) => (
        <SingleProduct
          key={product.id}
          product={product}
          addedInCart={Array.isArray(cart) && cart.find((pd) => pd.productId === product.id)}
          addedInWishlist={Array.isArray(wishlist) && wishlist.find((pd) => pd.productId === product.id)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      ))}
    </>
  );
};
