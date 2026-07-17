'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, HelpCircle, Search, Settings, ShieldCheck, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/tenders', label: 'Tenders' },
  { href: '/consortia', label: 'Consortia' },
  { href: '/saved-tenders', label: 'Saved' },
  { href: '/compliance', label: 'Compliance' },
]

export default function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  if (!user) {
    return (
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-semibold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              BB
            </div>
            <div>
              <div className="text-sm font-semibold">Bantu Bid</div>
              <div className="text-xs font-medium text-slate-500">Enterprise Procurement</div>
            </div>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            BB
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Bantu Bid</div>
            <div className="text-xs font-medium text-slate-500">Procurement Platform</div>
          </div>
        </Link>

        <div className="ml-4 flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <span>Search suppliers, tenders, documents</span>
          <span className="ml-auto rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Ctrl K</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/notifications">
            <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50" title="Notifications">
              <Bell className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/help">
            <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50" title="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
          </Link>
          <div className="relative ml-2">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role === 'admin' ? 'Admin' : 'Supplier'}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-600 transition ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg z-50">
                <div className="p-2 space-y-1">
                  <Link href="/settings">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-sm text-slate-700">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </Link>
                  <Link href="/reports">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-sm text-slate-700">
                      <Bell className="h-4 w-4" />
                      Reports
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2 text-sm text-red-600 border-t border-slate-200 mt-2 pt-2"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-3 overflow-x-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition whitespace-nowrap ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 flex-shrink-0">
            <ShieldCheck className="h-4 w-4 text-[#C78A2C]" />
            <span className="hidden sm:inline">Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}
