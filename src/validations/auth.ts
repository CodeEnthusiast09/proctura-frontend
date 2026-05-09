import * as Yup from "yup";

export const loginSchema = Yup.object({
  identifier: Yup.string()
    .trim()
    .required("Email or matric number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export const acceptInviteSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name is too short")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name is too short")
    .required("Last name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});
