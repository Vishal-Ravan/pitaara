import { Login } from 'components/Login/Login';
import { Subscribe } from 'components/shared/Subscribe/Subscribe';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Log In',
    path: '/login',
  },
];
const LoginPage = () => {
  return (
    <PublicLayout  breadcrumbTitle='Log In'>
      <Login />
    </PublicLayout>
  );
};

export default LoginPage;
