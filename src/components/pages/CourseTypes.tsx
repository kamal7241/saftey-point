"use client";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import Table from "@/components/ui/Table";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import NewCourseTypeForm from "../forms/NewCourseTypeForm";
import { CourseType } from "@/types/ui.types";
import {
  fetchCourseTypes,
  deleteCourseType,
} from "@/api/courseTypesService";
import PageHeader from "../global/PageHeader";
import SearchForm from "../formsUI/SearchForm";
import { Edit } from "../ui/icons/Edit";
import { Delete } from "../ui/icons/Delete";
import Eye from "../ui/icons/Eye";
import { Export } from "../ui/icons/Export";
import { Add } from "../ui/icons/Add";
import { useRouter } from "@/i18n/routing";

export default function CourseTypes() {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentCourseType, setCurrentCourseType] = useState<CourseType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      const result = await fetchCourseTypes(offset, itemsPerPage);
      
      if (result.success && result.innerData) {
        setCourseTypes(result.innerData.courseTypes);
        setTotalCount(result.innerData.count);
      } else {
        showToast.error(result.message || "Failed to fetch course types");
      }
    } catch (error) {
      console.error("Error fetching course types:", error);
      showToast.error("Failed to fetch course types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleDeleteCourseType = async () => {
    if (!currentCourseType) return;
    
    try {
      setIsSubmitting(true);
      const result = await deleteCourseType(currentCourseType.id);
      
      if (result.success) {
        setShowDeletePopup(false);
        showToast.success(tMsgs("course_type_deleted_successfully"));
        fetchData();
      } else {
        showToast.error(result.error || tMsgs("error_deleting_course_type"));
      }
    } catch (error) {
      console.error("Error deleting course type:", error);
      showToast.error(tMsgs("error_deleting_course_type"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (courseType: CourseType) => {
    router.push(`/dashboard/courses-management/course-types/${courseType.id}`);
  };

  const handleEdit = (courseType: CourseType) => {
    setCurrentCourseType(courseType);
    setShowEditPopup(true);
  };

  const handleDelete = (courseType: CourseType) => {
    setCurrentCourseType(courseType);
    setShowDeletePopup(true);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "Code",
          "Name English",
          "Name Arabic",
          "Status",
          "Created At",
        ],
        ...filteredCourseTypes.map((courseType) => [
          courseType.id,
          courseType.code || '',
          courseType.nameEnglish || '',
          courseType.nameArabic || '',
          courseType.isActive ? t("active") : t("inactive"),
          courseType.createdAt,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "course-types.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCourseTypes = courseTypes.filter((courseType) => {
    const matchesSearch = 
      (courseType.nameEnglish?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (courseType.nameArabic?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (courseType.code?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("courses_management"), href: "/dashboard/courses-management" },
    { label: t("course_types"), href: "/dashboard/courses-management/course-types" },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("course_types")}
      />

      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          <SearchForm
            onSearch={setSearchTerm}
          />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.add_course_type")}
              onClick={() => setShowAddPopup(true)}
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
          data={filteredCourseTypes}
          columns={[
            { header: "id", accessor: "id" },
            { header: "code", accessor: "code" },
            { header: "name_english", accessor: "nameEnglish" },
            { header: "name_arabic", accessor: "nameArabic" },
            { header: "status", accessor: "isActive" },
            { header: "created", accessor: "createdAt" },
          ]}
          renderRowActions={(row) => (
            <div className="flex gap-2">
              <Button
                icon={<Eye />}
                noBackground={true}
                textColor="gray-900"
                noLabel={true}
                onClick={() => handleView(row)}
              />
              <Button
                icon={<Edit />}
                noBackground={true}
                textColor="gray-900"
                noLabel={true}
                onClick={() => handleEdit(row)}
              />
              <Button
                icon={<Delete />}
                noBackground={true}
                textColor="red-500"
                noLabel={true}
                onClick={() => handleDelete(row)}
              />
            </div>
          )}
          isLoading={loading}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / itemsPerPage),
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      {/* Add Course Type Popup */}
      <Popup 
        isOpen={showAddPopup} 
        onClose={() => {
          setShowAddPopup(false);
          fetchData();
        }}
      >
        <NewCourseTypeForm
          title={t("add_course_type")}
          sub_title={t("add_course_type_subtitle")}
          onClose={() => {
            setShowAddPopup(false);
            fetchData();
          }}
        />
      </Popup>

      {/* Edit Course Type Popup */}
      {showEditPopup && currentCourseType && (
        <Popup 
          isOpen={showEditPopup} 
          onClose={() => {
            setShowEditPopup(false);
            setCurrentCourseType(null);
            fetchData();
          }}
        >
          <NewCourseTypeForm
            title={t("edit_course_type")}
            sub_title={t("edit_course_type_subtitle")}
            onClose={() => {
              setShowEditPopup(false);
              setCurrentCourseType(null);
              fetchData();
            }}
            courseTypeData={currentCourseType}
          />
        </Popup>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && currentCourseType && (
        <Popup isOpen={showDeletePopup} onClose={() => setShowDeletePopup(false)}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t("are_you_sure_delete")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleDeleteCourseType}
                label={t("buttons.confirm")}
                variant="danger"
                disabled={isSubmitting}
              />
              <Button
                onClick={() => setShowDeletePopup(false)}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
} 