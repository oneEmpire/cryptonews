import type { Metadata } from "next"
import { Heart, Globe, Award, Target, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - HealthNews.Guru Mission & Team",
  description:
    "Learn about HealthNews.Guru's mission to provide trusted global health news, medical insights, and our commitment to accurate health journalism.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-red-600">HealthNews.Guru</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're dedicated to bringing you the most accurate, timely, and comprehensive health news from around the
              world. Our mission is to empower individuals with knowledge to make informed health decisions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Medical professionals collaborating"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2024, HealthNews.Guru emerged from a simple yet powerful vision: to make reliable health
                information accessible to everyone, everywhere. In an era of information overload, we recognized the
                critical need for a trusted source that could cut through the noise and deliver what matters most to
                your health.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of experienced journalists, medical professionals, and health experts work tirelessly to bring
                you breaking news, in-depth analysis, and practical insights that can impact your daily life and
                long-term wellbeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by our core principles and commitment to excellence in health journalism
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accuracy First</h3>
              <p className="text-gray-600">
                Every article is fact-checked by medical professionals and verified through multiple reliable sources
                before publication.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Perspective</h3>
              <p className="text-gray-600">
                We cover health developments from around the world, providing a comprehensive view of global health
                trends and innovations.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trust & Transparency</h3>
              <p className="text-gray-600">
                We maintain editorial independence and clearly disclose our sources, methodology, and any potential
                conflicts of interest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Editorial Approach</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our editorial team consists of experienced medical professionals, journalists, and health experts
              committed to delivering accurate, timely health information.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical Expertise</h3>
              <p className="text-gray-600 text-sm">
                Our content is reviewed by board-certified physicians and healthcare professionals with decades of
                experience.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Perspective</h3>
              <p className="text-gray-600 text-sm">
                We cover health developments worldwide, providing comprehensive coverage of international health trends.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fact-Checked Content</h3>
              <p className="text-gray-600 text-sm">
                Every article undergoes rigorous fact-checking and is verified through multiple reliable medical
                sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-red-100">Monthly Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-red-100">Newsletter Subscribers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-red-100">Expert Contributors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-red-100">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-gray-600">Our commitment to excellence has been recognized by industry leaders</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Best Health News Website 2024</h3>
                <p className="text-gray-600 text-sm">Digital Health Media Awards</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Excellence in Medical Journalism</h3>
                <p className="text-gray-600 text-sm">International Health Press Association</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Top 10 Health Information Sites</h3>
                <p className="text-gray-600 text-sm">Healthcare Communication Review</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Public Health Communication Award</h3>
                <p className="text-gray-600 text-sm">Global Health Media Foundation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
