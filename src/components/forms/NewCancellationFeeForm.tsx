/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createCancellationFee, updateCancellationFee } from "@/api/cancellationFeesService";
import { CancellationFee } from "@/types/ui.types";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as Yup from "yup";
import Input from "../formsUI/Input";
import SelectField from "../formsUI/SelectField";
import Toggler from "../formsUI/Toggler";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";

interface NewCancellationFeeFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  cancellationFeeData?: CancellationFee | null;
}

interface FormValues {
  name: string;
  description: string;
  type: 'FULL_REFUND' | 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NO_REFUND';
  percentage?: string;
  fixedAmount?: number;
  hoursBeforeStart: number;
  sortOrder: number;
  isActive: boolean;
}

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  type: Yup.string().oneOf(['FULL_REFUND', 'PERCENTAGE', 'FIXED_AMOUNT', 'NO_REFUND']).required("Required"),
  percentage: Yup.string().when('type', {
    is: 'PERCENTAGE',
    then: (schema) => schema.required("Percentage is required for percentage type"),
    otherwise: (schema) => schema.optional(),
  }),
  fixedAmount: Yup.number().when('type', {
    is: 'FIXED_AMOUNT',
    then: (schema) => schema.positive("Must be positive").required("Fixed amount is required for fixed amount type"),
    otherwise: (schema) => schema.optional(),
  }),
  hoursBeforeStart: Yup.number().positive("Must be positive").required("Required"),
  sortOrder: Yup.number().positive("Must be positive").required("Required"),
  isActive: Yup.boolean().required("Required"),
});

export default function NewCancellationFeeForm({
  title: propTitle,
  sub_title,
  onClose,
  cancellationFeeData,
}: NewCancellationFeeFormProps) {
  const t = useTranslations("common");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const formTitle = propTitle || (cancellationFeeData ? "Edit Cancellation Fee" : "Add New Cancellation Fee");

  const initialValues: FormValues = cancellationFeeData
    ? {
        name: cancellationFeeData.name || "",
        description: cancellationFeeData.description || "",
        type: cancellationFeeData.type || "FULL_REFUND",
        percentage: cancellationFeeData.percentage || "",
        fixedAmount: cancellationFeeData.fixedAmount || 0,
        hoursBeforeStart: cancellationFeeData.hoursBeforeStart || 0,
        sortOrder: cancellationFeeData.sortOrder || 1,
        isActive: cancellationFeeData.isActive ?? true,
      }
    : {
        name: "",
        description: "",
        type: "FULL_REFUND",
        percentage: "",
        fixedAmount: 0,
        hoursBeforeStart: 0,
        sortOrder: 1,
        isActive: true,
      };

  const handleSubmit = async (values: FormValues) => {
    const apiData = {
      name: values.name,
      description: values.description,
      type: values.type,
      percentage: values.type === 'PERCENTAGE' ? values.percentage : null,
      fixedAmount: values.type === 'FIXED_AMOUNT' ? values.fixedAmount : null,
      hoursBeforeStart: values.hoursBeforeStart,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    };
    setApiErrors(null);
    try {
      let result;
      if (cancellationFeeData && cancellationFeeData.id) {
        result = await updateCancellationFee(cancellationFeeData.id, apiData);
      } else {
        result = await createCancellationFee(apiData);
      }
      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setApiErrors(
          result.message ||
            `An error occurred while ${cancellationFeeData ? "updating" : "creating"} the cancellation fee.`
        );
      }
    } catch (error: any) {
      setApiErrors(error.message || "An unexpected error occurred.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={cancellationFeeData ? "Successfully Updated" : "Successfully Added"}
          msg={`Cancellation fee has been ${cancellationFeeData ? "updated" : "created"} successfully!`}
          bigger
        />
        <div className="flex justify-center mt-4">
          <Button label={t("buttons.close")} onClick={onClose} variant="primary" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {formTitle && <h3 className="heading3">{formTitle}</h3>}
      {sub_title && <p className="textRegular mt-1.5">{sub_title}</p>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="w-full gap-4 grid grid-cols-2 mt-4">
            {apiErrors && (
              <div className="col-span-2 p-2 bg-red-100 text-red-700 rounded border border-red-300">
                {apiErrors}
              </div>
            )}
            <div className="col-span-2">
              <Input
                label="Fee Name"
                type="text"
                placeholder="Enter fee name"
                value={values.name}
                onChange={handleChange}
                name="name"
              />
              <ErrorMessage name="name">
                {(msg) => <ErrorMessageWrappers msg={msg} />}
              </ErrorMessage>
            </div>
            <div className="col-span-2">
              <Input
                label="Description"
                type="text"
                placeholder="Enter description"
                value={values.description}
                onChange={handleChange}
                name="description"
              />
              <ErrorMessage name="description">
                {(msg) => <ErrorMessageWrappers msg={msg} />}
              </ErrorMessage>
            </div>
            <div className="col-span-1">
              <SelectField
                label="Fee Type"
                name="type"
                value={values.type}
                onChange={handleChange}
                options={[
                  { value: "FULL_REFUND", label: "Full Refund" },
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "FIXED_AMOUNT", label: "Fixed Amount" },
                  { value: "NO_REFUND", label: "No Refund" },
                ]}
              />
              <ErrorMessage name="type">
                {(msg) => <ErrorMessageWrappers msg={msg} />}
              </ErrorMessage>
            </div>
            <div className="col-span-1">
              <Input
                label="Hours Before Start"
                type="number"
                placeholder="Enter hours before start"
                value={values.hoursBeforeStart}
                onChange={handleChange}
                name="hoursBeforeStart"
              />
              <ErrorMessage name="hoursBeforeStart">
                {(msg) => <ErrorMessageWrappers msg={msg} />}
              </ErrorMessage>
            </div>
            {values.type === 'PERCENTAGE' && (
              <div className="col-span-1">
                <Input
                  label="Percentage"
                  type="text"
                  placeholder="Enter percentage (e.g., 25.00)"
                  value={values.percentage || ""}
                  onChange={handleChange}
                  name="percentage"
                />
                <ErrorMessage name="percentage">
                  {(msg) => <ErrorMessageWrappers msg={msg} />}
                </ErrorMessage>
              </div>
            )}
            {values.type === 'FIXED_AMOUNT' && (
              <div className="col-span-1">
                <Input
                  label="Fixed Amount"
                  type="number"
                  placeholder="Enter fixed amount"
                  value={values.fixedAmount || ""}
                  onChange={handleChange}
                  name="fixedAmount"
                />
                <ErrorMessage name="fixedAmount">
                  {(msg) => <ErrorMessageWrappers msg={msg} />}
                </ErrorMessage>
              </div>
            )}
            <div className="col-span-1">
              <Input
                label="Sort Order"
                type="number"
                placeholder="Enter sort order"
                value={values.sortOrder}
                onChange={handleChange}
                name="sortOrder"
              />
              <ErrorMessage name="sortOrder">
                {(msg) => <ErrorMessageWrappers msg={msg} />}
              </ErrorMessage>
            </div>

            <div className="col-span-2">
              <Toggler
                checked={values.isActive}
                onChange={() => setFieldValue("isActive", !values.isActive)}
              />
              <ErrorMessage name="isActive">
                {(msg) => <ErrorMessageWrappers msg={msg} />}
              </ErrorMessage>
            </div>
            <div className="flex justify-end gap-4 col-span-2 mt-4">
              <Button
                label={t("buttons.close")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
                type="button"
              />
              <Button
                label={t("buttons.submit")}
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