import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const SIDEBAR_OPEN = 240
const SIDEBAR_CLOSED = 64

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? SIDEBAR_CLOSED : SIDEBAR_OPEN }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          flexShrink: 0,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Sidebar collapsed={collapsed} />
      </motion.div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Navbar onToggleSidebar={() => setCollapsed(v => !v)} />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
