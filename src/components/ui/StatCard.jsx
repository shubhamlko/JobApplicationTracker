export default function StatCard({ label, value, color, icon: Icon, trend }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: color || 'var(--accent)',
        borderRadius: '12px 12px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {Icon && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${color || 'var(--accent)'}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={16} color={color || 'var(--accent)'} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <span style={{
          fontSize: 32,
          fontWeight: 700,
          color: color || 'var(--text)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {value}
        </span>
        {trend && (
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: trend.startsWith('+') ? 'var(--green)' : 'var(--red)',
            marginBottom: 3,
          }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
