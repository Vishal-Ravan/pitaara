import { PrivacyPolicy } from "components/Privacy/Privacy";
import { PublicLayout } from "layout/PublicLayout";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Privacy Policy",
    path: "/privacy-policy",
  },
];
const privacyPage = () => {
  return (
    <PublicLayout
      breadcrumbTitle="Privacy Policy"
    >
        <PrivacyPolicy/>
    </PublicLayout>
  );
};

export default privacyPage;
