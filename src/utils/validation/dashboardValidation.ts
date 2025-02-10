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

export const addUserValidationSchema = Yup.object({
  userName: Yup.string().required("User Name is required"),
  jobTitle: Yup.string().required("Job Title is required"),
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

export const addBranchValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  status: Yup.string().required("Status is required"),
  address: Yup.string().required("Address is required"),
  pinLocation: Yup.mixed().required("Pin Location is required"),
});
