import type { Metadata } from "next"
import { Scale, FileText, Shield, AlertTriangle, Users, Gavel } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Use - HealthNews.Guru Legal Terms",
  description:
    "Read HealthNews.Guru's Terms of Use covering website usage, content guidelines, user responsibilities, and legal agreements.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                <Scale className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Terms of <span className="text-red-600">Use</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Please read these Terms of Use carefully before using HealthNews.Guru. By accessing our website, you agree
              to be bound by these terms.
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
                <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-red-900 mb-2">Important Notice</h2>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• Our content is for informational purposes only and not medical advice</li>
                    <li>• Always consult healthcare professionals for medical decisions</li>
                    <li>• You are responsible for how you use the information provided</li>
                    <li>• We reserve the right to modify these terms at any time</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              {/* Acceptance of Terms */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Acceptance of Terms</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    By accessing and using HealthNews.Guru ("we," "our," or "us"), you accept and agree to be bound by
                    the terms and provision of this agreement. If you do not agree to abide by the above, please do not
                    use this service.
                  </p>

                  <p className="text-gray-600">
                    These Terms of Use apply to all visitors, users, and others who access or use our website and
                    services.
                  </p>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Medical Disclaimer</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">
                      <strong>IMPORTANT:</strong> The information provided on HealthNews.Guru is for educational and
                      informational purposes only and is not intended as medical advice.
                    </p>
                  </div>

                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Our content should not be used to diagnose, treat, cure, or prevent any disease</li>
                    <li>
                      Always seek the advice of your physician or other qualified health provider with any questions
                      about a medical condition
                    </li>
                    <li>
                      Never disregard professional medical advice or delay seeking it because of something you read on
                      our website
                    </li>
                    <li>
                      If you think you may have a medical emergency, call your doctor or emergency services immediately
                    </li>
                  </ul>
                </div>
              </div>

              {/* Use License */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Gavel className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Use License</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Permission is granted to temporarily download one copy of the materials on HealthNews.Guru for
                    personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                    title, and under this license you may not:
                  </p>

                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on our website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>

                  <p className="text-gray-600">
                    This license shall automatically terminate if you violate any of these restrictions and may be
                    terminated by us at any time.
                  </p>
                </div>
              </div>

              {/* User Conduct */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">User Conduct</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">You agree not to use our website to:</p>

                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Violate any applicable local, state, national, or international law</li>
                    <li>
                      Transmit, or procure the sending of, any advertising or promotional material without our prior
                      written consent
                    </li>
                    <li>
                      Impersonate or attempt to impersonate the company, a company employee, another user, or any other
                      person or entity
                    </li>
                    <li>
                      Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website
                    </li>
                    <li>Use the website in any manner that could disable, overburden, damage, or impair the site</li>
                  </ul>
                </div>
              </div>

              {/* Content and Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Content and Intellectual Property</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Content</h3>
                    <p className="text-gray-600">
                      The content on HealthNews.Guru, including but not limited to text, graphics, images, logos, and
                      software, is owned by or licensed to us and is protected by copyright and other intellectual
                      property laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">User-Generated Content</h3>
                    <p className="text-gray-600">
                      If you submit comments, feedback, or other content to our website, you grant us a non-exclusive,
                      royalty-free, perpetual, and worldwide license to use, modify, and distribute such content.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Copyright Infringement</h3>
                    <p className="text-gray-600">
                      If you believe that any content on our website infringes your copyright, please contact us at
                      editorial@healthnews.guru with details of the alleged infringement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy</h2>
                <p className="text-gray-600">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                  website, to understand our practices.
                </p>
              </div>

              {/* Disclaimers */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimers</h2>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    The information on this website is provided on an "as is" basis. To the fullest extent permitted by
                    law, this company:
                  </p>

                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Excludes all representations and warranties relating to this website and its contents</li>
                    <li>Does not warrant that the website will be constantly available, or available at all</li>
                    <li>
                      Makes no representations or warranties regarding the accuracy or completeness of the content
                    </li>
                  </ul>
                </div>
              </div>

              {/* Limitations */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitations of Liability</h2>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    In no event shall HealthNews.Guru or its suppliers be liable for any damages (including, without
                    limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                    use or inability to use the materials on our website.
                  </p>

                  <p className="text-gray-600">
                    This limitation applies even if HealthNews.Guru or an authorized representative has been notified
                    orally or in writing of the possibility of such damage.
                  </p>
                </div>
              </div>

              {/* Modifications */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifications</h2>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    HealthNews.Guru may revise these Terms of Use at any time without notice. By using this website, you
                    are agreeing to be bound by the then current version of these terms of service.
                  </p>

                  <p className="text-gray-600">
                    We will notify users of any material changes to these terms by posting a notice on our website or
                    sending an email to registered users.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
                <p className="text-gray-600">
                  These terms and conditions are governed by and construed in accordance with the laws of the United
                  States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or
                  location.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Use, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:info@healthnews.guru" className="text-red-600 hover:underline">
                      info@healthnews.guru
                    </a>
                  </p>
                  <p>
                    <strong>Legal inquiries:</strong>{" "}
                    <a href="mailto:legal@healthnews.guru" className="text-red-600 hover:underline">
                      legal@healthnews.guru
                    </a>
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
