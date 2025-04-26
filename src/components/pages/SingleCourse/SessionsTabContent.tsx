import React from "react";
import { useTranslations } from "next-intl";
import GroupInfo from "../../ui/GroupInfo";
import Status from "../../ui/Status";
import Note from "../../ui/icons/Note";
import Calendar from "../../ui/icons/Calendar";
import StatusCheck from "../../ui/icons/StatusCheck";

// Define a type for the session data item, adjust based on your actual API response
interface SessionItem {
  id: number;
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string; // e.g., 'ACTIVE', 'INACTIVE'
  // Add other relevant fields like trainer, location, etc.
}

interface SessionsTabContentProps {
  sessionData: SessionItem[];
  isLoading: boolean;
}

export default function SessionsTabContent({ sessionData, isLoading }: SessionsTabContentProps) {
  const t = useTranslations("common");

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (!sessionData || sessionData.length === 0) {
    return <div>{t("no_sessions_found")}</div>;
  }

  return (
    <div className="divide-y space-y-2">
      {sessionData.map((session) => (
        <div key={session.id} className="grid grid-cols-3 gap-6 py-4">
          <GroupInfo
            label={t("title")}
            content={session.title}
            icon={<Note />}
          />
          <GroupInfo
            label={t("description")}
            content={session.description}
            icon={<Note />}
          />
          <GroupInfo
            label={t("startDate")}
            content={new Date(session.startDate).toLocaleDateString()} // Format date as needed
            icon={<Calendar />}
          />
          <GroupInfo
            label={t("endDate")}
            content={new Date(session.endDate).toLocaleDateString()} // Format date as needed
            icon={<Calendar />}
          />
          <GroupInfo
            label={t("status")}
            content={
              session.status === "ACTIVE" ? ( // Adjust status check based on actual values
                <Status status={"1"} />
              ) : (
                <Status status={"0"} />
              )
            }
            icon={<StatusCheck />}
          />
          {/* Add other session details as needed */}
        </div>
      ))}
    </div>
  );
}