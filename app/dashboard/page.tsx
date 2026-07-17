'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
} from 'lucide-react'

import { useAuth } from '@/lib/AuthContext'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import { MOCK_COMPANIES, MOCK_CONSORTIA, MOCK_TENDERS } from '@/lib/mockData'
import { getRecommendedTenders } from '@/lib/matching'
import {
  ActionLink,
  ActivityFeed,
  AnalyticsCard,
  ApprovalCard,
  ChartCard,
  ComplianceBadge,
  DocumentCard,
  EnterpriseTable,
  FilterBar,
  MetricCard,
  NotificationPanel,
  PageHeader,
  QuickActionButton,
  SearchBar,
  SectionHeader,
  StatusBadge,
  TenderCard,
  TrendSparkline,
} from '@/components/ui/enterprise'

type TenderFilter = 'all' | 'open' | 'closing_soon' | 'awarded'

const pipelineSteps = [
  { label: 'Draft', count: 3, value: 1240000, progress: 35 },
  { label: 'Published', count: 7, value: 4100000, progress: 72 },
  { label: 'Evaluation', count: 5, value: 2870000, progress: 58 },
  { label: 'Awarded', count: 2, value: 1760000, progress: 84 },
]

const notifications = [
  {
    title: 'Today',
    items: [
      { title: 'Approval request pending', detail: 'Consortium review requires director sign-off', tone: 'warning' as const },
      { title: 'Supplier question received', detail: 'New clarification on local content documentation', tone: 'default' as const },
    ],
  },
  {
    title: 'Yesterday',
    items: [
      { title: 'Compliance renewal due', detail: 'Safety certification expires in 5 days', tone: 'danger' as const },
    ],
  },
  {
    title: 'Earlier',
    items: [{ title: 'Tender deadline reminder', detail: 'Konkola assets package closes tomorrow', tone: 'default' as const }],
  },
]

const activityItems = [
  { title: 'Tender published', description: 'Copper processing package published to verified suppliers.', time: '08:10' },
  { title: 'Supplier registered', description: 'Northstar Logistics completed verification and profile update.', time: '09:45' },
  { title: 'Consortium approved', description: 'Integrated Works consortium received procurement director approval.', time: '11:20' },
  { title: 'Contract signed', description: 'Maintenance agreement was finalised and archived.', time: '14:05' },
]

const complianceItems = [
  { label: 'ESG score', value: '92 / 100', tone: 'success' as const },
  { label: 'S.I. No. 68', value: 'Compliant', tone: 'success' as const },
  { label: 'Safety certifications', value: '3 expiring', tone: 'warning' as const },
  { label: 'Tax clearance', value: 'Pending', tone: 'danger' as const },
]

const supplierActivity = [
  { name: 'Northstar Logistics', verification: 'verified', province: 'Copperbelt', specialization: 'Transport & warehousing', rating: '4.8', activity: 'Uploaded insurance certificate 2h ago' },
  { name: 'Mupeta Civil Works', verification: 'pending', province: 'Lusaka', specialization: 'Roads & earthworks', rating: '4.3', activity: 'Requested tender clarification' },
  { name: 'Apex Safety Systems', verification: 'suspended', province: 'Southern', specialization: 'Safety compliance', rating: '3.9', activity: 'Compliance review overdue' },
]

