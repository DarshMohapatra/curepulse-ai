import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

export default function MitraDashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const navigate = useNavigate()

  useEffect(() => { loadFromStorage() }, [])
  const handleLogout = () => { logout(); navigate('/') }

  const stats = [
    { label:'Assigned Patients', value:'0', icon:'👥', color:'#c9a84c' },
    { label:'Vitals Recorded Today', value:'0', icon:'📊', color:'#10b981' },
    { label:'Pending Alerts', value:'0', icon:'🚨', color:'#ef4444' },
    { label:'Upcoming Visits', value:'0', icon:'📅', color:'#3b82f6' },
  ]

  const actions = [
    { title:'Record Patient Vitals', desc:'Enter vitals for an assigned patient', icon:'📊', phase:'Phase 1', available:true, path:'/patient/vitals/entry' },
    { title:'Patient List', desc:'View all assigned patients', icon:'👥', phase:'Phase 1', available:false, path:null },
    { title:'Risk Queue', desc:'Patients sorted by deterioration risk', icon:'⚡', phase:'Phase 4', available:false, path:null },
    { title:'Alert Centre', desc:'View and acknowledge health alerts', icon:'🚨', phase:'Phase 2', available:false, path:null },
    { title:'Schedule Visit', desc:'Plan home or clinic visits', icon:'📅', phase:'Phase 5', available:false, path:null },
    { title:'Lab Report Upload', desc:'Scan and upload patient lab reports', icon:'🧪', phase:'Phase 2', available:false, path:null },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#080d1a', color:'#f0f4ff' }}>

      {/* Navbar */}
      <div style={{ background:'#0a0f1e', borderBottom:'1px solid #1a2540', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontWeight:700, fontSize:16 }}>CurePulse AI</span>
          <span style={{ width:1, height:20, background:'#1a2540', margin:'0 12px' }} />
          <span style={{ fontSize:13, color:'#4a6080' }}>Swasthya Mitra Portal</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, background:'linear-gradient(135deg,#10b981,#34d399)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#080d1a' }}>
              {user?.full_name?.charAt(0) || 'M'}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#f0f4ff' }}>{user?.full_name}</div>
              <div style={{ fontSize:11, color:'#4a6080' }}>Swasthya Mitra</div>
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
              Good morning, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize:14, color:'#4a6080' }}>Manage your patients and record their vitals</p>
          </div>
          <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, padding:'8px 16px', textAlign:'right' }}>
            <div style={{ fontSize:11, color:'#10b981', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>Status</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#10b981', marginTop:2 }}>On Duty ✓</div>
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

          {/* Actions grid */}
          <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:15, fontWeight:600 }}>Mitra Actions</h2>
              <span style={{ fontSize:12, color:'#4a6080' }}>Field operations</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {actions.map(a => (
                <div key={a.title}
                  onClick={() => a.path && navigate(a.path)}
                  style={{
                    background:'#080d1a',
                    border:`1px solid ${a.available ? 'rgba(201,168,76,0.3)' : '#1a2540'}`,
                    borderRadius:12, padding:16,
                    cursor: a.available ? 'pointer' : 'default',
                    transition:'all 0.2s',
                    opacity: a.available ? 1 : 0.6
                  }}
                  onMouseEnter={e => a.available && (e.currentTarget.style.borderColor='#c9a84c')}
                  onMouseLeave={e => a.available && (e.currentTarget.style.borderColor='rgba(201,168,76,0.3)')}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{a.icon}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#f0f4ff', marginBottom:3 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:'#4a6080', marginBottom:8 }}>{a.desc}</div>
                  <div style={{ fontSize:10, color: a.available ? '#c9a84c' : '#4a6080', background: a.available ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)', padding:'2px 6px', borderRadius:4, display:'inline-block', fontWeight:600 }}>
                    {a.available ? 'Available →' : a.phase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Today's Schedule</h3>
              <div style={{ textAlign:'center', padding:'20px 0', color:'#4a6080', fontSize:13 }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📅</div>
                No visits scheduled
                <div style={{ fontSize:12, marginTop:4, color:'#2a3a54' }}>Scheduling in Phase 5</div>
              </div>
            </div>

            <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>This Week</h3>
              {[
                { label:'Patients visited', value:'0' },
                { label:'Vitals recorded', value:'0' },
                { label:'Alerts resolved', value:'0' },
              ].map(s => (
                <div key={s.label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #1a2540' }}>
                  <span style={{ fontSize:13, color:'#4a6080' }}>{s.label}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'#c9a84c' }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:16, padding:20 }}>
              <h3 style={{ fontSize:13, fontWeight:600, color:'#10b981', marginBottom:10 }}>Your Role</h3>
              <p style={{ fontSize:12, color:'#4a6080', lineHeight:1.7 }}>
                As a Swasthya Mitra, you are the bridge between patients and doctors. Record vitals, monitor health, and escalate when needed.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}