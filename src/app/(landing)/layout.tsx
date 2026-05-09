import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proctura — Online Coding Exams for Universities",
  description:
    "The end of writing code on paper. Proctura gives Nigerian universities a real online coding exam platform — so students can write, run, and submit actual code.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
