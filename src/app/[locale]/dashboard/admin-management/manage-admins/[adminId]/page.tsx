export const runtime = "edge";
import { fetchAdminById } from "@/api/adminService";
import SingleAdmin from "@/components/pages/SingleAdmin";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ adminId: string }>; // Changed adminID to adminId
}) {
  const { adminId } = await params; // Changed adminID to adminId
  const t = await getTranslations("common");
  const initialData = await fetchAdminById(adminId); // Changed adminID to adminId

  if (!initialData || !initialData.admin) {
    console.error("Failed to load admin data:", initialData?.error);
    return <div className="p-4 text-red-500">{t("error_loading_data")}</div>;
  }

  return (
    <SingleAdmin
      adminData={{
        ...initialData.admin,
        avatar: initialData.admin.user.avatar,
      }}
      adminID={adminId}
    />
  );
}
