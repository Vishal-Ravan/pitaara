import { Exchange } from "components/Exchange/Exchangesx";
import { PublicLayout } from "layout/PublicLayout";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Return and Exchange",
    path: "/return-and-exchange",
  },
];
const ExchangePage = () => {
  return (
    <PublicLayout
      breadcrumbTitle="Return and Exchange"
    >
      <Exchange />
    </PublicLayout>
  );
};

export default ExchangePage;
