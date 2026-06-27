import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Briefcase, TrendingUp, Shield, Zap, GitBranch } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  rememberMe: z.boolean().optional(),
})

const FEATURES = [
  { icon: TrendingUp, text: 'Track all your applications in one beautiful kanban board' },
  { icon: Zap,        text: 'AI-powered resume match scores and suggestions' },
  { icon: Shield,     text: 'Private, secure, and always in sync' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'demo@jobflow.ai', password: '123456', rememberMe: false },
  })

  async function onSubmit(data) {
    setLoading(true)
    setApiError('')
    await new Promise(r => setTimeout(r, 600))
    const result = login(data.email, data.password)
    if (!result.success) {
      setApiError(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg)',
    }}>
      {/* Left — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0E0E14 0%, #16161E 50%, #1a1530 100%)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #7C5CFC18 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -50,
          right: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #26C28E10 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7C5CFC, #5B4BCC)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px #7C5CFC40',
          }}>
            <Briefcase size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
              JobFlow AI
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>BETA</div>
          </div>
        </div>

        <h1 style={{
          fontSize: 38,
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: 16,
        }}>
          Your career,<br />
          <span style={{ color: 'var(--accent)' }}>organized</span><br />
          beautifully.
        </h1>

        <p style={{
          fontSize: 15,
          color: 'var(--muted)',
          lineHeight: 1.6,
          marginBottom: 40,
          maxWidth: 340,
        }}>
          Stop losing track of applications. JobFlow AI gives you a beautiful command center for your job search.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FEATURES.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--accent-low)',
                border: '1px solid #7C5CFC30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={15} color="var(--accent)" />
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginTop: 6 }}>{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right — Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: 460,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 50px',
          background: 'var(--surface)',
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
          Sign in to your account to continue
        </p>

        {/* Social login */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Google', icon: '🌐' },
            { label: 'GitHub', icon: null, IconComp: GitBranch },
          ].map(({ label, icon, IconComp }) => (
            <button
              key={label}
              type="button"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface2)',
                color: 'var(--text)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {IconComp ? <IconComp size={15} /> : <span>{icon}</span>}
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--faint)' }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              {...register('email')}
              placeholder="you@example.com"
              type="email"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${errors.email ? 'var(--red)' : 'var(--border)'}`,
                background: 'var(--surface2)',
                color: 'var(--text)',
                fontSize: 14,
                outline: 'none',
              }}
            />
            {errors.email && (
              <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${errors.password ? 'var(--red)' : 'var(--border)'}`,
                  background: 'var(--surface2)',
                  color: 'var(--text)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>{errors.password.message}</p>
            )}
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              {...register('rememberMe')}
              type="checkbox"
              id="rememberMe"
              style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}>
              Remember me
            </label>
          </div>

          {apiError && (
            <div style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: '#E5534B14',
              border: '1px solid #E5534B33',
              fontSize: 13,
              color: 'var(--red)',
            }}>
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: 8,
              border: 'none',
              background: loading ? 'var(--faint)' : 'var(--accent)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 14,
                  height: 14,
                  border: '2px solid #ffffff44',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: 24,
          padding: '12px',
          borderRadius: 8,
          background: 'var(--accent-low)',
          border: '1px solid #7C5CFC30',
          fontSize: 12,
          color: 'var(--muted)',
          lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Demo credentials:</span><br />
          Email: <code style={{ color: 'var(--text)' }}>demo@jobflow.ai</code> / Password: <code style={{ color: 'var(--text)' }}>123456</code>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
