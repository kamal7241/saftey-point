/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/ui/Button";
import { Flag } from "@/components/ui/icons/Flag";
import Note from "@/components/ui/icons/Note";
import PriceIcon from "@/components/ui/icons/PriceIcon";
import Theoretical from "@/components/ui/icons/Theoretical";
import TicketDiscount from "@/components/ui/icons/TicketDiscount";
import { useTranslations } from "next-intl";
import CorporatePricingTable from "../../ui/CorporatePricingTable";
import GroupInfo from "../../ui/GroupInfo";
import { useEffect, useState } from "react";
import { fetchCountries } from "@/api/dashboardService";
import Popup from "../../ui/Popup";
import PricingForm from "./PricingForm";
import { FormikValues } from "formik";
import { submitPricing } from "@/api/courseService";
import { Add } from "@/components/ui/icons/Add";
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
  const [countries, setCountries] = useState<any>([]);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  useEffect(() => {
    const getCountries = async () => {
      const response = await fetchCountries();
      if (response.success) {
        setCountries(response.countries);
      }
    };
    getCountries();
  }, []);

  const handleSubmit = async (values: FormikValues) => {
    try {
      setIsSubmitting(true);

      const mainPricingData = {
        isTheoreticalOnly: values.theoreticalOnly === "yes",
        type: values.priceType,
        isCompanyTraining: values.companyPremises === "yes",
        price: values.price,
        discount: values.discount,
        countryId: values.countryId,
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
    return <div>{t("no_pricing_found")}</div>;
  }

  return (
    <div className="divide-y space-y-2">
      {pricingData.map((pricing) => (
        <div key={pricing.id} className="grid grid-cols-3 gap-6 py-4">
          <GroupInfo
            label={t("country")}
            content={
              countries.find((c: any) => c.id === Number(pricing.countryId))
                ?.name
            }
            icon={<Flag />}
            block
          />
          <GroupInfo
            label={t("price")}
            content={`$${pricing.price}`}
            icon={<PriceIcon />}
            block
          />
          <GroupInfo
            label={t("discount")}
            content={`${pricing.discount}%`}
            icon={<TicketDiscount />}
            block
          />
          <GroupInfo
            label={t("theoreticalOnly")}
            content={pricing.isTheoreticalOnly ? t("yes") : t("no")}
            icon={<Theoretical />}
            block
          />
          <GroupInfo
            label={t("companyPremises")}
            content={pricing.isCompanyTraining ? t("yes") : t("no")}
            icon={<Theoretical />}
            block
          />
          <GroupInfo
            label={t("type")}
            content={pricing.type}
            icon={<Note />}
            block
          />
          <div className="col-span-3 flex justify-end gap-6">
            <Button
              label={t("buttons.edit")}
              onClick={() => onEditPricing(pricing.id)}
              variant="secondary"
            />
            {pricing === pricingData[0] && (
              <Button
                label={t("buttons.add_price")}
                onClick={() => setAddPopupOpen(true)}
                icon={
                  <span className="inline-block w-6">
                    <Add />
                  </span>
                }
                variant="primary"
              />
            )}
          </div>
        </div>
      ))}
      <div className="mt-6">
        <CorporatePricingTable courseId={courseId} />
      </div>

      <Popup
        isOpen={addPopupOpen}
        onClose={() => setAddPopupOpen(false)}
        width="max-w-[940px]"
      >
        <PricingForm
          initialValues={{}}
          onSubmit={handleSubmit}
          onCancel={() => setAddPopupOpen(false)}
          isLoading={isSubmitting}
        />
      </Popup>
    </div>
  );
}
