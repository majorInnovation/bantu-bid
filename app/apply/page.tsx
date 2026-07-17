'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Mail, FileText, CheckCircle2, ArrowRight, Building2, Users } from 'lucide-react'

const APPLICATION_EMAIL = 'apply@bantubid.zm'

const steps = [
  {
    step: 1,
    title: 'Prepare your company documents',
    description:
      'Gather your certificate of incorporation, tax clearance certificate, and any relevant industry certifications (safety, quality, or trade).',
  },
  {
    step: 2,
    title: 'Write your application email',
    description:
      'Compose an email to our onboarding team including your company details, sector, and the role you want (SME Supplier or Mining Company).',
  },
  {
    step: 3,
    title: 'Send it to our onboarding team',
    description: `Send your application to ${APPLICATION_EMAIL}. Our team reviews new applications within 2 business days.`,
  },
  {
    step: 4,
    title: 'Receive your login credentials',
    description:
      'Once approved, you will receive a verification email with secure login credentials to access your Bantu Bid dashboard.',
  },
]

const requiredInfo = [
  'Registered company name and registration number',
  'Primary contact name, email, and phone number',
  'Business sector and core capabilities',
  'Physical address and province of operation',
  'Requested role: SME Supplier or Mining Company',
  'Local content percentage (for S.I. No. 68 compliance)',
]

export default function ApplyPage() {
  const subject = encodeURIComponent('Bantu Bid Platform Application')
  const body = encodeURIComponent(
    `Hello Bantu Bid Team,\n\nI would like to apply to join the Bantu Bid platform.\n\nCompany name:\nRegistration number:\nContact name:\nContact email:\nContact phone:\nBusiness sector:\nCore capabilities:\nPhysical address / province:\nRequested role (SME Supplier or Mining Company):\nEstimated local content percentage:\n\nThank you,`,
  )
  const mailtoHref = `mailto:${APPLICATION_EMAIL}?subject=${subject}&body=${body}`

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-12 md:pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg mb-6">
            <Mail size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Application by invitation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight font-geist text-balance">
            Apply to Join Bantu Bid
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Bantu Bid is a vetted enterprise procurement platform. To maintain trust and compliance, new members apply
            by email and are reviewed by our onboarding team before gaining access.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Mail size={18} />
              Email your application
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Already a member? Log in
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3 font-geist">How to Apply</h2>
            <p className="text-gray-600 text-base md:text-lg">
              Follow these four steps to submit your application for review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="flex gap-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-gray-200"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1 font-geist">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to include */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6">
                <FileText size={22} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 font-geist">
                Include in your email
              </h3>
              <ul className="space-y-3 text-gray-700">
                {requiredInfo.map((info) => (
                  <li key={info} className="flex gap-3">
                    <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-primary text-white rounded-2xl p-8">
                <h3 className="text-lg md:text-xl font-bold mb-2 font-geist">Send applications to</h3>
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 text-secondary text-lg md:text-xl font-semibold break-all hover:underline"
                >
                  <Mail size={20} className="flex-shrink-0" />
                  {APPLICATION_EMAIL}
                </a>
                <p className="mt-4 text-sm text-gray-200 leading-relaxed">
                  Applications are reviewed within 2 business days. You will receive login credentials by email once
                  approved.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-1 font-geist">SME Suppliers</h4>
                  <p className="text-gray-600 text-sm">Access tenders and form consortia with other suppliers.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <Users size={20} className="text-accent" />
                  </div>
                  <h4 className="font-semibold text-primary mb-1 font-geist">Mining Companies</h4>
                  <p className="text-gray-600 text-sm">Post tenders and manage a verified supplier network.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
