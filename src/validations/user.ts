// src/validations/user.ts
import * as Yup from "yup";

export const inviteLecturerSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
});

export const inviteStudentSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  matricNumber: Yup.string().trim().required("Matric number is required"),
});
