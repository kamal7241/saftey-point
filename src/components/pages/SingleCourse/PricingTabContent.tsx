import Button from "@/components/ui/Button";
import { Flag } from "@/components/ui/icons/Flag";
import Note from "@/components/ui/icons/Note";
import PriceIcon from "@/components/ui/icons/PriceIcon";
import Theoretical from "@/components/ui/icons/Theoretical";
import TicketDiscount from "@/components/ui/icons/TicketDiscount";
import { useTranslations } from "next-intl";
import CorporatePricingTable from "../../ui/CorporatePricingTable";
import GroupInfo from "../../ui/GroupInfo";

interface PricingTabContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pricingData: any[];
  courseId: number;
  isLoading: boolean;
  onEditPricing: (pricingId: number) => void;
}

export default function PricingTabContent({
  pricingData,
  courseId,
  isLoading,
  onEditPricing,
}: PricingTabContentProps) {
  const t = useTranslations("common");

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
            content={`$${pricing.countryId}`}
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
          <div className="col-span-3 flex justify-end">
            <Button
              label={t("buttons.edit")}
              onClick={() => onEditPricing(pricing.id)}
            />
          </div>
        </div>
      ))}
      <div className="mt-6">
        <CorporatePricingTable courseId={courseId} />
      </div>
    </div>
  );
}
