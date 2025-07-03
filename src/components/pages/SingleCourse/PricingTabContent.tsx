/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/ui/Button";
import { Flag } from "@/components/ui/icons/Flag";
import Note from "@/components/ui/icons/Note";
import PriceIcon from "@/components/ui/icons/PriceIcon";
import Theoretical from "@/components/ui/icons/Theoretical";
import TicketDiscount from "@/components/ui/icons/TicketDiscount";
import { useTranslations } from "next-intl";
import GroupInfo from "../../ui/GroupInfo";
import { useState } from "react";
import Popup from "../../ui/Popup";
import PricingForm from "./PricingForm";
import { FormikValues } from "formik";
import { submitPricing } from "@/api/courseService";
import { showToast } from "@/utils/toast";

interface PricingTabContentProps {
  pricingData: any[];
  courseId: number;
  isLoading: boolean;
  onEditPricing: (pricingId: number) => void;
  refetchPricingData: () => void;
}

export default function PricingTabContent({
  pricingData,
  courseId,
  isLoading,
  onEditPricing,
  refetchPricingData,
}: PricingTabContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  const handleSubmit = async (values: FormikValues) => {
    try {
      setIsSubmitting(true);

      const mainPricingData = {
        isTheoreticalOnly: values.isTheoreticalOnly,
        type: values.type,
        isCompanyTraining: values.isCompanyTraining,
        price: values.price,
        discount: values.discount,
        countryId: Number(values.countryId),
      };
      const result = await submitPricing(courseId.toString(), mainPricingData);
      if (result.success) {
        setAddPopupOpen(false);
        showToast.success(tMsgs("pricing_added_successfully"));
        refetchPricingData();
      } else {
        showToast.error(tMsgs("error_adding_pricing"));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting pricing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (!pricingData || pricingData.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div>{t("no_pricing_found")}</div>
        <Button
          type="button"
          label={t("buttons.add_price")}
          onClick={() => setAddPopupOpen(true)}
          variant="primary"
        />
        {addPopupOpen && (
          <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)} width="max-w-[940px]">
            <PricingForm
              initialValues={{
                countryId: 0,
                price: 0,
                discount: 0,
                isTheoreticalOnly: false,
                type: "BOTH",
                isCompanyTraining: false
              }}
              onSubmit={handleSubmit}
              onCancel={() => setAddPopupOpen(false)}
              isLoading={isSubmitting}
            />
          </Popup>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y space-y-2">
      {pricingData.map((pricing) => (
        <div key={pricing.id} className="grid grid-cols-3 gap-6 py-4">
          <GroupInfo
            label={t("country")}
            content={pricing.country?.name || ""}
            icon={<Flag />}
          />
          <GroupInfo
            label={t("price")}
            content={pricing.price}
            icon={<PriceIcon />}
          />
          <GroupInfo
            label={t("discount")}
            content={pricing.discount}
            icon={<TicketDiscount />}
          />
          <GroupInfo
            label={t("theoreticalOnly")}
            content={pricing.isTheoreticalOnly ? t("yes") : t("no")}
            icon={<Theoretical />}
          />
          <GroupInfo
            label={t("type")}
            content={pricing.type}
            icon={<Note />}
          />
          <GroupInfo
            label={t("companyTraining")}
            content={pricing.isCompanyTraining ? t("yes") : t("no")}
            icon={<Note />}
          />
          <div className="col-span-3 flex justify-end">
            <Button
              type="button"
              label={t("buttons.edit")}
              onClick={() => onEditPricing(pricing.id)}
              variant="secondary"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
