export const runtime = "edge";
import { fetchAdminById } from "@/api/adminService";
import SingleAdmin from "@/components/pages/SingleAdmin";
import { getTranslations } from "next-intl/server"; // Import for server-side translations

export default async function Page({
  params,
}: {
  params: Promise<{ adminID: string }>;
}) {
  const { adminID } = await params;
  const t = await getTranslations("messages"); // Get translations

  // Fetch initial data
  const initialData = await fetchAdminById(Number(adminID));

  // Check if data fetching was successful and admin data exists
  if (!initialData || !initialData.admin) {
    // Handle the error appropriately, maybe return an error component or message
    // You might want to log initialData.error here if it exists
    console.error("Failed to load admin data:", initialData?.error);
    return <div className="p-4 text-red-500">{t("error_loading_data")}</div>; // Display an error message
  }

  // If data is valid, render the component
  return <SingleAdmin adminData={{ ...initialData.admin, avatar: initialData.admin.user.avatar }} adminID={adminID} />;
}
