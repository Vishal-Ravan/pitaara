import Link from "next/link";

export const Card = ({ wish }) => {
  const { name, image, id, isStocked, productNumber, price } = wish;


  return (
    <div className="cart-table__row">
      <div className="cart-table__col">
        <Link href={`/product/${id}`}>
          <a className="cart-table__img">
            <img src={`http://localhost:5000${image[0]}`} className="js-img" alt={name || "Product"} />
          </a>
        </Link>
        <div className="cart-table__info">
          <Link href={`/product/${id}`}>
            <a className="title5">{name}</a>
          </Link>
          <span className="cart-table__info-num">SKU: {productNumber}</span>
        </div>
      </div>
      <div className="cart-table__col">
        <span className="cart-table__price">${price}</span>
      </div>
      <div className="cart-table__col">
        {isStocked ? (
          <span className="wishlist-stock">In Stock</span>
        ) : (
          <span className="wishlist-available">Not Available</span>
        )}
      </div>
      <div className="cart-table__col">
        <span className="cart-table__total">
          <Link href={`/product/${id}`}>
            <a className="blog-item__link">
              Buy Now <i className="icon-arrow-md"></i>
            </a>
          </Link>
        </span>
      </div>
    </div>
  );
};
