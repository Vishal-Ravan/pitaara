import { ProductsCarousel } from "components/Product/Products/ProductsCarousel";
import { SectionTitle } from "components/shared/SectionTitle/SectionTitle";
import { useEffect, useRef, useState } from "react";

export const NewArrivals = () => {
  const [productsItem, setProductsItem] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Filter only products with new_arival === "new"
        const newArrivals = data.filter((item) => item.new_arival);
        setProductsItem(newArrivals);
      } catch (error) {
        console.error("Error fetching new arrival products:", error);
      }
    };

    fetchNewArrivals();
  }, []);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Remove if you only want the animation once
        }
      },
      { threshold: 0.2 } // Trigger when 10% of the component is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* <!-- BEGIN NEW ARRIVALS SECTION --> */}
      <section className="arrivals  pb-5">
        <div
          ref={ref}
          className={`scroll-left-to-right ${isVisible ? "visible" : ""}`}
        >
          <SectionTitle
            subTitle="Cosmetics"
            title="New arrivals"
            body="Just dropped: Fresh new arrivals you’ll want to wear on repeat!"
          />
          <div className="trending-content">
            <div className="tab-wrap trending-tabs">
              <div className="products-items">
                <ProductsCarousel productsdata={productsItem} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- END NEW ARRIVALS SECTION --> */}
    </>
  );
};
