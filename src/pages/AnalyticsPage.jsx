import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useAppContext } from '../context/AppContext'
import { monthlyData } from '../data/mockData'
import PageHeader from '../components/ui/PageHeader'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const COLORS = ['#7C5CFC', '#E8A838', '#26C28E', '#E5534B', '#8B5CF6', '#10B981', '#F59E0B', '#8899B5', '#3ECF8E']

export default function AnalyticsPage() {
  const { jobs } = useAppContext()

  // Status distribution for pie
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  // Top skills
  const skillCounts = {}
  jobs.forEach(job => {
    job.skills?.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })
  })
  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }))

  // Success rate by month
  const successRate = monthlyData.map(d => ({
    month: d.month,
    rate: d.applications > 0 ? Math.round((d.interviews / d.applications) * 100) : 0,
  }))

  // Summary stats
  const total = jobs.length
  const interviews = jobs.filter(j => ['interview', 'hr_round'].includes(j.status)).length
  const offers = jobs.filter(j => ['offer', 'hired'].includes(j.status)).length
  const responseRate = total > 0 ? Math.round((interviews / total) * 100) : 0
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Analytics"
        subtitle="Insights into your job search performance"
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Applications', value: total,         color: 'var(--accent)' },
          { label: 'Interview Rate',     value: `${responseRate}%`, color: 'var(--green)' },
          { label: 'Offer Rate',         value: `${offerRate}%`,    color: '#3ECF8E'       },
          { label: 'Avg Match Score',    value: `${Math.round(jobs.reduce((s, j) => s + (j.matchScore || 0), 0) / (jobs.length || 1))}%`, color: 'var(--yellow)' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: stat.color, letterSpacing: '-0.02em' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Monthly Applications */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Applications per Month</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>Monthly breakdown of activity</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28283A" />
              <XAxis dataKey="month" tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="applications" name="Applications" fill="#7C5CFC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="interviews"   name="Interviews"   fill="#26C28E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offers"       name="Offers"       fill="#E8A838" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success Rate Trend */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Interview Rate Trend</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>% of applications that got interviews</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={successRate} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28283A" />
              <XAxis dataKey="month" tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="rate" name="Rate (%)"
                stroke="#26C28E" strokeWidth={2.5}
                dot={{ fill: '#26C28E', strokeWidth: 0, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Status Distribution */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Status Distribution</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Current state of all applications</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pieData.slice(0, 6).map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ color: 'var(--muted)', flex: 1, textTransform: 'capitalize' }}>
                    {d.name.replace('_', ' ')}
                  </span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Top Skills in Applications</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Most frequent skills across your jobs</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={topSkills}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 50, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#28283A" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="skill" tick={{ fill: '#8585A0', fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" fill="#7C5CFC" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
