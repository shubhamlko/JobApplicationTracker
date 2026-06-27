import { statusMap } from '../../constants/statuses'

export default function StatusBadge({ statusId, size = 'sm' }) {
  const s = statusMap[statusId]
  if (!s) return null

  const padding = size === 'lg' ? '5px 12px' : size === 'md' ? '4px 10px' : '2px 8px'
  const fontSize = size === 'lg' ? 14 : size === 'md' ? 13 : 11
  const dotSize = size === 'lg' ? 8 : 6

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding,
      borderRadius: 20,
      fontSize,
      fontWeight: 500,
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.color}22`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: dotSize,
        height: dotSize,
        borderRadius: '50%',
        background: s.color,
        flexShrink: 0,
      }} />
      {s.label}
    </span>
  )
}
