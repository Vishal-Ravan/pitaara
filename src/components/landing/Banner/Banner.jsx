import Slider from 'react-slick';
import Link from 'next/link';

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
    <>
      <Slider {...settings}>
        {/* Slide 1 */}
        <div className='main-block load-bg'>
          <div className='wrapper'>
            <div className='main-block__content'>
              <span className='saint-text'>Professional</span>
              <h1 className='main-text'>Beauty &amp; Care</h1>
              <p>
                Nourish your skin with toxin-free cosmetic products. With the
                offers that you can’t refuse.
              </p>
              <Link href='/shop'>
                <a className='btn'>Shop now</a>
              </Link>
            </div>
          </div>
          <img
            className='main-block__decor'
            src='/assets/img/main-block-decor.png'
            alt=''
          />
        </div>

        {/* Slide 2 */}
        <div className='main-block load-bg'>
          <div className='wrapper'>
            <div className='main-block__content'>
              <span className='saint-text'>New Arrival</span>
              <h1 className='main-text'>Natural Products</h1>
              <p>
                Discover our range of 100% natural skincare products that are good for you.
              </p>
              <Link href='/shop'>
                <a className='btn'>Explore now</a>
              </Link>
            </div>
          </div>
          <img
            className='main-block__decor'
            src='/assets/img/main-block-decor.png'
            alt=''
          />
        </div>
      </Slider>
    </>
  );
};
