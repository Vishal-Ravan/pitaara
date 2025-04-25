import { ContactDetailBlock } from 'components/Contact/ContactDetailBlock/ContactDetailBlock';
import { ContactForm } from 'components/Contact/ContactForm/ContactForm';
import { ContactInfo } from 'components/Contact/ContactInfo/ContactInfo';
import { Map } from 'components/Contact/Map/Map';
import { BrandLogo } from 'components/shared/BrandLogo/BrandLogo';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];
const ContactPage = () => {
  return (
    <PublicLayout  breadcrumbTitle='Contact'>
      <ContactDetailBlock />
      <ContactInfo />
      {/* <BrandLogo /> */}
      <ContactForm />
      <Map />
    </PublicLayout>
  );
};

export default ContactPage;
