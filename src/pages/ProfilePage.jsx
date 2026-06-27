import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Plus, X, GitBranch, Link2, Globe, Upload, Briefcase, MapPin } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'

const DEFAULT_PROFILE = {
  name: 'Arjun Sharma',
  title: 'Senior Frontend Engineer',
  location: 'Bangalore, India',
  bio: 'Passionate frontend engineer with 5+ years building scalable web applications. Love creating great user experiences.',
  skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS', 'Node.js', 'Figma', 'Jest'],
  github: 'github.com/arjunsharma',
  linkedin: 'linkedin.com/in/arjunsharma',
  portfolio: 'arjunsharma.dev',
  experience: [
    { id: 'e1', company: 'Razorpay', role: 'Frontend Engineer II', period: 'Jan 2022 – Present', desc: 'Built core payment UI components serving 10M+ users.' },
    { id: 'e2', company: 'Swiggy',   role: 'Frontend Developer',   period: 'Jun 2020 – Dec 2021', desc: 'Worked on consumer-facing restaurant discovery flow.' },
  ],
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useLocalStorage('jf_profile', DEFAULT_PROFILE)
  const [editingSkill, setEditingSkill] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState(profile)
  const [dragOver, setDragOver] = useState(false)

  function addSkill() {
    if (!newSkill.trim()) return
    setProfile(p => ({ ...p, skills: [...(p.skills || []), newSkill.trim()] }))
    setNewSkill('')
    setEditingSkill(false)
  }

  function removeSkill(skill) {
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))
  }

  function saveProfile() {
    setProfile(editForm)
    setEditMode(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Profile"
        subtitle="Manage your professional information"
        action={
          <button
            onClick={() => editMode ? saveProfile() : setEditMode(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: editMode ? 'var(--green)' : 'var(--accent)',
              border: 'none', color: '#fff', cursor: 'pointer',
            }}
          >
            <Edit3 size={14} />
            {editMode ? 'Save Profile' : 'Edit Profile'}
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Avatar card */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '28px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 14px',
              background: 'linear-gradient(135deg, #7C5CFC, #5B4BCC)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#fff',
              boxShadow: '0 8px 24px #7C5CFC40',
            }}>
              {(profile.name || user?.name || 'U')[0]}
            </div>

            {editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  style={{ textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text)', fontSize: 15, fontWeight: 700 }} />
                <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  style={{ textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--muted)', fontSize: 12 }} />
                <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                  style={{ textAlign: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--muted)', fontSize: 12 }} />
              </div>
            ) : (
              <>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{profile.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{profile.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12, color: 'var(--faint)' }}>
                  <MapPin size={11} /> {profile.location}
                </div>
              </>
            )}
          </div>

          {/* Portfolio links */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Portfolio Links</div>
            {[
              { icon: GitBranch, label: 'GitHub',   key: 'github'    },
              { icon: Link2,    label: 'LinkedIn',  key: 'linkedin'  },
              { icon: Globe,    label: 'Portfolio', key: 'portfolio' },
            ].map(({ icon: Icon, label, key }) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 0', borderBottom: '1px solid var(--border)',
              }}>
                <Icon size={14} color="var(--muted)" />
                {editMode ? (
                  <input value={editForm[key]} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 12 }} />
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--accent)', flex: 1 }}>{profile[key]}</span>
                )}
              </div>
            ))}
          </div>

          {/* Resume upload */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false) }}
            style={{
              background: dragOver ? 'var(--accent-low)' : 'var(--surface)',
              border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 12, padding: '24px 16px', textAlign: 'center',
              transition: 'all 0.15s', cursor: 'pointer',
            }}
          >
            <Upload size={24} color="var(--faint)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>Upload Resume</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Drag & drop or click to upload PDF, DOCX</div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Bio */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>About</div>
            {editMode ? (
              <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                rows={3} style={{
                  width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', resize: 'vertical',
                }} />
            ) : (
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{profile.bio}</p>
            )}
          </div>

          {/* Skills */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Skills</div>
              <button onClick={() => setEditingSkill(true)} style={{
                background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer',
                fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Plus size={13} /> Add skill
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(profile.skills || []).map(skill => (
                <span key={skill} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 12px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                  background: 'var(--accent-low)', border: '1px solid #7C5CFC30', color: 'var(--accent)',
                }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} style={{
                    background: 'none', border: 'none', color: 'var(--accent)',
                    cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center',
                  }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              {editingSkill && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    autoFocus
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addSkill(); if (e.key === 'Escape') setEditingSkill(false) }}
                    placeholder="New skill"
                    style={{
                      padding: '5px 10px', borderRadius: 10, fontSize: 12,
                      background: 'var(--surface2)', border: '1px solid var(--accent)',
                      color: 'var(--text)', outline: 'none', width: 100,
                    }}
                  />
                  <button onClick={addSkill} style={{
                    padding: '5px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                    background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer',
                  }}>Add</button>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Experience</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(profile.experience || []).map((exp, i) => (
                <div key={exp.id} style={{
                  display: 'flex', gap: 14,
                  paddingBottom: i < profile.experience.length - 1 ? 20 : 0,
                }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: 'var(--accent)', border: '2px solid var(--surface)',
                      boxShadow: '0 0 0 2px var(--accent)',
                      marginTop: 4, flexShrink: 0,
                    }} />
                    {i < profile.experience.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 8 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Briefcase size={13} color="var(--accent)" />
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{exp.role}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 2 }}>{exp.company}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{exp.period}</div>
                    <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
