import React from "react";
import { useTranslations } from "next-intl";
import { CourseEnrollment } from "@/types/api.types";
import GroupInfo from "../../ui/GroupInfo";
import ImageWithFallback from "../../ui/ImageWithFallback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faAward,
  faTasks,
  faClock,
  faUsers,
  faInfoCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

interface EnrollmentsTabContentProps {
  enrollmentsData: CourseEnrollment[] | null;
  isLoading: boolean;
}

export default function EnrollmentsTabContent({
  enrollmentsData,
  isLoading,
}: EnrollmentsTabContentProps) {
  const t = useTranslations("common");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("not_set") || "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("loading")}...</div>
      </div>
    );
  }

  if (!enrollmentsData || enrollmentsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-900">{t("no_enrollments")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">{t("enrollments")}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-900">
            {enrollmentsData.length} {t("enrollment")}
            {enrollmentsData.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {enrollmentsData.map((enrollment) => (
          <div
            key={enrollment.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={enrollment.userCourseEnrollment.user.avatar}
                    alt={`${enrollment.userCourseEnrollment.user.firstName} ${enrollment.userCourseEnrollment.user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {enrollment.userCourseEnrollment.user.firstName}{" "}
                    {enrollment.userCourseEnrollment.user.lastName}
                  </h4>
                  <p className="text-sm text-gray-900">
                    {enrollment.userCourseEnrollment.user.email}
                  </p>
                  <p className="text-sm text-gray-900">
                    {enrollment.userCourseEnrollment.user.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    enrollment.status
                  )}`}
                >
                  {enrollment.status.replace("_", " ")}
                </span>
                {enrollment.isCompleted && (
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GroupInfo
                label={t("enrollment_date")}
                content={formatDate(enrollment.createdAt)}
                icon={<FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />}
              />
              <GroupInfo
                label={t("progress")}
                content={`${enrollment.progressPercentage}%`}
                icon={<FontAwesomeIcon icon={faTasks} className="w-4 h-4" />}
              />
              <GroupInfo
                label={t("last_activity")}
                content={formatDate(enrollment.lastActivityDate)}
                icon={<FontAwesomeIcon icon={faClock} className="w-4 h-4" />}
              />
              <GroupInfo
                label={t("certificate")}
                content={
                  enrollment.certificateIssued ? (
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faAward} className="w-4 h-4 text-green-600" />
                      <span className="text-green-900">
                        {formatDate(enrollment.certificateIssueDate)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-900">{t("not_issued")}</span>
                  )
                }
                icon={<FontAwesomeIcon icon={faAward} className="w-4 h-4" />}
              />
            </div>

            {enrollment.completedAt && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <GroupInfo
                  label={t("completion_date")}
                  content={formatDate(enrollment.completedAt)}
                  icon={<FontAwesomeIcon icon={faAward} className="w-4 h-4" />}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 