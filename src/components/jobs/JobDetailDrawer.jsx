import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, DollarSign, Calendar, Trash2, Pencil, CheckCircle } from 'lucide-react'
import { STATUSES } from '../../constants/statuses'
import StatusBadge from '../ui/StatusBadge'
import { useAppContext } from '../../context/AppContext'

const TIMELINE_STEPS = [
  { label: 'Applied',   done: true  },
  { label: 'Screening', done: true  },
  { label: 'Interview', done: false },
  { label: 'Offer',     done: false },
]

function CircleProgress({ percent, size = 80, stroke = 7, color = '#7C5CFC' }) {
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
      />
    </svg>
  )
}

export default function JobDetailDrawer({ job, onClose }) {
  const { dispatch } = useAppContext()
  const [notes, setNotes] = useState(job?.notes || '')

  useEffect(() => {
    if (job) {
      const saved = localStorage.getItem(`jf_notes_${job.id}`)
      setNotes(saved !== null ? saved : job.notes || '')
    }
  }, [job?.id])

  function handleNotesChange(val) {
    setNotes(val)
    if (job) localStorage.setItem(`jf_notes_${job.id}`, val)
  }

  function handleMove(statusId) {
    if (job) dispatch({ type: 'MOVE', id: job.id, status: statusId })
  }

  function handleDelete() {
    if (job && confirm('Delete this job application?')) {
      dispatch({ type: 'DELETE', id: job.id })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {job && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 50,
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 400,
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              zIndex: 60,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 20px 16px',
              borderBottom: '1px solid var(--border)',
              position: 'sticky', top: 0,
              background: 'var(--surface)',
              zIndex: 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{job.role}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{job.company}</div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none', border: 'none', color: 'var(--muted)',
                    cursor: 'pointer', padding: 4, borderRadius: 6,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <StatusBadge statusId={job.status} size="md" />
            </div>

            {/* Meta */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {job.location && (
                <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--muted)', alignItems: 'center' }}>
                  <MapPin size={13} color="var(--faint)" />
                  {job.location}
                </div>
              )}
              {job.salary && (
                <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--muted)', alignItems: 'center' }}>
                  <DollarSign size={13} color="var(--faint)" />
                  {job.salary}
                </div>
              )}
              {job.appliedDate && (
                <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--muted)', alignItems: 'center' }}>
                  <Calendar size={13} color="var(--faint)" />
                  Applied {new Date(job.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>

            {/* AI Match Score */}
            {job.matchScore && (
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <CircleProgress
                    percent={job.matchScore}
                    size={72}
                    stroke={7}
                    color={job.matchScore >= 85 ? 'var(--green)' : job.matchScore >= 70 ? 'var(--yellow)' : 'var(--accent)'}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{job.matchScore}%</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>AI Match Score</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
                    {job.matchScore >= 85 ? 'Excellent match! Great fit for this role.' :
                     job.matchScore >= 70 ? 'Good match. A few gaps to address.' :
                     'Moderate match. Review requirements.'}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Description
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{job.description}</p>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Required Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {job.skills.map(skill => (
                    <span key={skill} style={{
                      fontSize: 12,
                      padding: '3px 10px',
                      borderRadius: 10,
                      background: 'var(--accent-low)',
                      border: '1px solid #7C5CFC30',
                      color: 'var(--accent)',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Move to status */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Move to Stage
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STATUSES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleMove(s.id)}
                    style={{
                      fontSize: 11, fontWeight: 500,
                      padding: '4px 10px', borderRadius: 14, cursor: 'pointer',
                      border: `1px solid ${job.status === s.id ? s.color : 'var(--border)'}`,
                      background: job.status === s.id ? s.bg : 'transparent',
                      color: job.status === s.id ? s.color : 'var(--muted)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Timeline */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Interview Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: step.done ? 'var(--green)' : 'var(--surface2)',
                      border: `2px solid ${step.done ? 'var(--green)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {step.done && <CheckCircle size={12} color="#fff" />}
                    </div>
                    <span style={{ fontSize: 12, color: step.done ? 'var(--text)' : 'var(--muted)' }}>
                      {step.label}
                    </span>
                    {step.done && (
                      <span style={{ fontSize: 10, color: 'var(--green)', marginLeft: 'auto' }}>Completed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Notes
              </div>
              <textarea
                value={notes}
                onChange={e => handleNotesChange(e.target.value)}
                placeholder="Add your notes here..."
                rows={4}
                style={{
                  width: '100%',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: 'var(--text)',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: 1.6,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>Auto-saved</div>
            </div>

            {/* Actions */}
            <div style={{ padding: '14px 20px', display: 'flex', gap: 10 }}>
              <button
                onClick={() => {}}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: 'var(--accent-low)', border: '1px solid #7C5CFC30', color: 'var(--accent)',
                  cursor: 'pointer',
                }}
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: '#E5534B14', border: '1px solid #E5534B33', color: 'var(--red)',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
