"use client"
import { Mail, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from "react-dom"
import { submitContactForm } from "./actions"

export default function ContactPageClient() {
  const [state, formAction] = useFormState(submitContactForm, null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                <MessageSquare className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get in <span className="text-red-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have a question, story tip, or want to collaborate? We'd love to hear from you. Our team is here to help
              and connect with our community.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">We'll get back to you within 24 hours</p>
              </div>

              <form action={formAction} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    name="subject"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Editorial Question">Editorial Question</option>
                    <option value="Partnership Opportunity">Partnership Opportunity</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Press Inquiry">Press Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>

                {state && (
                  <div
                    className={`text-center p-3 rounded-lg ${
                      state.success
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {state.message}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <div className="space-y-1">
                        <p className="text-gray-600">editorial@healthnews.guru</p>
                        <p className="text-gray-600">support@healthnews.guru</p>
                        <p className="text-gray-600">info@healthnews.guru</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">We respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a href="/about" className="block text-red-600 hover:text-red-700 hover:underline transition-colors">
                    About HealthNews.Guru
                  </a>
                  <a
                    href="/newsletter"
                    className="block text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Subscribe to Newsletter
                  </a>
                  <a
                    href="/privacy"
                    className="block text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a href="/terms" className="block text-red-600 hover:text-red-700 hover:underline transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How can I submit a news tip or story idea?</h3>
              <p className="text-gray-600">
                Send us an email at editorial@healthnews.guru with your story idea, relevant details, and any supporting
                information.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you accept guest articles or expert contributions?
              </h3>
              <p className="text-gray-600">
                Yes! We welcome contributions from healthcare professionals and experts. Please contact us with your
                credentials and article proposal.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How can I advertise or partner with HealthNews.Guru?</h3>
              <p className="text-gray-600">
                For advertising and partnership opportunities, please email us with "Partnership" in the subject line,
                and we'll connect you with our business development team.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How do I report a technical issue with the website?</h3>
              <p className="text-gray-600">
                Please email support@healthnews.guru with details about the issue you're experiencing, including your
                browser and device information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
