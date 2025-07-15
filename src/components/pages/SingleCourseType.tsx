"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { CourseType } from "@/types/ui.types";
import { fetchCourseTypeById, deleteCourseType } from "@/api/courseTypesService";
import { showToast } from "@/utils/toast";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import Popup from "../ui/Popup";
import Edit2 from "../ui/icons/Edit2";
import { Delete } from "../ui/icons/Delete";
import NewCourseTypeForm from "../forms/NewCourseTypeForm";

interface SingleCourseTypeProps {
  courseTypeId: string;
}

export default function SingleCourseType({ courseTypeId }: SingleCourseTypeProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  const [courseType, setCourseType] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourseType = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchCourseTypeById(courseTypeId);
      
      if (result.success && result.innerData?.courseType) {
        setCourseType(result.innerData.courseType);
      } else {
        setError(result.error || "Failed to fetch course type");
        showToast.error(result.error || "Failed to fetch course type");
      }
    } catch (error) {
      console.error("Error fetching course type:", error);
      setError("Failed to fetch course type");
      showToast.error("Failed to fetch course type");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseType();
  }, [courseTypeId]);

  const handleEdit = () => {
    setShowEditPopup(true);
  };

  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  const handleDeleteCourseType = async () => {
    if (!courseType) return;
    
    try {
      setIsSubmitting(true);
      const result = await deleteCourseType(courseType.id);
      
      if (result.success) {
        setShowDeletePopup(false);
        showToast.success(tMsgs("course_type_deleted_successfully"));
        router.push("/dashboard/courses-management/course-types");
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

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("courses_management"), href: "/dashboard/courses-management" },
    { label: t("course_types"), href: "/dashboard/courses-management/course-types" },
    { label: courseType?.nameEnglish || courseType?.code || t("course_type_details"), href: `/dashboard/courses-management/course-types/${courseTypeId}` },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("loading")}...</div>
      </div>
    );
  }

  if (error || !courseType) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">{error || t("course_type_not_found")}</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={courseType.nameEnglish || courseType.code || t("course_type_details")}
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              onClick={handleEdit}
              icon={
                <span className="inline-block w-6">
                  <Edit2 />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.delete")}
              onClick={handleDelete}
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

      <div className="mt-6 bg-white rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("course_type_details")}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("code")}
                </label>
                <p className="text-gray-900">{courseType.code || t("not_available")}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("name_english")}
                </label>
                <p className="text-gray-900">{courseType.nameEnglish || t("not_available")}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("name_arabic")}
                </label>
                <p className="text-gray-900">{courseType.nameArabic || t("not_available")}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("status")}
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  courseType.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {courseType.isActive ? t("active") : t("inactive")}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("created_at")}
                </label>
                <p className="text-gray-900">
                  {courseType.createdAt ? new Date(courseType.createdAt).toLocaleDateString() : t("not_available")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("updated_at")}
                </label>
                <p className="text-gray-900">
                  {courseType.updatedAt ? new Date(courseType.updatedAt).toLocaleDateString() : t("not_available")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Course Type Popup */}
      {showEditPopup && courseType && (
        <Popup 
          isOpen={showEditPopup} 
          onClose={() => {
            setShowEditPopup(false);
            fetchCourseType();
          }}
        >
          <NewCourseTypeForm
            title={t("edit_course_type")}
            sub_title={t("edit_course_type_subtitle")}
            onClose={() => {
              setShowEditPopup(false);
              fetchCourseType();
            }}
            courseTypeData={courseType}
          />
        </Popup>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && courseType && (
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