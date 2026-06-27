import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Briefcase, TrendingUp, Award, XCircle, Activity, Sparkles } from 'lucide-react'
import { useJobs } from '../hooks/useJobs'
import { weeklyActivity, aiSuggestions, interviewReadiness } from '../data/mockData'
import StatCard from '../components/ui/StatCard'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import { useAppContext } from '../context/AppContext'

const FUNNEL_STEPS = [
  { label: 'Applied',    key: 'applied',    color: '#7C6FF7' },
  { label: 'Screening',  key: 'screening',  color: '#E8A838' },
  { label: 'Interview',  key: 'interview',  color: '#26C28E' },
  { label: 'Offer',      key: 'offer',      color: '#3ECF8E' },
  { label: 'Hired',      key: 'hired',      color: '#10B981' },
]

function CircleProgress({ percent, size = 120, stroke = 8, color = '#7C5CFC' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (percent / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#28283A" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1D1D28',
      border: '1px solid #28283A',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <div style={{ color: '#8585A0', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { totalApplied, interviewCount, offerCount, rejectedCount, responseRate } = useJobs()
  const { jobs } = useAppContext()

  const statsRefs = useRef([])

  const stats = [
    { label: 'Total Applied',   value: totalApplied,   color: '#7C5CFC', icon: Briefcase,   trend: '+3 this week' },
    { label: 'Interviews',      value: interviewCount,  color: '#26C28E', icon: TrendingUp,  trend: '+2 this week' },
    { label: 'Offers',          value: offerCount,      color: '#3ECF8E', icon: Award,       trend: null           },
    { label: 'Rejected',        value: rejectedCount,   color: '#E5534B', icon: XCircle,     trend: null           },
    { label: 'Response Rate',   value: `${responseRate}%`, color: '#E8A838', icon: Activity, trend: null           },
  ]

  useEffect(() => {
    statsRefs.current.forEach((el, i) => {
      if (!el) return
      const endVal = stats[i].value
      if (typeof endVal === 'number') {
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: endVal,
          duration: 1.2,
          delay: i * 0.1,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate() { el.textContent = Math.round(+el.textContent) },
        })
      }
    })
  }, [])

  const funnelData = FUNNEL_STEPS.map(step => ({
    ...step,
    count: jobs.filter(j => j.status === step.key).length,
  }))
  const maxFunnel = Math.max(...funnelData.map(f => f.count), 1)

  const recentJobs = [...jobs]
    .sort((a, b) => (b.appliedDate || '').localeCompare(a.appliedDate || ''))
    .slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Dashboard"
        subtitle="Your job search at a glance"
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <div key={stat.label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: stat.color, borderRadius: '12px 12px 0 0',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </span>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon size={14} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: stat.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
              <span ref={el => statsRefs.current[i] = el}>{stat.value}</span>
            </div>
            {stat.trend && (
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>{stat.trend}</div>
            )}
          </div>
        ))}
      </div>

      {/* Middle section: Chart + Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, marginBottom: 20 }}>
        {/* Weekly Activity Chart */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Weekly Activity</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Applications, interviews & offers this week</div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'Applied', color: '#7C5CFC' },
              { label: 'Interviews', color: '#26C28E' },
              { label: 'Offers', color: '#E8A838' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyActivity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gInterviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#26C28E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#26C28E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOffers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A838" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8A838" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#28283A" />
              <XAxis dataKey="day" tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="applied" name="Applied" stroke="#7C5CFC" strokeWidth={2} fill="url(#gApplied)" />
              <Area type="monotone" dataKey="interviews" name="Interviews" stroke="#26C28E" strokeWidth={2} fill="url(#gInterviews)" />
              <Area type="monotone" dataKey="offers" name="Offers" stroke="#E8A838" strokeWidth={2} fill="url(#gOffers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Application Funnel */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Application Funnel</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>Conversion through stages</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {funnelData.map((step, i) => (
              <div key={step.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                  <span style={{ color: 'var(--muted)' }}>{step.label}</span>
                  <span style={{ color: step.color, fontWeight: 600 }}>{step.count}</span>
                </div>
                <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(step.count / maxFunnel) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    style={{ height: '100%', background: step.color, borderRadius: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* AI Resume Match */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sparkles size={16} color="var(--accent)" />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>AI Resume Score</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
            <CircleProgress percent={82} size={110} stroke={9} color="var(--accent)" />
            <div style={{
              position: 'absolute',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>82%</span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>match</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {aiSuggestions.slice(0, 3).map(s => (
              <div key={s.id} style={{
                display: 'flex', gap: 8, padding: '6px 8px',
                borderRadius: 6, background: 'var(--surface2)', fontSize: 11, color: 'var(--muted)',
              }}>
                <span style={{
                  flexShrink: 0,
                  width: 16, height: 16,
                  borderRadius: 4,
                  background: s.priority === 'high' ? '#E5534B20' : s.priority === 'medium' ? '#E8A83820' : '#26C28E20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9,
                  color: s.priority === 'high' ? 'var(--red)' : s.priority === 'medium' ? 'var(--yellow)' : 'var(--green)',
                }}>
                  {s.priority === 'high' ? '!' : s.priority === 'medium' ? '~' : '✓'}
                </span>
                {s.text}
              </div>
            ))}
          </div>
        </div>

        {/* Interview Readiness */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Interview Readiness</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>Self-assessed preparation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {interviewReadiness.map(item => (
              <div key={item.topic}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>{item.topic}</span>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.score}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{ height: '100%', background: item.color, borderRadius: 3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Recent Activity</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Latest applications</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentJobs.map(job => (
              <div key={job.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px', borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface2)',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 6,
                  background: 'var(--accent-low)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: 'var(--accent)',
                  flexShrink: 0,
                }}>
                  {job.logo || job.company?.[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {job.role}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{job.company}</div>
                </div>
                <StatusBadge statusId={job.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
