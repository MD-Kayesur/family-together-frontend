import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — FamilyRoots | Private Family SaaS Platform",
  description:
    "Join FamilyRoots to build your private family sanctuary, map multi-generational family trees, store memories, and protect legal documents.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
