import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext, closestCenter, DragOverlay,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Search, Plus } from 'lucide-react'
import { STATUSES } from '../constants/statuses'
import { useAppContext } from '../context/AppContext'
import KanbanCard from '../components/jobs/KanbanCard'
import JobDetailDrawer from '../components/jobs/JobDetailDrawer'
import PageHeader from '../components/ui/PageHeader'

function AddJobModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    company: '', role: '', location: '', salary: '',
    status: 'applied', skills: '', notes: '', description: '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.company || !form.role) return
    onAdd({
      ...form,
      id: crypto.randomUUID(),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      appliedDate: new Date().toISOString().split('T')[0],
      matchScore: Math.floor(Math.random() * 20 + 70),
      logo: form.company[0].toUpperCase(),
    })
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--surface2)',
    color: 'var(--text)', fontSize: 13, outline: 'none',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 14,
          border: '1px solid var(--border)',
          padding: '24px', width: 520, maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
          Add New Application
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input placeholder="Company *" value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              style={inputStyle} required />
            <input placeholder="Role *" value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              style={inputStyle} required />
            <input placeholder="Location" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              style={inputStyle} />
            <input placeholder="Salary (e.g. ₹30 LPA)" value={form.salary}
              onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
              style={inputStyle} />
          </div>
          <input placeholder="Skills (comma separated)" value={form.skills}
            onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
            style={inputStyle} />
          <select value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            style={{ ...inputStyle, cursor: 'pointer' }}>
            {STATUSES.map(s => (
              <option key={s.id} value={s.id} style={{ background: 'var(--surface2)' }}>{s.label}</option>
            ))}
          </select>
          <textarea placeholder="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <textarea placeholder="Notes" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)',
              cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 2, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer',
            }}>Add Application</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function ApplicationsPage() {
  const { jobs, dispatch } = useAppContext()
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const filtered = jobs.filter(j =>
    !search ||
    j.role?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  )

  function handleDragStart(event) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    // Check if dropped on a column
    const overStatus = STATUSES.find(s => s.id === over.id)
    if (overStatus) {
      dispatch({ type: 'MOVE', id: active.id, status: overStatus.id })
      return
    }

    // Check if dropped on another card (find that card's status)
    const overJob = jobs.find(j => j.id === over.id)
    if (overJob && overJob.id !== active.id) {
      dispatch({ type: 'MOVE', id: active.id, status: overJob.status })
    }
  }

  const activeJob = jobs.find(j => j.id === activeId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <PageHeader
        title="Applications"
        subtitle="Drag cards between columns to update status"
        action={
          <button
            onClick={() => setAddOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer',
            }}
          >
            <Plus size={15} /> Add Application
          </button>
        }
      />

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '8px 12px', marginBottom: 20, width: 300,
      }}>
        <Search size={14} color="var(--faint)" />
        <input
          placeholder="Search applications..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', flex: 1 }}
        />
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          paddingBottom: 20, flex: 1,
        }}>
          {STATUSES.map(status => {
            const colJobs = filtered.filter(j => j.status === status.id)
            return (
              <div
                key={status.id}
                id={status.id}
                style={{
                  minWidth: 240, maxWidth: 240, flexShrink: 0,
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {/* Column header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 6px', marginBottom: 8,
                  borderBottom: `2px solid ${status.color}44`,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{status.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: status.color, background: status.bg,
                    padding: '1px 7px', borderRadius: 10,
                  }}>
                    {colJobs.length}
                  </span>
                </div>

                {/* Drop zone */}
                <SortableContext items={colJobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
                  <div
                    style={{
                      flex: 1, minHeight: 60,
                      background: colJobs.length === 0 ? 'var(--surface)' : 'transparent',
                      border: colJobs.length === 0 ? `1px dashed ${status.color}33` : 'none',
                      borderRadius: 8,
                    }}
                  >
                    {colJobs.map(job => (
                      <KanbanCard
                        key={job.id}
                        job={job}
                        onClick={() => setSelectedJob(job)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            )
          })}
        </div>

        <DragOverlay>
          {activeJob && (
            <div style={{ transform: 'rotate(3deg)', opacity: 0.9 }}>
              <KanbanCard job={activeJob} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Job Detail Drawer */}
      {selectedJob && (
        <JobDetailDrawer
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Add Job Modal */}
      {addOpen && (
        <AddJobModal
          onClose={() => setAddOpen(false)}
          onAdd={job => dispatch({ type: 'ADD', job })}
        />
      )}
    </motion.div>
  )
}
