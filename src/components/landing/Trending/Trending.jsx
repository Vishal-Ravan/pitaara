import { ProductsCarousel } from 'components/Product/Products/ProductsCarousel';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';
import Link from "next/link";
import { useEffect, useState } from 'react';

export const Trending = () => {
  const [productsItem, setProductsItem] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`);
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
      <section className='trending pt-5'>
        <div className='trending-content'>
          <SectionTitle
            subTitle='Shop The Style'
            title='Shop Your Style'
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
