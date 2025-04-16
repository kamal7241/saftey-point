export const runtime = "edge";
import { fetchCurrencyById } from "@/api/presetsService";
import SingleCurrency from "@/components/pages/SingleCurrency";

export default async function Page({
  params,
}: {
  params: Promise<{ currencyId: string }>;
}) {
  const { currencyId } = await params;

  // Fetch initial data
  const response = await fetchCurrencyById(currencyId);

  // Check if the fetch was successful and data exists
  if (!response.success || !response.data) {
    // Handle the error appropriately, maybe return an error component or message
    // For now, let's return null or an error message component
    return <div>Error loading currency data.</div>; 
  }

  // Pass the actual currency data object to the component
  return <SingleCurrency currencyData={response.data} currencyID={currencyId} />;
}
