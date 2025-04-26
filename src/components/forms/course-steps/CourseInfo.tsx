import FileUploader from "@/components/formsUI/FileUploader";
import Input from "@/components/formsUI/Input";
import RadioField from "@/components/formsUI/RadioField";
import SelectField from "@/components/formsUI/SelectField";
import Textarea from "@/components/formsUI/Textarea";
import Calendar from "@/components/ui/icons/Calendar";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";

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

export default function CourseInfo({
  values,
  handleChange,
  errors,
  setFieldValue,
}: CourseInfoProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");
  return (
    <div>
      <div className="mt-4 grid w-full grid-cols-4 gap-x-4 gap-y-6">
        <div className="col-span-2">
          <Input
            label="Course Title"
            type="text"
            placeholder="Course Title"
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
        <div className="col-span-2">
          <SelectField
            label={tTable("status")}
            name="status"
            value={values.status}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "DRAFT", label: t("user_status.draft") },
              { value: "PUBLISHED", label: t("user_status.published") },
              { value: "ARCHIVED", label: t("user_status.archived") },
              { value: "IN_REVIEW", label: t("user_status.in_review") },
            ]}
            customDropdown
          />
          <ErrorMessage
            name="status"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
        <div className="col-span-2">
          <SelectField
            label={t("prerequisites.name")}
            name="prerequisites"
            value={values.prerequisites}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "none", label: t("prerequisites.none") },
              {
                value: "assessment_required",
                label: t("prerequisites.assessment_required"),
              },
              {
                value: "department_approval",
                label: t("prerequisites.department_approval"),
              },
              {
                value: "level_requirement",
                label: t("prerequisites.level_requirement"),
              },
            ]}
            customDropdown
          />
          {errors.prerequisites && (
            <p className="text-xs text-red-500 py-1">{errors.prerequisites}</p>
          )}
        </div>
        <div className="col-span-2">
          <Input
            label={t("validity")}
            type="date"
            placeholder="validity"
            value={values.validity}
            onChange={(value) => {
              if (typeof value === 'string') {
                setFieldValue('validity', value);
              } else if (value instanceof Date) {
                setFieldValue('validity', value.toISOString());
              }
            }}
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
        <div className="col-span-2">
          <FileUploader
            onChange={(file) => setFieldValue("courseCover", file || "")}
            label="Course Cover"
            subdirName="course"
            small
            initialImageUrl={values ? `${process.env.NEXT_PUBLIC_URL}/${values.courseCover}` : null}
          />
          {errors.courseCover && (
            <p className="text-xs text-red-500 py-1">{errors.courseCover}</p>
          )}
        </div>
        <div className="col-span-2">
          <SelectField
            label={t("level.name")}
            name="level"
            value={values.level}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "advanced", label: t("level.advanced") },
              {
                value: "basic",
                label: t("level.basic"),
              },
              {
                value: "intermediate",
                label: t("level.intermediate"),
              },
            ]}
            customDropdown
          />
          {errors.level && (
            <p className="text-xs text-red-500 py-1">{errors.level}</p>
          )}
        </div>
        <div className="col-span-2">
          <SelectField
            label={t("language.name")}
            name="language"
            value={values.language}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "en", label: t("language.en") },
              {
                value: "ar",
                label: t("language.ar"),
              },
              {
                value: "fr",
                label: t("language.fr"),
              },
            ]}
            customDropdown
          />
          {errors.language && (
            <p className="text-xs text-red-500 py-1">{errors.language}</p>
          )}
        </div>
        <div className="col-span-2">
          <Input
            label={t("maxAttendees")}
            type="number"
            placeholder="maxAttendees"
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
        <div className="col-span-2">
          <RadioField
            label={t("medicalTestLabel")}
            name="medicalTest"
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
            selectedValue={values.medicalTest}
            onChange={handleChange}
          />
          {errors.medicalTest && (
            <p className="text-xs text-red-500 py-1">{errors.medicalTest}</p>
          )}
        </div>
        <div className="col-span-4">
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
      </div>
    </div>
  );
}
