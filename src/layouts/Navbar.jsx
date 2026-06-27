import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronRight, PanelLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PAGE_TITLES = {
  '/':             'Dashboard',
  '/applications': 'Applications',
  '/saved':        'Saved Jobs',
  '/jobs':         'Job Board',
  '/recruiter':    'Recruiter Panel',
  '/analytics':    'Analytics',
  '/calendar':     'Calendar',
  '/profile':      'Profile',
  '/settings':     'Settings',
}

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth()
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const pageTitle = PAGE_TITLES[location.pathname] || 'JobFlow AI'

  return (
    <div style={{
      height: 56,
      background: `${getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#0E0E14'}CC`,
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 12,
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Toggle button */}
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          padding: 6,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PanelLeft size={18} />
      </button>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>JobFlow AI</span>
        <ChevronRight size={13} color="var(--faint)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{pageTitle}</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '6px 12px',
        width: 220,
      }}>
        <Search size={14} color="var(--faint)" />
        <input
          placeholder="Search anything..."
          readOnly
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: 13,
            color: 'var(--muted)',
            width: '100%',
          }}
        />
        <kbd style={{
          fontSize: 10,
          color: 'var(--faint)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          padding: '1px 4px',
          fontFamily: 'monospace',
        }}>
          ⌘K
        </kbd>
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen(v => !v)}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '7px 8px',
            color: 'var(--muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--accent)',
            border: '1.5px solid var(--bg)',
          }} />
        </button>
        {notifOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            width: 280,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '8px',
            zIndex: 100,
          }}>
            <div style={{ padding: '4px 8px 8px', fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
              NOTIFICATIONS
            </div>
            {[
              { text: 'Google interview scheduled for Jan 28', time: '2h ago' },
              { text: 'Microsoft offer deadline approaching', time: '5h ago' },
              { text: 'CRED assignment due in 2 days', time: '1d ago' },
            ].map((n, i) => (
              <div key={i} style={{
                padding: '8px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                color: 'var(--text)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>{n.text}</div>
                <div style={{ color: 'var(--faint)', marginTop: 2 }}>{n.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C5CFC, #5B4BCC)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          cursor: 'pointer',
        }}>
          {user?.name?.[0] || 'U'}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{user?.name || 'User'}</div>
          <div style={{
            fontSize: 10,
            color: 'var(--accent)',
            background: 'var(--accent-low)',
            padding: '0 6px',
            borderRadius: 10,
            fontWeight: 500,
            textTransform: 'capitalize',
          }}>
            {user?.role || 'candidate'}
          </div>
        </div>
      </div>
    </div>
  )
}
