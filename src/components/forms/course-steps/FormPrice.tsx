"use client";
import { submitCorporatePricing } from "@/api/courseService";
import { fetchBranches, fetchCountries } from "@/api/dashboardService";
import Input from "@/components/formsUI/Input";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import SelectField from "../../formsUI/SelectField";
import Button from "../../ui/Button";
import SuccessMessage from "../../ui/SuccessMessage";

interface FormPriceProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  courseId: number;
}
interface FormValues {
  city: string;
  branch: string;
  trainees: number | null;
  type: string;
  fees: number | null;
}

export default function FormPrice({
  title,
  sub_title,
  onClose,
  courseId,
}: FormPriceProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const tTable = useTranslations("tables");
  const tValidation = useTranslations("validation");
  const [countries, setCountries] = useState([]);
  const [branches, setBranches] = useState([]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationSchema = Yup.object({
    city: Yup.string().required(tValidation("required")),
    // branch: Yup.string().required(tValidation("required")),
    trainees: Yup.number()
      .nullable()
      .required(tValidation("required"))
      .min(1, tValidation("min_number", { min: 1 })),
    type: Yup.string()
      .required(tValidation("required"))
      .oneOf(["BOTH", "THEORETICAL", "PRACTICAL"], tValidation("invalid_type")),
    fees: Yup.number()
      .nullable()
      .required(tValidation("required"))
      .min(0, tValidation("min_number", { min: 0 })),
  });
  const handleSubmit = async (values: FormValues) => {
    try {
      const pricingData = {
        type: values.type,
        isCompanyTraining: false,
        city: values.city,
        trainees: Number(values.trainees),
        fees: Number(values.fees),
        currency: "USD"
      };
      if (!courseId) {
        toast.error(tMsgs("missing_courseId"));
        return;
      }
    
      const response = await submitCorporatePricing(courseId, pricingData);
      
      if (response.success) {
        setIsSubmitted(true);
      } else {
        // Handle error case
        console.error("Failed to submit pricing:", response.error);
      }
    } catch (error) {
      console.error("Error submitting pricing:", error);
    }
  };

  useEffect(() => {
    const getCountries = async () => {
      const response = await fetchCountries();
      if (response.success) {
        setCountries(response.countries);
      }
    };
    const getBranches = async () => {
      const response = await fetchBranches();
      if (response.success) {
        setBranches(response.branches);
      }
    };
    getBranches();
    getCountries();
  }, []);

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={"Successfully Added"}
          msg={"Thank you for filling out your information! ."}
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
          city: "",
          branch: "",
          trainees: null,
          type: "",
          fees: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, submitForm }) => (
          <Form className="w-full gap-4 grid grid-cols-4 mt-4">
            <div className="col-span-2">
              <SelectField
                label={tTable("city")}
                name="city"
                value={values.city}
                onChange={(name, value) => setFieldValue(name, value)}
                options={countries.map((country) => ({
                  value: (country as { code: string }).code,
                  label: (country as { name: string }).name,
                }))}
                customDropdown
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label={tTable("branch")}
                name="branch"
                value={values.branch}
                onChange={(name, value) => setFieldValue(name, value)}
                options={branches.map((branch) => ({
                  value: (branch as { id: number }).id.toString(),
                  label: (branch as { name: string }).name,
                }))}
                customDropdown
              />
              <ErrorMessage
                name="branch"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <Input
                label={t("trainees")}
                type="number"
                placeholder={t("trainees")}
                value={values.trainees??""}
                onChange={handleChange}
                name="trainees"
              />
              <ErrorMessage
                name="trainees"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <SelectField
                label={tTable("type")}
                name="type"
                value={values.type}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "BOTH", label: t("both") },
                  { value: "THEORETICAL", label: t("theoretical") },
                  { value: "PRACTICAL", label: t("practical") },
                ]}
                customDropdown
              />
              <ErrorMessage
                name="type"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-4">
              <Input
                label={t("fees")}
                type="number"
                placeholder={t("fees")}
                value={values.fees??""}
                onChange={handleChange}
                name="fees"
              />
              <ErrorMessage
                name="fees"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="flex justify-end gap-4 col-span-4">
              <Button
                label={t("buttons.cancel")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
              />
              <Button
                label={t("buttons.add")}
                onClick={submitForm}
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
