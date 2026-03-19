import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import { vitalsAPI } from '../../services/api'

export default function VitalsHistory() {
  const user = useAuthStore((state) => state.user)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const navigate = useNavigate()
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (user?.id) fetchVitals()
  }, [user])

  const fetchVitals = async () => {
    try {
      const res = await vitalsAPI.getAll(user.id)
      setVitals(res.data)
    } catch {
      setVitals([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (type, value) => {
    if (!value) return '#4a6080'
    const ranges = {
      heart_rate: { min:60, max:100 },
      spo2: { min:95, max:100 },
      temperature: { min:97, max:99 },
      blood_glucose: { min:70, max:100 },
    }
    const range = ranges[type]
    if (!range) return '#c9a84c'
    if (value < range.min || value > range.max) return '#ef4444'
    return '#10b981'
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
  }

  return (
    <div style={{minHeight:'100vh', background:'#080d1a', color:'#f0f4ff'}}>

      {/* Navbar */}
      <div style={{background:'#0a0f1e', borderBottom:'1px solid #1a2540', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:32, height:32, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>🏥</div>
          <span style={{fontWeight:700, fontSize:16}}>CurePulse AI</span>
          <span style={{width:1, height:20, background:'#1a2540', margin:'0 12px'}} />
          <span style={{fontSize:13, color:'#4a6080'}}>Vitals History</span>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button onClick={() => navigate('/patient/vitals/entry')}
            style={{background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:8, padding:'7px 16px', fontSize:13, fontWeight:700, cursor:'pointer'}}>
            + Record New
          </button>
          <button onClick={() => navigate('/patient/dashboard')}
            style={{background:'rgba(255,255,255,0.04)', border:'1px solid #1a2540', color:'#f0f4ff', borderRadius:8, padding:'7px 16px', fontSize:13, cursor:'pointer'}}>
            ← Dashboard
          </button>
        </div>
      </div>

      <div style={{maxWidth:1000, margin:'0 auto', padding:'40px 24px'}}>

        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32}}>
          <div>
            <h1 style={{fontSize:24, fontWeight:700, marginBottom:4}}>Vitals History</h1>
            <p style={{fontSize:14, color:'#4a6080'}}>{vitals.length} readings recorded</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{textAlign:'center', padding:'60px 0', color:'#4a6080'}}>
            Loading your vitals...
          </div>
        )}

        {/* Empty state */}
        {!loading && vitals.length === 0 && (
          <div style={{textAlign:'center', padding:'60px 0', background:'#0d1528', border:'1px solid #1a2540', borderRadius:16}}>
            <div style={{fontSize:48, marginBottom:16}}>📊</div>
            <div style={{fontSize:16, fontWeight:600, color:'#f0f4ff', marginBottom:8}}>No vitals recorded yet</div>
            <div style={{fontSize:14, color:'#4a6080', marginBottom:24}}>Start tracking your health by recording your first vitals</div>
            <button onClick={() => navigate('/patient/vitals/entry')}
              style={{background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer'}}>
              Record First Vitals →
            </button>
          </div>
        )}

        {/* Vitals list */}
        {!loading && vitals.length > 0 && (
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            {vitals.map((v, i) => (
              <div key={v.id} style={{background:'#0d1528', border:'1px solid #1a2540', borderRadius:14, padding:20, transition:'border-color 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.borderColor='#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.borderColor='#1a2540'}>

                {/* Row header */}
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <div style={{width:28, height:28, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#c9a84c'}}>
                      {vitals.length - i}
                    </div>
                    <div>
                      <div style={{fontSize:13, fontWeight:600, color:'#f0f4ff'}}>{formatDate(v.recorded_at)}</div>
                      <div style={{fontSize:11, color:'#4a6080', marginTop:1}}>Manual entry</div>
                    </div>
                  </div>
                  {i === 0 && (
                    <span style={{fontSize:11, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#10b981', padding:'3px 10px', borderRadius:10, fontWeight:600}}>
                      Latest
                    </span>
                  )}
                </div>

                {/* Vitals grid */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10}}>
                  {[
                    { label:'BP', value: v.bp_systolic ? `${v.bp_systolic}/${v.bp_diastolic}` : '—', unit:'mmHg', icon:'🩸', color: v.bp_systolic > 130 ? '#ef4444' : '#10b981' },
                    { label:'Heart Rate', value: v.heart_rate || '—', unit:'bpm', icon:'❤️', color: getStatusColor('heart_rate', v.heart_rate) },
                    { label:'SpO2', value: v.spo2 || '—', unit:'%', icon:'🫁', color: getStatusColor('spo2', v.spo2) },
                    { label:'Temp', value: v.temperature || '—', unit:'°F', icon:'🌡️', color: getStatusColor('temperature', v.temperature) },
                    { label:'Glucose', value: v.blood_glucose || '—', unit:'mg/dL', icon:'🧪', color: getStatusColor('blood_glucose', v.blood_glucose) },
                    { label:'Source', value: v.source, unit:'', icon:'📝', color:'#4a6080' },
                  ].map(stat => (
                    <div key={stat.label} style={{background:'#080d1a', borderRadius:10, padding:'10px 12px', border:`1px solid ${stat.color}22`}}>
                      <div style={{fontSize:10, color:'#4a6080', marginBottom:4}}>{stat.icon} {stat.label}</div>
                      <div style={{fontSize:15, fontWeight:700, color:stat.color}}>{stat.value}</div>
                      <div style={{fontSize:10, color:'#2a3a54'}}>{stat.unit}</div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {v.notes && (
                  <div style={{marginTop:12, padding:'8px 12px', background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:8, fontSize:12, color:'#8896b3'}}>
                    📝 {v.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}