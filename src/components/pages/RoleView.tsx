"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import StatusCheck from "../ui/icons/StatusCheck";
import Suspend from "../ui/icons/Suspend";
import Task from "../ui/icons/Task";
import Popup from "../ui/Popup";
import { fetchRoleById } from "@/api/roleService";

interface RoleData {
  name: string;
  status: string;
  role: string;
  // Add more fields as needed
}
interface SingleRoleProps {
  roleId: string;
}

export default function RoleView({ roleId }: SingleRoleProps) {
  const t = useTranslations("common");
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("roleId", roleId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoleById(roleId);
        setRoleData(data);
      } catch (error) {
        console.error("Failed to fetch role:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roleId) {
      fetchData();
    }
  }, [roleId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roleData) {
    return <div>Role not found</div>;
  }
  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("admin-management"), href: "/dashboard/admin-management" },
    {
      label: t("view_role"),
      href: "/dashboard/admin-management/manage-admins",
    },
  ];
  return (
    <div className="h-full">
      <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)}>
        Form
      </Popup>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("view_role")}
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Edit2 />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.suspend")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Suspend />
                </span>
              }
              variant="dark"
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Delete />
                </span>
              }
              variant="danger"
            />
          </>
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <h1 className="heading3">{t("role_details")}</h1>
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <GroupInfo
            label={t("name")}
            content={roleData?.name ?? "Ahmed Ail"}
            copyIt
            icon={<Buildings2 />}
          />
          <GroupInfo
            label={t("status")}
            content={<Status status={"1"} />}
            icon={<StatusCheck />}
          />
          <GroupInfo label={t("role")} content={"Admin"} icon={<Task />} />
        </div>
        <h3 className="heading3">{t("permissions")}</h3>
        {/* <PermissionForm title2={t("permissions")} sections={sections} inView /> */}
      </div>
    </div>
  );
}
