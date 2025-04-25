export const runtime = "edge";
import { fetchAdminById } from "@/api/adminService";
import SingleAdmin from "@/components/pages/SingleAdmin";
import { getTranslations } from "next-intl/server"; // Import for server-side translations

export default async function Page({
  params,
}: {
  params: Promise<{ adminID: string }>;
}) {
  const { adminID: adminIdString } = await params; // Rename for clarity
  const t = await getTranslations("common"); // Get translations

  // Validate adminID
  const adminIdNumber = Number(adminIdString);
  if (isNaN(adminIdNumber)) {
    console.error("Invalid Admin ID provided:", adminIdString);
    // Consider a more specific error message if translations allow
    return <div className="p-4 text-red-500">{t("invalid_admin_id") || "Invalid Admin ID"}</div>;
  }

  // Fetch initial data using the validated number
  const initialData = await fetchAdminById(adminIdNumber);

  // Check if data fetching was successful and admin data exists
  if (!initialData || !initialData.admin) {
    // Handle the error appropriately, maybe return an error component or message
    // You might want to log initialData.error here if it exists
    console.error("Failed to load admin data:", initialData?.error);
    // Ensure the translation key exists or provide a fallback
    return <div className="p-4 text-red-500">{t("error_loading_data") || "Error loading admin data"}</div>;
  }

  // If data is valid, render the component
  // Pass the original string ID if needed by SingleAdmin, or the number if preferred
  return <SingleAdmin adminData={{ ...initialData.admin, avatar: initialData.admin.user.avatar }} adminID={adminIdString} />;
}
