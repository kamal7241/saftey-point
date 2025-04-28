import { fetchCountries } from "@/api/dashboardService";
import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import SelectField from "@/components/formsUI/SelectField";
import Button from "@/components/ui/Button";
import CorporatePricingTable from "@/components/ui/CorporatePricingTable";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface PricingProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  errors: FormikValues;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  courseId?: number;
}

export default function Pricing({
  values,
  handleChange,
  errors,
  setFieldValue,
  courseId,
}: PricingProps) {
  const t = useTranslations("common");

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
      // Remove the form values for the last price set
      const lastIndex = pricingSets.length - 1;
      setFieldValue(`country_${lastIndex}`, '');
      setFieldValue(`price_${lastIndex}`, '');
      setFieldValue(`discount_${lastIndex}`, '');
    }
  };
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
                    value: (country as { id: string }).id,
                    label: (country as { name: string }).name,
                  }))}
                  customDropdown
                />
                {errors[`country_${index}`] && (
                  <p className="text-xs text-red-500 py-1">
                    {errors[`country_${index}`]}
                  </p>
                )}
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
        values.companyPremises === "yes") && courseId && (
        <CorporatePricingTable courseId={courseId} />
      )}
    </div>
  );
}
