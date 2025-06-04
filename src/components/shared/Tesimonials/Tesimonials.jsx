import Slider from 'react-slick';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import {
  SlickArrowPrev,
  SlickArrowNext,
} from 'components/utils/SlickArrows/SlickArrows';
import { Card } from './Card/Card';
import TestimonialData from 'data/testimonial/testimonial';

export const Testimonials = () => {
  const testimonials = [...TestimonialData];
const settings = {
  dots: false,
  infinite: true,
  arrows: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,  
  autoplay: true,           
  autoplaySpeed: 3000,  
  prevArrow: <SlickArrowPrev />,
  nextArrow: <SlickArrowNext />,
  lazyLoad: 'progressive',
  responsive: [
    {
      breakpoint: 1024, 
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768, 
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480, 
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false, 
        dots: true,    
      },
    },
  ],
};


  return (
    <>
      {/* <!-- BEGIN TESTIMONIALS --> */}
      <section className='testimonials'>
        <div className='wrapper'>
          <SectionTitle subTitle='They Stay' title='testimonials' />
          <div className='testimonials-slider'>
            <Slider {...settings}>
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} testimonial={testimonial} />
              ))}
            </Slider>
          </div>
        </div>
      </section>
      {/* <!-- TESTIMONIALS EOF   --> */}
    </>
  );
};
