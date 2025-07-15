import React from "react";
import { useTranslations } from "next-intl";
import type { SingleCourse } from "@/types/ui.types";
import GroupInfo from "../../ui/GroupInfo";
import Status from "../../ui/Status";
import ImagePopup from "../../ui/ImagePopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faCheckCircle,
  faClipboardList,
  faCalendarCheck,
  faLayerGroup,
  faBuilding,
  faTag,
  faImage,
  faGlobe,
  faUsers,
  faStethoscope,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";

interface CourseInfoDisplayProps {
  courseData: SingleCourse;
}

export default function CourseInfoDisplay({
  courseData,
}: CourseInfoDisplayProps) {
  const t = useTranslations("common");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <GroupInfo
          label={t("courseTitle")}
          content={courseData.title || "Not set"}
          icon={<FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4" />}
        />
        <GroupInfo
          label={t("status")}
          content={<Status status={courseData.status} />}
          icon={<FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />}
        />
        <GroupInfo
          label={t("prerequisites.name")}
          content={courseData.prerequisites?.name || "Not set"}
          icon={<FontAwesomeIcon icon={faClipboardList} className="w-4 h-4" />}
        />
        <GroupInfo
          label={t("validity")}
          content={formatDate(courseData.validity)}
          icon={<FontAwesomeIcon icon={faCalendarCheck} className="w-4 h-4" />}
        />
        <GroupInfo
          label={t("level.name")}
          content={courseData.level?.name || "Not set"}
          icon={<FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4" />}
        />

        <GroupInfo
          label={t("facility")}
          content={courseData.facility?.title || "Not set"}
          icon={<FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />}
        />

        <GroupInfo
          label={t("course_type")}
          content={courseData.courseType?.code || "Not set"}
          icon={<FontAwesomeIcon icon={faTag} className="w-4 h-4" />}
        />

        <GroupInfo
          label={t("courseCover")}
          content={<ImagePopup imagePath={courseData?.cover} />}
          icon={<FontAwesomeIcon icon={faImage} className="w-4 h-4" />}
        />

        <GroupInfo
          label={t("language.name")}
          content={courseData.language?.name || "Not set"}
          icon={<FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />}
        />

        <GroupInfo
          label={t("maxAttendees")}
          content={courseData.maxAttendees?.toString() || "Not set"}
          icon={<FontAwesomeIcon icon={faUsers} className="w-4 h-4" />}
        />
        <GroupInfo
          label={t("medicalTest")}
          content={courseData.requiresMedicalTest ? "Yes" : "No"}
          icon={<FontAwesomeIcon icon={faStethoscope} className="w-4 h-4" />}
        />
      </div>
      <div className="mt-6">
        <GroupInfo
          label={t("description")}
          content={courseData.description || "Not set"}
          icon={<FontAwesomeIcon icon={faNoteSticky} className="w-4 h-4" />}
        />
      </div>
    </>
  );
}
