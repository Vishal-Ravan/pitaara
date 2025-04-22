import { Category } from 'components/Category/Category';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Categories',
    path: '/categories',
  },
];
const CategoriesPage = () => {
  return (
    <PublicLayout  breadcrumbTitle='Categories'>
      <Category />
    </PublicLayout>
  );
};

export default CategoriesPage;
