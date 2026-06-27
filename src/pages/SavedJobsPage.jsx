import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, MapPin, DollarSign, Send, Trash2, Search } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'

export default function SavedJobsPage() {
  const { jobs, dispatch } = useAppContext()
  const [search, setSearch] = useState('')

  const savedJobs = jobs.filter(j => j.status === 'saved').filter(j =>
    !search ||
    j.role?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  )

  function applyJob(job) {
    dispatch({ type: 'MOVE', id: job.id, status: 'applied' })
  }

  function removeJob(job) {
    dispatch({ type: 'DELETE', id: job.id })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Saved Jobs"
        subtitle={`${savedJobs.length} jobs saved for later`}
      />

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '8px 12px', marginBottom: 24, width: 300,
      }}>
        <Search size={14} color="var(--faint)" />
        <input
          placeholder="Search saved jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', flex: 1 }}
        />
      </div>

      {savedJobs.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, padding: '80px 20px', color: 'var(--muted)',
        }}>
          <Bookmark size={48} color="var(--faint)" />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>No saved jobs</div>
          <div style={{ fontSize: 13 }}>Jobs you save will appear here for easy access</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          <AnimatePresence>
            {savedJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '20px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {/* Company logo + match score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'var(--accent-low)',
                    border: '1px solid #7C5CFC22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: 'var(--accent)',
                  }}>
                    {job.logo || job.company?.[0]}
                  </div>
                  {job.matchScore && (
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: job.matchScore >= 85 ? 'var(--green)' : 'var(--yellow)',
                      background: job.matchScore >= 85 ? '#26C28E18' : '#E8A83818',
                      padding: '4px 10px', borderRadius: 10,
                      border: `1px solid ${job.matchScore >= 85 ? '#26C28E30' : '#E8A83830'}`,
                    }}>
                      {job.matchScore}% match
                    </div>
                  )}
                </div>

                {/* Role & company */}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{job.role}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{job.company}</div>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {job.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
                      <MapPin size={11} /> {job.location}
                    </div>
                  )}
                  {job.salary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
                      <DollarSign size={11} /> {job.salary}
                    </div>
                  )}
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {job.skills.slice(0, 3).map(skill => (
                      <span key={skill} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 10,
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        color: 'var(--muted)',
                      }}>{skill}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => applyJob(job)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer',
                    }}
                  >
                    <Send size={12} /> Apply Now
                  </button>
                  <button
                    onClick={() => removeJob(job)}
                    style={{
                      padding: '9px 12px', borderRadius: 8,
                      background: '#E5534B14', border: '1px solid #E5534B30',
                      color: 'var(--red)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
