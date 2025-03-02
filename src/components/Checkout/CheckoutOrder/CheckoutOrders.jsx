import productData from 'data/product/product';
import { CartContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';
import { Card } from './Card/Card';
import { useRouter } from 'next/router';

export const CheckoutOrders = () => {
  
  const router = useRouter();
  const { cart, total } = router.query;
  const [cartData, setCartData] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  console.log(cartData,'ll')

  useEffect(() => {
    if (cart) {
      try {
        setCartData(JSON.parse(decodeURIComponent(cart)));
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartData([]);
      }
    }
    if (total) {
      setCartTotal(parseFloat(total));
    }
  }, [cart, total]);
  return (
    <>
      <div className='checkout-order'>
        <h5>Your Order</h5>
        {cartData.map((order) => (
          <Card key={order.id} order={order} />
        ))}
      </div>
      <div className='cart-bottom__total'>
        <div className='cart-bottom__total-goods'>
          Goods on
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        {/* <div className='cart-bottom__total-promo'>
          Discount on promo code
          <span>No</span>
        </div> */}
        <div className='cart-bottom__total-delivery'>
          Delivery{' '}
          <span className='cart-bottom__total-delivery-date'>
            (Aug 28,2020 at 11:30)
          </span>
          <span>$30</span>
        </div>
        <div className='cart-bottom__total-num'>
          total:
          <span>${(cartTotal + 30).toFixed(2)}</span>
        </div>
      </div>
    </>
  );
};
