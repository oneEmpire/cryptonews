import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with HealthNews.Guru",
  description:
    "Contact HealthNews.Guru for editorial inquiries, partnerships, feedback, or general questions about global health news and medical insights.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
