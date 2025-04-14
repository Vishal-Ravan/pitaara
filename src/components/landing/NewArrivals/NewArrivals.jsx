import { ProductsCarousel } from 'components/Product/Products/ProductsCarousel';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';
import { useEffect, useState } from 'react';

export const NewArrivals = () => {
  const [productsItem, setProductsItem] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        // Filter only products with new_arival === "new"
        const newArrivals = data
        .filter(item => item.new_arival);
        setProductsItem(newArrivals);
      } catch (error) {
        console.error('Error fetching new arrival products:', error);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <>
      {/* <!-- BEGIN NEW ARRIVALS SECTION --> */}
      <section className='arrivals pt-5 pb-5'>
        <SectionTitle
          subTitle='Cosmetics'
          title='New arrivals'
          body='Just dropped: Fresh new arrivals you’ll want to wear on repeat!'
        />
        <div className='trending-content'>
          <div className='tab-wrap trending-tabs'>
            <div className='products-items'>
              <ProductsCarousel productsdata={productsItem} />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- END NEW ARRIVALS SECTION --> */}
    </>
  );
};
