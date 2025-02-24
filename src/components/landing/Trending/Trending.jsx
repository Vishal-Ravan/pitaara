import { ProductsCarousel } from 'components/Product/Products/ProductsCarousel';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';
import { useEffect, useState } from 'react';

export const Trending = () => {
  const [productsItem, setProductsItem] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProductsItem(data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <>
      {/* <!-- BEGIN TRENDING --> */}
      <section className='trending'>
        <div className='trending-content'>
          <SectionTitle
            subTitle='Cosmetics'
            title='Trending products'
            body='Nourish your skin with toxin-free cosmetic products. With the offers that you can’t refuse.'
          />
          <div className='tab-wrap trending-tabs'>
            <div className='products-items'>
              <ProductsCarousel productsdata={productsItem} />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- TRENDING EOF   --> */}
    </>
  );
};
