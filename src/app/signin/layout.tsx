import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — FamilyRoots | Private Family SaaS Platform",
  description:
    "Sign in to your private multi-generational family network, access your interactive tree visualizer, document vault, and shared memories.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
