"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/utils/toast";
import { createNotificationGroup } from "@/api/notificationService";
import { NotificationGroupDTO } from "@/types/api.types";
import Button from "../ui/Button";

interface NewNotificationGroupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const NewNotificationGroupForm = ({ onSuccess, onCancel }: NewNotificationGroupFormProps) => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast.error(tMsgs("please_fill_all_required_fields"));
      return;
    }

    const groupData: NotificationGroupDTO = {
      name: name.trim(),
      description: description.trim() || undefined,
      userIds: []
    };

    setLoading(true);
    try {
      await createNotificationGroup(groupData);
      showToast.success(tMsgs("notification_group_created_successfully"));
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : tMsgs("failed_to_create_notification_group");
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Group Information */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-dark mb-4">{t("notifications.group_information")}</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-400 mb-2">
              {t("notifications.group_name")} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("notifications.enter_group_name")}
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-400 mb-2">
              {t("notifications.group_description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("notifications.enter_group_description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Group Details */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-dark mb-4">{t("notifications.group_details")}</h4>
        <div className="p-4 bg-blue-50 rounded-lg">
          <label className="block text-sm font-medium text-light-400 mb-2">
            {t("notifications.creation_note")}
          </label>
          <p className="text-dark font-semibold">
            💡 {t("notifications.you_can_add_users_to_this_group_after_creation")}
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          label={loading ? t("notifications.creating") : t("notifications.create_group")}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          label={t("cancel")}
        />
      </div>
    </form>
  );
};

export default NewNotificationGroupForm; 