import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import { PricingFormValues } from "@/types/forms.types";
import { getPricingValidationSchemaSingle } from "@/utils/validation/courseValidation";
import { Form, Formik, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import Button from "../../ui/Button";
import SelectField from "@/components/formsUI/SelectField";
import { useEffect, useState } from "react";
import { fetchCountries } from "@/api/dashboardService";

interface PricingFormProps {
  initialValues: Partial<PricingFormValues>;
  onSubmit: (values: FormikValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function PricingForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: PricingFormProps) {
  const tValidation = useTranslations("validation");
  const t = useTranslations("common");
  const [countries, setCountries] = useState([]);
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
    <Formik
      initialValues={initialValues}
      validationSchema={getPricingValidationSchemaSingle(tValidation)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange, errors, setFieldValue }) => (
        <Form>
          <div className="grid grid-cols-4 gap-4 w-full col-span-4">
            <div className="col-span-1">
              <SelectField
                label={t("country")}
                name={`countryId`}
                value={values.countryId ? values.countryId.toString() : ""}
                onChange={(name, value) => setFieldValue(name, Number(value))}
                options={
                  countries.length > 0
                    ? countries.map((country) => ({
                        value: (
                          country as { id: string | number }
                        ).id.toString(),
                        label: (country as { name: string }).name,
                      }))
                    : []
                }
                customDropdown
              />
              {errors.countryId && (
                <p className="text-xs text-red-500 py-1">{errors.countryId}</p>
              )}
            </div>
            <div className="col-span-1">
              <Input
                name="price"
                label={t("price")}
                type="number"
                value={values.price ?? ""}
                onChange={handleChange}
                error={errors.price}
              />
            </div>
            <div className="col-span-1">
              <Input
                name="discount"
                label={t("discount")}
                type="number"
                value={values.discount ?? ""}
                onChange={handleChange}
                error={errors.discount}
              />
            </div>

            <div className="col-span-2">
              <RadioField
                label={t("theoreticalOnly")}
                name="theoreticalOnly"
                options={[
                  { value: "yes", label: t("yes") },
                  { value: "no", label: t("no") },
                ]}
                selectedValue={values.isTheoreticalOnly ? "yes" : "no"}
                onChange={(e) => {
                  setFieldValue("isTheoreticalOnly", e.target.value === "yes");
                }}
              />
              {errors.isTheoreticalOnly && (
                <p className="text-xs text-red-500 py-1">
                  {errors.isTheoreticalOnly}
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
                selectedValue={values.type}
                onChange={(e) => {
                  setFieldValue("type", e.target.value);
                }}
              />
              {errors.type && (
                <p className="text-xs text-red-500 py-1">{errors.type}</p>
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
                selectedValue={values.isCompanyTraining ? "yes" : "no"}
                onChange={(e) => {
                  setFieldValue("isCompanyTraining", e.target.value === "yes");
                }}
              />
              {errors.isCompanyTraining && (
                <p className="text-xs text-red-500 py-1">
                  {errors.isCompanyTraining}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              label={t("buttons.cancel")}
              onClick={onCancel}
              variant="transparent"
              type="button"
            />
            <Button
              label={t("buttons.save")}
              type="submit"
              variant="primary"
              disabled={isLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
