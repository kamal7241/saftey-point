import React from "react";
import { useTranslations } from "next-intl";
import Button from "../../ui/Button";
import Edit2 from "../../ui/icons/Edit2";
import Suspend from "../../ui/icons/Suspend";
import { Delete } from "../../ui/icons/Delete";

type ActiveTab = "course_info" | "pricing" | "exam" | "certificate" | "sessions" | "enrollments";

interface CourseHeaderActionsProps {
  isEditing: boolean;
  activeTab: ActiveTab;
  onEdit: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}

export default function CourseHeaderActions({
  isEditing,
  activeTab,
  onEdit,
  onSuspend,
  onDelete,
}: CourseHeaderActionsProps) {
  const t = useTranslations("common");

  return (
    <>
      {!isEditing && activeTab == "course_info" && (
        <Button
          label={t("buttons.edit")}
          onClick={onEdit}
          icon={
            <span className="inline-block w-6">
              <Edit2 />
            </span>
          }
          variant="primary"
        />
      )}
      <Button
        label={t("buttons.suspend")}
        onClick={onSuspend}
        icon={
          <span className="inline-block w-6">
            <Suspend />
          </span>
        }
        variant="dark"
        disabled={isEditing}
      />
      <Button
        label={t("buttons.delete")}
        onClick={onDelete}
        icon={
          <span className="inline-block w-6">
            <Delete />
          </span>
        }
        variant="danger"
        disabled={isEditing}
      />
    </>
  );
}