import { Field, ErrorMessage, FormikProps, FormikValues } from "formik";

interface PricingProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  handleBlur: FormikProps<FormikValues>["handleBlur"];
}

export default function Pricing({
  values,
  handleChange,
  handleBlur,
}: PricingProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pricing</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Price</label>
        <Field
          type="number"
          name="price"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.price}
        />
        <ErrorMessage
          name="price"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
}
