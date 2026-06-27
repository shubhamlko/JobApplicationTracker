import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Briefcase, MapPin, Clock, Trash2, Users } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from '../components/ui/PageHeader'

const schema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.string().min(1, 'Salary range is required'),
  experience: z.string().min(1, 'Experience is required'),
  type: z.enum(['Remote', 'Hybrid', 'Onsite']),
  skills: z.string().min(1, 'Enter at least one skill'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
})

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--border)', background: 'var(--surface2)',
  color: 'var(--text)', fontSize: 13, outline: 'none',
}

export default function RecruiterPage() {
  const [activeTab, setActiveTab] = useState('post')
  const [postings, setPostings] = useLocalStorage('jf_recruiter_jobs', [])
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'Remote' },
  })

  function onSubmit(data) {
    const newJob = {
      ...data,
      id: crypto.randomUUID(),
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      posted: 'Just now',
      applicants: 0,
      createdAt: new Date().toISOString(),
    }
    setPostings(prev => [newJob, ...prev])
    setSuccess(true)
    reset()
    setTimeout(() => setSuccess(false), 3000)
  }

  function deletePosting(id) {
    setPostings(prev => prev.filter(j => j.id !== id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Recruiter Panel"
        subtitle="Post jobs and manage your listings"
      />

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 28,
      }}>
        {[
          { id: 'post',     label: 'Post a Job',   icon: Plus    },
          { id: 'listings', label: 'My Postings',  icon: Briefcase },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--muted)',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.id === 'listings' && postings.length > 0 && (
              <span style={{
                background: activeTab === 'listings' ? '#ffffff30' : 'var(--surface2)',
                color: activeTab === 'listings' ? '#fff' : 'var(--muted)',
                fontSize: 10, fontWeight: 700,
                padding: '1px 6px', borderRadius: 10,
              }}>
                {postings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'post' ? (
          <motion.div
            key="post"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '28px', maxWidth: 680,
            }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>
                Post a New Job
              </div>

              {success && (
                <div style={{
                  padding: '12px 16px', borderRadius: 8, marginBottom: 20,
                  background: '#26C28E14', border: '1px solid #26C28E30',
                  fontSize: 13, color: 'var(--green)',
                }}>
                  Job posted successfully! It will appear in My Postings.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Company *</label>
                    <input {...register('company')} placeholder="e.g. Stripe" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    {errors.company && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.company.message}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Role *</label>
                    <input {...register('role')} placeholder="e.g. Senior Frontend Engineer" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    {errors.role && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.role.message}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Location *</label>
                    <input {...register('location')} placeholder="e.g. Bangalore / Remote" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    {errors.location && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.location.message}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Salary Range *</label>
                    <input {...register('salary')} placeholder="e.g. ₹30–40 LPA" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    {errors.salary && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.salary.message}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Experience Required *</label>
                    <input {...register('experience')} placeholder="e.g. 3-5 yrs" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    {errors.experience && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.experience.message}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Work Type *</label>
                    <select {...register('type')} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="Remote" style={{ background: 'var(--surface2)' }}>Remote</option>
                      <option value="Hybrid" style={{ background: 'var(--surface2)' }}>Hybrid</option>
                      <option value="Onsite" style={{ background: 'var(--surface2)' }}>Onsite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Skills Required *</label>
                  <input {...register('skills')} placeholder="e.g. React, TypeScript, Node.js" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  {errors.skills && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.skills.message}</p>}
                  <p style={{ fontSize: 11, color: 'var(--faint)', marginTop: 3 }}>Comma separated</p>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Job Description *</label>
                  <textarea {...register('description')} placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  {errors.description && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 3 }}>{errors.description.message}</p>}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => reset()} style={{
                    padding: '11px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer',
                  }}>
                    Reset
                  </button>
                  <button type="submit" style={{
                    flex: 1, padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <Plus size={15} /> Post Job
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="listings"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {postings.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 12, padding: '80px 20px', color: 'var(--muted)',
              }}>
                <Users size={48} color="var(--faint)" />
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>No postings yet</div>
                <div style={{ fontSize: 13 }}>Post your first job to see it here</div>
                <button onClick={() => setActiveTab('post')} style={{
                  padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer',
                }}>
                  Post a Job
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {postings.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                    style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 12, padding: '20px 24px',
                      display: 'flex', alignItems: 'center', gap: 16,
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: 'var(--accent-low)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
                    }}>
                      {job.company[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{job.role}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{job.company}</div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
                          <MapPin size={11} /> {job.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
                          <Briefcase size={11} /> {job.experience}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{job.salary}</div>
                        <span style={{
                          fontSize: 11, padding: '1px 8px', borderRadius: 10,
                          background: 'var(--accent-low)', color: 'var(--accent)',
                          border: '1px solid #7C5CFC30',
                        }}>
                          {job.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                        {(Array.isArray(job.skills) ? job.skills : job.skills?.split(',') || []).slice(0, 4).map(skill => (
                          <span key={skill} style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 10,
                            background: 'var(--surface2)', border: '1px solid var(--border)',
                            color: 'var(--muted)',
                          }}>{skill.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--faint)' }}>
                        <Clock size={11} /> {job.posted}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{job.applicants}</span> applicants
                      </div>
                      <button
                        onClick={() => deletePosting(job.id)}
                        style={{
                          padding: '6px 10px', borderRadius: 6,
                          background: '#E5534B14', border: '1px solid #E5534B30',
                          color: 'var(--red)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
