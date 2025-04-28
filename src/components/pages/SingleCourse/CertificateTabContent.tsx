import Level from "@/components/ui/icons/Level";
import Teacher from "@/components/ui/icons/Teacher";
import Validity from "@/components/ui/icons/Validity";
import { useTranslations } from "next-intl";
import { useState } from "react";
import GroupInfo from "../../ui/GroupInfo";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import CertificateForm from "./CertificateForm";
import { FormikValues } from "formik";
import { submitCertificate } from "@/api/courseService";
import { showToast } from "@/utils/toast";


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
  courseId: number;
  onEditCertificate: (certificateId: number) => void;
  refetchCertificateData: () => void;
}

export default function CertificateTabContent({
  certificateData,
  isLoading,
  courseId,
  onEditCertificate,
  refetchCertificateData,
}: CertificateTabContentProps) {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("common");

  const handleSubmit = async (values: FormikValues) => {
    try {
      setIsSubmitting(true);
      const result = await submitCertificate(values, courseId.toString());
      if (result.success) {
        setShowAddPopup(false);
        showToast.success(t("certificate_added_successfully"));
        refetchCertificateData();
      } else {
        showToast.error(t("error_adding_certificate"));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting certificate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (!certificateData || certificateData.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div>{t("no_certificate_found")}</div>
        <Button
          type="button"
          label={t("buttons.add_certificate")}
          onClick={() => setShowAddPopup(true)}
          variant="primary"
        />
        {showAddPopup && (
          <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)}>
            <CertificateForm
              initialValues={{}}
              onSubmit={handleSubmit}
              onCancel={() => setShowAddPopup(false)}
              isLoading={isSubmitting}
            />
          </Popup>
        )}
      </div>
    );
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
