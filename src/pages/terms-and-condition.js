import { TermsAndCondition } from "components/TermsAndCondition/TermsAndCondition";
import { PublicLayout } from "layout/PublicLayout";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Terms and Condition",
    path: "/terms-and-condition",
  },
];
const ExchangePage = () => {
  return (
    <PublicLayout
      breadcrumbTitle="Terms and Condition"
    >
      <TermsAndCondition />
    </PublicLayout>
  );
};

export default ExchangePage;
