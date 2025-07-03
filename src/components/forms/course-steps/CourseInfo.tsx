import FileUploader from "@/components/formsUI/FileUploader";
import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import SelectField from "@/components/formsUI/SelectField";
import Textarea from "@/components/formsUI/Textarea";
import Calendar from "@/components/ui/icons/Calendar";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import { useLookups } from "@/hooks/useLookups";
import { ChangeEvent, useEffect } from "react";

interface CourseInfoProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  errors: FormikValues;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
}

type DateRange = [Date | null, Date | null];
type TimeRange = { from: Date | null; to: Date | null };

export default function CourseInfo({
  values,
  handleChange,
  errors,
  setFieldValue,
}: CourseInfoProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");
  const { languages, levels, facilities, loading } = useLookups();

  const languageOptions = languages.map(lang => ({
    value: lang.id.toString(),
    label: lang.name
  }));

  const levelOptions = levels.map(level => ({
    value: level.id.toString(),
    label: level.name
  }));

  const facilityOptions = facilities.map(facility => ({
    value: facility.id.toString(),
    label: facility.title
  }));

  const statusOptions = [
    { value: "DRAFT", label: t("user_status.draft") },
    { value: "PUBLISHED", label: t("user_status.published") },
    { value: "ARCHIVED", label: t("user_status.archived") },
    { value: "IN_REVIEW", label: t("user_status.in_review") },
  ];

  const medicalTestOptions = [
    { value: "yes", label: t("yes") },
    { value: "no", label: t("no") },
  ];

  // Update form values when lookups are loaded
  useEffect(() => {
    if (!loading) {
      // Ensure language value is valid
      if (values.languageId && !languageOptions.find(opt => opt.value === values.languageId.toString())) {
        setFieldValue('languageId', '');
      }
      // Ensure level value is valid
      if (values.levelId && !levelOptions.find(opt => opt.value === values.levelId.toString())) {
        setFieldValue('levelId', '');
      }
      // Ensure facility value is valid
      if (values.facilityId && !facilityOptions.find(opt => opt.value === values.facilityId.toString())) {
        setFieldValue('facilityId', '');
      }
    }
  }, [loading, languageOptions, levelOptions, facilityOptions, values, setFieldValue]);

  const handleDateChange = (value: string | ChangeEvent<HTMLInputElement> | DateRange | TimeRange) => {
    if (typeof value === 'string') {
      setFieldValue('validity', value);
    } else if ('target' in value) {
      setFieldValue('validity', value.target.value);
    } else if (Array.isArray(value)) {
      // Handle DateRange
      const [startDate] = value;
      if (startDate) {
        setFieldValue('validity', startDate.toISOString().split('T')[0]);
      }
    } else if ('from' in value) {
      // Handle TimeRange
      const { from } = value;
      if (from) {
        setFieldValue('validity', from.toISOString().split('T')[0]);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Course Title */}
        <div className="col-span-2">
          <Input
            label={t("courseTitle")}
            type="text"
            placeholder={t("courseTitle")}
            value={values.courseTitle}
            onChange={handleChange}
            name="courseTitle"
          />
          <ErrorMessage
            name="courseTitle"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>

        {/* Status */}
        <div className="col-span-2">
          <SelectField
            label={tTable("status")}
            name="status"
            value={values.status}
            onChange={(name, value) => setFieldValue(name, value)}
            options={statusOptions}
            customDropdown
          />
          <ErrorMessage
            name="status"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>

        {/* Prerequisites */}
        <div className="col-span-2">
          <SelectField
            label={t("prerequisites.name")}
            name="prerequisiteId"
            value={values.prerequisiteId}
            onChange={(name, value) => setFieldValue(name, value)}
            options={levelOptions}
            customDropdown
          />
          {errors.prerequisiteId && (
            <p className="text-xs text-red-500 py-1">{errors.prerequisiteId}</p>
          )}
        </div>

        {/* Validity */}
        <div className="col-span-2">
          <Input
            label={t("validity")}
            type="date"
            placeholder={t("validity")}
            value={values.validity}
            onChange={handleDateChange}
            name="validity"
            iconEnd={true}
            iconSVG={<Calendar />}
          />
          <ErrorMessage
            name="validity"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>

        {/* Course Cover */}
        <div className="col-span-2">
          <FileUploader
            onChange={(file) => setFieldValue("courseCover", file || "")}
            label={t("courseCover")}
            subdirName="course"
            small
            initialImageUrl={values.courseCover ? `${process.env.NEXT_PUBLIC_URL}/${values.courseCover}` : null}
          />
          {errors.courseCover && (
            <p className="text-xs text-red-500 py-1">{errors.courseCover}</p>
          )}
        </div>

        {/* Level */}
        <div className="col-span-2">
          <SelectField
            label={t("level.name")}
            name="levelId"
            value={values.levelId}
            onChange={(name, value) => setFieldValue(name, value)}
            options={levelOptions}
            customDropdown
          />
          {errors.levelId && (
            <p className="text-xs text-red-500 py-1">{errors.levelId}</p>
          )}
        </div>

        {/* Language */}
        <div className="col-span-2">
          <SelectField
            label={t("language.name")}
            name="languageId"
            value={values.languageId}
            onChange={(name, value) => setFieldValue(name, value)}
            options={languageOptions}
            customDropdown
          />
          {errors.languageId && (
            <p className="text-xs text-red-500 py-1">{errors.languageId}</p>
          )}
        </div>

        {/* Facility */}
        <div className="col-span-2">
          <SelectField
            label={t("facility")}
            name="facilityId"
            value={values.facilityId}
            onChange={(name, value) => setFieldValue(name, value)}
            options={facilityOptions}
            customDropdown
          />
          {errors.facility && (
            <p className="text-xs text-red-500 py-1">{errors.facility}</p>
          )}
        </div>

        {/* Max Attendees */}
        <div className="col-span-2">
          <Input
            label={t("maxAttendees")}
            type="number"
            placeholder={t("maxAttendees")}
            value={values.maxAttendees}
            onChange={handleChange}
            name="maxAttendees"
          />
          <ErrorMessage
            name="maxAttendees"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>

        {/* Medical Test */}
        <div className="col-span-4">
          <RadioField
            label={t("medicalTestLabel")}
            name="medicalTest"
            options={medicalTestOptions}
            selectedValue={values.medicalTest}
            onChange={handleChange}
          />
          {errors.medicalTest && (
            <p className="text-xs text-red-500 py-1">{errors.medicalTest}</p>
          )}
        </div>

        {/* Description */}
        <div className="col-span-4">
          <Textarea
            label={t("description")}
            placeholder={t("description")}
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
      </div>
    </div>
  );
}
