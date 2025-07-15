"use client";
import { deleteFacility, fetchFacilities } from "@/api/presetsService";
import Table from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import NewFacilityForm from "../forms/NewFacilityForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import { Add } from "../ui/icons/Add";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";
import { showToast } from "@/utils/toast";

interface SingleFacility {
  id: number;
  title: string;
  titleArabic?: string;
  description: string;
  imageUrl: string;
}

interface Facility {
  id: number;
  title: string;
  name: string;
  titleArabic?: string;
  description: string;
  imageUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

const Facilities = () => {
  const t = useTranslations("common");
  // const tMsgs = useTranslations("messages");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [facilityToEdit, setFacilityToEdit] = useState<SingleFacility | null>(null);

  const limit = 10;
  const getFacilities = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchFacilities(offset, limit);
    if (response.success) {
      setFacilities(
        response.innerData.facilities.map((facility: Facility) => ({
          ...facility,
          name: facility.title,
          image: facility.imageUrl ? `${process.env.NEXT_PUBLIC_URL}${facility.imageUrl}` : '/placeholder-image.png',
          createdAt: format(new Date(facility.createdAt as string), "yyyy / MM / dd"),
          status: facility.deletedAt ? "0" : "1", // Set status based on deletedAt
        }))
      );
      setTotalCount(response.innerData.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFacilities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch = facility.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const columns: { header: string; accessor: keyof Facility }[] = [
    { header: "name", accessor: "name" },
    { header: "description", accessor: "description" },
    { header: "created", accessor: "createdAt" },
  ];




  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "Name",
          "Description",
          "Created At",
        ],
        ...filteredFacilities.map((c) => [
          c.id,
          c.title,
          c.description,
          c.createdAt,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Facilities.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!facilityToDelete) return;

    try {
      const result = await deleteFacility(facilityToDelete);
      if (result.success) {
        showToast.success(t("facility_deleted_successfully"));
        getFacilities();
      } else {
        console.error("Failed to delete facility:", result.message);
      }
    } catch (error) {
      console.error("Error deleting facility:", error);
    }
    setShowDeleteConfirm(false);
    setFacilityToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setFacilityToDelete(null);
  };

  const renderRowActions = (row: Facility) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/presets/facility/${row.id}`}
      />
      <Button
        icon={<Edit />}
        noBackground={true}
        textColor="gray-900"
        noLabel={true}
        onClick={() => {
          setFacilityToEdit({
            id: row.id,
            title: row.title,
            titleArabic: row.titleArabic,
            description: row.description,
            imageUrl: row.imageUrl || "",
          });
          setEditPopupOpen(true);
        }}
      />
      <Button
        icon={<Delete />}
        noBackground={true}
        textColor="red-500"
        noLabel={true}
        onClick={() => {
          setFacilityToDelete(row.id);
          setShowDeleteConfirm(true);
        }}
      />
    </div>
  );

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    { label: t("facility"), href: "/dashboard/presets/facility" },
  ];

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("facility")} />

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

      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.add_facility")}
              onClick={() => setAddPopupOpen(true)}
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
          data={filteredFacilities}
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: (page) => setCurrentPage(page),
          }}
          
          rowsPerPage={limit}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>

      <Popup
        isOpen={addPopupOpen}
        onClose={() => {
          setAddPopupOpen(false);
          getFacilities();
        }}
      >
        <NewFacilityForm
          title={t("add_facility")}
          sub_title={t("form_subtitle")}
          onClose={() => {
            setAddPopupOpen(false);
            getFacilities();
          }}
        />
      </Popup>

      <Popup
        isOpen={editPopupOpen}
        onClose={() => {
          setEditPopupOpen(false);
          setFacilityToEdit(null);
          getFacilities();
        }}
      >
        <NewFacilityForm
          title={t("edit_facility")}
          sub_title={t("form_subtitle")}
          onClose={() => {
            setEditPopupOpen(false);
            setFacilityToEdit(null);
            getFacilities();
          }}
          facilityData={facilityToEdit}
        />
      </Popup>
    </div>
  );
};

export default Facilities;
