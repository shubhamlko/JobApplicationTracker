import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Clock, Bookmark, Send, Briefcase } from 'lucide-react'
import { jobBoardListings } from '../data/mockData'
import { useAppContext } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'

const TYPE_FILTERS = ['All', 'Remote', 'Hybrid', 'Onsite']

export default function JobBoardPage() {
  const { dispatch } = useAppContext()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [applied, setApplied] = useState(new Set())
  const [saved, setSaved] = useState(new Set())

  const filtered = jobBoardListings.filter(job => {
    const matchSearch = !search ||
      job.role?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || job.type === typeFilter
    return matchSearch && matchType
  })

  function handleApply(job) {
    if (applied.has(job.id)) return
    dispatch({
      type: 'ADD',
      job: {
        id: crypto.randomUUID(),
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary,
        status: 'applied',
        appliedDate: new Date().toISOString().split('T')[0],
        skills: job.skills,
        notes: `Applied via Job Board. Experience: ${job.experience}`,
        description: `${job.type} position at ${job.company}. Experience required: ${job.experience}.`,
        matchScore: Math.floor(Math.random() * 20 + 72),
        logo: job.company[0],
      },
    })
    setApplied(s => new Set([...s, job.id]))
  }

  function handleSave(job) {
    if (saved.has(job.id)) return
    dispatch({
      type: 'ADD',
      job: {
        id: crypto.randomUUID(),
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary,
        status: 'saved',
        appliedDate: new Date().toISOString().split('T')[0],
        skills: job.skills,
        notes: '',
        description: `${job.type} position at ${job.company}. Experience required: ${job.experience}.`,
        matchScore: Math.floor(Math.random() * 20 + 70),
        logo: job.company[0],
      },
    })
    setSaved(s => new Set([...s, job.id]))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Job Board"
        subtitle="Discover and apply to top opportunities"
      />

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px 12px', flex: 1, maxWidth: 400,
        }}>
          <Search size={14} color="var(--faint)" />
          <input
            placeholder="Search jobs, companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {TYPE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s',
                background: typeFilter === f ? 'var(--accent)' : 'var(--surface)',
                border: `1px solid ${typeFilter === f ? 'var(--accent)' : 'var(--border)'}`,
                color: typeFilter === f ? '#fff' : 'var(--muted)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Job listing count */}
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} found
      </div>

      {/* Job cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 20,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {/* Company avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: 'var(--accent-low)', border: '1px solid #7C5CFC22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
            }}>
              {job.company[0]}
            </div>

            {/* Job info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{job.role}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{job.company}</div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                  background: job.type === 'Remote' ? '#26C28E14' : job.type === 'Hybrid' ? '#E8A83814' : '#7C5CFC14',
                  color: job.type === 'Remote' ? 'var(--green)' : job.type === 'Hybrid' ? 'var(--yellow)' : 'var(--accent)',
                  border: `1px solid ${job.type === 'Remote' ? '#26C28E30' : job.type === 'Hybrid' ? '#E8A83830' : '#7C5CFC30'}`,
                  flexShrink: 0,
                }}>
                  {job.type}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
                  <MapPin size={11} /> {job.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
                  <Briefcase size={11} /> {job.experience}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                  {job.salary}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--faint)' }}>
                  <Clock size={10} /> {job.posted}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {job.skills.map(skill => (
                  <span key={skill} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 10,
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    color: 'var(--muted)',
                  }}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => handleSave(job)}
                disabled={saved.has(job.id)}
                style={{
                  padding: '9px 12px', borderRadius: 8,
                  background: saved.has(job.id) ? '#26C28E14' : 'var(--surface2)',
                  border: `1px solid ${saved.has(job.id) ? '#26C28E30' : 'var(--border)'}`,
                  color: saved.has(job.id) ? 'var(--green)' : 'var(--muted)',
                  cursor: saved.has(job.id) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <Bookmark size={15} />
              </button>
              <button
                onClick={() => handleApply(job)}
                disabled={applied.has(job.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: applied.has(job.id) ? '#26C28E14' : 'var(--accent)',
                  border: `1px solid ${applied.has(job.id) ? '#26C28E30' : 'transparent'}`,
                  color: applied.has(job.id) ? 'var(--green)' : '#fff',
                  cursor: applied.has(job.id) ? 'default' : 'pointer',
                }}
              >
                <Send size={13} />
                {applied.has(job.id) ? 'Applied' : 'Apply'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
