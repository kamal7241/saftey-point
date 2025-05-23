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
    console.log("values", values);
    try {
      setIsSubmitting(true);

      const startDateInput = values.session_date?.[0];
      const endDateInput = values.session_date?.[1];
      const startTimeInput = values.session_time?.from ?? null;
      const endTimeInput = values.session_time?.to ?? null;

      let finalStartDateISO, finalEndDateISO;

      if (startDateInput && startTimeInput) {
        const startDateTime = new Date(startDateInput);
        // Ensure startTimeInput is a Date object or a string that can be parsed into a Date
        const startTimeDate = typeof startTimeInput === 'string' ? new Date(startTimeInput) : startTimeInput;
        const [hoursFrom, minutesFrom] = startTimeDate.toTimeString().split(':').map(Number);
        startDateTime.setHours(hoursFrom, minutesFrom, 0, 0);
        finalStartDateISO = startDateTime.toISOString().split('.')[0] + 'Z';
      }

      if (endDateInput && endTimeInput) {
        const endDateTime = new Date(endDateInput);
        // Ensure endTimeInput is a Date object or a string that can be parsed into a Date
        const endTimeDate = typeof endTimeInput === 'string' ? new Date(endTimeInput) : endTimeInput;
        const [hoursTo, minutesTo] = endTimeDate.toTimeString().split(':').map(Number);
        endDateTime.setHours(hoursTo, minutesTo, 0, 0);
        finalEndDateISO = endDateTime.toISOString().split('.')[0] + 'Z';
      }
      const result = await submitSession({
        title: values.sessionName,
        description: values.description,
        startDate: finalStartDateISO,
        endDate: finalEndDateISO,
        status: "ACTIVE",
      }, courseId.toString());
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

      const startDateInput = values.session_date?.[0];
      const endDateInput = values.session_date?.[1];
      const startTimeInput = values.session_time?.from;
      const endTimeInput = values.session_time?.to;

      let finalStartDateISO, finalEndDateISO;

      if (startDateInput && startTimeInput) {
        const startDateTime = new Date(startDateInput);
        // Ensure startTimeInput is a Date object or a string that can be parsed into a Date
        const startTimeDate = typeof startTimeInput === 'string' ? new Date(startTimeInput) : startTimeInput;
        const [hoursFrom, minutesFrom] = startTimeDate.toTimeString().split(':').map(Number);
        startDateTime.setHours(hoursFrom, minutesFrom, 0, 0);
        finalStartDateISO = startDateTime.toISOString().split('.')[0] + 'Z';
      }

      if (endDateInput && endTimeInput) {
        const endDateTime = new Date(endDateInput);
        // Ensure endTimeInput is a Date object or a string that can be parsed into a Date
        const endTimeDate = typeof endTimeInput === 'string' ? new Date(endTimeInput) : endTimeInput;
        const [hoursTo, minutesTo] = endTimeDate.toTimeString().split(':').map(Number);
        endDateTime.setHours(hoursTo, minutesTo, 0, 0);
        finalEndDateISO = endDateTime.toISOString().split('.')[0] + 'Z';
      }

      const result = await updateSession(currentSession?.id.toString() || "", {
        title: values.sessionName,
        description: values.description,
        startDate: finalStartDateISO,
        endDate: finalEndDateISO,
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
        
      />

      {showEditPopup && currentSession && (
        <Popup isOpen={showEditPopup} onClose={() => setShowEditPopup(false)}>
          <SessionForm
            initialValues={{
              sessionName: currentSession.title,
              description: currentSession.description,
              session_date: [new Date(currentSession.startDate), new Date(currentSession.endDate)],
              session_time: { from: currentSession.startDate, to: currentSession.endDate }, // Assuming API returns full ISO string for dates
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
