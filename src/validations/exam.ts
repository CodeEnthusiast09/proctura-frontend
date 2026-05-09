import * as Yup from "yup";

export const LANGUAGES = [
  { id: 71, name: "Python 3" },
  { id: 50, name: "C" },
  { id: 54, name: "C++" },
  { id: 51, name: "C#" },
  { id: 62, name: "Java" },
] as const;

export const examSchema = Yup.object({
  courseId: Yup.string().uuid("Invalid course").required("Course is required"),
  title: Yup.string().trim().required("Title is required"),
  instructions: Yup.string().default(""),
  durationMinutes: Yup.number()
    .min(1, "Minimum 1 minute")
    .required("Duration is required"),
  startsAt: Yup.string().required("Start time is required"),
  endsAt: Yup.string()
    .required("End time is required")
    .test("after-start", "End must be after start", function (value) {
      const { startsAt } = this.parent;
      if (!startsAt || !value) return true;
      return new Date(value) > new Date(startsAt);
    }),
  languageId: Yup.number().required("Language is required"),
  languageName: Yup.string().required(),
});

export const updateExamSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  instructions: Yup.string().default(""),
  durationMinutes: Yup.number()
    .min(1, "Minimum 1 minute")
    .required("Duration is required"),
});
