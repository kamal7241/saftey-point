"use client";
import { deleteIndividual, fetchUsers, toggleUserVerification } from "@/api/usersService";
import Table from "@/components/ui/Table";
import { SingleUser } from "@/types/ui.types";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewUserForm from "../forms/NewUserForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Add } from "../ui/icons/Add";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";
import Switcher from "../ui/SmallSwitcher";


const Users = () => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [users, setUsers] = useState<SingleUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const limit = 10;
  const getUsers = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchUsers(offset, limit);
    setUsers(response.users);
    setTotalCount(response.totalCount);
    setLoading(false);
  };
  useEffect(() => {

    getUsers();
  }, [currentPage]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return user[key as keyof SingleUser]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof SingleUser }[] = [
    { header: "user_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "email", accessor: "email" },
    { header: "phone_number", accessor: "phone" },
    { header: "user_type", accessor: "type" },
    { header: "status", accessor: "status" },
  ];

  const handleApplyFilters = (appliedFilters: { [key: string]: string }) => {
    setFilters(appliedFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "Name",
          "Status",
          "Email",
          "Employees",
          "Created",
        ],
        ...filteredUsers.map((c) => [
          c.id,
          c.name,
          c.status,
          c.email,
          // c.employees,
          // c.created,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleVerification = async (userId: number, isVerified: boolean) => {
    try {
      const result = await toggleUserVerification(userId, isVerified);
      if (result.success) {
        showToast.success(tMsgs(
          isVerified
            ? "user_suspended_successfully"
            : "user_activated_successfully"
        ));
        // Refresh the users list
        const offset = (currentPage - 1) * limit;
        const response = await fetchUsers(offset, limit);
        setUsers(response.users);
        setTotalCount(response.totalCount);
      } else {
        console.error("Failed to toggle verification:", result.error);
      }
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  const renderRowActions = (row: SingleUser) => (
    <div className="flex gap-2">
      <Switcher
        isChecked={row.isVerified ?? false}
        onChange={(checked) => handleToggleVerification(row.id, checked)}
      />
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/user-management/users/${row.id}`}
      />
      <Button
        icon={<Edit />}
        noBackground={true}
        textColor="gray-900"
        noLabel={true}
        href={`/dashboard/user-management/users/${row.id}`}
      />
      <Button
        icon={<Delete />}
        noBackground={true}
        textColor="red-500"
        noLabel={true}
        onClick={() => {
          setUserToDelete(row.id);
          setShowDeleteConfirm(true);
        }}
      />
    </div>
  );

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const result = await deleteIndividual(userToDelete);
      if (result.success) {
        showToast.success(tMsgs('user_deleted_successfully'));
        const offset = (currentPage - 1) * limit;
        const response = await fetchUsers(offset, limit);
        setUsers(response.users);
        setTotalCount(response.totalCount);
      } else {
        console.error("Failed to delete user:", result.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  // Add this new function
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("user-management"), href: "/dashboard/user-management" },
    {
      label: t("users"),
      href: "/dashboard/user-management/users",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("users")}
      />

      {showDeleteConfirm && (
        <Popup isOpen={showDeleteConfirm} onClose={handleDeleteCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t("are_you_sure_delete")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDelete} label={t("buttons.confirm")} />
              <Button
                onClick={handleDeleteCancel}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
          </div>
        </Popup>
      )}

      {/* Table */}
      <div className="mt-6 rounded-2xl bg-white">
        <div className="flex flex-wrap-reverse items-center justify-between gap-6 p-4">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex flex-wrap items-stretch justify-between gap-3">
            <Button
              label={t("buttons.add_user")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Add />
                </span>
              }
              variant="primary"
            />

            {/* Filters Button */}
            <Button
              label={t("buttons.filters")}
              onClick={() => setFiltersOpen((prev) => !prev)}
              variant={!filtersOpen ? "transparent" : "selected"}
            />

            {/* Export Button */}
            <Button
              label={t("buttons.export")}
              onClick={handleExport}
              variant="dark"
              icon={
                <span className="inline-block w-6">
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
                label: t("user_id"),
                name: "id",
                placeholder: t("user_id"),
              },
              {
                type: "text",
                label: t("name"),
                name: "name",
                placeholder: t("name"),
              },
              {
                type: "select",
                label: t("status"),
                placeholder: t("status"),
                name: "status",
                options: [
                  { value: "1", label: t('user_status.active') },
                  { value: "0", label: t('user_status.inactive') },
                ],
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={filteredUsers}
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: (page) => setCurrentPage(page),
          }}
          // 
          rowsPerPage={limit}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>

      <Popup isOpen={addPopupOpen}
        onClose={() => {
          setAddPopupOpen(false);
          getUsers();
        }}>
        <NewUserForm
          title={t("add_user")}
          sub_title={t("form_subtitle")}

          onClose={() => {
            setAddPopupOpen(false);
            getUsers();
          }}
        />
      </Popup>
    </div>
  );
};

export default Users;
