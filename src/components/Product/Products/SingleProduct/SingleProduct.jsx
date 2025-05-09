import Link from "next/link";

export const SingleProduct = ({
  product,
  onAddToCart,
  onAddToWishlist,
  addedInWishlist,
  addedInCart,
}) => {
  const { name, old_price, price, images, isSale, isNew, _id ,stock } = product;

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

        <div className="product-img-container">
              {images && images.length > 0 ? (
                <>
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${images[0]}`}
                    alt="Product"
                    className="main-image"
                  />
                  {images.length > 1 && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${images[1]}`}
                      alt="Product"
                      className="hover-image"
                    />
                  )}
                </>
              ) : (
                <div className="placeholder">No Image Available</div>
              )}
            </div>
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
              <span className="products-item__name">  {name?.length > 15 ? name.slice(0, 15) + "..." : name}</span>
            </a>
          </Link>

          {stock === 0 ? (
            <button className="addListss out-of-stock" disabled>
              <i className="icon-block"></i> Out of Stock
            </button>
          ) : (
            <button
              disabled={addedInCart}
              className={`addLists ${addedInCart ? "added" : ""}`}
              onClick={() => onAddToCart(_id)}
            >
              <i className="icon-cart"></i> Add To Cart
            </button>
          )}
        </div>
      </div>
      {/* <!-- SINGLE PRODUCT ITEM EOF --> */}
    </>
  );
};
