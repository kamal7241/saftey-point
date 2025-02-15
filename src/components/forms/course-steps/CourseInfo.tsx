import { Field, ErrorMessage, FormikProps, FormikValues } from "formik";

interface CourseInfoProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  handleBlur: FormikProps<FormikValues>["handleBlur"];
  errors: FormikValues;
}

export default function CourseInfo({
  values,
  handleChange,
  handleBlur,
  errors,
}: CourseInfoProps) {
  console.log("errors", errors);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Course Info</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Course Name</label>
        <Field
          type="text"
          name="courseName"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.courseName}
        />
        <ErrorMessage
          name="courseName"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <Field
          as="textarea"
          name="description"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.description}
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
}
