import { useTranslations } from "next-intl";
import Button from "./Button";
import Table from "./Table";
import { Add } from "./icons/Add";
import Popup from "./Popup";
import FormPrice from "../forms/course-steps/FormPrice";
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { fetchCorporatePricing } from "@/api/courseService";
import { CorporatePricingItem } from "@/types/api.types";

interface CorporatePricingTableProps {
  courseId: number;
}

// type TableRowData = {
//   id: number;
//   city: string;
//   branch: string;
//   type: string;
//   fees: string;
//   image?: string;
// };

export default function CorporatePricingTable({ courseId }: CorporatePricingTableProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<CorporatePricingItem[]>([]);

  const getPricing = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    const data = await fetchCorporatePricing(courseId);
    if (data) {
      setTableData(data);
    } else {
      toast.error(tMsgs("error_fetching_pricing"));
    }
    setLoading(false);
  }, [courseId, tMsgs]);

  useEffect(() => {
    getPricing();
  }, [getPricing]);

  const columns: { header: string; accessor: keyof CorporatePricingItem }[] = [
    { header: "id", accessor: "id" },
    { header: "city", accessor: "city" },
    // { header: "branch", accessor: "branch" },
    { header: "type", accessor: "type" },
    { header: "fees", accessor: "fees" },
  ];

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <h2 className="heading3">Corporates Address</h2>
        <div className="flex gap-3 justify-between items-stretch flex-wrap">
          <Button
            label={t("addSpecificPrice")}
            onClick={() => {
              if (!courseId) {
                toast.error(tMsgs("missing_courseId"));
                return;
              }
              setAddPopupOpen(true);
            }}
            icon={
              <span className="w-6 inline-block">
                <Add />
              </span>
            }
            variant="primary"
          />
          <Button
            label={t("buttons.filters")}
            onClick={() => console.log("FILTER")}
            variant={"transparent"}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-4 text-gray-500">{t("loading")}...</div>
      ) : tableData.length === 0 ? (
        <div className="text-center py-4 text-gray-500">{t("no_pricing_found")}</div>
      ) : (
        <Table<CorporatePricingItem> data={tableData} columns={columns} />
      )}

      {courseId && (
        <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)}>
          <FormPrice
            title={t("addSpecificPrice")}
            sub_title={t("form_subtitle")}
            onClose={() => {
              setAddPopupOpen(false);
              getPricing(); // Refresh data after adding new price
            }}
            courseId={courseId}
          />
        </Popup>
      )}
    </div>
  );
}