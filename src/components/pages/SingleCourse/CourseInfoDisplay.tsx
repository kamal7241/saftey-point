import React from "react";
import { useTranslations } from "next-intl";
import type { SingleCourse } from "@/types/ui.types";
import GroupInfo from "../../ui/GroupInfo";
import Status from "../../ui/Status";
import ImagePopup from "../../ui/ImagePopup";
import CourseTitle from "../../ui/icons/CourseTitle";
import StatusCheck from "../../ui/icons/StatusCheck";
import Prerequisites from "../../ui/icons/Prerequisites";
import Validity from "../../ui/icons/Validity";
import Level from "../../ui/icons/Level";
import Attach from "../../ui/icons/Attach";
import LanguageSquare from "../../ui/icons/LanguageSquare";
import MaxAttendees from "../../ui/icons/MaxAttendees";
import Medical from "../../ui/icons/Medical";
import Note from "../../ui/icons/Note";

interface CourseInfoDisplayProps {
  courseData: SingleCourse;
}

export default function CourseInfoDisplay({ courseData }: CourseInfoDisplayProps) {
  const t = useTranslations("common");

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <GroupInfo
          label={t("courseTitle")}
          content={courseData.title ?? "missing from API"}
          icon={<CourseTitle />}
        />
        <GroupInfo
          label={t("status")}
          content={
            <Status status={courseData?.status} />
          }
          icon={<StatusCheck />}
        />
        <GroupInfo
          label={t("prerequisites.name")}
          content={courseData.prerequisites ?? "missing from API"}
          icon={<Prerequisites />}
        />
        <GroupInfo
          label={t("validity")}
          content={
            courseData.validity
              ? new Date(courseData.validity).toLocaleDateString()
              : "missing from API"
          }
          icon={<Validity />}
        />
        <GroupInfo
          label={t("level.name")}
          content={courseData.level ?? "missing from API"}
          icon={<Level />}
        />
        <GroupInfo
          label={t("courseCover")}
          content={<ImagePopup imagePath={courseData?.cover} />}
          icon={<Attach />}
        />
        <GroupInfo
          label={t("language.name")}
          content={courseData.language ?? "missing from API"}
          icon={<LanguageSquare />}
        />
        <GroupInfo
          label={t("maxAttendees")}
          content={courseData.maxAttendees ?? "missing from API"}
          icon={<MaxAttendees />}
        />
        <GroupInfo
          label={t("medicalTest")}
          content={courseData.requiresMedicalTest ? "Yes" : "No"}
          icon={<Medical />}
        />
      </div>
      <div className="mt-6">
        <GroupInfo
          label={t("description")}
          content={courseData.description ?? "missing from API"}
          icon={<Note />}
        />
      </div>
    </>
  );
}