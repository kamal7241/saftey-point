"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/utils/toast";
import {
  sendNotificationToUser,
  sendNotificationToAll,
} from "@/api/notificationService";
import { NotificationDTO } from "@/types/api.types";
import Button from "../ui/Button";

interface NewNotificationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  selectedUserId?: number;
  isGroupNotification?: boolean;
}

const NewNotificationForm = ({
  onSuccess,
  onCancel,
  selectedUserId,
  isGroupNotification = false,
}: NewNotificationFormProps) => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const notificationTypes = [
    { value: "info", label: "Information" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      showToast.error(tMsgs("please_fill_all_required_fields"));
      return;
    }

    const formData: NotificationDTO = {
      title: title.trim(),
      message: message.trim(),
      type: type as "info" | "success" | "warning" | "error",
      data: {},
    };

    setLoading(true);
    try {
      if (selectedUserId) {
        await sendNotificationToUser(selectedUserId, formData);
        showToast.success(tMsgs("notification_sent_successfully"));
      } else {
        await sendNotificationToAll(formData);
        showToast.success(tMsgs("notification_sent_to_all_users"));
      }

      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : tMsgs("failed_to_send_notification");
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notification Information */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-dark mb-4">
          {t("notifications.notification_information")}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-400 mb-2">
              {t("notifications.notification_title")} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("notifications.enter_notification_title")}
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-400 mb-2">
              {t("notifications.notification_message")} *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("notifications.enter_notification_message")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-400 mb-2">
              {t("notifications.notification_type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 placeholder:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {notificationTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(`notifications.${option.value}_type`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notification Details */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-dark mb-4">
          {t("notifications.notification_details")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedUserId && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-light-400 mb-2">
                {t("notifications.target_user")}
              </label>
              <p className="text-dark font-semibold">ID: {selectedUserId}</p>
            </div>
          )}

          {!selectedUserId && !isGroupNotification && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <label className="block text-sm font-medium text-light-400 mb-2">
                {t("notifications.target_audience")}
              </label>
              <p className="text-dark font-semibold">
                {t("notifications.all_users")}
              </p>
            </div>
          )}

          {isGroupNotification && (
            <div className="p-4 bg-green-50 rounded-lg">
              <label className="block text-sm font-medium text-light-400 mb-2">
                {t("notifications.target_audience")}
              </label>
              <p className="text-dark font-semibold">
                {t("notifications.group_members")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          label={
            loading
              ? t("notifications.sending")
              : t("notifications.send_notification")
          }
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

export default NewNotificationForm;
