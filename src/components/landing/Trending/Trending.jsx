import { ProductsCarousel } from "components/Product/Products/ProductsCarousel";
import { SectionTitle } from "components/shared/SectionTitle/SectionTitle";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const Trending = () => {
  const [productsItem, setProductsItem] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProductsItem(data);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrendingProducts();
  }, []);

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* <!-- BEGIN TRENDING --> */}
      <section className="trending pt-5">
        <div
          ref={ref}
          className={`scroll-right-to-left ${isVisible ? 'visible' : ''}`}
        >
          <div className="trending-content">
            <SectionTitle
              subTitle="Shop The Style"
              title="Shop Your Style"
              body="We bring you the best Pinterest-worthy accessories for every budget"
            />
            <div className="tab-wrap trending-tabs">
              <div className="products-items">
                <ProductsCarousel productsdata={productsItem} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- TRENDING EOF   --> */}
    </>
  );
};
