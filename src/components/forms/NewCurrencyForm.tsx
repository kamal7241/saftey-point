"use client";
import { createCurrency, updateCurrency } from "@/api/presetsService";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import * as Yup from 'yup';
import Input from "../formsUI/Input";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import SuccessMessage from "../ui/SuccessMessage";

interface NewCurrencyFormProps {
    title?: string;
    sub_title?: string;
    onClose?: () => void;
    currencyData?: {
        id: number;
        name: string;
        exchangeRate: number;
        symbol: string;
        code: string;
        isActive: boolean;
    } | null;
}

interface FormValues {
    name: string;
    exchangeRate: string;
    symbol: string;
    code: string;
    isActive: string;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    exchangeRate: Yup.number().required('Required').positive('Must be positive'),
    symbol: Yup.string().required('Required'),
    code: Yup.string().required('Required'),
    isActive: Yup.string().required('Required'),
});

export default function NewCurrencyForm({
    title,
    sub_title,
    onClose,
    currencyData,
}: NewCurrencyFormProps) {
    const t = useTranslations("common");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [apiErrors, setApiErrors] = useState<string | null>(null);

    const initialValues: FormValues = currencyData
        ? {
            name: currencyData.name,
            exchangeRate: currencyData.exchangeRate.toString(),
            symbol: currencyData.symbol,
            code: currencyData.code,
            isActive: currencyData.isActive.toString(),
        }
        : {
        name: "",
        exchangeRate: "",
        symbol: "",
        code: "",
        isActive: "true",
    };

    const handleSubmit = async (values: FormValues) => {
        const apiData = {
            name: values.name,
            exchangeRate: parseFloat(values.exchangeRate),
            symbol: values.symbol,
            code: values.code.toUpperCase(),
            isActive: values.isActive === "true",
        };

        try {
            let result;
            if (currencyData) {
                result = await updateCurrency(currencyData.id, apiData);
            } else {
                result = await createCurrency(apiData);
            }
            
            if (result.success) {
                setIsSubmitted(true);
                setApiErrors(null);
            } else {
                setApiErrors(result.message || "An error occurred");
            }
        } catch {
            setApiErrors("An unexpected error occurred");
        }
    };

    if (isSubmitted) {
        return (
            <div className="py-10">
                <SuccessMessage
                    title={"Successfully " + (currencyData ? "Updated" : "Added")}
                    msg={"Currency has been " + (currencyData ? "updated" : "created") + " successfully!"}
                    bigger
                />
            </div>
        );
    }

    return (
        <div>
            {title && <h3 className="heading3">{title}</h3>}
            {sub_title && <p className="textRegular mt-1.5">{sub_title}</p>}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange }) => (
                    <Form className="w-full gap-4 grid grid-cols-2 mt-4">
                        {apiErrors && (
                            <div className="col-span-2">
                                <div className="text-red-500">{apiErrors}</div>
                            </div>
                        )}

                        <div className="col-span-2">
                            <Input
                                label="Currency Name"
                                type="text"
                                placeholder="Enter currency name"
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

                        <div className="col-span-1">
                            <Input
                                label="Exchange Rate"
                                type="number"
                                placeholder="Enter exchange rate"
                                value={values.exchangeRate}
                                onChange={handleChange}
                                name="exchangeRate"
                            />
                            <ErrorMessage
                                name="exchangeRate"
                                component="div"
                                className="text-xs text-red-500"
                            />
                        </div>

                        <div className="col-span-1">
                            <Input
                                label="Symbol"
                                type="text"
                                placeholder="Enter symbol"
                                value={values.symbol}
                                onChange={handleChange}
                                name="symbol"
                            />
                            <ErrorMessage
                                name="symbol"
                                component="div"
                                className="text-xs text-red-500"
                            />
                        </div>

                        <div className="col-span-1">
                            <Input
                                label="Code"
                                type="text"
                                placeholder="Enter currency code"
                                value={values.code}
                                onChange={handleChange}
                                name="code"
                            />
                            <ErrorMessage
                                name="code"
                                component="div"
                                className="text-xs text-red-500"
                            />
                        </div>

                        <div className="col-span-1">
                            <SelectField
                                label="Status"
                                name="isActive"
                                value={values.isActive}
                                onChange={(name, value) => handleChange({ target: { name, value } })}
                                options={[
                                    { value: "true", label: "Active" },
                                    { value: "false", label: "Inactive" },
                                ]}
                            />
                            <ErrorMessage
                                name="isActive"
                                component="div"
                                className="text-xs text-red-500"
                            />
                        </div>

                        <div className="flex justify-end gap-4 col-span-2">
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