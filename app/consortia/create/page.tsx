'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import Navigation from '@/components/Navigation'
import { MOCK_COMPANIES } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader, SectionHeader } from '@/components/ui/enterprise'
import { Plus, X, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CreateConsortiumPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<'basic' | 'members' | 'review'>('basic')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>(user?.companyId ? [user.companyId] : [])
  const [error, setError] = useState('')

  const availableCompanies = MOCK_COMPANIES.filter((c) => !selectedMembers.includes(c.id))
  const leaderCompany = MOCK_COMPANIES.find((c) => c.id === selectedMembers[0])

  const calculateLocalContent = () => {
    if (selectedMembers.length === 0) return 0
    const totalContent = selectedMembers.reduce((sum, memberId) => {
      const company = MOCK_COMPANIES.find((c) => c.id === memberId)
      return sum + (company?.localContentPercentage || 0)
    }, 0)
    return Math.round(totalContent / selectedMembers.length)
  }

  const handleAddMember = (companyId: string) => {
    if (!selectedMembers.includes(companyId)) {
      setSelectedMembers([...selectedMembers, companyId])
    }
  }

  const handleRemoveMember = (companyId: string) => {
    if (selectedMembers.length > 1) {
      setSelectedMembers(selectedMembers.filter((id) => id !== companyId))
    }
  }

  const handleNext = () => {
    if (step === 'basic') {
      if (!name.trim() || !description.trim()) {
        setError('Please fill in all basic information')
        return
      }
      setError('')
      setStep('members')
    } else if (step === 'members') {
      if (selectedMembers.length < 2) {
        setError('A consortium must have at least 2 members')
        return
      }
      setError('')
      setStep('review')
    }
  }

  const handleSubmit = () => {
    // In a real app, this would save to database
    router.push('/consortia')
  }

  const localContent = calculateLocalContent()
  const isCompliant = localContent >= 70

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <PageHeader eyebrow="New consortium" title="Create a consortium" description="Form a group of suppliers to bid on tenders together." />

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 mb-8">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${step === 'basic' || step === 'members' || step === 'review' ? 'bg-slate-900 text-white' : 'bg-border text-muted-foreground'}`}>1</div>
          <div className="h-1 w-16 bg-border" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${step === 'members' || step === 'review' ? 'bg-slate-900 text-white' : 'bg-border text-muted-foreground'}`}>2</div>
          <div className="h-1 w-16 bg-border" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${step === 'review' ? 'bg-slate-900 text-white' : 'bg-border text-muted-foreground'}`}>3</div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 'basic' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            <SectionHeader title="Basic information" description="Name and describe your consortium" />

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Consortium name *</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Northern Mining Solutions"
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose and focus of this consortium..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/consortia">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleNext} className="bg-slate-900 text-white hover:bg-slate-800 flex-1">
                Continue to members
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Members */}
        {step === 'members' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            <SectionHeader title="Add members" description="Select companies to join your consortium" />

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Current Members */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 mb-3">Current members ({selectedMembers.length})</p>
                <div className="space-y-2">
                  {selectedMembers.map((memberId) => {
                    const company = MOCK_COMPANIES.find((c) => c.id === memberId)
                    const isLeader = memberId === selectedMembers[0]
                    return (
                      <div key={memberId} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">{company?.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{isLeader ? 'Consortium leader' : 'Member'}</p>
                        </div>
                        {!isLeader && selectedMembers.length > 1 && (
                          <button onClick={() => handleRemoveMember(memberId)} className="p-1 hover:bg-white rounded-lg transition">
                            <X className="h-4 w-4 text-slate-600" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Available Companies */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 mb-3">Add more members</p>
                <div className="space-y-2">
                  {availableCompanies.map((company) => (
                    <div key={company.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">{company.name}</p>
                        <p className="text-xs text-slate-600 mt-1">{company.sector} • {company.location}</p>
                      </div>
                      <button
                        onClick={() => handleAddMember(company.id)}
                        className="p-1 hover:bg-white rounded-lg transition"
                      >
                        <Plus className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('basic')}>Back</Button>
              <Button onClick={handleNext} className="bg-slate-900 text-white hover:bg-slate-800 flex-1">
                Review consortium
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
              <SectionHeader title="Review" description="Confirm your consortium details before creating" />

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Consortium name</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Description</p>
                  <p className="text-slate-900 mt-1">{description}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-3">Members ({selectedMembers.length})</p>
                  <div className="space-y-2">
                    {selectedMembers.map((memberId) => {
                      const company = MOCK_COMPANIES.find((c) => c.id === memberId)
                      const isLeader = memberId === selectedMembers[0]
                      return (
                        <div key={memberId} className="flex items-center gap-2 text-slate-900">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>{company?.name}</span>
                          {isLeader && <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">Leader</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Summary */}
            <div className={`rounded-3xl border p-8 shadow-sm ${isCompliant ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-start gap-3">
                <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isCompliant ? 'text-emerald-600' : 'text-amber-600'}`} />
                <div>
                  <p className={`font-semibold ${isCompliant ? 'text-emerald-900' : 'text-amber-900'}`}>Local content analysis</p>
                  <p className={`text-sm mt-2 ${isCompliant ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Your consortium has an average local content of <strong>{localContent}%</strong>
                    {isCompliant ? ' - compliant with S.I. No. 68 minimum thresholds.' : ' - may need additional member consideration.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('members')}>Back</Button>
              <Button onClick={handleSubmit} className="bg-slate-900 text-white hover:bg-slate-800 flex-1">
                Create consortium
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
