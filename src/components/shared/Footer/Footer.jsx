import footerNavData from 'data/footer/footerNav';
import paymentMethodData from 'data/footer/payment';
import socialData from 'data/social';
import Link from 'next/link';
import { NavCol } from './NavCol/NavCol';

export const Footer = () => {
  const footerLogo = '/assets/img/footer.png';

  const footerNav = [...footerNavData];
  const footerSocial = [...socialData];
  const paymentMethods = [...paymentMethodData];

  return (
    <>
      {/* <!-- BEGIN FOOTER --> */}
      <footer className='footer'>
        <div className='wrapper'>
          <div className='footer-top'>
            <div className='footer-top__social'>
              <span>Find us here:</span>
              <ul>
                {footerSocial.map((social, index) => (
                  <li key={index}>
                    <a href={social.path}>
                      <i className={social.icon}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='footer-top__logo'>
              <Link href='/'>
                <a>
                  <img src={footerLogo} className='js-img' alt='' width={230} />
                </a>
              </Link>
            </div>

            {/* Payment method */}
            <div className='footer-top__payments'>
              <span>Payment methods:</span>
              <ul>
                {paymentMethods.map((payment, index) => (
                  <li key={index}>
                    <img src={payment.icon} className='js-img' alt='' />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='footer-nav'>
            {/* Footer Nav */}
            {footerNav.map((nav, index) => (
              <NavCol nav={nav} key={index} />
            ))}
            <div className='footer-nav__col'>
              <span className='footer-nav__col-title'>Contact</span>
              <ul>
                <li>
                  <i className='icon-map-pin'></i> 248, NH-52, Hisar Rajgarh Road, Near IIFL Finance, Siwani,Bhiwani, Haryana - 127046
                </li>
                <li>
                  <i className='icon-smartphone'></i>
                  <div className='footer-nav__col-phones'>
                    <a href='tel:+919220557803'>+91 9220557803</a>
                  </div>
                </li>
                <li>
                  <i className='icon-mail'></i>
                  <a href='mailto:info@pittara.in'>info@pittara.in</a>
                </li>
              </ul>
            </div>
          </div>
          <div className='footer-copy'>
            <span>&copy; All rights reserved. Pittara 2025</span>
          </div>
        </div>
      </footer>
      {/* <!-- FOOTER EOF   --> */}
    </>
  );
};
