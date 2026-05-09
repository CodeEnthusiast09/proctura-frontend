import * as Yup from "yup";

export const createTenantSchema = Yup.object({
  name: Yup.string().trim().required("School name is required"),
  subdomain: Yup.string()
    .trim()
    .lowercase()
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens")
    .required("Subdomain is required"),
  adminEmail: Yup.string()
    .email("Invalid email")
    .required("Admin email is required"),
  adminFirstName: Yup.string().trim().required("First name is required"),
  adminLastName: Yup.string().trim().required("Last name is required"),
});

export const updateTenantSchema = Yup.object({
  name: Yup.string().trim().required("School name is required"),
});
