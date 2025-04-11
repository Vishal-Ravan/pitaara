import Slider from "react-slick";
import Link from "next/link";

export const Banner = () => {
  const settings = {
    dots: true,
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
          className="wrappers"
          style={{
            backgroundImage: "url(/assets/img/5.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "640px",
            height: "640px",
            marginTop: "100px",
            width: "100%",
          }}
        ></div>
      </div>{" "}
      <div className="">
        <div
          className="wrappers"
          style={{
            backgroundImage: "url(/assets/img/6.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "640px",
            height: "640px",
            marginTop: "100px",
            width: "100%",
          }}
        ></div>
      </div>
      <div className="">
        <div
          className="wrappers"
          style={{
            backgroundImage: "url(/assets/img/7.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "640px",
            height: "640px",
            marginTop: "100px",
            width: "100%",
          }}
        ></div>
      </div>
      <div className="">
        <div
          className="wrappers"
          style={{
            backgroundImage: "url(/assets/img/8.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "640px",
            height: "640px",
            marginTop: "100px",
            width: "100%",
          }}
        ></div>
      </div>
      {/* Slide 4 */}
    </Slider>
  );
};
