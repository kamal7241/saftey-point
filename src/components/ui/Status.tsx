import { useTranslations } from "next-intl";

interface StatusProps {
  status: string;
}

const Status = ({ status }: StatusProps) => {
  const t = useTranslations("common");
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-100";
      case "ACTIVE":
        return "text-green-400 bg-green-100";
      case "1":
        return "text-green-400 bg-green-100";
      case "inactive":
        return "text-gray-300 bg-gray-300 bg-opacity-10";
      case "0":
        return "text-gray-300 bg-gray-300 bg-opacity-10";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };
  const getStatusName = (status: string) => {
    switch (status) {
      case "active":
        return t("active");
      case "ACTIVE":
        return t("active");
      case "1":
        return t("active");
      case "inactive":
        return t("inactive");
      case "0":
        return t("inactive");
      case "pending":
        return t("pending");
      default:
        return t("default");
    }
  };

  return (
    <span className={`${getStatusStyle(status)} leading-6 rounded text-xs capitalize w-24 text-center inline-block`}>{getStatusName(status)}</span>
  );
};

export default Status;
