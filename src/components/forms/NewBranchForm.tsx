"use client";
import Input from "@/components/formsUI/Input";
import { addBranchValidationSchema } from "@/utils/validation/dashboardValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
// import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";
import MapComponent from "@/components/ui/MapComponent";
import { LatLngExpression } from "leaflet";

interface NewBranchFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
}

interface FormValues {
  name: string;
  status: string;
  address: string;
  pinLocation: [number, number];
}

export default function NewBranchForm({
  title,
  sub_title,
  onClose,
}: NewBranchFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (values: FormValues) => {
    console.log("Form Submitted:", values);
    setIsSubmitted(true);
  };

  const handleLocationSelect = (
    location: LatLngExpression,
    setFieldValue: (field: string, value: LatLngExpression) => void
  ) => {
    // Set the selected location in the form using setFieldValue
    console.log("location", location);
    setFieldValue("pinLocation", location);
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={"Successfully Added"}
          msg={"Thank you for filling out your information!"}
          bigger
        />
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="heading3">{title}</h3>}
      {sub_title && (
        <p className="textRegular mt-1.5">
          {sub_title.split("(*)").map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < sub_title.split("(*)").length - 1 && (
                <span className="text-red-400">(*)</span>
              )}
            </React.Fragment>
          ))}
        </p>
      )}

      <Formik
        initialValues={{
          name: "",
          status: "",
          address: "",
          pinLocation: [30.033333, 31.233334],
        }}
        validationSchema={addBranchValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, submitForm }) => (
          <Form className="w-full gap-4 grid grid-cols-4 mt-4">
            {/* Name */}
            <div className="col-span-2">
              <Input
                label="Name"
                type="text"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
                name="name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {/* Status */}
            <div className="col-span-2">
              <SelectField
                label={tTable("status")}
                name="status"
                value={values.status}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "active", label: t("company_status.active") },
                  { value: "inactive", label: t("company_status.inactive") },
                  { value: "pending", label: t("company_status.pending") },
                  { value: "suspended", label: t("company_status.suspended") },
                  { value: "expired", label: t("company_status.expired") },
                ]}
                customDropdown
              />
              <ErrorMessage
                name="status"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {/* Address */}
            <div className="col-span-4">
              <Input
                label="Address"
                type="text"
                placeholder="Enter address"
                value={values.address}
                onChange={handleChange}
                name="address"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {/* Pin Location Input */}
            <div className="col-span-4">
              <Input
                label="Pin Location"
                type="text"
                placeholder="Pin location"
                value={values.pinLocation
                  .toString()
                  .replace(/LatLng\(/, "")
                  .replace(/\)/, "")}
                readOnly={true}
                onChange={() => {}}
                name=""
              />
              <ErrorMessage
                name="pinLocation"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {/* Map */}
            <div className="col-span-4">
              <MapComponent
                onLocationSelect={(location) =>
                  handleLocationSelect(location, setFieldValue)
                }
                initialLocation={values.pinLocation}
              />
            </div>

            {/* Submit & Close Buttons */}
            <div className="flex justify-end gap-4 col-span-4">
              <Button
                label={t("buttons.close")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
              />
              <Button
                label={t("buttons.submit")}
                onClick={submitForm}
                type="submit"
                variant="primary"
                padding="py-3 px-4"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
