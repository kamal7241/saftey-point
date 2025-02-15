import { Field, ErrorMessage, FormikProps, FormikValues } from "formik";

interface CertificateProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  handleBlur: FormikProps<FormikValues>["handleBlur"];
}

export default function Certificate({
  values,
  handleChange,
  handleBlur,
}: CertificateProps) {
  console.log("values", values);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Certificate</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Certificate Available?</label>
        <Field
          as="select"
          name="certificate"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Field>
        <ErrorMessage
          name="certificate"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
}
