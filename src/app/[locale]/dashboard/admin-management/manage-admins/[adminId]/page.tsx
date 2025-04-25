export const runtime = "edge";
import { fetchAdminById } from "@/api/adminService";
import SingleAdmin from "@/components/pages/SingleAdmin";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ adminID: string }>;
}) {
  const { adminID } = await params;
  const t = await getTranslations("common");

  // Fetch initial data
  const initialData = await fetchAdminById(adminID);

  if (!initialData || !initialData.admin) {
    console.error("Failed to load admin data:", initialData?.error);
    return <div className="p-4 text-red-500">{t("error_loading_data")}</div>;
  }

  // If data is valid, render the component
  return <SingleAdmin adminData={{ ...initialData.admin, avatar: initialData.admin.user.avatar }} adminID={adminID} />;
}
