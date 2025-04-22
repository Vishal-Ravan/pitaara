import { Checkout } from 'components/Checkout/Checkout';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Shop',
    path: '/shop',
  },
  {
    label: 'Checkout',
    path: '/checkout',
  },
];
const CheckoutPage = () => {
  return (
    <PublicLayout  breadcrumbTitle='Checkout'>
      <Checkout />
    </PublicLayout>
  );
};

export default CheckoutPage;
