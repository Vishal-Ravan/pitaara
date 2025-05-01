import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  SlickArrowNext,
  SlickArrowPrev,
} from "components/utils/SlickArrows/SlickArrows";
import { useEffect, useRef, useState } from "react";
export const BrandLogo = () => {


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


  const categories = [
    {
      id: 1,
      name: "Rings",
      imgSrc:
        "/assets/img/ring.png",
      url: "/shop?category=rings",
    },
    {
      id: 2,
      name: "Bracelets",
      imgSrc:
        "/assets/img/brecelate.png",
      url: "/shop?category=bracelets",
    },
    {
      id: 3,
      name: "Earrings",
      imgSrc:
        "/assets/img/ear.png",
      url: "/shop?category=earrings",
    },
    {
      id: 4,
      name: "Necklace",
      imgSrc:
        "/assets/img/chain.png",
      url: "/shop?category=necklaces",
    }
    // {
    //   id: 5,
    //   name: "Anklets",
    //   imgSrc:
    //     "/assets/img/anklet.png",
    //   url: "/shop?category=anklet",
    // },
  ];

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SlickArrowNext />,
    prevArrow: <SlickArrowPrev />,
    responsive: [
      { breakpoint: 1640, settings: { slidesToShow: 3.1 } },
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div
    ref={ref}
    className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}
  >
    <div className="category-slider" >
      <Slider {...settings}>
        {categories.map((item) => (
          <div key={item.id} className="category-slide" >
            <a href={item.url} >
              <div className="image-container"style={{ padding: '0 5px' }}>
                <img src={item.imgSrc} alt={item.name} className="brand-logo"/>
              </div>
              <p className="category-name">{item.name}</p>
            </a>
          </div>
        ))}
      </Slider>
    </div>
    </div>
  );
};
