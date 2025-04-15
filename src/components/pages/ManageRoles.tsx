"use client";
import { deleteRole, fetchRoles } from "@/api/roleService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import { Add } from "../ui/icons/Add";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import Eye from "../ui/icons/Eye";

interface Role {
  id: number;
  key: string;
  name: string;
  description: string;
  image?: string;
  features: {
    key: string;
    name: string;
    create: boolean;
    delete: boolean;
    update: boolean;
    list: boolean;
    find: boolean;
  }[];
  permissionsCount?: string;
}

const ManageRoles = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(
        data.map((role) => ({
          ...role,
          permissionsCount: `${role.features.reduce(
            (count, feature) =>
              count +
              (feature.create ? 1 : 0) +
              (feature.delete ? 1 : 0) +
              (feature.update ? 1 : 0) +
              (feature.list ? 1 : 0) +
              (feature.find ? 1 : 0),
            0
          )}`,
        }))
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Failed to fetch roles");
    }
    setLoading(false);
  };

  useEffect(() => {
    getRoles();
  }, []);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: {
    header: string;
    accessor: keyof Role | "permissionsCount";
  }[] = [
    { header: "num", accessor: "id" },
    { header: "roles", accessor: "name" },
    { header: "permissions", accessor: "permissionsCount" },
  ];

  const handleView = (id: number) => {
    console.log("Viewing branch with ID:", id);
    router.push(`/dashboard/admin-management/${id}`);
  };

  const renderRowActions = (row: Role) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        onClick={() => handleView(row.id)}
      />
      <Button
        icon={<Edit />}
        noBackground={true}
        textColor="gray-900"
        noLabel={true}
        onClick={() => handleEdit(row.id)}
      />
      <Button
        icon={<Delete />}
        noBackground={true}
        textColor="red-500"
        noLabel={true}
        onClick={() => handleDelete(row.id)}
      />
    </div>
  );

  const handleEdit = (id: number) => {
    router.push(`/dashboard/admin-management/roles-permissions/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      showToast.success("Role deleted successfully");
      getRoles();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error("Failed to delete role");
    }
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("admin-management"), href: "/dashboard/admin-management" },
    {
      label: t("roles-permissions"),
      href: "/dashboard/admin-management/roles-permissions",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("roles-permissions")}
      />

      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4">
          <SearchForm onSearch={setSearchTerm} />
          <Button
            label={t("buttons.add_role")}
            href="/dashboard/admin-management/add-role"
            icon={
              <span className="w-6 inline-block">
                <Add />
              </span>
            }
            variant="primary"
          />
        </div>

        <Table
          data={filteredRoles}
          columns={columns}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default ManageRoles;
