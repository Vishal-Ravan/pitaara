import { Registration } from 'components/Registration/Registration';
import { Subscribe } from 'components/shared/Subscribe/Subscribe';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Sign Up',
    path: '/registration',
  },
];
const RegistrationPage = () => {
  return (
    <PublicLayout  breadcrumbTitle='Sign Up'>
      <Registration />
      {/* <Subscribe /> */}
    </PublicLayout>
  );
};

export default RegistrationPage;
