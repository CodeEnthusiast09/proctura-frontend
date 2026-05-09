import * as Yup from "yup";

export const testCaseSchema = Yup.object({
  input: Yup.string().default(""),
  expectedOutput: Yup.string().required("Expected output is required"),
  isHidden: Yup.boolean().required(),
});
