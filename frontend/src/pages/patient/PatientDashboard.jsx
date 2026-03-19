import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import { vitalsAPI } from '../../services/api'

const card = {
  background:'#0d1528',
  border:'1px solid #1a2540',
  borderRadius:16,
  padding:24
}

const features = [
  { title:'Vitals History', desc:'Track your health over time', icon:'📈', phase:'Phase 1', path:'/patient/vitals/history' },
  { title:'Symptom Checker', desc:'AI triage assistant', icon:'🤖', phase:'Phase 2', path:null },
  { title:'Lab Reports', desc:'AI-powered analysis', icon:'🧪', phase:'Phase 2', path:null },
  { title:'Teleconsult', desc:'Video with your doctor', icon:'📹', phase:'Phase 3', path:null },
  { title:'Prescriptions', desc:'Active medications', icon:'💊', phase:'Phase 3', path:null },
  { title:'Health Timeline', desc:'Your complete history', icon:'🗂️', phase:'Phase 1', path:null },
  { title:'Risk Score', desc:'Predictive health AI', icon:'⚡', phase:'Phase 4', path:null },
  { title:'Skin Scanner', desc:'CNN-based screening', icon:'🔬', phase:'Phase 4', path:null },
]

export default function PatientDashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const navigate = useNavigate()

  const [latestVitals, setLatestVitals] = useState(null)
  const [vitalsCount, setVitalsCount] = useState(0)
  const [loadingVitals, setLoadingVitals] = useState(true)

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetchVitals()
    }
  }, [user])

  const fetchVitals = async () => {
    try {
      // Get latest vitals
      const latestRes = await vitalsAPI.getLatest(user.id)
      setLatestVitals(latestRes.data)

      // Get all vitals for count
      const allRes = await vitalsAPI.getAll(user.id)
      setVitalsCount(allRes.data.length)
    } catch (err) {
      // No vitals yet — that's fine
      setLatestVitals(null)
      setVitalsCount(0)
    } finally {
      setLoadingVitals(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  // Color code vitals
  const getVitalStatus = (type, value) => {
    if (!value) return { status:'No data', color:'#4a6080' }
    const ranges = {
      heart_rate: { min:60, max:100 },
      spo2: { min:95, max:100 },
      temperature: { min:97, max:99 },
      blood_glucose: { min:70, max:100 },
    }
    const range = ranges[type]
    if (!range) return { status:'Recorded', color:'#c9a84c' }
    if (value < range.min || value > range.max) return { status:'Abnormal', color:'#ef4444' }
    return { status:'Normal', color:'#10b981' }
  }

  const getBPStatus = (sys, dia) => {
    if (!sys || !dia) return { status:'No data', color:'#4a6080' }
    if (sys > 130 || dia > 80) return { status:'High', color:'#ef4444' }
    if (sys < 90 || dia < 60) return { status:'Low', color:'#f59e0b' }
    return { status:'Normal', color:'#10b981' }
  }

  const bpStatus = getBPStatus(latestVitals?.bp_systolic, latestVitals?.bp_diastolic)

  const vitals = [
    {
      label:'Heart Rate',
      value: latestVitals?.heart_rate ? `${latestVitals.heart_rate}` : '—',
      unit:'bpm', icon:'❤️',
      ...getVitalStatus('heart_rate', latestVitals?.heart_rate),
      bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.2)'
    },
    {
      label:'Blood Pressure',
      value: latestVitals?.bp_systolic ? `${latestVitals.bp_systolic}/${latestVitals.bp_diastolic}` : '—',
      unit:'mmHg', icon:'🩸',
      ...bpStatus,
      bg:'rgba(201,168,76,0.08)', border:'rgba(201,168,76,0.2)'
    },
    {
      label:'SpO2',
      value: latestVitals?.spo2 ? `${latestVitals.spo2}` : '—',
      unit:'%', icon:'🫁',
      ...getVitalStatus('spo2', latestVitals?.spo2),
      bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.2)'
    },
    {
      label:'Temperature',
      value: latestVitals?.temperature ? `${latestVitals.temperature}` : '—',
      unit:'°F', icon:'🌡️',
      ...getVitalStatus('temperature', latestVitals?.temperature),
      bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.2)'
    },
  ]

  return (
    <div style={{minHeight:'100vh', background:'#080d1a', color:'#f0f4ff'}}>

      {/* Navbar */}
      <div style={{background:'#0a0f1e', borderBottom:'1px solid #1a2540', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:32, height:32, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>🏥</div>
          <span style={{fontWeight:700, fontSize:16, color:'#f0f4ff'}}>CurePulse AI</span>
          <span style={{width:1, height:20, background:'#1a2540', margin:'0 12px'}} />
          <span style={{fontSize:13, color:'#4a6080'}}>Patient Portal</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:32, height:32, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#080d1a'}}>
              {user?.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <div style={{fontSize:13, fontWeight:600, color:'#f0f4ff'}}>{user?.full_name}</div>
              <div style={{fontSize:11, color:'#4a6080', textTransform:'capitalize'}}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:12, padding:'6px 14px', borderRadius:8, cursor:'pointer', fontWeight:500}}>
            Logout
          </button>
        </div>
      </div>

      <div style={{padding:'32px'}}>

        {/* Page header */}
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28}}>
          <div>
            <h1 style={{fontSize:24, fontWeight:700, color:'#f0f4ff', marginBottom:4}}>
              Good morning, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p style={{fontSize:14, color:'#4a6080'}}>Here's your health overview for today</p>
          </div>
          <div style={{background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:'8px 16px', textAlign:'right'}}>
            <div style={{fontSize:11, color:'#c9a84c', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase'}}>Risk Status</div>
            <div style={{fontSize:16, fontWeight:700, color: vitalsCount > 0 ? '#10b981' : '#4a6080', marginTop:2}}>
              {vitalsCount > 0 ? 'Low Risk ✓' : 'No data yet'}
            </div>
          </div>
        </div>

        {/* Vitals strip */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24}}>
          {vitals.map(v => (
            <div key={v.label} style={{...card, background:v.bg, border:`1px solid ${v.border}`, padding:20}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
                <span style={{fontSize:22}}>{v.icon}</span>
                <span style={{fontSize:11, background:`${v.color}22`, color:v.color, padding:'3px 8px', borderRadius:20, fontWeight:600}}>{v.status}</span>
              </div>
              <div style={{fontSize:26, fontWeight:700, color:'#f0f4ff'}}>
                {loadingVitals ? '...' : v.value}
                <span style={{fontSize:13, fontWeight:400, color:'#4a6080'}}> {v.unit}</span>
              </div>
              <div style={{fontSize:12, color:'#4a6080', marginTop:4}}>{v.label}</div>
              {latestVitals && (
                <div style={{fontSize:11, color:'#2a3a54', marginTop:6}}>
                  Last updated: {new Date(latestVitals.recorded_at).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:20}}>

          {/* Features grid */}
          <div style={card}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20}}>
              <h2 style={{fontSize:15, fontWeight:600, color:'#f0f4ff'}}>All Features</h2>
              <span style={{fontSize:12, color:'#4a6080'}}>30 features across 6 phases</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
              {features.map(f => (
                <div key={f.title}
                  style={{background:'#080d1a', border:'1px solid #1a2540', borderRadius:12, padding:16, cursor: f.path ? 'pointer' : 'default', transition:'border-color 0.2s'}}
                  onClick={() => f.path && navigate(f.path)}
                  onMouseEnter={e => e.currentTarget.style.borderColor = f.path ? '#c9a84c' : '#1a2540'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='#1a2540'}>
                  <div style={{fontSize:24, marginBottom:8}}>{f.icon}</div>
                  <div style={{fontSize:12, fontWeight:600, color:'#f0f4ff', marginBottom:3}}>{f.title}</div>
                  <div style={{fontSize:11, color:'#4a6080', marginBottom:8}}>{f.desc}</div>
                  <div style={{fontSize:10, color:'#c9a84c', background:'rgba(201,168,76,0.1)', padding:'2px 6px', borderRadius:4, display:'inline-block'}}>
                    {f.path ? 'Open →' : f.phase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{display:'flex', flexDirection:'column', gap:16}}>

            {/* Health score */}
            <div style={{...card}}>
              <h3 style={{fontSize:14, fontWeight:600, color:'#f0f4ff', marginBottom:16}}>Health Score</h3>
              <div style={{textAlign:'center', padding:'8px 0'}}>
                <div style={{fontSize:56, fontWeight:700, color:'#c9a84c', lineHeight:1}}>
                  {vitalsCount > 0 ? '86' : '—'}
                </div>
                <div style={{fontSize:13, color:'#4a6080', marginTop:6}}>
                  {vitalsCount > 0 ? 'out of 100' : 'Record vitals first'}
                </div>
                <div style={{marginTop:16, background:'#080d1a', borderRadius:8, height:6, overflow:'hidden'}}>
                  <div style={{width: vitalsCount > 0 ? '86%' : '0%', height:'100%', background:'linear-gradient(90deg,#c9a84c,#e8c76a)', borderRadius:8, transition:'width 0.5s'}} />
                </div>
                <button
                  onClick={() => navigate('/patient/vitals/entry')}
                  style={{marginTop:16, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:8, padding:'8px 20px', fontSize:12, fontWeight:700, cursor:'pointer', width:'100%'}}>
                  + Record Vitals
                </button>
              </div>
            </div>

            {/* Next appointment */}
            <div style={card}>
              <h3 style={{fontSize:14, fontWeight:600, color:'#f0f4ff', marginBottom:14}}>Next Appointment</h3>
              <div style={{background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, padding:14}}>
                <div style={{fontSize:12, color:'#c9a84c', fontWeight:600, marginBottom:4}}>📅 Teleconsultation</div>
                <div style={{fontSize:13, color:'#f0f4ff', fontWeight:500}}>No upcoming</div>
                <div style={{fontSize:12, color:'#4a6080', marginTop:2}}>Schedule one in Phase 3</div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={card}>
              <h3 style={{fontSize:14, fontWeight:600, color:'#f0f4ff', marginBottom:14}}>This Month</h3>
              {[
                {label:'Vitals recorded', value: vitalsCount.toString()},
                {label:'Lab reports', value:'0'},
                {label:'Consultations', value:'0'},
              ].map(s => (
                <div key={s.label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid #1a2540'}}>
                  <span style={{fontSize:13, color:'#4a6080'}}>{s.label}</span>
                  <span style={{fontSize:14, fontWeight:700, color:'#c9a84c'}}>{s.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}