import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

export default function DoctorDashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const navigate = useNavigate()

  useEffect(() => { loadFromStorage() }, [])
  const handleLogout = () => { logout(); navigate('/') }

  const stats = [
    { label:'Consultations Today', value:'0', icon:'📹', color:'#8b5cf6' },
    { label:'Pending Reviews', value:'0', icon:'📋', color:'#c9a84c' },
    { label:'Active Patients', value:'0', icon:'👥', color:'#10b981' },
    { label:'Alerts', value:'0', icon:'🚨', color:'#ef4444' },
  ]

  const actions = [
    { title:'Teleconsult Queue', desc:'Upcoming video consultations', icon:'📹', phase:'Phase 3', available:false },
    { title:'Patient Search', desc:'Find and view patient records', icon:'🔍', phase:'Phase 1', available:false },
    { title:'Pre-Consult Brief', desc:'AI summary before teleconsult', icon:'🤖', phase:'Phase 3', available:false },
    { title:'SOAP Notes', desc:'AI-generated clinical notes', icon:'📝', phase:'Phase 3', available:false },
    { title:'Prescription Builder', desc:'Write prescriptions with drug checks', icon:'💊', phase:'Phase 3', available:false },
    { title:'Analytics Dashboard', desc:'Your consultation metrics', icon:'📈', phase:'Phase 6', available:false },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#080d1a', color:'#f0f4ff' }}>

      {/* Navbar */}
      <div style={{ background:'#0a0f1e', borderBottom:'1px solid #1a2540', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontWeight:700, fontSize:16 }}>CurePulse AI</span>
          <span style={{ width:1, height:20, background:'#1a2540', margin:'0 12px' }} />
          <span style={{ fontSize:13, color:'#4a6080' }}>Doctor Portal</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white' }}>
              {user?.full_name?.charAt(0) || 'D'}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#f0f4ff' }}>Dr. {user?.full_name}</div>
              <div style={{ fontSize:11, color:'#4a6080' }}>Doctor</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:12, padding:'6px 14px', borderRadius:8, cursor:'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding:'32px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>
              Good morning, Dr. {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize:14, color:'#4a6080' }}>Your AI-enhanced clinical workspace</p>
          </div>
          <div style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:10, padding:'8px 16px', textAlign:'right' }}>
            <div style={{ fontSize:11, color:'#8b5cf6', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>Status</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#8b5cf6', marginTop:2 }}>Available ✓</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:14, padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <span style={{ fontSize:22 }}>{s.icon}</span>
                <span style={{ fontSize:11, color:s.color, background:`${s.color}22`, padding:'2px 8px', borderRadius:10, fontWeight:600 }}>Today</span>
              </div>
              <div style={{ fontSize:32, fontWeight:700, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#4a6080', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two column */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>

          {/* Actions */}
          <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:15, fontWeight:600 }}>Clinical Tools</h2>
              <span style={{ fontSize:12, color:'#4a6080' }}>AI-enhanced</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {actions.map(a => (
                <div key={a.title}
                  style={{ background:'#080d1a', border:'1px solid #1a2540', borderRadius:12, padding:16, opacity:0.6 }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{a.icon}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#f0f4ff', marginBottom:3 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:'#4a6080', marginBottom:8 }}>{a.desc}</div>
                  <div style={{ fontSize:10, color:'#4a6080', background:'rgba(255,255,255,0.04)', padding:'2px 6px', borderRadius:4, display:'inline-block' }}>
                    {a.phase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Next consult */}
            <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Next Consultation</h3>
              <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.15)', borderRadius:10, padding:14 }}>
                <div style={{ fontSize:12, color:'#8b5cf6', fontWeight:600, marginBottom:4 }}>📹 Teleconsult</div>
                <div style={{ fontSize:13, color:'#f0f4ff', fontWeight:500 }}>No upcoming</div>
                <div style={{ fontSize:12, color:'#4a6080', marginTop:2 }}>Scheduling in Phase 3</div>
              </div>
            </div>

            {/* AI features preview */}
            <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>AI Features (Phase 3)</h3>
              {[
                { label:'Live transcription', icon:'🎙️' },
                { label:'Auto SOAP notes', icon:'📝' },
                { label:'Drug interaction check', icon:'💊' },
                { label:'Pre-consult AI brief', icon:'🤖' },
              ].map(f => (
                <div key={f.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #1a2540' }}>
                  <span style={{ fontSize:16 }}>{f.icon}</span>
                  <span style={{ fontSize:13, color:'#4a6080' }}>{f.label}</span>
                  <span style={{ marginLeft:'auto', fontSize:11, color:'#2a3a54' }}>Soon</span>
                </div>
              ))}
            </div>

            {/* Role info */}
            <div style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.15)', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:13, fontWeight:600, color:'#8b5cf6', marginBottom:10 }}>AI-Enhanced Practice</h3>
              <p style={{ fontSize:12, color:'#4a6080', lineHeight:1.7 }}>
                CurePulse AI handles transcription, note-taking, and drug checks — so you can focus entirely on your patient.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}