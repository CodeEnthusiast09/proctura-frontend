// src/validations/question.ts
import * as Yup from "yup";

export const questionSchema = Yup.object({
  body: Yup.string().trim().required("Question text is required"),
  points: Yup.number()
    .min(1, "Minimum 1 point")
    .required("Points are required"),
});
