'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { PageHeader, SectionHeader, MetricCard } from '@/components/ui/enterprise'
import { BarChart3, LineChart, PieChart, Download, Calendar, TrendingUp } from 'lucide-react'

export default function ReportsPage() {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader
          eyebrow="Analytics"
          title="Reports & analytics"
          description="Track your bidding performance, compliance status, and consortium activity with detailed insights."
          actions={<Button className="gap-2"><Download className="h-4 w-4" /> Export report</Button>}
        />

        {/* Key Metrics */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Tenders viewed" value="24" trend="This month" icon={<BarChart3 className="h-4 w-4" />} accent="navy" />
          <MetricCard label="Bids submitted" value="8" trend="2 awaiting" icon={<TrendingUp className="h-4 w-4" />} accent="gold" />
          <MetricCard label="Success rate" value="75%" trend="6 awards" icon={<PieChart className="h-4 w-4" />} accent="green" />
          <MetricCard label="Consortia active" value="3" trend="All compliant" icon={<LineChart className="h-4 w-4" />} accent="slate" />
        </div>

        {/* Reports Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Bidding Performance */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Bidding performance" description="Your success metrics" />
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Total bids submitted</p>
                  <p className="text-sm text-slate-600">Across all consortia</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">8</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Tenders won</p>
                  <p className="text-sm text-slate-600">75% success rate</p>
                </div>
                <p className="text-2xl font-semibold text-emerald-600">6</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Total value awarded</p>
                  <p className="text-sm text-slate-600">YTD cumulative</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">K 8.7M</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Avg response time</p>
                  <p className="text-sm text-slate-600">From tender to submission</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">3.2d</p>
              </div>
            </div>
          </div>

          {/* Consortium Health */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Consortium health" description="Active group status" />
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Active consortia</p>
                  <p className="text-sm text-slate-600">Currently active</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">3</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Member companies</p>
                  <p className="text-sm text-slate-600">Across all consortia</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">8</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Compliance status</p>
                  <p className="text-sm text-slate-600">All consortia</p>
                </div>
                <p className="text-2xl font-semibold text-emerald-600">100%</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">Avg local content</p>
                  <p className="text-sm text-slate-600">Weighted average</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">84%</p>
              </div>
            </div>
          </div>

          {/* Sector Distribution */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Sector focus" description="Bid distribution by sector" />
            <div className="mt-5 space-y-3">
              {[
                { sector: 'Equipment', bids: 3, percentage: 38 },
                { sector: 'Construction', bids: 2, percentage: 25 },
                { sector: 'Logistics', bids: 2, percentage: 25 },
                { sector: 'Training', bids: 1, percentage: 12 },
              ].map((item) => (
                <div key={item.sector} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{item.sector}</span>
                    <span className="text-slate-600">{item.bids} bids</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-slate-900" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Timeline */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader title="Compliance tracker" description="Key certification dates" />
            <div className="mt-5 space-y-3">
              {[
                { cert: 'ISO 9001:2015', expires: '2025-03-15', status: 'active' },
                { cert: 'ISO 45001:2018', expires: '2024-11-20', status: 'expiring' },
                { cert: 'Safety Training', expires: '2024-09-30', status: 'urgent' },
                { cert: 'Tax Clearance', expires: '2025-06-01', status: 'active' },
              ].map((item) => (
                <div
                  key={item.cert}
                  className={`p-4 rounded-2xl border ${
                    item.status === 'urgent'
                      ? 'border-red-200 bg-red-50'
                      : item.status === 'expiring'
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${item.status === 'urgent' ? 'text-red-900' : item.status === 'expiring' ? 'text-amber-900' : 'text-slate-900'}`}>
                        {item.cert}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">Expires {new Date(item.expires).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      item.status === 'urgent'
                        ? 'bg-red-200 text-red-900'
                        : item.status === 'expiring'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeader title="Generate reports" description="Download your analytics and performance data" />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="h-4 w-4" />
              Performance report (PDF)
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="h-4 w-4" />
              Compliance summary (PDF)
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="h-4 w-4" />
              Analytics export (CSV)
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
