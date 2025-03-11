import * as Yup from 'yup';

export const addCompanyValidationSchema = Yup.object({
  companyName: Yup.string().required("Company Name is required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password can only contain letters")
    .matches(/[0-9]/, "Password must contain a number"),
});

export const editCompanyValidationSchema = Yup.object({
  companyName: Yup.string().required("Company Name is required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

export const addUserValidationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  type: Yup.string().required("Type is required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  nationalId: Yup.string().required("National ID is required"),
  identityType: Yup.string().required("Identity Type is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password can only contain letters")
    .matches(/[0-9]/, "Password must contain a number"),
  nationalIdExpiry: Yup.date().required("National ID Expiry is required"),
  nationality: Yup.string().required("Nationality is required"),
  birthday: Yup.date().required("Birthday is required"),
  nationalIdFront: Yup.mixed().required("National ID Front is required"),
  nationalIdBack: Yup.mixed().required("National ID Back is required"),
});

export const addStaffValidationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  resume: Yup.mixed().required("Resume is required"),
  avatar: Yup.mixed().required("Avatar is required"),
});


export const editUserValidationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  type: Yup.string().required("Type is required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  nationalId: Yup.string().required("National ID is required"),
  identityType: Yup.string().required("Identity Type is required"),
  nationalIdExpiry: Yup.date().required("National ID Expiry is required"),
  nationality: Yup.string().required("Nationality is required"),
  birthday: Yup.date().required("Birthday is required"),
  nationalIdFront: Yup.mixed().required("National ID Front is required"),
  nationalIdBack: Yup.mixed().required("National ID Back is required"),
});

export const addBranchValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  status: Yup.string().required("Status is required"),
  address: Yup.string().required("Address is required"),
  pinLocation: Yup.mixed().required("Pin Location is required"),
});


export const getCourseInfoValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    courseTitle: Yup.string().required(t("validation.courseTitle.required")),
    status: Yup.string().required(t("validation.status.required")),
    prerequisites: Yup.string().required(t("validation.prerequisites.required")),
    validity: Yup.date()
      .required(t("validation.validity.required"))
      .min(new Date(), t("validation.validity.futureDate")),
    courseCover: Yup.string().required(t("validation.courseCover.required")),
    level: Yup.string().required(t("validation.level.required")),
    language: Yup.string().required(t("validation.language.required")),
    maxAttendees: Yup.number()
      .required(t("validation.maxAttendees.required"))
      .positive(t("validation.maxAttendees.positive"))
      .integer(t("validation.maxAttendees.integer")),
    medicalTest: Yup.string().required(t("validation.medicalTest.required")),
    description: Yup.string().required(t("validation.description.required")),
  });
};

export const getPricingValidationSchema = (t: (key: string) => string) => {
  return Yup.object().shape({
    // Validate first pricing set (required)
    country_0: Yup.string()
      .required(t("validation.country.required")),
    price_0: Yup.number()
      .required(t("validation.price.required"))
      .positive(t("validation.price.positive")),
    discount_0: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(0, t("validation.discount.min"))
      .max(100, t("validation.discount.max")),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...Array(10).reduce((acc: Record<string, Yup.ObjectSchema<any>>, _, index) => {
      if (index === 0) return acc;
      return {
        ...acc,
        [`country_${index}`]: Yup.string()
          .when(`price_${index}`, {
            is: (val: string | number | undefined) => val !== undefined && val !== '',
            then: (schema) => schema.required(t("validation.country.required")),
          }),
        [`price_${index}`]: Yup.number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .when(`country_${index}`, {
            is: (val: string | undefined) => val !== undefined && val !== '',
            then: (schema) => schema
              .required(t("validation.price.required"))
              .positive(t("validation.price.positive")),
          }),
        [`discount_${index}`]: Yup.number()
          .nullable()
          .transform((value) => (isNaN(value) ? null : value))
          .min(0, t("validation.discount.min"))
          .max(100, t("validation.discount.max")),
      };
    }, {}),

    // Radio button selections
    theoreticalOnly: Yup.string()
      .required(t("validation.theoreticalOnly.required"))
      .oneOf(["yes", "no"]),
    
    priceType: Yup.string()
      .required(t("validation.priceType.required"))
      .oneOf(["theoretical", "practical"]),
    
    companyPremises: Yup.string()
      .required(t("validation.companyPremises.required"))
      .oneOf(["yes", "no"]),
  });
};