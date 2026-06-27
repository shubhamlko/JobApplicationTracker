import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Bell, Shield, Trash2, User, Mail } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from '../context/AuthContext'
import { useAppContext } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'

const THEMES = [
  { id: 'dark',   label: 'Dark',   icon: Moon    },
  { id: 'light',  label: 'Light',  icon: Sun     },
  { id: 'system', label: 'System', icon: Monitor },
]

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? 'var(--accent)' : 'var(--surface2)',
        border: `1px solid ${value ? 'var(--accent)' : 'var(--border)'}`,
        position: 'relative', cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2,
        left: value ? 22 : 2,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', borderBottom: '1px solid var(--border)', gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: description ? 3 : 0 }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{description}</div>}
      </div>
      {children}
    </div>
  )
}

function SettingSection({ title, icon: Icon, children }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 24px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Icon size={15} color="var(--accent)" />
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { dispatch } = useAppContext()
  const [theme, setTheme] = useLocalStorage('jf_theme', 'dark')
  const [notifs, setNotifs] = useLocalStorage('jf_notifs', {
    interviews: true,
    deadlines: true,
    weeklyReport: false,
    offers: true,
    newJobs: false,
  })
  const [dangerConfirm, setDangerConfirm] = useState(false)
  const [cleared, setCleared] = useState(false)

  function clearAllData() {
    if (!dangerConfirm) {
      setDangerConfirm(true)
      setTimeout(() => setDangerConfirm(false), 5000)
      return
    }
    dispatch({ type: 'RESET' })
    setCleared(true)
    setDangerConfirm(false)
    setTimeout(() => setCleared(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences and account"
      />

      {/* Theme */}
      <SettingSection title="Appearance" icon={Sun}>
        <div style={{ paddingTop: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Theme</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: theme === t.id ? 'var(--accent)' : 'var(--surface2)',
                  border: `1px solid ${theme === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  color: theme === t.id ? '#fff' : 'var(--muted)',
                }}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
            Theme preference saved. UI will update on next reload.
          </p>
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Notifications" icon={Bell}>
        <SettingRow label="Interview Reminders" description="Get notified 24h before interviews">
          <Toggle value={notifs.interviews} onChange={v => setNotifs(n => ({ ...n, interviews: v }))} />
        </SettingRow>
        <SettingRow label="Deadline Alerts" description="Reminders for assignment deadlines">
          <Toggle value={notifs.deadlines} onChange={v => setNotifs(n => ({ ...n, deadlines: v }))} />
        </SettingRow>
        <SettingRow label="Weekly Summary" description="Weekly email with your job search progress">
          <Toggle value={notifs.weeklyReport} onChange={v => setNotifs(n => ({ ...n, weeklyReport: v }))} />
        </SettingRow>
        <SettingRow label="Offer Alerts" description="Be notified when offers need action">
          <Toggle value={notifs.offers} onChange={v => setNotifs(n => ({ ...n, offers: v }))} />
        </SettingRow>
        <SettingRow label="New Job Recommendations" description="AI-matched jobs from the job board">
          <Toggle value={notifs.newJobs} onChange={v => setNotifs(n => ({ ...n, newJobs: v }))} />
        </SettingRow>
      </SettingSection>

      {/* Account */}
      <SettingSection title="Account" icon={User}>
        <div style={{ paddingTop: 4 }}>
          <SettingRow label="Email" description="Your account email">
            <div style={{
              padding: '6px 12px', borderRadius: 8,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Mail size={12} />
              {user?.email || 'demo@jobflow.ai'}
            </div>
          </SettingRow>
          <SettingRow label="Role" description="Your account type">
            <div style={{
              padding: '5px 12px', borderRadius: 10,
              background: 'var(--accent-low)', border: '1px solid #7C5CFC30',
              fontSize: 12, color: 'var(--accent)', fontWeight: 600,
              textTransform: 'capitalize',
            }}>
              {user?.role || 'candidate'}
            </div>
          </SettingRow>
          <SettingRow label="Account Plan" description="Current subscription tier">
            <div style={{
              padding: '5px 12px', borderRadius: 10,
              background: '#E8A83814', border: '1px solid #E8A83830',
              fontSize: 12, color: 'var(--yellow)', fontWeight: 600,
            }}>
              Pro Beta
            </div>
          </SettingRow>
        </div>
      </SettingSection>

      {/* Danger Zone */}
      <SettingSection title="Danger Zone" icon={Shield}>
        <div style={{ paddingTop: 8 }}>
          {cleared && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 12,
              background: '#26C28E14', border: '1px solid #26C28E30',
              fontSize: 13, color: 'var(--green)',
            }}>
              All data cleared and reset to defaults.
            </div>
          )}
          <div style={{
            padding: '16px', borderRadius: 10,
            background: '#E5534B08', border: '1px solid #E5534B30',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 6 }}>
              Clear All Application Data
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
              This will permanently delete all your job applications and reset to default data. This action cannot be undone.
            </div>
            <button
              onClick={clearAllData}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: dangerConfirm ? 'var(--red)' : '#E5534B14',
                border: '1px solid #E5534B40',
                color: dangerConfirm ? '#fff' : 'var(--red)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <Trash2 size={14} />
              {dangerConfirm ? 'Click again to confirm' : 'Clear All Data'}
            </button>
          </div>
        </div>
      </SettingSection>
    </motion.div>
  )
}
