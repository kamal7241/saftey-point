import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import SelectField from "@/components/formsUI/SelectField";
import Textarea from "@/components/formsUI/Textarea";
import Calendar from "@/components/ui/icons/Calendar";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";

interface SessionProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  setFieldValue: FormikProps<FormikValues>["setFieldValue"];
  errors: FormikValues;
}

type DateRange = [Date | null, Date | null];
type TimeRange = { from: Date | null; to: Date | null };

export default function SessionStep({
  values,
  handleChange,
  errors,
  setFieldValue,
}: SessionProps) {
  const t = useTranslations("common");

  const handleDateChange = (value: string | ChangeEvent<HTMLInputElement> | DateRange | TimeRange) => {
    if (Array.isArray(value) && value.length === 2) {
      const [startDate, endDate] = value;
      if (startDate instanceof Date) {
        setFieldValue('session_date.0', startDate.toISOString().split('T')[0]);
      }
      if (endDate instanceof Date) {
        setFieldValue('session_date.1', endDate.toISOString().split('T')[0]);
      }
    }
  };

  const handleTimeChange = (value: string | ChangeEvent<HTMLInputElement> | DateRange | TimeRange) => {
    if (typeof value === 'object' && 'from' in value && 'to' in value) {
      const { from, to } = value as TimeRange;
      if (from instanceof Date) {
        setFieldValue('session_time.from', from);
      }
      if (to instanceof Date) {
        setFieldValue('session_time.to', to);
      }
    }
  };

  const dateRange: DateRange = [
    values.session_date?.[0] ? new Date(values.session_date[0]) : null,
    values.session_date?.[1] ? new Date(values.session_date[1]) : null
  ];

  return (
    <div>
      <div className="mt-4 grid w-full grid-cols-6 gap-x-4 gap-y-6">
        <div className="col-span-6">
          <Input
            label={t("title")}
            type="text"
            placeholder={t("title")}
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
        <div className="col-span-3">
          <Input
            label={t("date")}
            type="date"
            range={true}
            placeholder={t("date")}
            value={dateRange}
            onChange={handleDateChange}
            name="date"
            iconEnd={true}
            iconSVG={<Calendar />}
          />
          <ErrorMessage
            name="session_date.0"
            component="div"
            className="text-xs text-red-500"
          />
          <ErrorMessage
            name="session_date.1"
            component="div"
            className="text-xs text-red-500"
          />
        </div>
        <div className="col-span-3">
          <Input
            label={t("time")}
            type="time"
            timeRange={true}
            placeholder={t("time")}
            value=""
            onChange={handleTimeChange}
            name="time"
            iconEnd={true}
            iconSVG={<Calendar />}
          />
          <ErrorMessage
            name="session_time.from"
            component="div"
            className="text-xs text-red-500"
          />
          <ErrorMessage
            name="session_time.to"
            component="div"
            className="text-xs text-red-500"
          />
        </div>
      </div>
    </div>
  );
}
