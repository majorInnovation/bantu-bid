'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShieldCheck, Building2, User } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { registerUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RegisterRole = 'supplier' | 'admin' | null

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<'role' | 'company' | 'account'>('role')
  const [role, setRole] = useState<RegisterRole>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [sector, setSector] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRoleSelect = (selectedRole: RegisterRole) => {
    setRole(selectedRole)
    setStep('company')
  }

  const handleCompanyNext = () => {
    if (!company.trim() || !location.trim() || !name.trim()) {
      setError('Please fill in all required company fields.')
      return
    }
    setError('')
    setStep('account')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required account fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const user = registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      companyName: company.trim(),
    })

    if (user) {
      login(user)
      router.push('/dashboard')
    } else {
      setError('An account with this email already exists.')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-slate-900 p-8 text-slate-100 lg:p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C78A2C] text-sm font-semibold text-slate-950">BB</div>
              <div>
                <p className="text-lg font-semibold">Bantu Bid</p>
                <p className="text-sm text-slate-400">Create your secure procurement workspace</p>
              </div>
            </div>
            <h1 className="mt-10 text-3xl font-semibold tracking-tight">Join the enterprise bidding network</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">Register as a supplier or consortium lead and gain access to tenders, compliance dashboards, and collaborative planning tools.</p>
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 font-medium text-white"><ShieldCheck className="h-4 w-4 text-[#C78A2C]" /> Trusted onboarding</div>
              <p className="mt-2 text-sm text-slate-400">Your account is ready for immediate review and dashboard access.</p>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            {/* Step 1: Role Selection */}
            {step === 'role' && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Select your role</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">How will you use Bantu Bid?</h2>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleRoleSelect('supplier')}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-slate-900 hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white flex-shrink-0">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">SME Supplier</p>
                        <p className="text-sm text-slate-600">Register your business to bid on tenders</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-slate-900 hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white flex-shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Mining Company</p>
                        <p className="text-sm text-slate-600">Post tenders and manage suppliers</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="text-sm text-slate-600">
                  Already have an account? <Link href="/login" className="font-semibold text-slate-900">Sign in</Link>
                </div>
              </div>
            )}

            {/* Step 2: Company Information */}
            {step === 'company' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleCompanyNext()
                }}
                className="space-y-6"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Step 1 of 3</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Company details</h2>
                </div>

                {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Contact person name *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Company name *</label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company name"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  {role === 'supplier' && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Registration number</label>
                      <Input
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="ZM-YYYY-XXXXXX"
                        disabled={loading}
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Sector *</label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900"
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

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Location *</label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Province/City"
                        disabled={loading}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep('role')
                      setRole(null)
                      setError('')
                    }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                    Continue
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Account Setup */}
            {step === 'account' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Step 2 of 3</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Account credentials</h2>
                </div>

                {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email address *</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      disabled={loading}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+260212345678"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Password *</label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        disabled={loading}
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password *</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        disabled={loading}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep('company')
                      setError('')
                    }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>
                </div>

                <div className="text-sm text-slate-600">
                  Already have an account? <Link href="/login" className="font-semibold text-slate-900">Sign in</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
