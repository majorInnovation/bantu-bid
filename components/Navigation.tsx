'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, HelpCircle, Search, Settings, ShieldCheck, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { isAdmin, isSupplier } from '@/lib/roleGuards'

const getNavItems = (role: string) => {
  const baseItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/tenders', label: 'Tenders' },
    { href: '/compliance', label: 'Compliance' },
  ]

  if (isAdmin(role as any)) {
    return [
      ...baseItems,
      { href: '/admin/manage-tenders', label: 'Manage' },
    ]
  }

  return [
    ...baseItems,
    { href: '/consortia', label: 'Consortia' },
    { href: '/saved-tenders', label: 'Saved' },
  ]
}

export default function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navItems = user ? getNavItems(user.role) : []

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  if (!user) {
    return (
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3 font-semibold text-slate-900">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-slate-900 text-xs md:text-sm font-semibold text-white">
              BB
            </div>
            <div className="hidden sm:block">
              <div className="text-xs md:text-sm font-semibold">Bantu Bid</div>
              <div className="text-[10px] md:text-xs font-medium text-slate-500">Enterprise Procurement</div>
            </div>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              Login
            </Button>
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Top Navigation Bar */}
      <div className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-2xl bg-slate-900 text-xs md:text-sm font-semibold text-white">
              BB
            </div>
            <div className="hidden sm:block">
              <div className="text-xs md:text-sm font-semibold text-slate-900">Bantu Bid</div>
              <div className="text-[10px] md:text-xs font-medium text-slate-500">Procurement</div>
            </div>
          </Link>

          {/* Desktop Search - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 ml-4 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search suppliers, tenders, documents</span>
            <span className="lg:hidden">Search...</span>
            <span className="ml-auto rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Ctrl K</span>
          </div>

          {/* Desktop Icons - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/notifications">
              <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 h-10 w-10 flex items-center justify-center" title="Notifications">
                <Bell className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/help">
              <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 h-10 w-10 flex items-center justify-center" title="Help">
                <HelpCircle className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:block relative ml-2">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition min-h-10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{isAdmin(user.role as any) ? 'Admin' : 'Supplier'}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-600 transition ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg z-50">
                <div className="p-2 space-y-1">
                  <Link href="/settings">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-sm text-slate-700 min-h-10">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </Link>
                  <Link href="/reports">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-sm text-slate-700 min-h-10">
                      <Bell className="h-4 w-4" />
                      Reports
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2 text-sm text-red-600 border-t border-slate-200 mt-2 pt-2 min-h-10"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition h-10 w-10 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Only on small screens */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-slate-50/95 px-4 py-3 space-y-3">
          {/* Mobile Search */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input type="text" placeholder="Search..." className="flex-1 bg-transparent outline-none text-slate-700" />
          </div>

          {/* Mobile Nav Items */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition min-h-11 flex items-center ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile User Actions */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <Link href="/notifications" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-white transition min-h-11 font-medium">
                <Bell className="h-5 w-5" />
                Notifications
              </button>
            </Link>
            <Link href="/help" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-white transition min-h-11 font-medium">
                <HelpCircle className="h-5 w-5" />
                Help
              </button>
            </Link>
            <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-white transition min-h-11 font-medium">
                <Settings className="h-5 w-5" />
                Settings
              </button>
            </Link>
            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition min-h-11 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Tab Navigation - Hidden on Mobile */}
      <div className="hidden md:block border-t border-slate-200 bg-slate-50/80">
        <div className="px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition whitespace-nowrap min-h-9 flex items-center ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 flex-shrink-0 min-h-9">
            <ShieldCheck className="h-4 w-4 text-[#C78A2C]" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}
