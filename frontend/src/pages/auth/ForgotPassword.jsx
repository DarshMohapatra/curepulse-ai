import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#080d1a' },
  card: { width:'100%', maxWidth:420, background:'#0d1528', border:'1px solid #1a2540', borderRadius:20, padding:'40px 36px' },
  logo: { display:'flex', alignItems:'center', gap:10, marginBottom:32 },
  logoIcon: { width:40, height:40, background:'linear-gradient(135deg, #c9a84c, #e8c76a)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 },
  logoText: { color:'#f0f4ff', fontSize:18, fontWeight:700 },
  title: { color:'#f0f4ff', fontSize:22, fontWeight:700, marginBottom:6 },
  sub: { color:'#4a6080', fontSize:13, marginBottom:28, lineHeight:1.6 },
  label: { fontSize:13, fontWeight:500, color:'#8896b3', display:'block', marginBottom:6 },
  input: { width:'100%', background:'#080d1a', border:'1.5px solid #1a2540', borderRadius:10, padding:'12px 14px', fontSize:14, color:'#f0f4ff', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' },
  btn: { width:'100%', background:'linear-gradient(135deg, #c9a84c, #e8c76a)', color:'#080d1a', border:'none', borderRadius:10, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', marginTop:8 },
  btnDisabled: { opacity:0.7 },
  error: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#f87171', fontSize:13, padding:'12px 16px', borderRadius:10, marginBottom:16 },
  success: { background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#34d399', fontSize:13, padding:'12px 16px', borderRadius:10, marginBottom:16 },
  link: { textAlign:'center', fontSize:13, color:'#4a6080', marginTop:20 },
  linkA: { color:'#c9a84c', fontWeight:600, textDecoration:'none', cursor:'pointer' },
  stepBadge: { display:'inline-block', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.15)', color:'#c9a84c', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, marginBottom:16 },
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // Step 1: enter email, Step 2: enter new password
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerifyEmail = async () => {
    setError('')
    if (!email) { setError('Please enter your email'); return }
    // Just move to step 2 — the actual verification happens on submit
    setStep(2)
  }

  const handleResetPassword = async () => {
    setError('')
    setSuccess('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.resetPassword({ email, new_password: newPassword })
      setSuccess(res.data.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>

        <div style={S.logo}>
          <div style={S.logoIcon}>🏥</div>
          <span style={S.logoText}>CurePulse AI</span>
        </div>

        <div style={S.stepBadge}>Step {step} of 2</div>

        {step === 1 && (
          <>
            <h2 style={S.title}>Reset Password</h2>
            <p style={S.sub}>Enter the email address associated with your account and we'll let you set a new password.</p>

            {error && <div style={S.error}>{error}</div>}

            <div style={{ marginBottom:16 }}>
              <label style={S.label}>Email address</label>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@curebay.com" style={S.input}
                onFocus={e => e.target.style.borderColor='#c9a84c'}
                onBlur={e => e.target.style.borderColor='#1a2540'}
              />
            </div>

            <button onClick={handleVerifyEmail} style={S.btn}>
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={S.title}>Set New Password</h2>
            <p style={S.sub}>
              Resetting password for <span style={{ color:'#c9a84c', fontWeight:600 }}>{email}</span>
            </p>

            {error && <div style={S.error}>{error}</div>}
            {success && <div style={S.success}>{success}</div>}

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={S.label}>New Password</label>
                <input
                  type="password" value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setError('') }}
                  placeholder="Min 6 characters" style={S.input}
                  onFocus={e => e.target.style.borderColor='#c9a84c'}
                  onBlur={e => e.target.style.borderColor='#1a2540'}
                />
              </div>
              <div>
                <label style={S.label}>Confirm New Password</label>
                <input
                  type="password" value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                  placeholder="Re-enter password" style={S.input}
                  onFocus={e => e.target.style.borderColor='#c9a84c'}
                  onBlur={e => e.target.style.borderColor='#1a2540'}
                />
              </div>
              <button onClick={handleResetPassword} disabled={loading}
                style={{...S.btn, ...(loading ? S.btnDisabled : {})}}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            <p style={{ ...S.link, marginTop:12 }}>
              <span style={S.linkA} onClick={() => { setStep(1); setError(''); setSuccess('') }}>
                 Use a different email
              </span>
            </p>
          </>
        )}

        <p style={S.link}>
          Remember your password?{' '}
          <a href="/login" style={S.linkA}>Sign in</a>
        </p>

      </div>
    </div>
  )
}
