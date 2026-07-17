'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { PageHeader, SectionHeader } from '@/components/ui/enterprise'
import { Bell, CheckCircle, AlertCircle, Clock, Trash2, Archive, Filter } from 'lucide-react'

interface Notification {
  id: string
  type: 'tender' | 'consortium' | 'compliance' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'unread' | 'tender' | 'compliance'>('all')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'tender',
      title: 'Tender closing soon',
      message: 'Copper Processing Equipment Supply closes in 5 days. Submit your bid now.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionUrl: '/tenders/tender-1',
    },
    {
      id: '2',
      type: 'consortium',
      title: 'Consortium updated',
      message: 'Northern Mining Solutions has added a new member: Apex Safety Systems',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      actionUrl: '/consortia/consortium-1',
    },
    {
      id: '3',
      type: 'compliance',
      title: 'Certification expiring',
      message: 'Your ISO 45001:2018 certification expires in 30 days.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/settings',
    },
    {
      id: '4',
      type: 'tender',
      title: 'New tender available',
      message: 'A new tender matching your capabilities is now open: Civil Works for TSF Expansion',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/tenders/tender-2',
    },
    {
      id: '5',
      type: 'system',
      title: 'Bid awarded',
      message: 'Congratulations! Your consortium won the Safety Training and Compliance Services tender.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/tenders/tender-4',
    },
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" /></div>
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    if (filter === 'tender') return n.type === 'tender'
    if (filter === 'compliance') return n.type === 'compliance'
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tender':
        return <Bell className="h-5 w-5 text-blue-600" />
      case 'consortium':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'compliance':
        return <AlertCircle className="h-5 w-5 text-amber-600" />
      case 'system':
        return <Bell className="h-5 w-5 text-slate-600" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'tender':
        return 'bg-blue-100 text-blue-700'
      case 'consortium':
        return 'bg-emerald-100 text-emerald-700'
      case 'compliance':
        return 'bg-amber-100 text-amber-700'
      case 'system':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <PageHeader
          eyebrow="Updates"
          title="Notifications"
          description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Mark all as read</Button>
            </div>
          }
        />

        {/* Filters */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-slate-600" />
            <p className="text-sm font-semibold text-slate-700">Filter notifications</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'tender', 'compliance'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                  filter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="mt-8 space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-3xl border p-6 transition ${
                  notification.read
                    ? 'border-slate-200 bg-white'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getTypeIcon(notification.type)}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getTypeBadgeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-1" />
                      )}
                    </div>

                    <p className="text-slate-600 text-sm mb-3">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(notification.timestamp)}
                      </p>

                      <div className="flex gap-2">
                        {notification.actionUrl && (
                          <button
                            onClick={() => router.push(notification.actionUrl!)}
                            className="text-sm font-medium text-slate-900 hover:text-slate-600 transition"
                          >
                            View
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 hover:bg-slate-200 rounded-lg transition text-slate-600 hover:text-red-600"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Bell className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-600 mb-6">No notifications to display</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
