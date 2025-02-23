import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import Calendar from "@/components/ui/icons/Calendar";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";

interface CertificateProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  setFieldValue: FormikProps<FormikValues>["setFieldValue"];
  errors: FormikValues;
}

export default function Certificate({
  values,
  handleChange,
  errors,
  setFieldValue,
}: CertificateProps) {
  const t = useTranslations("common");
  console.log("values", values);
  return (
    <div>
      <div className="mt-4 grid w-full grid-cols-4 gap-x-4 gap-y-6">
        <div className="col-span-4">
          <Input
            label={t("certificate_name")}
            type="text"
            placeholder="certificateName"
            value={values.certificateName}
            onChange={handleChange}
            name="certificateName"
          />
          <ErrorMessage
            name="certificateName"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
        <div className="col-span-2">
          <Input
            label={t("validate_date_interval")}
            type="date"
            placeholder={t("validate_date_interval")}
            value={values.validate_date_interval}
            onChange={(dateRange) =>
              setFieldValue("validate_date_interval", dateRange)
            }
            name="validate_date_interval"
            range={true}
            iconEnd={true}
            iconSVG={<Calendar />}
          />
          <ErrorMessage
            name="validate_date_interval"
            component="div"
            className="text-xs text-red-500"
          />
        </div>
        <div className="col-span-2">
          <Input
            label={t("issue_date")}
            type="date"
            placeholder={t("issue_date")}
            value={values.issue_date}
            onChange={(dateRange) => setFieldValue("issue_date", dateRange)}
            name="issue_date"
            iconEnd={true}
            iconSVG={<Calendar />}
          />
          <ErrorMessage
            name="issue_date"
            component="div"
            className="text-xs text-red-500"
          />
        </div>

        <div className="col-span-2">
          <RadioField
            label={t("displayScore")}
            name="displayScore"
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
            selectedValue={values.displayScore}
            onChange={handleChange}
          />
          {errors.displayScore && (
            <p className="text-xs text-red-500 py-1">{errors.displayScore}</p>
          )}
        </div>
        <br />
        <div className="col-span-2">
          <RadioField
            label={t("watermark")}
            name="watermark"
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
            selectedValue={values.watermark}
            onChange={handleChange}
          />
          {errors.watermark && (
            <p className="text-xs text-red-500 py-1">{errors.watermark}</p>
          )}
        </div>
      </div>
    </div>
  );
}
