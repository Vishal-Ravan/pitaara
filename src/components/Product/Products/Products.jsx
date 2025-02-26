import { CartContext } from 'pages/_app';
import { useContext } from 'react';
import { SingleProduct } from './SingleProduct/SingleProduct';
import { useRouter } from 'next/router';

export const Products = ({ products }) => {
  const { cart, setCart } = useContext(CartContext);
  const router = useRouter();

  const handleAddToCart = async (id) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log('Token:', token); // Debugging
  
    if (!token) {
      alert('You need to be logged in to add items to the cart');
      router.push('/login'); // Redirect to login
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure correct format
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token'); // Clear invalid token
        router.push('/login'); // Redirect to login
        return;
      }
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }
  
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    }
  };
  

  return (
    <>
      {products.map((product) => (
        <SingleProduct
          addedInCart={Boolean(cart?.find((pd) => pd.id === product.id))}
          key={product.id}
          product={product}
          onAddToWish={(id) => console.log(id)}
          onAddToCart={handleAddToCart}
        />
      ))}
    </>
  );
};
