import Level from "@/components/ui/icons/Level";
import Teacher from "@/components/ui/icons/Teacher";
import Validity from "@/components/ui/icons/Validity";
import { useTranslations } from "next-intl";
import GroupInfo from "../../ui/GroupInfo";
import Button from "@/components/ui/Button";


interface CertificateItem {
  id: number;
  title: string;
  validFrom: string | Date;
  validTo: string | Date;
  issueDate: string | Date;
  displaySource: boolean;
  watermark: boolean;
}

interface CertificateTabContentProps {
  certificateData: CertificateItem[];
  isLoading: boolean;
  onEditCertificate: (certificateId: number) => void;
}

export default function CertificateTabContent({
  certificateData,
  isLoading,
  onEditCertificate,
}: CertificateTabContentProps) {
  const t = useTranslations("common");

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (!certificateData || certificateData.length === 0) {
    return <div>{t("no_certificate_found")}</div>;
  }

  return (
    <div className="divide-y space-y-2">
      {certificateData.map((certificate) => (
        <div key={certificate.id} className="grid grid-cols-3 gap-6 py-4">
          <GroupInfo
            label={t("certificate_name")}
            content={certificate.title}
            icon={<Teacher />}
          />
          <GroupInfo
            label={t("validFrom")}
            content={new Date(certificate.validFrom).toLocaleDateString()}
            icon={<Validity />}
          />
          <GroupInfo
            label={t("validTo")}
            content={new Date(certificate.validTo).toLocaleDateString()}
            icon={<Validity />}
          />
          <GroupInfo
            label={t("issueDate")}
            content={new Date(certificate.issueDate).toLocaleDateString()}
            icon={<Validity />}
          />
          <GroupInfo
            label={t("displaySource")}
            content={certificate.displaySource ? t("yes") : t("no")}
            icon={<Level />}
          />
          <GroupInfo
            label={t("watermark")}
            content={certificate.watermark ? t("yes") : t("no")}
            icon={<Level />}
          />
          <div className="col-span-3 flex justify-end">
            <Button
              type="button"
              label={t("buttons.edit")}
              onClick={() => onEditCertificate(certificate.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
