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

// export const addUserValidationSchema = Yup.object({
export const addUserValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    firstName: Yup.string().required(t("firstName.required")),
    lastName: Yup.string().required(t("lastName.required")),
    type: Yup.string().required(t("userType.required")),
    status: Yup.string().required(t("status.required")),
    email: Yup.string().email(t("invalid_type")).required(t("email.required")),
    phoneNumber: Yup.string().required(t("phoneNumber.required")),
    nationalId: Yup.string().required(t("nationalId.required")),
    identityType: Yup.string().required(t("identityType.required")),
    password: Yup.string()
      .required(t("password.required"))
      .min(8, t("password_min_length"))
      .matches(/[a-zA-Z]/, t("password.letters"))
      .matches(/[0-9]/, t("password.numbers")),
    nationalIdExpiry: Yup.date().required(t("nationalIdExpiry.required"))
      .min(new Date(), t("validity.futureDate")),
    nationality: Yup.string().required(t("nationality.required")),
    birthday: Yup.date().required(t("birthday.required"))
      .max(new Date(), t("validity.pastDate")),
    nationalIdFront: Yup.mixed().required(t("nationalIdFront.required")),
    nationalIdBack: Yup.mixed().when('identityType', {
      is: 'national_id',
      then: (schema) => schema.required(t("nationalIdBack.required")),
      otherwise: (schema) => schema
    }),
  });
};

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
export const editStaffValidationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  status: Yup.string().required("Status is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  avatar: Yup.mixed().required("Avatar is required"),
});


export const editUserValidationSchema = (t: (key: string) => string) => {
  return Yup.object({
    firstName: Yup.string().required(t("firstName.required")),
    lastName: Yup.string().required(t("lastName.required")),
    type: Yup.string().required(t("userType.required")),
    status: Yup.string().required(t("status.required")),
    email: Yup.string().email(t("invalid_type")).required(t("email.required")),
    phoneNumber: Yup.string().required(t("phoneNumber.required")),
    nationalId: Yup.string().required(t("nationalId.required")),
    identityType: Yup.string().required(t("identityType.required")),
    nationalIdExpiry: Yup.date().required(t("nationalIdExpiry.required")),
    nationality: Yup.string().required(t("nationality.required")),
    birthday: Yup.date().required(t("birthday.required")),
    nationalIdFront: Yup.mixed().required(t("nationalIdFront.required")),
    nationalIdBack: Yup.mixed().required(t("nationalIdBack.required")),
  });
};

export const addBranchValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  status: Yup.string().required("Status is required"),
  address: Yup.string().required("Address is required"),
  pinLocation: Yup.mixed().required("Pin Location is required"),
});

export const certificateValidationSchemaGeneral = (t: (key: string) => string) => Yup.object({
  courseId: Yup.string().required(t("course.required")),
  validFrom: Yup.date().required(t("validFrom.required")),
  validTo: Yup.date()
    .required(t("validTo.required"))
    .min(Yup.ref('validFrom'), t("validTo.after_validFrom")),
  issueDate: Yup.date()
    .required(t("issueDate.required"))
    .max(Yup.ref('validTo'), t("issueDate.before_validTo")),
});
