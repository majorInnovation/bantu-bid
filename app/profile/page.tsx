'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { MOCK_COMPANIES } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { PageHeader, SectionHeader } from '@/components/ui/enterprise'
import { Edit3, Globe, Mail, Phone, MapPin, Award, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" /></div>
  }

  const company = MOCK_COMPANIES.find((c) => c.id === user.companyId)

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="text-center">Company not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <PageHeader eyebrow="My profile" title={company.name} description="Your company information and credentials" />
          <Link href="/settings">
            <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
              <Edit3 className="h-4 w-4" />
              Edit profile
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <div className="space-y-6">
            {/* Company Info */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Company information" description="Public profile details" />
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Registration number</p>
                  <p className="text-lg font-semibold text-slate-900">{company.registrationNumber}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Location</p>
                    <p className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {company.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Sector</p>
                    <p className="text-base font-semibold text-slate-900">{company.sector}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-2">Contact information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <a href={`mailto:${company.contactEmail}`} className="hover:text-slate-600">
                        {company.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {company.contactPhone}
                    </div>
                    {company.website && (
                      <div className="flex items-center gap-2 text-slate-900">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600">
                          {company.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-2">Description</p>
                  <p className="text-slate-700">{company.description}</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Certifications" description="Active credentials and certifications" />
              <div className="mt-5 space-y-3">
                {company.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Award className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <p className="font-medium text-slate-900">{cert}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Core capabilities" description="Services and expertise" />
              <div className="mt-5 flex flex-wrap gap-2">
                {company.capabilities.map((cap) => (
                  <span key={cap} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <p className="text-sm text-slate-600">Local content</p>
                <p className="text-2xl font-semibold text-slate-900">{company.localContentPercentage}%</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Active consortia</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">2</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Success rate</span>
                </div>
                <p className="text-2xl font-semibold text-emerald-600">72%</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-600">Member since</p>
              <p className="text-lg font-semibold text-slate-900 mt-2">{new Date(company.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
            </div>

            {/* Action Buttons */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <Link href="/consortia/create">
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  Create consortium
                </Button>
              </Link>
              <Link href="/tenders">
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                  Browse tenders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
