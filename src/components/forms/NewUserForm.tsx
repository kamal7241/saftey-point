"use client";
import Input from "@/components/formsUI/Input";
import {
  addUserValidationSchema,
  editUserValidationSchema,
} from "@/utils/validation/dashboardValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react"; // Added useEffect
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";
import RadioField from "../formsUI/RadioField";
import { submitIndividual, updateIndividual } from "@/api/usersService";
import { Individual, IndividualResponse } from "@/types/ui.types";
import { generateStrongPassword } from "@/utils/passwordGenerator";
import Calendar from "../ui/icons/Calendar";
import { fetchCompanies } from "@/api/companiesService"; // Added import
import { Company } from "@/types/ui.types"; // Assuming Company type exists or define it

interface NewUserFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  userData?: IndividualResponse | null;
}
interface FormValues {
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  type: string;
  phoneNumber: string;
  password: string;
  nationalId: string;
  nationalIdExpiry: string;
  identityType: string;
  jobTitle: string;
  nationality: string;
  birthday: string;
  avatar: string;
  nationalIdFront: string;
  nationalIdBack: string;
  companyId?: string;
}

export default function NewUserForm({
  title,
  sub_title,
  onClose,
  userData,
}: NewUserFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");
  const tValidation = useTranslations("validation");

  const [companyOptions, setCompanyOptions] = useState<{ value: string; label: string }[]>([]); // Added state for company options

  const initialValues: FormValues = userData
    ? {
      firstName: userData.firstName,
      lastName: userData.lastName || "",
      jobTitle: "", // jobTitle is not in the new response
      type: userData.userType.toLowerCase(),
      status: userData.isVerified ? "active" : "inactive",
      email: userData.email,
      phoneNumber: userData.phone || "",
      nationalId: userData.nationalId,
      identityType: userData.identityType.toLowerCase() || "national_id",
      password: "",
      avatar: userData.avatar || "avatar.png",
      nationalIdExpiry: userData.nationalIdExpiry,
      nationality: userData.countryId || "",
      birthday: userData.birthday || "",
      nationalIdFront: userData.nationalIdFront || "",
      nationalIdBack: userData.nationalIdBack || "",
      companyId: userData.companyId || "", // Added companyId to initialValues if editing
    }
    : {
      firstName: "",
      lastName: "",
      jobTitle: "",
      type: "individual",
      status: "",
      email: "",
      phoneNumber: "",
      nationalId: "",
      identityType: "national_id",
      password: "",
      avatar: "",
      nationalIdExpiry: "",
      nationality: "",
      birthday: "",
      nationalIdFront: "",
      nationalIdBack: "",
      companyId: "", // Added companyId to initialValues for new user
    };

  const handleGeneratePassword = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    const randomPassword = generateStrongPassword();
    setFieldValue("password", randomPassword);
  };
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
        try {
          const companyData = await fetchCompanies(0, 100);
          if (companyData && companyData.companies) {
            const options = companyData.companies.map((company: Company) => ({
              value: company.id.toString(),
              label: company.name,
            }));
            setCompanyOptions(options);
          }
        } catch (error) {
          console.error("Failed to fetch companies:", error);
          setCompanyOptions([]); // Set to empty array on error
        }
    };
    loadCompanies();
  }, []);

  const handleSubmit = async (values: FormValues) => {
    console.log("Form Submitted:", values);

    const mappedValues: Individual = {
      identityType: values.identityType,
      nationalId: values.nationalId,
      nationalIdExpiry: values?.nationalIdExpiry
        ? new Date(values.nationalIdExpiry).toISOString().slice(0, 10)
        : "",
      nationalIdFront: values.nationalIdFront,
      nationalIdBack: values.nationalIdBack,
      nationality: values.nationality,
      birthday: values?.birthday
        ? new Date(values.birthday).toISOString().slice(0, 10)
        : "",
      status: values.status || "pending",
      userType: values.type || "individual",
      companyId: values.type === "company" ? Number(values.companyId) : undefined,
      user: {
        id: userData?.userId || 0,
        firstName: values.firstName,
        lastName: values.lastName || "",
        avatar: values.avatar || "avatar.png",
        email: values.email,
        phone: values.phoneNumber,
        password: values.password,
        isVerified: values.status === "active",
        companyId: values.type === "company" ? Number(values.companyId) : undefined
      },
    };

    // Create currentData from userData
    const currentData: Individual = {
      identityType: userData?.identityType || "",
      nationalId: userData?.nationalId || "",
      nationalIdExpiry: userData?.nationalIdExpiry ? userData.nationalIdExpiry.split("T")[0] : "",
      nationalIdFront: userData?.nationalIdFront || "",
      nationalIdBack: userData?.nationalIdBack || "",
      nationality: userData?.countryId || "",
      birthday: userData?.birthday ? userData.birthday.split("T")[0] : "",
      status: userData?.status || "",
      userType: userData?.userType || "individual",
      companyId: Number(userData?.companyId),
      user: {
        id: userData?.userId || 0,
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        avatar: userData?.avatar || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        isVerified: userData?.isVerified || false,
        companyId: Number(userData?.companyId),
      },
    };

    let result;
    if (userData && userData.id) {
      result = await updateIndividual(userData.id, mappedValues, currentData);
    } else {
      result = await submitIndividual(mappedValues);
    }

    if (result?.success) {
      setIsSubmitted(true);
      setApiErrors(null);
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } else {
      setIsSubmitted(false);
      setApiErrors(result?.error || "An error occurred");
    }
  };


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

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={
          userData && userData.id
            ? editUserValidationSchema(tValidation)
            : addUserValidationSchema(tValidation)
        }
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="mt-4 grid w-full grid-cols-4 gap-4">
            {apiErrors && (
              <div className="col-span-4">
                <div className="text-red-500">{apiErrors}</div>
              </div>
            )}
            <div className="col-span-4">
              <FileUploader
                onChange={(file) => setFieldValue("avatar", file)}
                label={t("logo_user")}
                note={t("fileuploader_note")}
                subdirName="user"
                initialImageUrl={
                  userData
                    ? `${process.env.NEXT_PUBLIC_URL}/${initialValues.avatar}`
                    : null
                }
              />
            </div>
            <div className="col-span-2">
              <Input
                label={tValidation('firstName.name')}
                type="text"
                placeholder={tValidation('firstName.name')}
                value={values.firstName}
                onChange={handleChange}
                name="firstName"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="col-span-2">
              <Input
                label={tValidation('lastName.name')}
                type="text"
                placeholder={tValidation('lastName.name')}
                value={values.lastName}
                onChange={handleChange}
                name="lastName"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* type */}
            <div className="col-span-2">
              <SelectField
                label={tValidation('userType.name')}
                name="type"
                value={values.type}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "individual", label: t("user_type.individual") },
                  { value: "company", label: t("user_type.company") },
                ]}
                customDropdown
              />
              <ErrorMessage
                name="type"
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
                  { value: "active", label: t("user_status.active") },
                  { value: "inactive", label: t("user_status.inactive") },
                  { value: "pending", label: t("user_status.pending") },
                  { value: "suspended", label: t("user_status.suspended") },
                  { value: "expired", label: t("user_status.expired") },
                ]}
                customDropdown
              />
              <ErrorMessage
                name="status"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Company Name */}
            {values.type === "company" && (
              <div className="col-span-4">
                <SelectField
                  label={tTable("company_name")}
                  name="companyId"
                  value={values.companyId?.toString()??""}
                  onChange={(name, value) => setFieldValue(name, value)}
                  options={companyOptions} // Use fetched company options
                  customDropdown
                />
                <ErrorMessage
                  name="companyId"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
            )}
            {/* Identity Type */}
            {values.type === "individual" && (
              <div className="col-span-4">
                <RadioField
                  label={tValidation('identityType.name')}
                  name="identityType"
                  options={[
                    { value: "national_id", label: tValidation('nationalId.name') },
                    { value: "passport", label: tValidation('passport.name') },
                  ]}
                  selectedValue={values.identityType ?? "national_id"}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="identityType"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
            )}
            {/* National ID */}
            <div className="col-span-4">
              <Input
                label={tValidation('nationalId.name')}
                type="text"
                placeholder={tValidation('nationalId.placeholder')}
                value={values.nationalId}
                onChange={handleChange}
                name="nationalId"
              />
              <ErrorMessage
                name="nationalId"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* National ID Front */}
            <div className="col-span-2">
              <FileUploader
                onChange={(file) => setFieldValue("nationalIdFront", file)}
                label={tValidation('nationalIdFront.name')}
                subdirName="user"
                small
                initialImageUrl={
                  userData
                    ? `${process.env.NEXT_PUBLIC_URL}/${initialValues.nationalIdFront}`
                    : null
                }
              />
              <ErrorMessage
                name="nationalIdFront"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {values.identityType === "national_id" && (
              <div className="col-span-2">
                <FileUploader
                  onChange={(file) => setFieldValue("nationalIdBack", file)}
                  label={tValidation('nationalIdBack.name')}
                  subdirName="user"
                  small
                  initialImageUrl={
                    userData
                      ? `${process.env.NEXT_PUBLIC_URL}/${initialValues.nationalIdBack}`
                      : null
                  }
                />
                <ErrorMessage
                  name="nationalIdBack"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
            )}
            {/* Nationality */}
            <div className="col-span-2">
              <Input
                label={tValidation('nationality.name')}
                type="text"
                placeholder={tValidation('nationality.placeholder')}
                value={values.nationality}
                onChange={handleChange}
                name="nationality"
              />
              <ErrorMessage
                name="nationality"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="col-span-2">
              <Input
                label={tValidation('nationalIdExpiry.name')}
                type="date"
                placeholder={tValidation('nationalIdExpiry.placeholder')}
                value={values.nationalIdExpiry}
                onChange={(value) => {
                  if (typeof value === "string") {
                    setFieldValue("nationalIdExpiry", value);
                  } else if (value instanceof Date) {
                    setFieldValue("nationalIdExpiry", value.toISOString());
                  }
                }}
                name="nationalIdExpiry"
                iconEnd={true}
                iconSVG={<Calendar />}
              />
              <ErrorMessage
                name="nationalIdExpiry"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-4">
              <Input
                label={tValidation('birthday.name')}
                type="date"
                placeholder={tValidation('birthday.placeholder')}
                value={values.birthday}
                onChange={(value) => {
                  if (typeof value === "string") {
                    setFieldValue("birthday", value);
                  } else if (value instanceof Date) {
                    setFieldValue("birthday", value.toISOString());
                  }
                }}
                name="birthday"
                iconEnd={true}
                iconSVG={<Calendar />}
              />
              <ErrorMessage
                name="birthday"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="col-span-4">
              <Input
                label={tValidation('jobTitle.name')}
                type="text"
                placeholder={tValidation('jobTitle.name')}
                value={values.jobTitle}
                onChange={handleChange}
                name="jobTitle"
                required={false}
              />
              <ErrorMessage
                name="jobTitle"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Email */}
            <div className="col-span-2">
              <Input
                label={tValidation('email.name')}
                type="email"
                placeholder={tValidation('email.placeholder')}
                value={values.email}
                onChange={handleChange}
                name="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Phone Number */}
            <div className="col-span-2">
              <Input
                label={tValidation('phoneNumber.name')}
                type="text"
                placeholder={tValidation('phoneNumber.placeholder')}
                value={values.phoneNumber}
                onChange={handleChange}
                name="phoneNumber"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {!userData && (
              <>
                <div className="col-span-3">
                  <Input
                    label={tValidation('password.name')}
                    type="password"
                    placeholder={tValidation('password.placeholder')}
                    value={values.password}
                    onChange={handleChange}
                    name="password"
                  />
                </div>
                <div className="col-span-1 self-end">
                  <Button
                    label={t("buttons.generate")}
                    onClick={() => handleGeneratePassword(setFieldValue)}
                    type="button"
                    variant="dark"
                    padding="px-4 py-2.5"
                    textSize="text-base w-full"
                  />
                </div>
                <div className="col-span-4">
                  <ErrorMessage name="password">
                    {(msg) => <ErrorMessageWrappers msg={msg} />}
                  </ErrorMessage>
                </div>
              </>
            )}
            <div className="col-span-4 flex justify-end gap-4">
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
