import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import useAuthStore from '../../stores/authStore'

const inputStyle = {
  width:'100%',
  background:'#0d1528',
  border:'1.5px solid #1a2540',
  borderRadius:10,
  padding:'12px 14px',
  fontSize:14,
  color:'#f0f4ff',
  outline:'none',
  boxSizing:'border-box',
  transition:'border-color 0.2s'
}

export default function Signup() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [form, setForm] = useState({ full_name:'', email:'', password:'', role:'patient' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.full_name || !form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await authAPI.signup(form)
      setAuth(res.data.user, res.data.access_token)
      const role = res.data.user.role
      if (role === 'patient') navigate('/patient/dashboard')
      else if (role === 'mitra') navigate('/mitra/dashboard')
      else if (role === 'doctor') navigate('/doctor/dashboard')
      else navigate('/patient/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', background:'#080d1a'}}>

      {/* Left branding panel */}
      <div style={{
        width:'42%',
        background:'linear-gradient(160deg, #0d1528 0%, #080d1a 100%)',
        borderRight:'1px solid #1a2540',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        padding:'60px',
        position:'relative',
        overflow:'hidden'
      }}>
        {/* Decorative glow */}
        <div style={{position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(201,168,76,0.04)', filter:'blur(80px)', top:-100, right:-100, pointerEvents:'none'}} />
        <div style={{position:'absolute', width:250, height:250, borderRadius:'50%', background:'rgba(201,168,76,0.03)', filter:'blur(60px)', bottom:-50, left:-50, pointerEvents:'none'}} />

        <div style={{position:'relative', zIndex:1}}>
          {/* Logo */}
          <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:52}}>
            <div style={{width:46, height:46, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22}}>🏥</div>
            <span style={{color:'#f0f4ff', fontSize:20, fontWeight:700, letterSpacing:'-0.3px'}}>CurePulse AI</span>
          </div>

          <div style={{fontSize:12, fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:'#c9a84c', marginBottom:14}}>Join the platform</div>
          <h1 style={{color:'#f0f4ff', fontSize:32, fontWeight:700, lineHeight:1.25, marginBottom:16, letterSpacing:'-0.5px'}}>
            Your health journey<br/>starts here
          </h1>
          <p style={{color:'#4a6080', fontSize:14, lineHeight:1.8, marginBottom:40}}>
            Access AI diagnostics, real-time monitoring, and expert teleconsultations — all in one intelligent platform.
          </p>

          {/* Role cards */}
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {[
              { role:'Patient', desc:'View vitals, reports & consultations', icon:'👤' },
              { role:'Swasthya Mitra', desc:'Manage patients & enter vitals', icon:'🩺' },
              { role:'Doctor', desc:'Teleconsult with AI assistance', icon:'👨‍⚕️' },
            ].map(r => (
              <div key={r.role} style={{
                display:'flex',
                alignItems:'center',
                gap:14,
                background:'rgba(201,168,76,0.05)',
                border:'1px solid rgba(201,168,76,0.1)',
                borderRadius:12,
                padding:'14px 16px',
                cursor:'default'
              }}>
                <span style={{fontSize:20}}>{r.icon}</span>
                <div>
                  <div style={{color:'#c9a84c', fontSize:13, fontWeight:600}}>{r.role}</div>
                  <div style={{color:'#4a6080', fontSize:12, marginTop:2}}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{display:'flex', gap:16, marginTop:36, paddingTop:28, borderTop:'1px solid #1a2540'}}>
            {['🔒 Secure', '🇮🇳 Made in India', '❤️ Free'].map(b => (
              <span key={b} style={{fontSize:12, color:'#2a3a54'}}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40}}>
        <div style={{width:'100%', maxWidth:400}}>

          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:26, fontWeight:700, color:'#f0f4ff', letterSpacing:'-0.3px', marginBottom:6}}>Create your account</h2>
            <p style={{fontSize:14, color:'#4a6080'}}>Fill in your details to get started</p>
          </div>

          {error && (
            <div style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#f87171', fontSize:13, padding:'12px 16px', borderRadius:10, marginBottom:20}}>
              {error}
            </div>
          )}

          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            <div>
              <label style={{fontSize:13, fontWeight:500, color:'#8896b3', display:'block', marginBottom:6}}>Full Name</label>
              <input
                type="text" name="full_name" value={form.full_name}
                onChange={handleChange} placeholder="Darsh Mohapatra"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor='#c9a84c'}
                onBlur={e => e.target.style.borderColor='#1a2540'}
              />
            </div>

            <div>
              <label style={{fontSize:13, fontWeight:500, color:'#8896b3', display:'block', marginBottom:6}}>Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@gmail.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor='#c9a84c'}
                onBlur={e => e.target.style.borderColor='#1a2540'}
              />
            </div>

            <div>
              <label style={{fontSize:13, fontWeight:500, color:'#8896b3', display:'block', marginBottom:6}}>Role</label>
              <select
                name="role" value={form.role} onChange={handleChange}
                style={{...inputStyle, background:'#0d1528', cursor:'pointer'}}
                onFocus={e => e.target.style.borderColor='#c9a84c'}
                onBlur={e => e.target.style.borderColor='#1a2540'}
              >
                <option value="patient" style={{background:'#0d1528'}}>Patient</option>
                <option value="mitra" style={{background:'#0d1528'}}>Swasthya Mitra</option>
                <option value="doctor" style={{background:'#0d1528'}}>Doctor</option>
              </select>
            </div>

            <div>
              <label style={{fontSize:13, fontWeight:500, color:'#8896b3', display:'block', marginBottom:6}}>Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor='#c9a84c'}
                onBlur={e => e.target.style.borderColor='#1a2540'}
              />
            </div>

            <button
              onClick={handleSubmit} disabled={loading}
              style={{
                width:'100%',
                background:'linear-gradient(135deg,#c9a84c,#e8c76a)',
                color:'#080d1a',
                border:'none',
                borderRadius:10,
                padding:'13px',
                fontSize:14,
                fontWeight:700,
                cursor:'pointer',
                marginTop:4,
                opacity:loading ? 0.7 : 1,
                letterSpacing:'0.02em',
                boxShadow:'0 4px 20px rgba(201,168,76,0.25)'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </div>

          <p style={{textAlign:'center', fontSize:13, color:'#4a6080', marginTop:24}}>
            Already have an account?{' '}
            <a href="/login" style={{color:'#c9a84c', fontWeight:600, textDecoration:'none'}}>Sign in</a>
          </p>

          {/* Back to landing */}
          <p style={{textAlign:'center', fontSize:12, color:'#2a3a54', marginTop:12}}>
            <a href="/" style={{color:'#2a3a54', textDecoration:'none'}}
              onMouseEnter={e => e.target.style.color='#4a6080'}
              onMouseLeave={e => e.target.style.color='#2a3a54'}>
              ← Back to home
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}