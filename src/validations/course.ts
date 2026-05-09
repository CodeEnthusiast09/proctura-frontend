import * as Yup from "yup";

export const courseSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  code: Yup.string()
    .trim()
    .uppercase()
    .matches(/^[A-Z]{2,4}\d{3}$/, "Use format CSC301")
    .required("Course code is required"),
});
