import { createContext, useState, useEffect } from 'react';
import '../styles/styles.scss';

// Create contexts
export const CartContext = createContext();
export const AuthContext = createContext();

const MyApp = ({ Component, pageProps }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Clear corrupted data
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <CartContext.Provider value={{ cart, setCart }}>
        <Component {...pageProps} />
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

export default MyApp;
