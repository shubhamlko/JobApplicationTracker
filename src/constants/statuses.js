export const STATUSES = [
  { id: 'saved',      label: 'Saved',       color: '#8899B5', bg: '#8899B514' },
  { id: 'applied',    label: 'Applied',     color: '#7C6FF7', bg: '#7C6FF714' },
  { id: 'screening',  label: 'Screening',   color: '#E8A838', bg: '#E8A83814' },
  { id: 'assignment', label: 'Assignment',  color: '#F59E0B', bg: '#F59E0B14' },
  { id: 'interview',  label: 'Interview',   color: '#26C28E', bg: '#26C28E14' },
  { id: 'hr_round',   label: 'HR Round',    color: '#8B5CF6', bg: '#8B5CF614' },
  { id: 'offer',      label: 'Offer 🎉',   color: '#3ECF8E', bg: '#3ECF8E14' },
  { id: 'hired',      label: 'Hired ✅',   color: '#10B981', bg: '#10B98114' },
  { id: 'rejected',   label: 'Rejected',    color: '#E5534B', bg: '#E5534B14' },
]

export const statusMap = Object.fromEntries(STATUSES.map(s => [s.id, s]))
