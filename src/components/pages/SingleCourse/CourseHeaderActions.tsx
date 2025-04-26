import React from "react";
import { useTranslations } from "next-intl";
import Button from "../../ui/Button";
import Edit2 from "../../ui/icons/Edit2";
import Suspend from "../../ui/icons/Suspend";
import { Delete } from "../../ui/icons/Delete";

type ActiveTab = "course_info" | "pricing" | "exam" | "certificate" | "sessions";

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
      {/* Conditionally hide Edit button when editing */}
      {!isEditing && (
        <Button
          label={t("buttons.edit")}
          onClick={onEdit}
          icon={
            <span className="inline-block w-6">
              <Edit2 />
            </span>
          }
          variant="primary"
          disabled={activeTab !== "course_info"} // Only allow editing on course info tab
        />
      )}
      {/* Keep Suspend and Delete buttons visible, but disable when editing */}
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