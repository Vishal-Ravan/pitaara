import socialData from 'data/social';

export const ContactInfo = () => {
  const footerSocial = [...socialData];
  return (
    <>
      {/* <!-- BEGIN CONTACTS INFO --> */}
      <div className='contacts-info'>
        <div className='wrapper'>
          <div className='contacts-info__content'>
            <div className='contacts-info__text'>
              <h4>Let's Connect</h4>
              <p>
              We’d love to hear from you! Whether you have a question about the products, need help with your order, or want to share your thoughts, our team is here to assist. Contact us through the mentioned contact number & email ID or social media channels, and we’ll get back to you as soon as possible. At Pittara, we’re committed to making your jewellery experience smooth, sparkling, and special—just like you.
              </p>
            </div>
            <div className='contacts-info__social'>
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
          </div>
        </div>
      </div>
      {/* <!-- CONTACTS INFO EOF   -->  */}
    </>
  );
};
