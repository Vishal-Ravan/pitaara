import Link from "next/link";

export const SingleProduct = ({
  product,
  onAddToCart,
  onAddToWishlist,
  addedInWishlist,
  addedInCart,
}) => {
  const { name, old_price, price, images, isSale, isNew, _id } = product;

  return (
    <>
      {/* <!-- BEING SINGLE PRODUCT ITEM --> */}
      <div className="products-item">
        {/* <div className="products-item__type">
          {isSale && <span className="products-item__sale">sale</span>}
          {isNew && <span className="products-item__new">new</span>}
        </div> */}
        <div className="products-item__img">
        <Link href={`/product/${_id}`} >

          {images && images.length > 0 ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${images[0]}`}
              alt="Product"
            />
          ) : (
            <div className="placeholder">No Image Available</div>
          )}
          </Link>
          <div className="products-item__data" title="Add to wishlist">
        
            <div className="products-item_wishlist">
              <button 
                className={`addList ${addedInWishlist ? "added" : ""}`}
                onClick={() => onAddToWishlist(_id)}
              >
                <i className="icon-heart"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="products-item__info">
          <Link href={`/product/${_id}`} >

          <span className="products-item__cost">
            ₹ {price}&nbsp; &nbsp;
          </span>
          </Link>
          <Link href={`/product/${_id}`}>
            <a>
              <span className="products-item__name">{name}</span>
            </a>
          </Link>

          <button
            disabled={addedInCart}
            className={`addLists ${addedInCart ? "added" : ""}`}
            onClick={() => onAddToCart(_id)}
          >
          <i className="icon-cart"></i>  Add To Cart {" "}
          </button>
        </div>
      </div>
      {/* <!-- SINGLE PRODUCT ITEM EOF --> */}
    </>
  );
};
