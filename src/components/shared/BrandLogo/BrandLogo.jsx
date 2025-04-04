import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlickArrowNext, SlickArrowPrev } from "components/utils/SlickArrows/SlickArrows";
export const BrandLogo = () => {
  // Custom category data
  const categories = [
    {
      id: 1,
      name: "Rings",
      imgSrc:
        "https://www.giva.co/cdn/shop/collections/pink_rings_c356f6b3-6547-4e39-9b08-dfdf5ecfc2b0.jpg?v=1742651416",
      url: "#",
    },
    {
      id: 2,
      name: "Bracelets",
      imgSrc:
        "https://www.giva.co/cdn/shop/collections/pink_necklaces_pend_copy.jpg?v=1742651415",
      url: "#",
    },
    {
      id: 3,
      name: "Earrings",
      imgSrc:
        "https://www.giva.co/cdn/shop/collections/pink_br-min.png?v=1742651417",
      url: "#",
    },
    {
      id: 4,
      name: "Necklace",
      imgSrc:
        "https://www.giva.co/cdn/shop/collections/pink_rings_c356f6b3-6547-4e39-9b08-dfdf5ecfc2b0.jpg?v=1742651416",
      url: "#",
    },
    {
      id: 5,
      name: "Anklets",
      imgSrc:
        "https://www.giva.co/cdn/shop/collections/pink_br-min.png?v=1742651417",
      url: "#",
    },
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
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };
  return (
    <div className="category-slider">
      <Slider {...settings}>
        {categories.map((item) => (
          <div key={item.id} className="category-slide">
            <a href={item.url}>
              <div className="image-container">
                <img src={item.imgSrc} alt={item.name} />
              </div>
              <p className="category-name">{item.name}</p>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};
