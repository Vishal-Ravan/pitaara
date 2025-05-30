import Slider from "react-slick";
import Link from "next/link";

export const Banner = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {/* Slide 1 */}
      <div className="">
        <div
          className="wrappers mobile-banner-wrap"
          style={{
            backgroundImage: "url(/assets/img/5.png)",
            backgroundSize: "cover",
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center",
            height:"100%",
            marginTop: "100px",
            width: "100%",
          }}
        ><div className="banner-dv"></div></div>
      </div>{" "}
      <div className="">
        <div
          className="wrappers mobile-banner-wrap"
          style={{
            backgroundImage: "url(/assets/img/6.png)",
            backgroundSize: "cover",
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center",
            height:"100%",
            marginTop: "100px",
            width: "100%",
          }}
        ><div className="banner-dv"></div></div>
      </div>
      <div className="">
        <div
          className="wrappers mobile-banner-wrap"
          style={{
            backgroundImage: "url(/assets/img/7.png)",
            backgroundSize: "cover",
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center",
            height:"100%",
            marginTop: "100px",
            width: "100%",
          }}
        ><div className="banner-dv"></div></div>
      </div>
      <div className="">
        <div
          className="wrappers mobile-banner-wrap"
          style={{
            backgroundImage: "url(/assets/img/8.png)",
            backgroundSize: "cover",
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center",
            height:"100%",
            marginTop: "100px",
            width: "100%",
          }}
        ><div className="banner-dv"></div></div>
      </div>
      {/* Slide 4 */}
    </Slider>
  );
};
