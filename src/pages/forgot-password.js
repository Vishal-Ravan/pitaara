import { ForgotPassword } from 'components/Forgot/ForgotPassword';
import { Login } from 'components/Login/Login';
import { Subscribe } from 'components/shared/Subscribe/Subscribe';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Forgot password',
    path: '/forgot-password',
  },
];
const LoginPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Forgot password'>
      <ForgotPassword />
    </PublicLayout>
  );
};

export default LoginPage;
