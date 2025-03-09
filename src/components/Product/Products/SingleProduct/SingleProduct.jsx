import Link from "next/link";

export const SingleProduct = ({
  product,
  onAddToCart,
  onAddToWishlist,
  addedInWishlist,
  addedInCart,
}) => {
  const { name, oldPrice, price, images, isSale, isNew, _id } = product;

  return (
    <>
      {/* <!-- BEING SINGLE PRODUCT ITEM --> */}
      <div className="products-item">
        <div className="products-item__type">
          {isSale && <span className="products-item__sale">sale</span>}
          {isNew && <span className="products-item__new">new</span>}
        </div>
        <div className="products-item__img">
          {images && images.length > 0 ? (
            <img src={`http://localhost:5000${images[1]}`} alt="Product" />
          ) : (
            <div className="placeholder">No Image Available</div>
          )}
          <div className="products-item__hover">
            <Link href={`/product/${_id}`}>
              <a>
                <i className="icon-search"></i>
              </a>
            </Link>
            <div className="products-item__hover-options">
              <button
                disabled={addedInWishlist}
                className={`addList ${addedInWishlist ? "added" : ""}`}
                onClick={() => onAddToWishlist(_id)}
              >
                <i className="icon-heart"></i>
              </button>

              <button
                disabled={addedInCart}
                className={`addList ${addedInCart ? "added" : ""}`}
                onClick={() => onAddToCart(_id)}
              >
                <i className="icon-cart"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="products-item__info">
          <Link href={`/product/${_id}`}>
            <a>
              <span className="products-item__name">{name}</span>
            </a>
          </Link>
          <span className="products-item__cost">
            <span>{oldPrice && `₹${oldPrice}`}</span> ₹ {price}
          </span>
        </div>
      </div>
      {/* <!-- SINGLE PRODUCT ITEM EOF --> */}
    </>
  );
};
