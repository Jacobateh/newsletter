import type { Metadata } from "next";
import { Newsletter } from "@/components/newsletter/Newsletter";

export const metadata: Metadata = {
  title: "Join the Newsletter",
  description:
    "Get a new Hausa–Arabic learning experience delivered to your inbox.",
};

export default function NewsletterPage() {
  return <Newsletter />;
}
