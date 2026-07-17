'use client'

import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { MOCK_COMPANIES } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader, SectionHeader } from '@/components/ui/enterprise'
import { Bell, Lock, Shield, LogOut, User, Building2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'account' | 'company' | 'notifications' | 'security'>('account')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" /></div>
  }

  const company = MOCK_COMPANIES.find((c) => c.id === user.companyId)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader eyebrow="Settings" title="Manage your account" description="Control your profile, preferences, and security settings." />

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Navigation */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
            <div className="mt-4 border-t border-slate-200 pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <SectionHeader title="Account information" description="Update your personal profile details" />
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                    <Input
                      type="text"
                      defaultValue={user.name}
                      placeholder="Your full name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                    <Input
                      type="email"
                      defaultValue={user.email}
                      placeholder="your@email.com"
                      className="w-full"
                      disabled
                    />
                    <p className="text-xs text-slate-500 mt-2">Email cannot be changed. Contact support for assistance.</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">User ID</label>
                    <Input
                      type="text"
                      value={user.id}
                      className="w-full"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                    <Input
                      type="text"
                      value={user.role}
                      className="w-full capitalize"
                      disabled
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
                  {saved ? 'Saved' : 'Save changes'}
                </Button>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && company && (
              <div className="space-y-6">
                <SectionHeader title="Company information" description="Manage your company profile" />
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Company name</label>
                    <Input
                      type="text"
                      defaultValue={company.name}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Registration number</label>
                      <Input
                        type="text"
                        defaultValue={company.registrationNumber}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                      <Input
                        type="text"
                        defaultValue={company.location}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Website</label>
                    <Input
                      type="url"
                      defaultValue={company.website}
                      placeholder="https://example.com"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Contact email</label>
                    <Input
                      type="email"
                      defaultValue={company.contactEmail}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Contact phone</label>
                    <Input
                      type="tel"
                      defaultValue={company.contactPhone}
                      className="w-full"
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
                  {saved ? 'Saved' : 'Save changes'}
                </Button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <SectionHeader title="Notification preferences" description="Choose how you receive updates" />
                <div className="space-y-4">
                  {[
                    { label: 'Tender deadlines', description: 'Get alerts when tenders are closing soon' },
                    { label: 'Consortium updates', description: 'Notifications from your consortium members' },
                    { label: 'Compliance alerts', description: 'Important compliance and certification reminders' },
                    { label: 'Bid notifications', description: 'Updates on your bid submissions' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-slate-800">
                  {saved ? 'Saved' : 'Save preferences'}
                </Button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <SectionHeader title="Security settings" description="Manage your account security" />
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Change password</p>
                        <p className="text-sm text-slate-600 mt-1">Update your password regularly to keep your account secure</p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Two-factor authentication</p>
                        <p className="text-sm text-slate-600 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Active sessions</p>
                        <p className="text-sm text-slate-600 mt-1">Manage your active login sessions</p>
                      </div>
                      <Button variant="outline">View all</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
