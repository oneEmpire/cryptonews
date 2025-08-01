import type { Metadata } from "next"
import { Shield, Lock, Eye, Users, FileText, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy - HealthNews.Guru Data Protection",
  description:
    "Learn how HealthNews.Guru protects your privacy, handles your personal data, and maintains transparency in our data collection practices.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Privacy <span className="text-red-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal
              information when you use HealthNews.Guru.
            </p>
            <div className="mt-6 text-sm text-gray-500">Last updated: December 30, 2024</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            {/* Quick Overview */}
            <div className="mb-12 p-6 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-red-900 mb-2">Quick Overview</h2>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• We collect minimal personal information necessary to provide our services</li>
                    <li>• We never sell your personal data to third parties</li>
                    <li>• You can request deletion of your data at any time</li>
                    <li>• We use industry-standard security measures to protect your information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              {/* Information We Collect */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <p className="text-gray-600 mb-3">When you interact with our website, we may collect:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                      <li>Name and email address (when you subscribe to our newsletter)</li>
                      <li>Contact information (when you contact us)</li>
                      <li>Account information (if you create an account)</li>
                      <li>Comments and feedback you provide</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                      <li>IP address and location data</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referral sources</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookies and Tracking Technologies</h3>
                    <p className="text-gray-600">
                      We use cookies and similar technologies to enhance your browsing experience, analyze site traffic,
                      and personalize content. You can control cookie settings through your browser preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Uses</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                      <li>Deliver our newsletter and health news content</li>
                      <li>Respond to your inquiries and provide customer support</li>
                      <li>Improve our website and user experience</li>
                      <li>Send important updates about our services</li>
                      <li>Analyze website usage and performance</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketing Communications</h3>
                    <p className="text-gray-600">
                      We may send you promotional emails about new articles, health tips, and updates. You can
                      unsubscribe at any time using the link in our emails or by contacting us directly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Sharing */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Information Sharing</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    <strong>We do not sell, trade, or rent your personal information to third parties.</strong> We may
                    share your information only in the following circumstances:
                  </p>

                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>
                      <strong>Service Providers:</strong> With trusted third-party services that help us operate our
                      website (e.g., email service providers, analytics tools)
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> When required by law, court order, or government request
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets
                    </li>
                    <li>
                      <strong>Protection:</strong> To protect our rights, property, or safety, or that of our users
                    </li>
                  </ul>
                </div>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Data Security</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    We implement appropriate technical and organizational security measures to protect your personal
                    information against unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Measures Include:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                      <li>SSL encryption for data transmission</li>
                      <li>Secure servers and databases</li>
                      <li>Regular security audits and updates</li>
                      <li>Access controls and authentication</li>
                      <li>Employee training on data protection</li>
                    </ul>
                  </div>

                  <p className="text-gray-600">
                    However, no method of transmission over the internet or electronic storage is 100% secure. While we
                    strive to protect your personal information, we cannot guarantee absolute security.
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>

                <div className="space-y-4">
                  <p className="text-gray-600">You have the following rights regarding your personal information:</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Access</h3>
                      <p className="text-gray-600 text-sm">
                        Request a copy of the personal information we hold about you
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                      <p className="text-gray-600 text-sm">
                        Request correction of inaccurate or incomplete information
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                      <p className="text-gray-600 text-sm">Request deletion of your personal information</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Opt-out</h3>
                      <p className="text-gray-600 text-sm">Unsubscribe from marketing communications</p>
                    </div>
                  </div>

                  <p className="text-gray-600">
                    To exercise these rights, please contact us at{" "}
                    <a href="mailto:privacy@healthnews.guru" className="text-red-600 hover:underline">
                      privacy@healthnews.guru
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Third-Party Services */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Services</h2>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Our website may contain links to third-party websites or integrate with third-party services. This
                    privacy policy does not apply to these external sites or services.
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Services We Use:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                      <li>Google Analytics (for website analytics)</li>
                      <li>Email service providers (for newsletters)</li>
                      <li>Social media platforms (for content sharing)</li>
                      <li>Content delivery networks (for website performance)</li>
                    </ul>
                  </div>

                  <p className="text-gray-600">
                    We encourage you to review the privacy policies of any third-party services you interact with
                    through our website.
                  </p>
                </div>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
                <p className="text-gray-600">
                  Our website is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If we become aware that we have collected personal information
                  from a child under 13, we will take steps to delete such information.
                </p>
              </div>

              {/* International Users */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">International Users</h2>
                <p className="text-gray-600">
                  If you are accessing our website from outside the United States, please be aware that your information
                  may be transferred to, stored, and processed in the United States. By using our website, you consent
                  to the transfer of your information to the United States.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the
                  new privacy policy on this page and updating the "Last updated" date. We encourage you to review this
                  privacy policy periodically.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:privacy@healthnews.guru" className="text-red-600 hover:underline">
                      privacy@healthnews.guru
                    </a>
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Health Street, Medical District, NY 10001
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
