"use client";
import { deleteRole, fetchRoles, setRoleStatus } from "@/api/roleService";
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
import FilterForm from "../ui/FilterForm";
import Toggler from "../formsUI/Toggler";
import { RoleStatus } from "@/enum/role-status.enum";
import { TableStatus } from "@/enum/table-status.enum";
import { UserStatus } from "@/enum/user-status.enum";


interface Role {
  id: number;
  key: string;
  name: string;
  description: string;
  status: TableStatus;
  isActive: boolean;
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

export interface RoleVm extends Omit<Role, "status"> {
  status: TableStatus;
}

const ManageRoles = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleVm[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 10,
  });
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(
        data.map((role) => ({
          ...role,
          status: role.isActive ? TableStatus.ACTIVE : TableStatus.INACTIVE,
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

  // Build unique permissions list from features
  const permissionOptions = useMemo(() => {
    const keys = new Set<string>();
    const options: { value: string; label: string }[] = [];
    roles.forEach((role) => {
      role.features.forEach((feature) => {
        if (!keys.has(feature.key)) {
          keys.add(feature.key);
          options.push({ value: feature.key, label: feature.name });
        }
      });
    });
    return options;
  }, [roles]);

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === "permission") {
        // Check if any feature key matches the selected permission AND has at least one CRUD method true
        return role.features.some(
          (feature) =>
            feature.key === value &&
            (feature.create ||
              feature.update ||
              feature.delete ||
              feature.list ||
              feature.find)
        );
      }
      return role[key as keyof Role]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: {
    header: string;
    accessor: keyof Role | "permissionsCount";
  }[] = [
    { header: "num", accessor: "id" },
    { header: "roles", accessor: "name" },
    { header: "permissions", accessor: "permissionsCount" },
    { header: "status", accessor: "status" },
  ];

  const handleView = (id: number) => {
    router.push(`/dashboard/admin-management/roles-permissions/${id}`);
  };

  const toggleRoleStatus = async (role: Role) => {
    const newStatus = role.status === TableStatus.ACTIVE ? TableStatus.INACTIVE : TableStatus.ACTIVE;
    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, status: newStatus , isActive: !role.isActive } : r))
    );

    const result = await setRoleStatus(Number(role.id), !role.isActive);
    if (!result.success) {
      setRoles((prev) =>
        prev.map((r) => (r.id === role.id ? { ...r, status: role.status } : r))
      );
      showToast.error(result.message || "Failed to update status");
    } else {
      showToast.success("Status updated successfully");
      // await getRoles(); 
    }
  };

  const renderRowActions = (row: Role) => (
    <div className="flex gap-2 items-center">
      <Toggler
        checked={row.status === RoleStatus.ACTIVATED}
        onChange={() => toggleRoleStatus(row)}
      />
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
        ["ID", "Name", "Status", "Permissions"],
        ...filteredRoles.map((r) => [
          r.id,
          r.name,
          r.status,
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
              label={t("buttons.filters")}
              onClick={() => setFiltersOpen((prev) => !prev)}
              variant={!filtersOpen ? "transparent" : "selected"}
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
        {filtersOpen && (
          <FilterForm
            fields={[
              {
                type: "text",
                label: t("role"),
                name: "name",
                placeholder: t("role"),
              },
              {
                type: "select",
                label: t("permissions"),
                placeholder: t("permissions"),
                name: "permission",
                options: permissionOptions,
              },
              {
                type: "select",
                label: t("status"),
                placeholder: t("status"),
                name: "status",
                options: [
                  { value: UserStatus.ACTIVE, label: t("active") },
                  { value: UserStatus.INACTIVE, label: t("inactive") },
                ],
              },
            ]}
            onApply={setFilters}
            onReset={() => setFilters({})}
          />
        )}
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
