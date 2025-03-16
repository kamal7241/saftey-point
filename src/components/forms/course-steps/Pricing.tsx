import { useEffect, useState } from "react";
import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import SelectField from "@/components/formsUI/SelectField";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { Add } from "@/components/ui/icons/Add";
import FormPrice from "./FormPrice";
import { toast } from "react-hot-toast";
import Popup from "@/components/ui/Popup";
import { fetchCountries } from "@/api/dashboardService";

interface PricingProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  errors: FormikValues;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  courseId?: string;
}

export default function Pricing({
  values,
  handleChange,
  errors,
  setFieldValue,
  courseId,
}: PricingProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");

  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [pricingSets, setPricingSets] = useState([
    { country: "", price: "", discount: "" },
  ]);

  const addPriceSet = () => {
    setPricingSets([...pricingSets, { country: "", price: "", discount: "" }]);
  };

  const removeLastPriceSet = () => {
    if (pricingSets.length > 1) {
      setPricingSets(pricingSets.slice(0, pricingSets.length - 1));
    }
  };

  type TableRowData = {
    id: number;
    city: string;
    branch: string;
    type: string;
    fees: string;
    image?: string;
  };

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

  // Define the columns with specific accessors typed as keyof TableRowData
  const columns: { header: string; accessor: keyof TableRowData }[] = [
    { header: "id", accessor: "id" },
    { header: "city", accessor: "city" },
    { header: "branch", accessor: "branch" },
    { header: "type", accessor: "type" },
    { header: "fees", accessor: "fees" },
  ];


  useEffect(() => {
    const getCountries = async () => {
      const response = await fetchCountries();
      if (response.success) {
        setCountries(response.countries);
      }
    };
    getCountries();
  }, []);
  return (
    <div>
      <div className="grid w-full grid-cols-4 gap-4">
        <div className="grid w-full grid-cols-4 gap-4 relative col-span-4">
          {pricingSets.map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 w-full col-span-4"
            >
              <div className="col-span-1">
                <SelectField
                  label={t("country")}
                  name={`country_${index}`}
                  value={values[`country_${index}`] || ""}
                  onChange={(name, value) => setFieldValue(name, value)}
                  options={countries.map((country) => ({
                    value: (country as { code: string }).code,
                    label: (country as { name: string }).name,
                  }))}
                  customDropdown
                />
                <ErrorMessage
                  name={`country_${index}`}
                  component="div"
                  className="text-xs text-red-500 py-1"
                />
              </div>
              <div className="col-span-1">
                <Input
                  label={t("price")}
                  type="number"
                  placeholder="price"
                  value={values[`price_${index}`] || ""}
                  onChange={handleChange}
                  name={`price_${index}`}
                />
                <ErrorMessage
                  name={`price_${index}`}
                  component="div"
                  className="text-xs text-red-500 py-1"
                />
              </div>
              <div className="col-span-1">
                <Input
                  label={t("discount")}
                  type="number"
                  placeholder="discount"
                  value={values[`discount_${index}`] || ""}
                  onChange={handleChange}
                  name={`discount_${index}`}
                  required={false}
                />
                <ErrorMessage
                  name={`discount_${index}`}
                  component="div"
                  className="text-xs text-red-500 py-1"
                />
              </div>
            </div>
          ))}

          <Button
            label={t("buttons.anotherPrice")}
            onClick={addPriceSet}
            type="button"
            variant="dark"
            padding="py-3 px-4"
            className="absolute top-5 end-0 col-span-1"
          />
          {pricingSets.length > 1 && (
            <Button
              label={t("buttons.removeLastPrice")}
              onClick={removeLastPriceSet}
              type="button"
              variant="primary"
              padding="py-3 px-4"
              className="absolute bottom-0 end-0 col-span-1"
            />
          )}
        </div>

        <div className="col-span-2">
          <RadioField
            label={t("theoreticalOnly")}
            name="theoreticalOnly"
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
            selectedValue={values.theoreticalOnly ?? "no"}
            onChange={handleChange}
          />
          {errors.theoreticalOnly && (
            <p className="text-xs text-red-500 py-1">
              {errors.theoreticalOnly}
            </p>
          )}
        </div>

        <br />
        <div className="col-span-2">
          <RadioField
            label={t("chooseType")}
            name="priceType"
            options={[
              { value: "BOTH", label: t("both") },
              { value: "THEORETICAL", label: t("theoretical") },
              { value: "PRACTICAL", label: t("practical") },
            ]}
            selectedValue={values.priceType ?? "BOTH"}
            onChange={handleChange}
          />
          {errors.priceType && (
            <p className="text-xs text-red-500 py-1">{errors.priceType}</p>
          )}
        </div>
        <br />
        <div className="col-span-2">
          <RadioField
            label={t("companyPremises")}
            name="companyPremises"
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
            selectedValue={values.companyPremises ?? "no"}
            onChange={handleChange}
          />
          {errors.companyPremises && (
            <p className="text-xs text-red-500 py-1">
              {errors.companyPremises}
            </p>
          )}
        </div>
      </div>
      {(values.companyPremises === true ||
        values.companyPremises === "yes") && (
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
      )}
    </div>
  );
}
