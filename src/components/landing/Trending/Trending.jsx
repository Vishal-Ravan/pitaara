import { ProductsCarousel } from 'components/Product/Products/ProductsCarousel';
import { SectionTitle } from 'components/shared/SectionTitle/SectionTitle';
import Link from "next/link";

import { useEffect, useState } from 'react';

export const Trending = () => {
  const [productsItem, setProductsItem] = useState([]);
  const [filterItem, setFilterItem] = useState('rings'); // Default to the first category

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

  const filterList = [
    { name: 'Rings', value: 'rings' },
    { name: 'Bracelets', value: 'bracelets' },
    { name: 'Earrings', value: 'earrings' },
    { name: 'Necklace', value: 'necklace' },
    { name: 'Anklet', value: 'anklet' },
  ];

  // Filter products based on selected category
  const filteredProducts = productsItem.filter(product => product.category === filterItem);

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
              <ul className='nav-tab-list tabs'>
                {filterList.map((item) => (
                  <li
                    key={item.value}
                    onClick={() => setFilterItem(item.value)}
                    className={filterItem === item.value ? 'active' : ''} // Add active class
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
              <ProductsCarousel productsdata={filteredProducts} />
          <div className='shop-all'><Link href="/shop" ><button className='btn'>Shop All</button></Link>
          </div>
            </div>

          </div>
        </div>
      </section>
      {/* <!-- TRENDING EOF   --> */}
    </>
  );
};
