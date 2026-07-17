'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { isAdmin } from '@/lib/roleGuards'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { MOCK_TENDERS } from '@/lib/mockData'
import { PageHeader, StatusBadge, SectionHeader } from '@/components/ui/enterprise'
import { Plus, Edit, Eye, Trash2, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminManageTendersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user.role as any))) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading || !user || !isAdmin(user.role as any)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-8">
        <PageHeader
          eyebrow="Admin Controls"
          title="Manage Tenders"
          description="Create, edit, and monitor all active tender opportunities."
          actions={
            <Link href="/admin/create-tender">
              <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800 min-h-10">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Tender</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          }
        />

        <div className="mt-8 grid gap-4 md:gap-6">
          {/* Tender Statistics */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
              <p className="text-xs md:text-sm text-slate-500 font-medium">Active</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{MOCK_TENDERS.filter(t => t.status === 'open').length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
              <p className="text-xs md:text-sm text-slate-500 font-medium">Closing Soon</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-2">{MOCK_TENDERS.filter(t => t.status === 'closing_soon').length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
              <p className="text-xs md:text-sm text-slate-500 font-medium">Closed</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{MOCK_TENDERS.filter(t => t.status === 'closed').length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
              <p className="text-xs md:text-sm text-slate-500 font-medium">Total</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{MOCK_TENDERS.length}</p>
            </div>
          </div>

          {/* Tenders List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
            <SectionHeader title="All Tenders" description="View and manage tender opportunities" />

            <div className="mt-6 space-y-3">
              {MOCK_TENDERS.map((tender) => (
                <div key={tender.id} className="border border-slate-200 rounded-2xl p-4 hover:bg-slate-50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/tenders/${tender.id}`}>
                          <h3 className="text-sm md:text-base font-semibold text-slate-900 hover:text-slate-700 underline">
                            {tender.title}
                          </h3>
                        </Link>
                        <StatusBadge status={tender.status} />
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 mt-2">{tender.miningSite} • {tender.sector}</p>
                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-500">
                        <span>Budget: K {(tender.budget / 1000000).toFixed(1)}M</span>
                        <span>•</span>
                        <span>Closes: {tender.deadline.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Local content: {tender.minLocalContent}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/tenders/${tender.id}`}>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition" title="View">
                          <Eye className="h-4 w-4 text-slate-600" />
                        </button>
                      </Link>
                      <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition" title="Edit">
                        <Edit className="h-4 w-4 text-slate-600" />
                      </button>
                      <button className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 transition" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
