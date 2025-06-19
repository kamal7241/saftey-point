"use client";
import { deleteRole, fetchRoles } from "@/api/roleService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import { Add } from "../ui/icons/Add";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import Eye from "../ui/icons/Eye";
import { Export } from "../ui/icons/Export";

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
  }[];
  permissionsCount?: string;
}

const ManageRoles = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 10,
  });

  const getRoles = async () => {
    try {
      setLoading(true);
      const data = await fetchRoles();
      setRoles(
        data.map((role) => ({
          ...role,
          permissionsCount: `${role.features.reduce(
            (count, feature) => {
              const featureCount = 
                (feature.create ? 1 : 0) +
                (feature.delete ? 1 : 0) +
                (feature.update ? 1 : 0) +
                (feature.list ? 1 : 0);
              return count + featureCount;
            },
            0
          )}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
      showToast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const filteredRoles = roles.filter((role) => {
    return role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const columns: {
    header: string;
    accessor: keyof Role | "permissionsCount";
  }[] = [
    { header: "num", accessor: "id" },
    { header: "roles", accessor: "name" },
    { header: "permissions", accessor: "permissionsCount" },
    { header: "description", accessor: "description" },
  ];

  const handleView = (id: number) => {
    router.push(`/dashboard/admin-management/roles-permissions/${id}`);
  };

  const renderRowActions = (row: Role) => (
    <div className="flex gap-2 items-center">
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
    router.push(`/dashboard/admin-management/roles-permissions/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      showToast.success("Role deleted successfully");
      getRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
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

  const paginatedRoles = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    return filteredRoles.slice(startIndex, endIndex);
  }, [filteredRoles, pagination]);

  const totalPages = Math.ceil(filteredRoles.length / pagination.rowsPerPage);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["ID", "Name", "Description", "Permissions"],
        ...filteredRoles.map((r) => [
          r.id,
          r.name,
          r.description,
          r.permissionsCount,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "roles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("roles-permissions")}
      />

      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
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
            <Button
              label={t("buttons.export")}
              onClick={handleExport}
              variant="dark"
              icon={
                <span className="w-6 inline-block">
                  <Export />
                </span>
              }
            />
          </div>
        </div>
        <Table
          data={paginatedRoles}
          columns={columns}
          renderRowActions={renderRowActions}
          isLoading={loading}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: totalPages,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </div>
  );
};

export default ManageRoles;
