/* eslint-disable @typescript-eslint/no-explicit-any */
import { submitSession, updateSession } from "@/api/courseService";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import Table from "@/components/ui/Table";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useState } from "react";
import SessionForm from "./SessionForm";
import { Edit } from "@/components/ui/icons/Edit";

interface SessionsTabContentProps {
  sessionData: any[];
  isLoading: boolean;
  courseId: number;
  refetchSessionData: () => void;
}

export default function SessionsTabContent({
  sessionData,
  isLoading,
  courseId,
  refetchSessionData,
}: SessionsTabContentProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentSession, setCurrentSession] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      const result = await submitSession(values, courseId.toString());
      if (result.success) {
        setShowAddPopup(false);
        showToast.success(tMsgs("session_added_successfully"));
        refetchSessionData();
      } else {
        showToast.error(tMsgs("error_adding_session"));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSession = async (values: any) => {
    try {
      setIsSubmitting(true);
      const result = await updateSession(currentSession?.id.toString() || "", {
        title: values.sessionName,
        description: values.description,
        // startDate: values.startDate,
        // endDate: values.endDate,
        startDate: values.session_date?.[0]?.toISOString(),
        endDate: values.session_date?.[1]?.toISOString(),
        status: values.status === "1" ? "ACTIVE" : "INACTIVE",
      });
      if (result.success) {
        setShowEditPopup(false);
        showToast.success(tMsgs("session_updated_successfully"));
        refetchSessionData();
      } else {
        showToast.error(tMsgs("error_updating_session"));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (!sessionData || sessionData.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div>{t("no_sessions_found")}</div>
        <Button
          type="button"
          label={t("buttons.add_session")}
          onClick={() => setShowAddPopup(true)}
          variant="primary"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          label={t("buttons.add_session")}
          onClick={() => setShowAddPopup(true)}
          variant="primary"
        />
      </div>
      <Table
        data={sessionData}
        columns={[
          { header: "sessionID", accessor: "id" },
          { header: "sessionsName", accessor: "title" },
          { header: "startDate", accessor: "startDate" },
          { header: "endDate", accessor: "endDate" },
          { header: "status", accessor: "status" },
        ]}
        renderRowActions={(row) => (
          <Button
            icon={<Edit />}
            noBackground={true}
            textColor="gray-900"
            noLabel={true}
            onClick={() => {
              setCurrentSession(row);
              setShowEditPopup(true);
            }}
          />
        )}
        sortable={true}
      />

      {showEditPopup && currentSession && (
        <Popup isOpen={showEditPopup} onClose={() => setShowEditPopup(false)}>
          <SessionForm
            initialValues={{
              sessionName: currentSession.title,
              description: currentSession.description,
              endDate: new Date(currentSession.endDate)
                .toISOString()
                .split("T")[0],
              startDate: new Date(currentSession.startDate)
                .toISOString()
                .split("T")[0],
              status: currentSession.status === "ACTIVE" ? "1" : "0",
            }}
            onSubmit={handleEditSession}
            onCancel={() => setShowEditPopup(false)}
            isLoading={isSubmitting}
          />
        </Popup>
      )}

      {showAddPopup && (
        <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)}>
          <SessionForm
            initialValues={{}}
            onSubmit={handleSubmit}
            onCancel={() => setShowAddPopup(false)}
            isLoading={isSubmitting}
          />
        </Popup>
      )}
    </>
  );
}
