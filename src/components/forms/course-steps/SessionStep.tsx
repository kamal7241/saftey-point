import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import SelectField from "@/components/formsUI/SelectField";
import Textarea from "@/components/formsUI/Textarea";
import Calendar from "@/components/ui/icons/Calendar";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";

interface SessionProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  setFieldValue: FormikProps<FormikValues>["setFieldValue"];
  errors: FormikValues;
}

export default function SessionStep({
  values,
  handleChange,
  errors,
  setFieldValue,
}: SessionProps) {
  const t = useTranslations("common");
  console.log("values", values);
  console.log("errors", errors);
  return (
    <div>
      <div className="mt-4 grid w-full grid-cols-6 gap-x-4 gap-y-6">
        <div className="col-span-6">
          <Input
            label={t("sessionName")}
            type="text"
            placeholder={t("sessionName")}
            value={values.sessionName}
            onChange={handleChange}
            name="sessionName"
          />
          <ErrorMessage
            name="sessionName"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
        <div className="col-span-2">
          <SelectField
            label={t("trainer")}
            name="trainer"
            value={values.trainer}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "trainer_1", label: t("trainer_1") },
              { value: "trainer_2", label: t("trainer_2") },
            ]}
            customDropdown
          />
          {errors.trainer && (
            <p className="text-xs text-red-500 py-1">{errors.trainer}</p>
          )}
        </div>
        <div className="col-span-2">
          <SelectField
            label={t("assistant")}
            name="assistant"
            value={values.assistant}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "assistant_1", label: t("assistant_1") },
              { value: "assistant_2", label: t("assistant_2") },
            ]}
            customDropdown
          />

          {errors.assistant && (
            <p className="text-xs text-red-500 py-1">{errors.assistant}</p>
          )}
        </div>
        <div className="col-span-2">
          <SelectField
            label={t("assessor")}
            name="assessor"
            value={values.assessor}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "assessor_1", label: t("assessor_1") },
              { value: "assessor_2", label: t("assessor_2") },
            ]}
            customDropdown
          />

          {errors.assessor && (
            <p className="text-xs text-red-500 py-1">{errors.assessor}</p>
          )}
        </div>
        <div className="col-span-6">
          <Textarea
            label={t("description")}
            placeholder="description"
            value={values.description}
            onChange={handleChange}
            name="description"
          />
          <ErrorMessage
            name="description"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
        <div className="col-span-3">
          <RadioField
            label={t("schedule")}
            name="scheduleType"
            options={[
              { value: "theoretical", label: t("theoretical") },
              { value: "practical", label: t("practical") },
            ]}
            selectedValue={values.scheduleType}
            onChange={handleChange}
          />
          {errors.scheduleType && (
            <p className="text-xs text-red-500 py-1">{errors.scheduleType}</p>
          )}
        </div>
        <br />
        <div className="col-span-3">
          <Input
            label={t("date")}
            type="date"
            placeholder={t("date")}
            value={values.session_date}
            onChange={handleChange}
            name="session_date"
            iconEnd={true}
            iconSVG={<Calendar />}
          />
          <ErrorMessage
            name="session_date"
            component="div"
            className="text-xs text-red-500"
          />
        </div>
        <div className="col-span-3">
          <Input
            label={t("session_time")}
            type="time"
            placeholder="Select Time Range"
            value={values.session_time}
            onChange={(timeRange) => setFieldValue("session_time", timeRange)}
            name="session_time"
            timeRange={true}
            iconEnd={true}
            iconSVG={<Calendar />}
          />
          <ErrorMessage
            name="session_time"
            component="div"
            className="text-xs text-red-500"
          />
        </div>
      </div>
    </div>
  );
}
