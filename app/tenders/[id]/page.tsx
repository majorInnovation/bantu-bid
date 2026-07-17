'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import { MOCK_TENDERS, MOCK_CONSORTIA } from '@/lib/mockData'
import { getTenderMatches } from '@/lib/matching'
import { PageHeader, SectionHeader, StatusBadge } from '@/components/ui/enterprise'
import { ClipboardList, ShieldCheck, AlertCircle, CheckCircle, FileText, ArrowLeft, Calendar, DollarSign, Lock } from 'lucide-react'

export default function TenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const tenderId = params.id as string
  const [saved, setSaved] = useState(false)

  const tender = MOCK_TENDERS.find((t) => t.id === tenderId)
  const matches = tender ? getTenderMatches(tender.id, MOCK_CONSORTIA) : []

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" /></div>
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 mb-6">Tender not found</p>
            <Link href="/tenders">
              <Button>Back to tenders</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const daysRemaining = Math.ceil((tender.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isClosing = daysRemaining <= 7
  const userConsortia = MOCK_CONSORTIA.filter((c) => c.members.some((m) => m.companyId === user.companyId))

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Link href="/tenders">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <PageHeader eyebrow="Tender opportunity" title={tender.title} description={tender.description} />

        {isClosing && tender.status !== 'closed' && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Closing soon</p>
              <p className="text-sm text-amber-700 mt-1">This tender closes in {daysRemaining} days. Submit your bid immediately.</p>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {/* Key Details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Key details" description="Essential tender information" />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">K {(tender.budget / 1000000).toFixed(1)}M</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{tender.deadline.toLocaleDateString()}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 text-sm mb-2">Mining site</p>
                  <p className="text-lg font-semibold text-slate-900">{tender.miningSite}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 text-sm mb-2">Sector</p>
                  <p className="text-lg font-semibold text-slate-900">{tender.sector}</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Requirements" description="What you must have to bid" />
              <div className="mt-5 space-y-3">
                {tender.requirements.map((req) => (
                  <div key={req} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{req}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Specifications" description="Technical requirements and deliverables" />
              <div className="mt-5 space-y-3">
                {tender.specifications.map((spec) => (
                  <div key={spec} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <FileText className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{spec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Content */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Local content" description="S.I. No. 68 compliance requirement" />
              <div className="mt-5">
                <div className="flex items-end justify-between mb-3">
                  <span className="text-slate-600">Minimum required</span>
                  <span className="text-3xl font-semibold text-slate-900">{tender.minLocalContent}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${tender.minLocalContent}%` }} />
                </div>
                <p className="text-sm text-slate-600 mt-4">All consortia must meet this threshold for Zambian local content to be eligible for award.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Status</p>
                <StatusBadge status={tender.status} />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600 mb-2">Posted by</p>
                <p className="font-semibold text-slate-900">{tender.postedBy}</p>
                <p className="text-sm text-slate-500 mt-3">Posted {tender.postedDate.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {tender.status === 'open' || tender.status === 'closing_soon' ? (
                <div className="space-y-3">
                  {userConsortia.length > 0 ? (
                    <>
                      <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                        Submit Bid
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSaved(!saved)}
                      >
                        {saved ? 'Unsave' : 'Save tender'}
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                        <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-900 text-sm">Join a consortium</p>
                          <p className="text-xs text-amber-700 mt-1">You need to be in a consortium to bid.</p>
                        </div>
                      </div>
                      <Link href="/consortia">
                        <Button variant="outline" className="w-full">
                          View Consortia
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm font-semibold text-slate-700">Tender {tender.status}</p>
                  <p className="text-xs text-slate-600 mt-1">No new submissions accepted</p>
                </div>
              )}
            </div>

            {/* Matching Consortia */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Compatible consortia" description="Groups that may fit well" />
              <div className="mt-5 space-y-3">
                {matches.slice(0, 3).map((match) => {
                  const consortium = MOCK_CONSORTIA.find((c) => c.id === match.consortiumId)
                  return (
                    <div key={match.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900 text-sm">{consortium?.name}</p>
                      <p className="mt-2 text-xs text-slate-600">{match.reason}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
