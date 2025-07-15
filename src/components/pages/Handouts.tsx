"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Handout } from "@/types/api.types";
import { fetchHandouts, deleteHandout } from "@/api/handoutsService";
import { showToast } from "@/utils/toast";
import Button from "../ui/Button";
import Popup from "../ui/Popup";
import NewHandoutForm from "../forms/NewHandoutForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faEdit,
  faTrash,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function Handouts() {
  const t = useTranslations("common");
  const [handouts, setHandouts] = useState<Handout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentHandout, setCurrentHandout] = useState<Handout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadHandouts = async () => {
    try {
      setIsLoading(true);
      const result = await fetchHandouts();
      if (result.success && result.innerData) {
        setHandouts(result.innerData.handouts);
      } else {
        showToast.error(t("error_loading_data"));
      }
    } catch (error) {
      console.error("Error loading handouts:", error);
      showToast.error(t("error_loading_data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHandouts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("are_you_sure_delete"))) {
      try {
        const result = await deleteHandout(id);
        if (result.success) {
          showToast.success(t("handout_deleted_successfully"));
          loadHandouts();
        } else {
          showToast.error(result.error || t("error_deleting_handout"));
        }
      } catch (error) {
        console.error("Error deleting handout:", error);
        showToast.error(t("error_deleting_handout"));
      }
    }
  };

  const handleEdit = (handout: Handout) => {
    setCurrentHandout(handout);
    setShowEditPopup(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setShowAddPopup(false);
      showToast.success(t("handout_added_successfully"));
      loadHandouts();
    } catch (error) {
      console.error("Error submitting handout:", error);
      showToast.error(t("error_adding_handout"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setIsSubmitting(true);
      setShowEditPopup(false);
      showToast.success(t("handout_updated_successfully"));
      loadHandouts();
    } catch (error) {
      console.error("Error updating handout:", error);
      showToast.error(t("error_updating_handout"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("loading")}...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">{t("handouts")}</h1>
        </div>
        <Button
          type="button"
          label={t("buttons.add_handout")}
          onClick={() => setShowAddPopup(true)}
          variant="primary"
          icon={<FontAwesomeIcon icon={faPlus} className="w-4 h-4" />}
        />
      </div>

      {handouts.length === 0 ? (
        <div className="text-center py-8">
          <FontAwesomeIcon icon={faFileAlt} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t("no_handouts_found")}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {handouts.map((handout) => (
            <div
              key={handout.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {handout.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        handout.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {handout.isActive ? t("active") : t("inactive")}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{handout.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{t("file_type")}: {handout.fileType}</span>
                    <span>{t("file_size")}: {formatFileSize(handout.fileSize)}</span>
                    <span>{t("created")}: {new Date(handout.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.open(handout.fileUrl, '_blank')}
                    icon={<FontAwesomeIcon icon={faDownload} className="w-4 h-4" />}
                    label={t("buttons.download")}
                  />
                  <Button
                    type="button"
                    variant="dark"
                    onClick={() => handleEdit(handout)}
                    icon={<FontAwesomeIcon icon={faEdit} className="w-4 h-4" />}
                    label={t("buttons.edit")}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleDelete(handout.id)}
                    icon={<FontAwesomeIcon icon={faTrash} className="w-4 h-4" />}
                    label={t("buttons.delete")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddPopup && (
        <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)}>
          <NewHandoutForm
            initialValues={{}}
            onSubmit={handleSubmit}
            onCancel={() => setShowAddPopup(false)}
            isLoading={isSubmitting}
          />
        </Popup>
      )}

      {showEditPopup && currentHandout && (
        <Popup isOpen={showEditPopup} onClose={() => setShowEditPopup(false)}>
          <NewHandoutForm
            initialValues={{
              title: currentHandout.title,
              description: currentHandout.description,
              fileUrl: currentHandout.fileUrl,
              fileType: currentHandout.fileType,
              fileSize: currentHandout.fileSize,
              isActive: currentHandout.isActive,
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditPopup(false)}
            isLoading={isSubmitting}
          />
        </Popup>
      )}
    </div>
  );
} 