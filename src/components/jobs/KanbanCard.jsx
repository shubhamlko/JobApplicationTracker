import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MapPin, DollarSign } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { statusMap } from '../../constants/statuses'

export default function KanbanCard({ job, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 'auto',
  }

  const statusColor = statusMap[job.status]?.color || '#404055'
  const displaySkills = job.skills?.slice(0, 2) || []
  const extraSkills = (job.skills?.length || 0) - 2

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${statusColor}`,
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 8,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, background 0.15s',
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Top: role + match score */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, flex: 1, paddingRight: 8 }}>
          {job.role}
        </div>
        {job.matchScore && (
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: job.matchScore >= 85 ? 'var(--green)' : job.matchScore >= 70 ? 'var(--yellow)' : 'var(--muted)',
            background: job.matchScore >= 85 ? '#26C28E18' : job.matchScore >= 70 ? '#E8A83818' : '#40405518',
            padding: '1px 6px',
            borderRadius: 10,
            flexShrink: 0,
          }}>
            {job.matchScore}%
          </div>
        )}
      </div>

      {/* Company */}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{job.company}</div>

      {/* Location + Salary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {job.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--muted)' }}>
            <MapPin size={10} />
            {job.location}
          </div>
        )}
        {job.salary && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--muted)' }}>
            <DollarSign size={10} />
            {job.salary}
          </div>
        )}
      </div>

      {/* Skills */}
      {displaySkills.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {displaySkills.map(skill => (
            <span key={skill} style={{
              fontSize: 10,
              padding: '2px 7px',
              borderRadius: 10,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}>
              {skill}
            </span>
          ))}
          {extraSkills > 0 && (
            <span style={{
              fontSize: 10,
              padding: '2px 7px',
              borderRadius: 10,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--faint)',
            }}>
              +{extraSkills}
            </span>
          )}
        </div>
      )}

      {/* Bottom: Status + Date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusBadge statusId={job.status} size="sm" />
        {job.appliedDate && (
          <span style={{ fontSize: 10, color: 'var(--faint)' }}>
            {new Date(job.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  )
}
