import { Orderconfirm } from 'components/Orderconfirm/Orderconfirm';

import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'order-confirmation',
    path: '/order-confirmation',
  },
];
const orderconfirm = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Log In'>
      <Orderconfirm />
    </PublicLayout>
  );
};

export default orderconfirm;
