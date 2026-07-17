'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { Filter, Search as SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/Navigation'
import { MOCK_TENDERS } from '@/lib/mockData'
import { Tender } from '@/lib/types'
import { PageHeader, SectionHeader, StatusBadge } from '@/components/ui/enterprise'

export default function TendersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [minBudget, setMinBudget] = useState('0')
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>(MOCK_TENDERS)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    let results = MOCK_TENDERS
    if (search) {
      results = results.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()) || t.miningSite.toLowerCase().includes(search.toLowerCase()))
    }
    if (sectorFilter !== 'all') results = results.filter((t) => t.sector === sectorFilter)
    if (statusFilter !== 'all') results = results.filter((t) => t.status === statusFilter)
    results = results.filter((t) => t.budget >= parseInt(minBudget || '0'))
    setFilteredTenders(results)
  }, [search, sectorFilter, statusFilter, minBudget])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" /></div>
  }

  const sectors = Array.from(new Set(MOCK_TENDERS.map((t) => t.sector)))
  const statusOptions = ['open', 'closing_soon', 'closed', 'awarded'] as const

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-8">
        <PageHeader eyebrow="Procurement workspace" title="Tender pipeline" description="Search and assess procurement opportunities." />

        <div className="mt-6 md:mt-8 rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
          <SectionHeader title="Filters" description="Refine opportunities" action={<div className="flex items-center gap-2 text-xs md:text-sm text-slate-500"><Filter className="h-4 w-4" /> Live results</div>} />
          <div className="mt-5 grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs md:text-sm font-medium text-slate-700">Search</label>
              <div className="flex items-center gap-2 rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 min-h-10">
                <SearchIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tenders..."
                  className="border-0 bg-transparent px-0 shadow-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs md:text-sm font-medium text-slate-700">Sector</label>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs md:text-sm text-slate-700 min-h-10"
              >
                <option value="all">All sectors</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs md:text-sm font-medium text-slate-700">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs md:text-sm text-slate-700 min-h-10"
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'closing_soon' ? 'Closing soon' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs md:text-sm font-medium text-slate-700">Min budget</label>
              <Input
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="0"
                className="w-full text-xs md:text-sm min-h-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
          {filteredTenders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-8 text-center">
              <p className="text-slate-600">No tenders match your filters.</p>
            </div>
          ) : (
            filteredTenders.map((tender) => (
              <div key={tender.id} className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h2 className="text-base md:text-lg font-semibold text-slate-900">
                          {tender.title}
                        </h2>
                        <StatusBadge status={tender.status} />
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 line-clamp-2">{tender.description}</p>
                    </div>
                    <Link href={`/tenders/${tender.id}`} className="flex-shrink-0 w-full md:w-auto">
                      <Button className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800 min-h-10">
                        Review
                      </Button>
                    </Link>
                  </div>

                  <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    <div className="rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">Site</p>
                      <p className="mt-1 md:mt-2 text-xs md:text-base font-semibold text-slate-900">{tender.miningSite}</p>
                    </div>
                    <div className="rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">Budget</p>
                      <p className="mt-1 md:mt-2 text-xs md:text-base font-semibold text-slate-900">K{(tender.budget / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">Local content</p>
                      <p className="mt-1 md:mt-2 text-xs md:text-base font-semibold text-slate-900">{tender.minLocalContent}%</p>
                    </div>
                    <div className="rounded-lg md:rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">Deadline</p>
                      <p className="mt-1 md:mt-2 text-xs md:text-base font-semibold text-slate-900">{tender.deadline.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
