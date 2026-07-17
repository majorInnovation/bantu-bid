'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { MOCK_TENDERS } from '@/lib/mockData'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { PageHeader, SectionHeader, StatusBadge } from '@/components/ui/enterprise'
import { Calendar, DollarSign, MapPin, Trash2, Heart } from 'lucide-react'

export default function SavedTendersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [savedTenders, setSavedTenders] = useState(MOCK_TENDERS.slice(0, 3))

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" /></div>
  }

  const handleRemove = (tenderId: string) => {
    setSavedTenders(savedTenders.filter((t) => t.id !== tenderId))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader
          eyebrow="My workspace"
          title="Saved tenders"
          description="Your saved tender opportunities for future reference and quick access."
          actions={<Link href="/tenders"><Button variant="outline">Browse all tenders</Button></Link>}
        />

        <div className="mt-8">
          {savedTenders.length > 0 ? (
            <div className="space-y-4">
              {savedTenders.map((tender) => (
                <div key={tender.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-slate-900">{tender.title}</h2>
                        <StatusBadge status={tender.status} />
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{tender.description}</p>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{tender.miningSite}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">K{(tender.budget / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{tender.deadline.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{tender.minLocalContent}% local</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 lg:flex-col">
                      <Link href={`/tenders/${tender.id}`} className="flex-1">
                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                          Review
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleRemove(tender.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-slate-600 hover:text-red-600"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Heart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-600 mb-6">You haven&apos;t saved any tenders yet</p>
              <Link href="/tenders">
                <Button>Browse tenders</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
