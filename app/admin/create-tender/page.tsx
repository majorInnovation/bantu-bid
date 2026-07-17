'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { isAdmin } from '@/lib/roleGuards'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/enterprise'
import { ArrowLeft, Plus, X } from 'lucide-react'

export default function AdminCreateTenderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    miningSite: '',
    sector: '',
    budget: '',
    minLocalContent: 65,
    deadline: '',
    requirements: [''],
    specifications: [''],
  })

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user.role as any))) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArrayFieldChange = (field: 'requirements' | 'specifications', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }))
  }

  const addArrayField = (field: 'requirements' | 'specifications') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayField = (field: 'requirements' | 'specifications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save tender to backend
    router.push('/admin/manage-tenders')
  }

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

      <main className="mx-auto max-w-4xl px-4 py-4 md:px-6 md:py-8">
        <Link href="/admin/manage-tenders">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <PageHeader
          eyebrow="Admin Controls"
          title="Create New Tender"
          description="Post a new procurement opportunity for suppliers to bid on."
        />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Basic Information */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tender Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Equipment Maintenance Services"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the procurement opportunity in detail"
                  rows={4}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mining Site *</label>
                  <Input
                    name="miningSite"
                    value={formData.miningSite}
                    onChange={handleInputChange}
                    placeholder="e.g., Konkola Copper Mine"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sector *</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  >
                    <option value="">Select sector</option>
                    <option value="Equipment Manufacturing">Equipment Manufacturing</option>
                    <option value="Construction">Construction</option>
                    <option value="Transportation & Logistics">Transportation & Logistics</option>
                    <option value="Safety & Compliance">Safety & Compliance</option>
                    <option value="Training">Training</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Budget (Kwacha) *</label>
                  <Input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000000"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deadline *</label>
                  <Input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Local Content Requirement (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="minLocalContent"
                    min="0"
                    max="100"
                    value={formData.minLocalContent}
                    onChange={handleInputChange}
                    className="flex-1 h-2 bg-slate-200 rounded-full"
                  />
                  <span className="text-lg font-semibold text-slate-900 min-w-12">{formData.minLocalContent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">Requirements</h2>
              <button
                type="button"
                onClick={() => addArrayField('requirements')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={req}
                    onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                    placeholder="Enter requirement"
                    className="flex-1"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('requirements', index)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 transition"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">Specifications</h2>
              <button
                type="button"
                onClick={() => addArrayField('specifications')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={spec}
                    onChange={(e) => handleArrayFieldChange('specifications', index, e.target.value)}
                    placeholder="Enter specification"
                    className="flex-1"
                  />
                  {formData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('specifications', index)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 transition"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-slate-200">
            <Link href="/admin/manage-tenders">
              <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
            </Link>
            <Button type="submit" className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 min-h-10">
              Create Tender
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
