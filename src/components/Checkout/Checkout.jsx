import { useState } from 'react';
import { CheckoutOrders } from './CheckoutOrder/CheckoutOrders';
import { CheckoutStep1 } from './CheckoutSteps/CheckoutStep1';
import { CheckoutStep2 } from './CheckoutSteps/CheckoutStep2';
import { CheckoutStep3 } from './CheckoutSteps/CheckoutStep3';

const detailBlocks = [
  {
    step: 'Step 1',
    title: 'Order Details',
    icon: 'icon-step1',
  },
  {
    step: 'Step 2',
    title: 'Payment method',
    icon: 'icon-step2',
  },
  {
    step: 'Step 3',
    title: 'Finish!',
    icon: 'icon-step3',
  },
];

export const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handlePrev = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <>
      <div className='wrapper'>
        {/* <!-- BEGIN DETAIL MAIN BLOCK --> */}
        <div className='detail-block__items'>
          {detailBlocks.map((block, index) => (
            <div
              key={index}
              className={`detail-block__item ${
                activeStep <= index && 'detail-block__item-inactive'
              }`}
            >
              <div className='detail-block__item-icon'>
                <img
                  src={
                    activeStep <= index
                      ? '/assets/img/main-text-decor2.svg'
                      : '/assets/img/main-text-decor.svg'
                  }
                  className='js-img'
                  alt=''
                />
                <i className={block.icon}></i>
              </div>
              <div className='detail-block__item-info'>
                <h6>{block.step}</h6>
                {block.title}
              </div>
            </div>
          ))}
        </div>
        {/* <!-- DETAIL MAIN BLOCK EOF --> */}
      </div>

      {/* <!-- BEGIN CHECKOUT --> */}
      <div className={`checkout ${activeStep == 2 && 'checkout-step2'}`}>
        <div className='wrapper'>
          <div className='checkout-content'>
            {(() => {
              switch (activeStep) {
                case 1:
                  return <CheckoutStep1 onNext={handleNext} />;
                case 2:
                  return (
                    <CheckoutStep2 onNext={handleNext} onPrev={handlePrev} />
                  );
                case 3:
                  return <CheckoutStep3 />;

                default:
                  return null;
              }
            })()}
            <div className='checkout-info'>
              <CheckoutOrders />
            </div>
          </div>
        </div>
       
      </div>
      {/* <!-- CHECKOUT EOF   --> */}
    </>
  );
};
