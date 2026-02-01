import { getPurchaseDetails } from "~/lib/one_time_purchase";
import PricingTable from "./_component/pricing-table";

export default async function PricingPage() {
  const purchaseDetails = await getPurchaseDetails();

  return (
    <div className="flex flex-col items-center justify-center w-full ">
      <PricingTable purchaseDetails={purchaseDetails} />
    </div>
  );
}