const documents = [
  { title: 'Tender pack', description: 'Scope, submission criteria and Q&A', meta: 'Updated 2h ago' },
  { title: 'Supplier certificates', description: 'ISO, ESG and tax documents', meta: 'Shared with panel' },
  { title: 'Contract draft', description: 'Award conditions and milestone schedule', meta: 'Version 4.2' },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<TenderFilter>('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const company = MOCK_COMPANIES.find((companyItem) => companyItem.id === user?.companyId)
  const userConsortia = MOCK_CONSORTIA.filter((consortium) => consortium.members.some((member) => member.companyId === user?.companyId))
  const recommendations = userConsortia.length > 0 ? getRecommendedTenders(userConsortia[0], MOCK_TENDERS) : []
  const openTenders = MOCK_TENDERS.filter((tender) => tender.status === 'open')
  const closingSoonTenders = MOCK_TENDERS.filter((tender) => tender.status === 'closing_soon')

  const filteredTenders = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return MOCK_TENDERS.filter((tender) => {
      const matchesFilter = filter === 'all' ? true : tender.status === filter
      const matchesSearch = [tender.title, tender.miningSite, tender.sector].some((value) => value.toLowerCase().includes(term))
      return matchesFilter && matchesSearch
    })
  }, [filter, searchTerm])

  const tenderTableRows = filteredTenders.map((tender) => ({
    id: tender.id,
    title: <div><p className="font-semibold text-slate-900">{tender.title}</p><p className="mt-1 text-sm text-slate-500">{tender.miningSite}</p></div>,
    category: <span className="text-slate-600">{tender.sector}</span>,
    budget: <span className="font-semibold text-slate-900">K {tender.budget.toLocaleString()}</span>,
    closing: <span className="text-slate-600">{tender.deadline.toLocaleDateString('en-ZM')}</span>,
    applications: <span className="font-semibold text-slate-900">{Math.max(6, Math.round(tender.budget / 400000))}</span>,
    status: <StatusBadge status={tender.status} />,
    owner: <span className="text-slate-600">{tender.postedBy}</span>,
    actions: <div className="flex items-center gap-2"><Link href={`/tenders/${tender.id}`} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">View</Link><button className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Export</button></div>,
  }))

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    )
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />

      <div className="mx-auto flex max-w-7xl gap-4 md:gap-6 px-4 py-4 md:px-6 md:py-8 lg:px-8">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden w-56 lg:w-64 shrink-0 lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B1F35] text-sm font-semibold text-white">BB</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{company?.name || 'Mining Company'}</p>
                  <p className="text-xs text-slate-500">Procurement command centre</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Compliance posture</span>
                  <span className="font-semibold text-emerald-600">92%</span>
                </div>
              </div>
            </div>

            <nav className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Workspace</p>
              {[
                ['Overview', '/dashboard'],
                ['Active Tenders', '/tenders'],
                ['Verified Suppliers', '/profile'],
                ['Consortium Requests', '/consortia'],
                ['ESG Dashboard', '/compliance'],
                ['Contracts', '/dashboard'],
                ['Reports', '/dashboard'],
                ['Settings', '/profile'],
              ].map(([label, href]) => (
                <Link key={label} href={href as string} className="mt-1 flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                  <span>{label}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <PageHeader
            eyebrow={isAdmin ? "Admin Dashboard" : "Supplier Dashboard"}
            title={isAdmin ? "Procurement management" : "My opportunities"}
            description={isAdmin ? "Post tenders, manage suppliers, and track compliance." : "Find and apply to tenders, collaborate with suppliers in consortia."}
            actions={
              isAdmin ? (
                <>
                  <QuickActionButton href="/admin/create-tender" label="New Tender" icon={<Plus className="h-4 w-4" />} />
                  <QuickActionButton href="/admin/manage-tenders" label="Manage" icon={<FileText className="h-4 w-4" />} />
                </>
              ) : (
                <>
                  <QuickActionButton href="/saved-tenders" label="Saved" icon={<FileText className="h-4 w-4" />} />
                  <QuickActionButton href="/consortia/create" label="New Consortium" icon={<Users2 className="h-4 w-4" />} />
                </>
              )
            }
          />

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="h-4 w-4 text-[#C78A2C]" flex-shrink-0 />
              <span className="hidden sm:inline">Last updated 2 min ago • Secure access active</span>
              <span className="sm:hidden">Secure access active</span>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <BellRing className="h-4 w-4" flex-shrink-0 />
                <span>8 pending</span>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {isAdmin ? (
              <>
                <MetricCard label="Active tenders" value={openTenders.length} trend="3 closing soon" icon={<BriefcaseBusiness className="h-4 w-4" />} accent="navy" />
                <MetricCard label="Pending review" value={closingSoonTenders.length + 2} trend="High priority" icon={<Activity className="h-4 w-4" />} accent="gold" />
                <MetricCard label="Verified suppliers" value={MOCK_COMPANIES.length} trend="4.8 rating" icon={<Users2 className="h-4 w-4" />} accent="green" />
                <MetricCard label="Active consortiums" value={userConsortia.length} trend="Collaboration" icon={<ClipboardList className="h-4 w-4" />} accent="slate" />
              </>
            ) : (
              <>
                <MetricCard label="Tenders available" value={openTenders.length} trend="3 closing soon" icon={<BriefcaseBusiness className="h-4 w-4" />} accent="navy" />
                <MetricCard label="My consortiums" value={userConsortia.length} trend="Active" icon={<Users2 className="h-4 w-4" />} accent="gold" />
                <MetricCard label="Saved tenders" value="12" trend="For later" icon={<FileText className="h-4 w-4" />} accent="green" />
                <MetricCard label="Applications" value="5" trend="Pending" icon={<ClipboardList className="h-4 w-4" />} accent="slate" />
              </>
            )}
          </div>

          {isAdmin ? (
            // Admin Dashboard Layout
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <section className="space-y-6 min-w-0">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Procurement pipeline" description="Operational oversight across the tender lifecycle" />
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {pipelineSteps.map((step) => (
                    <div key={step.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{step.count}</span>
                      </div>
                      <p className="mt-3 text-xl font-semibold text-slate-900">K {step.value.toLocaleString()}</p>
                      <div className="mt-3 h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-[#0B1F35]" style={{ width: `${step.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <SectionHeader title="Active tender table" description="Search, filter and act on live procurement activity" />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search tenders" />
                    <FilterBar filters={[{ label: 'All', value: 'all' }, { label: 'Open', value: 'open' }, { label: 'Closing', value: 'closing_soon' }, { label: 'Awarded', value: 'awarded' }]} activeValue={filter} onChange={(value) => setFilter(value as TenderFilter)} />
                  </div>
                </div>
                <div className="mt-5">
                  <EnterpriseTable columns={[{ key: 'id', label: 'Tender ID' }, { key: 'title', label: 'Tender Title' }, { key: 'category', label: 'Category' }, { key: 'budget', label: 'Budget' }, { key: 'closing', label: 'Closing Date' }, { key: 'applications', label: 'Applications' }, { key: 'status', label: 'Status' }, { key: 'owner', label: 'Assigned Officer' }, { key: 'actions', label: 'Actions' }]} rows={tenderTableRows} emptyMessage="No tenders match the selected filters." />
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Compliance center" description="Critical controls and deadlines" />
                <div className="mt-5 space-y-3">
                  {complianceItems.map((item) => (
                    <ComplianceBadge key={item.label} label={item.label} value={item.value} tone={item.tone} />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader title="Approvals" description="Actions requiring attention" />
                <div className="mt-5 space-y-3">
                  <ApprovalCard title="Consortium request" description="Northstar + Apex joint bid pending review" />
                  <ApprovalCard title="Supplier application" description="Three new suppliers need onboarding checks" />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C78A2C]" />
                  <p className="text-sm font-semibold">Smart procurement insights</p>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">Recommended suppliers matched to the next tender window.</div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">Risk alerts are trending down after recent compliance updates.</div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">Budget utilization remains within approved thresholds.</div>
                </div>
              </div>
            </aside>
          </div>
          ) : (
            // Supplier Dashboard Layout
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <section className="space-y-6 min-w-0">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
                  <SectionHeader title="Available tenders" description="Open opportunities for your consortium" />
                  <div className="mt-5">
                    <EnterpriseTable
                      columns={[
                        { key: 'title', label: 'Opportunity' },
                        { key: 'budget', label: 'Budget' },
                        { key: 'closing', label: 'Closes' },
                        { key: 'status', label: 'Status' },
                      ]}
                      rows={filteredTenders.slice(0, 5).map((tender) => ({
                        id: tender.id,
                        title: <Link href={`/tenders/${tender.id}`} className="font-semibold text-slate-900 hover:text-slate-700 underline">{tender.title}</Link>,
                        budget: <span className="font-semibold text-slate-900">K {(tender.budget / 1000000).toFixed(1)}M</span>,
                        closing: <span className="text-slate-600">{tender.deadline.toLocaleDateString('en-ZM')}</span>,
                        status: <StatusBadge status={tender.status} />,
                      }))}
                      emptyMessage="No tenders available yet."
                    />
                  </div>
                  <Link href="/tenders" className="mt-4 inline-block">
                    <Button variant="outline" className="text-sm">View all tenders</Button>
                  </Link>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
                  <SectionHeader title="My consortiums" description="Collaborate with other suppliers" />
                  <div className="mt-5 space-y-3">
                    {userConsortia.map((consortium) => (
                      <div key={consortium.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="min-w-0">
                            <Link href={`/consortia/${consortium.id}`}>
                              <p className="text-sm font-semibold text-slate-900 hover:text-slate-700">{consortium.name}</p>
                            </Link>
                            <p className="mt-1 text-xs md:text-sm text-slate-600">{consortium.members.length} members</p>
                          </div>
                          <StatusBadge status={consortium.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/consortia/create" className="mt-4 inline-block">
                    <Button className="text-sm bg-slate-900 text-white hover:bg-slate-800">Create consortium</Button>
                  </Link>
                </div>
              </section>

              <aside className="space-y-6 min-w-0">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
                  <SectionHeader title="Recent activity" description="Your bidding activity" />
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-900">Bid submitted</p>
                      <p className="text-xs text-slate-600 mt-1">Konkola equipment tender</p>
                      <p className="text-xs text-slate-500 mt-2">2 hours ago</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-900">Tender saved</p>
                      <p className="text-xs text-slate-600 mt-1">Maintenance services package</p>
                      <p className="text-xs text-slate-500 mt-2">Yesterday</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-4 md:p-6 text-slate-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#C78A2C]" />
                    <p className="text-sm font-semibold">Supplier tips</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs md:text-sm text-slate-300">
                    <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">Join a consortium to bid on larger tenders.</li>
                    <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">Update your compliance certificates regularly.</li>
                    <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">Check your saved tenders for new matches.</li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
