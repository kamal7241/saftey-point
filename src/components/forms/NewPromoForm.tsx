/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { addPromoCode, updatePromoCode } from "@/api/presetsService";
import Input from "@/components/formsUI/Input";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import SuccessMessage from "../ui/SuccessMessage";

interface NewPromoFormProps {
    title?: string;
    sub_title?: string;
    onClose?: () => void;
    promoData?: any | null;
}

interface FormValues {
    code: string;
    description: string;
    discountType: string;
    discountAmount: number;
    expiryDate: string;
    isActive: boolean;
    maxUsage: number;
    minimumOrderAmount: number;
    maximumDiscountAmount: number;
}

const discountTypeOptions = [
    { value: "PERCENTAGE", label: "Percentage" },
    { value: "FIXED", label: "Fixed Amount" },
];

export default function NewPromoForm({
    title,
    sub_title,
    onClose,
    promoData
}: NewPromoFormProps) {
    const t = useTranslations("common");

    const initialValues: FormValues = promoData
        ? {
            code: promoData.code || "",
            description: promoData.description || "",
            discountType: promoData.discountType || "PERCENTAGE",
            discountAmount: promoData.discountAmount || 0,
            expiryDate: promoData.expiryDate ? promoData.expiryDate.slice(0, 10) : "",
            isActive: typeof promoData.isActive === "boolean" ? promoData.isActive : true,
            maxUsage: promoData.maxUsage || 1,
            minimumOrderAmount: promoData.minimumOrderAmount || 0,
            maximumDiscountAmount: promoData.maximumDiscountAmount || 0,
        }
        : {
            code: "",
            description: "",
            discountType: "PERCENTAGE",
            discountAmount: 0,
            expiryDate: "",
            isActive: true,
            maxUsage: 1,
            minimumOrderAmount: 0,
            maximumDiscountAmount: 0,
        };

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [apiErrors, setApiErrors] = useState<string | null>(null);

    const handleSubmit = async (values: FormValues) => {
        try {
            let result;
            if (promoData && promoData.code) {
                // PATCH update
                result = await updatePromoCode(promoData.id, {
                    code: values.code,
                    description: values.description,
                    discountType: values.discountType,
                    discountAmount: Number(values.discountAmount),
                    expiryDate: values.expiryDate,
                    isActive: values.isActive,
                    maxUsage: Number(values.maxUsage),
                    minimumOrderAmount: Number(values.minimumOrderAmount),
                    maximumDiscountAmount: Number(values.maximumDiscountAmount),
                });
            } else {
                result = await addPromoCode({
                    code: values.code,
                    description: values.description,
                    discountType: values.discountType,
                    discountAmount: Number(values.discountAmount),
                    expiryDate: values.expiryDate,
                    isActive: values.isActive,
                    maxUsage: Number(values.maxUsage),
                    minimumOrderAmount: Number(values.minimumOrderAmount),
                    maximumDiscountAmount: Number(values.maximumDiscountAmount),
                });
            }
            if (result.success) {
                setIsSubmitted(true);
                setApiErrors(null);
            } else {
                setApiErrors(result.message || "An error occurred");
            }
        } catch (error: any) {
            setApiErrors(error.message || "An unexpected error occurred");
        }
    };

    if (isSubmitted) {
        return (
            <div className="py-10">
                <SuccessMessage
                    title={promoData ? "Successfully Updated" : "Successfully Added"}
                    msg={promoData ? "Promo code updated successfully!" : "Promo code created successfully!"}
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
                initialValues={initialValues}
                // You can add validationSchema here if you want
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, setFieldValue }) => (
                    <Form className="w-full gap-4 grid grid-cols-4 mt-4">
                        {apiErrors && (
                            <div className="col-span-4">
                                <div className="text-red-500">{apiErrors}</div>
                            </div>
                        )}
                        {/* Code */}
                        <div className="col-span-2">
                            <Input
                                label="Code"
                                type="text"
                                placeholder="Promo code"
                                value={values.code}
                                onChange={handleChange}
                                name="code"
                            />
                            <ErrorMessage name="code" component="div" className="text-xs text-red-500" />
                        </div>
                        {/* Description */}
                        <div className="col-span-2">
                            <Input
                                label="Description"
                                type="text"
                                placeholder="Description"
                                value={values.description}
                                onChange={handleChange}
                                name="description"
                            />
                            <ErrorMessage name="description" component="div" className="text-xs text-red-500" />
                        </div>
                        {/* Discount Type */}
                        <div className="col-span-2">
                            <SelectField
                                label="Discount Type"
                                name="discountType"
                                value={values.discountType}
                                onChange={(name, value) => setFieldValue(name, value)}
                                options={discountTypeOptions}
                                customDropdown
                            />
                            <ErrorMessage name="discountType" component="div" className="text-xs text-red-500" />
                        </div>
                        {/* Discount Amount */}
                        <div className="col-span-2">
                            <Input
                                label="Discount Amount"
                                type="number"
                                placeholder="Discount amount"
                                value={values.discountAmount}
                                onChange={handleChange}
                                name="discountAmount"
                                min={0}
                            />
                            <ErrorMessage name="discountAmount" component="div" className="text-xs text-red-500" />
                        </div>
                        {/* Expiry Date */}
                        <div className="col-span-2">
                            <Input
                                label="Expiry Date"
                                type="date"
                                placeholder="Expiry date"
                                value={values.expiryDate}
                                onChange={(value) => {
                                  if (typeof value === 'string') {
                                    setFieldValue('expiryDate', value);
                                  } else if (value instanceof Date) {
                                    setFieldValue('expiryDate', value.toISOString());
                                  }
                                }}
                                name="expiryDate"
                            />
                            <ErrorMessage name="expiryDate" component="div" className="text-xs text-red-500" />
                        </div>
                        {/* Is Active */}
                        <div className="col-span-2 flex items-center gap-2">
                            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">Active</label>
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                checked={values.isActive}
                                onChange={() => setFieldValue("isActive", !values.isActive)}
                                className="ml-2"
                            />
                        </div>
                        {/* Max Usage */}
                        <div className="col-span-2">
                            <Input
                                label="Max Usage"
                                type="number"
                                placeholder="Max usage"
                                value={values.maxUsage}
                                onChange={handleChange}
                                name="maxUsage"
                                min={1}
                            />
                            <ErrorMessage name="maxUsage" component="div" className="text-xs text-red-500" />
                        </div>
                        {/* Minimum Order Amount */}
                        <div className="col-span-2">
                            <Input
                                label="Minimum Order Amount"
                                type="number"
                                placeholder="Minimum order amount"
                                value={values.minimumOrderAmount}
                                onChange={handleChange}
                                name="minimumOrderAmount"
                                min={0}
                            />
                            <ErrorMessage name="minimumOrderAmount" component="div" className="text-xs text-red-500" />
                        </div>
                        {/* Maximum Discount Amount */}
                        <div className="col-span-2">
                            <Input
                                label="Maximum Discount Amount"
                                type="number"
                                placeholder="Maximum discount amount"
                                value={values.maximumDiscountAmount}
                                onChange={handleChange}
                                name="maximumDiscountAmount"
                                min={0}
                            />
                            <ErrorMessage name="maximumDiscountAmount" component="div" className="text-xs text-red-500" />
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