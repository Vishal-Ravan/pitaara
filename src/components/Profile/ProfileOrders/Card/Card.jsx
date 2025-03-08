export const Card = ({ order, index, onCollapse, active }) => {
  const { createdAt, deliveryAddress, totalPrice, status, } = order;
  return (
    <>
      <div className={`profile-orders__item ${active === index && 'active'}`}>
        <div className='profile-orders__row'>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>date</span>
            <span className='profile-orders__item-date'>{createdAt}</span>
          </div>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Delivery address</span>
            <span className='profile-orders__item-addr'>{deliveryAddress}</span>
          </div>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>totalPrice</span>
            <span className='profile-orders__item-price'>INR {totalPrice}</span>
          </div>
          <div className='profile-orders__col'>
            <span className='profile-orders__col-mob'>Status</span>
            <span className='profile-orders__item-addr'>{status}</span>

            <span
              onClick={() => onCollapse(index)}
              className='profile-orders__col-btn'
            ></span>
          </div>
        </div>
        <div className='profile-orders__content'>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.productId.name}
                <span>INR {item.productId.price}</span>
              </li>
            ))}
            <li>
              Payment Methods:
              <span>Сredit card: **** **** **** 1633</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
