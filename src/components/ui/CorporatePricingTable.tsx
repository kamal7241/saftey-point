import { useTranslations } from "next-intl";
import Button from "./Button";
import Table from "./Table";
import { Add } from "./icons/Add";
import Popup from "./Popup";
import FormPrice from "../forms/course-steps/FormPrice";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface CorporatePricingTableProps {
  courseId: string;
}

type TableRowData = {
  id: number;
  city: string;
  branch: string;
  type: string;
  fees: string;
  image?: string;
};

export default function CorporatePricingTable({ courseId }: CorporatePricingTableProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  const tableData: TableRowData[] = [
    {
      id: 1,
      city: "New York",
      branch: "Manhattan",
      type: "Retail",
      fees: "$200",
    },
    {
      id: 2,
      city: "Los Angeles",
      branch: "Downtown",
      type: "Wholesale",
      fees: "$300",
    },
  ];

  const columns: { header: string; accessor: keyof TableRowData }[] = [
    { header: "id", accessor: "id" },
    { header: "city", accessor: "city" },
    { header: "branch", accessor: "branch" },
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
      <Table<TableRowData> data={tableData} columns={columns} />
      {courseId && (
        <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)}>
          <FormPrice
            title={t("add_specific_price")}
            sub_title={t("form_subtitle")}
            onClose={() => setAddPopupOpen(false)}
            courseId={courseId}
          />
        </Popup>
      )}
    </div>
  );
}