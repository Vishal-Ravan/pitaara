import Link from 'next/link';

export const Card = ({ order }) => {
  const { images, name, price, productNumber, _id, quantity } = order.productId;
  return (
    <>
      {/* <!-- BEING ORDER ITEM CARD --> */}
      <div className='checkout-order__item'>
        <Link href={`/product/${_id}`}>
          <a className='checkout-order__item-img'>
            <img src={`http://localhost:5000${images[0]}`} className='js-img' alt='' />
          </a>
        </Link>
        <div className='checkout-order__item-info'>
          <Link href={`/product/${_id}`}>
            <a className='title6'>
              {name} <span>x{quantity}</span>
            </a>
          </Link>
          <span className='checkout-order__item-price'>
            ${(price * quantity).toFixed(2)}
          </span>
          <span className='checkout-order__item-num'>SKU: {productNumber}</span>
        </div>
      </div>
      {/* <!-- ORDER ITEM CARD EOF --> */}
    </>
  );
};
