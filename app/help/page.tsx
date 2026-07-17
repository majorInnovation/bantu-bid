'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { PageHeader, SectionHeader } from '@/components/ui/enterprise'
import { ChevronDown, Search as SearchIcon, Mail, Phone, MessageSquare, BookOpen } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      question: 'How do I register on Bantu Bid?',
      answer: 'Click "Register" on the homepage and choose your role (Supplier or Mining Company). Complete your profile with company information and create your account. You&apos;ll have immediate access to the dashboard.',
    },
    {
      question: 'What is a consortium and why do I need one?',
      answer: 'A consortium is a group of suppliers who combine their capabilities to bid on larger tenders. It helps suppliers meet complex requirements, increase local content, and win higher-value contracts together.',
    },
    {
      question: 'How is S.I. No. 68 compliance calculated?',
      answer: 'Compliance is calculated by averaging the local content percentage of all consortium members. Your group must meet the minimum local content threshold specified in each tender (typically 70-85%).',
    },
    {
      question: 'Can I save tenders to review later?',
      answer: 'Yes! Use the "Save tender" button on any tender detail page. Access all your saved tenders from "Saved Tenders" in the sidebar for quick reference.',
    },
    {
      question: 'How do I submit a bid?',
      answer: 'Navigate to a tender you&apos;re interested in, review the requirements, and click "Submit Bid" if your consortium meets the criteria. Complete the bid form with all required information and submit before the deadline.',
    },
    {
      question: 'What documents do I need to provide?',
      answer: 'Most tenders require: Company registration certificate, ISO certifications, proof of local content, and financial statements. Check each tender&apos;s requirements for the specific documents needed.',
    },
    {
      question: 'How do I track my compliance status?',
      answer: 'Visit the Compliance Dashboard to see your local content status, certification expiration dates, and recommendations for improvement. All your consortia compliance is displayed clearly.',
    },
    {
      question: 'Can I edit my profile after registration?',
      answer: 'Yes. Go to Settings > Account or Settings > Company to update your personal information and company details. Changes take effect immediately.',
    },
    {
      question: 'How do I add more members to my consortium?',
      answer: 'Go to your consortium page and click "Edit consortium". You can search for and invite other verified suppliers to join your group.',
    },
    {
      question: 'What happens if my bid is awarded?',
      answer: 'You&apos;ll receive a notification. Visit the tender details to see award confirmation and next steps. You can then coordinate with your consortium members to execute the contract.',
    },
  ]

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const supportChannels = [
    {
      icon: Mail,
      title: 'Email support',
      description: 'Send us your questions',
      contact: 'support@bantu-bid.com',
      action: 'Email us',
    },
    {
      icon: Phone,
      title: 'Phone support',
      description: 'Available business hours',
      contact: '+260 212 345 678',
      action: 'Call us',
    },
    {
      icon: MessageSquare,
      title: 'Live chat',
      description: 'Chat with our team',
      contact: 'Available 9am-5pm CAT',
      action: 'Start chat',
    },
    {
      icon: BookOpen,
      title: 'Knowledge base',
      description: 'Browse detailed guides',
      contact: 'View documentation',
      action: 'Learn more',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader
          eyebrow="Support"
          title="Help center"
          description="Find answers to common questions and get support from our team."
        />

        {/* Search */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <SearchIcon className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search help articles..."
              className="flex-1 bg-transparent text-slate-900 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Support Channels */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {supportChannels.map((channel) => {
            const Icon = channel.icon
            return (
              <div key={channel.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="h-8 w-8 text-slate-900 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-1">{channel.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{channel.description}</p>
                <p className="text-sm font-medium text-slate-900 mb-4">{channel.contact}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {channel.action}
                </Button>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeader title="Frequently asked questions" description={`${filteredFAQs.length} helpful answers`} />

          <div className="mt-5 space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition text-left"
                  >
                    <p className="font-medium text-slate-900">{faq.question}</p>
                    <ChevronDown className={`h-5 w-5 text-slate-600 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFAQ === index && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4">
                      <p className="text-slate-700 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">No FAQs match your search. Try different keywords.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
