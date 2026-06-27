import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, Building2 } from 'lucide-react'
import { calendarEvents } from '../data/mockData'
import PageHeader from '../components/ui/PageHeader'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const EVENT_COLORS = {
  interview: { color: '#26C28E', bg: '#26C28E14', border: '#26C28E30' },
  followup:  { color: '#E8A838', bg: '#E8A83814', border: '#E8A83830' },
  deadline:  { color: '#E5534B', bg: '#E5534B14', border: '#E5534B30' },
  offer:     { color: '#7C5CFC', bg: '#7C5CFC14', border: '#7C5CFC30' },
}

function getEventsForDate(dateStr) {
  return calendarEvents.filter(e => e.date === dateStr)
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarPage() {
  const now = new Date()
  const [viewYear, setViewYear] = useState(2024)
  const [viewMonth, setViewMonth] = useState(0) // 0 = January
  const [selectedDate, setSelectedDate] = useState(null)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []
  const allUpcomingEvents = calendarEvents.slice().sort((a, b) => a.date.localeCompare(b.date))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Calendar"
        subtitle="Track interviews, deadlines, and follow-ups"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Calendar */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '24px', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <button onClick={prevMonth} style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--muted)',
              display: 'flex', alignItems: 'center',
            }}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <button onClick={nextMonth} style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--muted)',
              display: 'flex', alignItems: 'center',
            }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            marginBottom: 8,
          }}>
            {DAYS.map(day => (
              <div key={day} style={{
                textAlign: 'center', fontSize: 11, fontWeight: 600,
                color: 'var(--muted)', padding: '4px 0',
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = formatDate(viewYear, viewMonth, day)
              const events = getEventsForDate(dateStr)
              const isToday = day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear()
              const isSelected = selectedDate === dateStr

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  style={{
                    padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                    textAlign: 'center', minHeight: 52, position: 'relative',
                    background: isSelected ? 'var(--accent-low)' : isToday ? 'var(--surface2)' : 'transparent',
                    border: `1px solid ${isSelected ? '#7C5CFC40' : isToday ? 'var(--border2)' : 'transparent'}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--surface2)' }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? 'var(--surface2)' : 'transparent' }}
                >
                  <div style={{
                    fontSize: 13, fontWeight: isToday ? 700 : 400,
                    color: isSelected ? 'var(--accent)' : isToday ? 'var(--text)' : 'var(--text)',
                    marginBottom: 4,
                  }}>
                    {day}
                  </div>
                  {events.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                      {events.slice(0, 2).map((ev, ei) => {
                        const c = EVENT_COLORS[ev.type] || EVENT_COLORS.interview
                        return (
                          <div key={ei} style={{
                            width: '80%', height: 4, borderRadius: 2, background: c.color,
                          }} />
                        )
                      })}
                      {events.length > 2 && (
                        <div style={{ fontSize: 9, color: 'var(--muted)' }}>+{events.length - 2}</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Events panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Selected date events */}
          {selectedDate && (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--accent)',
              borderRadius: 12, padding: '16px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              {selectedEvents.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>No events on this day</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedEvents.map(ev => {
                    const c = EVENT_COLORS[ev.type] || EVENT_COLORS.interview
                    return (
                      <div key={ev.id} style={{
                        padding: '10px 12px', borderRadius: 8,
                        background: c.bg, border: `1px solid ${c.border}`,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: c.color }}>{ev.title}</div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
                            <Building2 size={10} /> {ev.company}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
                            <Clock size={10} /> {ev.time}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Upcoming events */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>
              Upcoming Events
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allUpcomingEvents.map(ev => {
                const c = EVENT_COLORS[ev.type] || EVENT_COLORS.interview
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedDate(ev.date)}
                    style={{
                      padding: '10px 12px', borderRadius: 8,
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{ev.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
                          <Calendar size={9} />
                          {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {ev.time}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: c.color,
                        background: c.bg, padding: '2px 8px', borderRadius: 10,
                        textTransform: 'capitalize', flexShrink: 0,
                      }}>
                        {ev.type}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10 }}>Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(EVENT_COLORS).map(([type, c]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color }} />
                  <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
