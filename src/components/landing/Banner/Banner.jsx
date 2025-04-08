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
            backgroundImage: "url(/assets/img/pittara.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "700px",
            height: "700px",
            marginTop: "100px",
            width: "100%",
          }}
        ></div>
      </div>{" "}
      <div className="">
        <div
          className="wrappers"
          style={{
            backgroundImage: "url(/assets/img/pittara.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "700px",
            height: "700px",
            marginTop: "100px",
            width: "100%",
          }}
        ></div>
      </div>
      {/* Slide 4 */}
    </Slider>
  );
};
