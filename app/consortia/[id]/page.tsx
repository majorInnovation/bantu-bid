'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import { MOCK_CONSORTIA, MOCK_COMPANIES } from '@/lib/mockData'
import { checkCompliance } from '@/lib/compliance'
import { PageHeader, SectionHeader, StatusBadge, DocumentCard } from '@/components/ui/enterprise'
import { ArrowLeft, Users, FileText, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react'
import { useState } from 'react'

export default function ConsortiumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const consortiumId = params.id as string

  // Hooks must be declared before any conditional logic
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<{ title: string; description: string; meta: string } | null>(null)

  const consortium = MOCK_CONSORTIA.find((c) => c.id === consortiumId)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" /></div>
  }

  if (!consortium) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 mb-6">Consortium not found</p>
            <Link href="/consortia">
              <Button>Back to consortia</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const compliance = checkCompliance(consortium)
  const leaderCompany = MOCK_COMPANIES.find((c) => c.id === consortium.leader)

  const evidenceList = consortium.members.flatMap((member) => {
    const company = MOCK_COMPANIES.find((c) => c.id === member.companyId)
    if (!company) return []
    return (company.certifications || []).map((cert) => ({
      title: `${member.companyName} — ${cert}`,
      description: `${cert} certificate for ${member.companyName}`,
      meta: company.updatedAt?.toLocaleDateString() ?? '2024',
    }))
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Link href="/consortia">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <PageHeader eyebrow="Consortium details" title={consortium.name} description={consortium.description} />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {/* Overview */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Consortium overview" description="Key metrics and status" />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{consortium.members.length}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Local content</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{consortium.localContentPercentage}%</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 text-sm mb-2">Status</p>
                  <StatusBadge status={consortium.status} />
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Consortium members" description="Active participants and capabilities" />
              <div className="mt-5 space-y-4">
                {consortium.members.map((member) => {
                  const company = MOCK_COMPANIES.find((c) => c.id === member.companyId)
                  return (
                    <div key={member.companyId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-slate-900">{member.companyName}</p>
                          <p className="text-xs text-slate-600 mt-1 capitalize">{member.role}</p>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{member.localContent}% local</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.capabilities.map((cap) => (
                          <span key={cap} className="text-xs bg-white border border-slate-200 rounded-full px-2.5 py-1 text-slate-700">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Capabilities */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Combined capabilities" description="Services available through this consortium" />
              <div className="mt-5 flex flex-wrap gap-2">
                {consortium.combinedCapabilities.map((cap) => (
                  <span key={cap} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leader Info */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 mb-4">Consortium leader</p>
              {leaderCompany && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{leaderCompany.name}</p>
                  <p className="text-sm text-slate-600 mt-2">{leaderCompany.location}</p>
                  <p className="text-xs text-slate-500 mt-1">{leaderCompany.sector}</p>
                  <Link href={`/profile`}>
                    <Button variant="outline" className="w-full mt-4">View profile</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Compliance Status */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader title="Compliance status" description="Local content alignment" />
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600">Current local content</span>
                    <span className="font-semibold text-slate-900">{consortium.localContentPercentage}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className={`h-3 rounded-full ${compliance.compliant ? 'bg-emerald-600' : 'bg-amber-600'}`} style={{ width: `${Math.min(100, consortium.localContentPercentage)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {compliance.compliant ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm text-emerald-700 font-medium">Compliant with S.I. No. 68</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="text-sm text-amber-700 font-medium">Gap of {compliance.gap}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                Edit consortium
              </Button>
              <Button variant="outline" onClick={() => setEvidenceOpen(true)} className="w-full gap-2">
                <FileText className="h-4 w-4" />
                View evidence
              </Button>
            </div>

            {/* Evidence modal */}
            {evidenceOpen ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-black/40" onClick={() => { setEvidenceOpen(false); setPreviewDoc(null) }} />
                <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Evidence documents</h3>
                    <div className="flex items-center gap-2">
                      {previewDoc ? (
                        <button onClick={() => setPreviewDoc(null)} className="text-sm text-slate-600">Back to list</button>
                      ) : null}
                      <button onClick={() => { setEvidenceOpen(false); setPreviewDoc(null) }} className="rounded-md border px-3 py-1 text-sm">Close</button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {previewDoc ? (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">{previewDoc.title}</h4>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                          <p className="mb-3">{previewDoc.description}</p>
                          <p className="text-xs text-slate-500">Meta: {previewDoc.meta}</p>
                          <div className="mt-4 rounded-md border bg-white p-3 text-sm text-slate-800">This is a preview of the document content. In a real app, PDFs or uploaded files would be rendered here.</div>
                        </div>
                      </div>
                    ) : (
                      evidenceList.length ? evidenceList.map((doc) => (
                        <DocumentCard key={doc.title} title={doc.title} description={doc.description} meta={doc.meta} />
                      )) : (
                        <div className="col-span-2 text-sm text-slate-600">No evidence documents available for this consortium.</div>
                      )
                    )}
                  </div>

                  {!previewDoc && evidenceList.length ? (
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => setPreviewDoc(evidenceList[0])} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Open first document</button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Dates */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-600 mb-3">Created {consortium.createdAt.toLocaleDateString()}</p>
              <p className="text-sm text-slate-600">Updated {consortium.updatedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
