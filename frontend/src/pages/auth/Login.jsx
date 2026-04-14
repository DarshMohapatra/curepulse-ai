import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import useAuthStore from '../../stores/authStore'

const S = {
  page: { minHeight:'100vh', display:'flex', background:'#080d1a' },
  left: { width:'45%', background:'linear-gradient(160deg, #0d1528 0%, #080d1a 100%)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px', position:'relative', overflow:'hidden', borderRight:'1px solid #1a2540' },
  circle1: { position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(201,168,76,0.04)', top:-100, right:-100 },
  circle2: { position:'absolute', width:250, height:250, borderRadius:'50%', background:'rgba(201,168,76,0.03)', bottom:-50, left:-50 },
  logo: { display:'flex', alignItems:'center', gap:12, marginBottom:56 },
  logoIcon: { width:46, height:46, background:'linear-gradient(135deg, #c9a84c, #e8c76a)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 },
  logoText: { color:'#f0f4ff', fontSize:20, fontWeight:700, letterSpacing:'-0.3px' },
  tagline: { color:'#c9a84c', fontSize:12, fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:16 },
  headline: { color:'#f0f4ff', fontSize:34, fontWeight:700, lineHeight:1.25, marginBottom:16, letterSpacing:'-0.5px' },
  subtext: { color:'#4a6080', fontSize:14, lineHeight:1.8, marginBottom:48 },
  statsGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  statCard: { background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:12, padding:'16px 20px' },
  statVal: { color:'#c9a84c', fontSize:22, fontWeight:700 },
  statLabel: { color:'#4a6080', fontSize:12, marginTop:3 },
  right: { flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40 },
  form: { width:'100%', maxWidth:400 },
  formHeader: { marginBottom:32 },
  formTitle: { color:'#f0f4ff', fontSize:26, fontWeight:700, letterSpacing:'-0.3px', marginBottom:6 },
  formSub: { color:'#4a6080', fontSize:14 },
  error: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#f87171', fontSize:13, padding:'12px 16px', borderRadius:10, marginBottom:20 },
  label: { fontSize:13, fontWeight:500, color:'#8896b3', display:'block', marginBottom:6 },
  input: { width:'100%', background:'#0d1528', border:'1.5px solid #1a2540', borderRadius:10, padding:'12px 14px', fontSize:14, color:'#f0f4ff', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' },
  btn: { width:'100%', background:'linear-gradient(135deg, #c9a84c 0%, #e8c76a 100%)', color:'#080d1a', border:'none', borderRadius:10, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', marginTop:8, letterSpacing:'0.02em' },
  divider: { display:'flex', alignItems:'center', gap:12, margin:'24px 0' },
  divLine: { flex:1, height:1, background:'#1a2540' },
  divText: { color:'#2a3a54', fontSize:12 },
  link: { textAlign:'center', fontSize:13, color:'#4a6080', marginTop:20 },
  linkA: { color:'#c9a84c', fontWeight:600, textDecoration:'none' },
  badges: { display:'flex', gap:16, marginTop:40, paddingTop:32, borderTop:'1px solid #1a2540' },
  badge: { display:'flex', alignItems:'center', gap:6, color:'#4a6080', fontSize:12 },
}

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

const handleSubmit = async () => {
  setError('')
  setLoading(true)

  // Aggressively clear everything before login
  localStorage.clear()

  try {
    const res = await authAPI.login(form)
    setAuth(res.data.user, res.data.access_token)
    const role = res.data.user.role
    if (role === 'patient') navigate('/patient/dashboard')
    else if (role === 'mitra') navigate('/mitra/dashboard')
    else if (role === 'doctor') navigate('/doctor/dashboard')
    else navigate('/patient/dashboard')
  } catch (err) {
    setError(err.response?.data?.detail || 'Invalid email or password')
  } finally {
    setLoading(false)
  }
}
  return (
    <div style={S.page}>
      {/* Left */}
      <div style={S.left}>
        <div style={S.circle1} /><div style={S.circle2} />
        <div style={{position:'relative',zIndex:1}}>
          <div style={S.logo}>
            <div style={S.logoIcon}>🏥</div>
            <span style={S.logoText}>CurePulse AI</span>
          </div>
          <div style={S.tagline}>Healthcare Intelligence</div>
          <h1 style={S.headline}>AI-powered care<br/>for everyone</h1>
          <p style={S.subtext}>
            Unified diagnostics, vitals monitoring, and teleconsultation 
          </p>
          <div style={S.statsGrid}>
            {[
              {value:'6', label:'ML Models Integrated'},
              {value:'30', label:'AI/Web Features'},
              {value:'3', label:'User Roles'},
              {value:'6', label:'Tech Stacks Combined'},
            ].map(s => (
              <div key={s.label} style={S.statCard}>
                <div style={S.statVal}>{s.value}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={S.right}>
        <div style={S.form}>
          <div style={S.formHeader}>
            <h2 style={S.formTitle}>Welcome back</h2>
            <p style={S.formSub}>Sign in to your CurePulse account</p>
          </div>

          {error && <div style={S.error}>{error}</div>}

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={S.label}>Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@curebay.com" style={S.input}
                onFocus={e => e.target.style.borderColor='#c9a84c'}
                onBlur={e => e.target.style.borderColor='#1a2540'} />
            </div>
            <div>
              <label style={S.label}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" style={S.input}
                onFocus={e => e.target.style.borderColor='#c9a84c'}
                onBlur={e => e.target.style.borderColor='#1a2540'} />
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{...S.btn, opacity:loading?0.7:1}}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </div>

          <p style={{ textAlign:'right', marginTop:10, marginBottom:0 }}>
            <a href="/forgot-password" style={{ color:'#c9a84c', fontSize:12, textDecoration:'none', fontWeight:500 }}>
              Forgot password?
            </a>
          </p>

          <div style={S.divider}>
            <div style={S.divLine}/><span style={S.divText}>OR</span><div style={S.divLine}/>
          </div>

          <p style={S.link}>
            Don't have an account?{' '}
            <a href="/signup" style={S.linkA}>Create one</a>
          </p>

          <div style={S.badges}>
            {['🔒 End-to-end encrypted', '🏥 HIPAA-aligned', '🇮🇳 Made for India'].map(b => (
              <div key={b} style={S.badge}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}