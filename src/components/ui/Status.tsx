import { AdminVmStatus } from "@/enum/admin-status.enum";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
interface StatusProps {
  status: string;
}

const Status = ({ status }: StatusProps) => {
  const t = useTranslations("common");
  const getStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase();

    const styles = {
      active: "text-green-400 bg-green-100",
      true: "text-green-400 bg-green-100",
      "1": "text-green-400 bg-green-100",
      inactive: "text-gray-300 bg-gray-300 bg-opacity-10",
      false: "text-gray-300 bg-gray-300 bg-opacity-10",
      "0": "text-gray-300 bg-gray-300 bg-opacity-10",
      pending: "text-yellow-900 bg-yellow-300 bg-opacity-50",
      suspended: "text-gray-900 bg-gray-200 bg-opacity-60",
    };

    return styles[statusLower as keyof typeof styles] || "text-gray-500";
  };
  const getStatusName = useCallback(
    (status: string) => {
      const statusMap: Record<string, string> = {
        active: "active",
        ACTIVE: "active",
        true: "active",
        [AdminVmStatus.ACTIVE]: "active",
        inactive: "inactive",
        INACTIVE: "inactive",
        false: "inactive",
        [AdminVmStatus.INACTIVE]: "inactive",
        pending: "pending",
        PENDING: "pending",
        suspended: "suspended",
        SUSPENDED: "suspended",
      };

      const normalizedStatus = statusMap[status];
      return t(normalizedStatus || "default");
    },
    [status]
  );

  return (
    <span
      className={`${getStatusStyle(
        status
      )} leading-6 rounded text-xs capitalize w-24 text-center inline-block`}
    >
      {getStatusName(status)}
    </span>
  );
};

export default Status;
