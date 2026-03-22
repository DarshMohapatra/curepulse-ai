import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import { timelineAPI } from '../../services/api'

const eventConfig = {
  vitals: {
    icon: '📊',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    label: 'Vitals'
  },
  lab_report: {
    icon: '🧪',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    label: 'Lab Report'
  },
  consultation: {
    icon: '📹',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    label: 'Consultation'
  },
  prescription: {
    icon: '💊',
    color: '#c9a84c',
    bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,168,76,0.2)',
    label: 'Prescription'
  },
  risk_assessment: {
    icon: '⚡',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    label: 'Risk Assessment'
  },
  skin_scan: {
    icon: '🔬',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.2)',
    label: 'Skin Scan'
  },
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return {
    date: d.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
    relative: getRelativeTime(d)
  }
}

const getRelativeTime = (date) => {
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-IN', { day:'numeric', month:'short' })
}

// Group events by date
const groupByDate = (events) => {
  const groups = {}
  events.forEach(e => {
    const date = new Date(e.created_at).toLocaleDateString('en-IN', {
      day:'numeric', month:'long', year:'numeric'
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(e)
  })
  return groups
}

export default function HealthTimeline() {
  const user = useAuthStore((state) => state.user)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState({})

  useEffect(() => { loadFromStorage() }, [])
  useEffect(() => { if (user?.id) fetchTimeline() }, [user])

  const fetchTimeline = async () => {
    try {
      const res = await timelineAPI.getAll(user.id)
      setEvents(res.data || [])
    } catch (err) {
      console.error('Failed to fetch timeline:', err.response?.data || err.message)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.event_type === filter)

  const grouped = groupByDate(filteredEvents)

  const filterOptions = [
    { key:'all', label:'All Events', icon:'📋' },
    { key:'vitals', label:'Vitals', icon:'📊' },
    { key:'lab_report', label:'Lab Reports', icon:'🧪' },
    { key:'consultation', label:'Consultations', icon:'📹' },
    { key:'prescription', label:'Prescriptions', icon:'💊' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#080d1a', color:'#f0f4ff' }}>

      {/* Navbar */}
      <div style={{ background:'#0a0f1e', borderBottom:'1px solid #1a2540', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontWeight:700, fontSize:16 }}>CurePulse AI</span>
          <span style={{ width:1, height:20, background:'#1a2540', margin:'0 12px' }} />
          <span style={{ fontSize:13, color:'#4a6080' }}>Health Timeline</span>
        </div>
        <button onClick={() => navigate('/patient/dashboard')}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid #1a2540', color:'#f0f4ff', borderRadius:8, padding:'7px 16px', fontSize:13, cursor:'pointer' }}>
          ← Dashboard
        </button>
      </div>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>Health Timeline</h1>
          <p style={{ fontSize:14, color:'#4a6080' }}>
            {events.length} events recorded — your complete health story
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:32, flexWrap:'wrap' }}>
          {filterOptions.map(f => (
            <button key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: `1px solid ${filter === f.key ? '#c9a84c' : '#1a2540'}`,
                color: filter === f.key ? '#c9a84c' : '#4a6080',
                borderRadius:8, padding:'6px 14px', fontSize:12,
                fontWeight:600, cursor:'pointer', transition:'all 0.2s'
              }}>
              {f.icon} {f.label}
              {f.key !== 'all' && (
                <span style={{ marginLeft:6, background:'rgba(201,168,76,0.1)', padding:'1px 6px', borderRadius:10, fontSize:11 }}>
                  {events.filter(e => e.event_type === f.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#4a6080' }}>
            Loading your timeline...
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', background:'#0d1528', border:'1px solid #1a2540', borderRadius:16 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>
              {filter === 'all' ? 'No events yet' : `No ${filter} events yet`}
            </div>
            <div style={{ fontSize:14, color:'#4a6080', marginBottom:24 }}>
              {filter === 'all'
                ? 'Start by recording your vitals — every action creates a timeline event'
                : 'This event type will appear here once recorded'}
            </div>
            {filter === 'all' && (
              <button onClick={() => navigate('/patient/vitals/entry')}
                style={{ background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Record First Vitals →
              </button>
            )}
          </div>
        )}

        {/* Timeline grouped by date */}
        {!loading && filteredEvents.length > 0 && (
          <div>
            {Object.entries(grouped).map(([date, dateEvents]) => (
              <div key={date} style={{ marginBottom:32 }}>

                {/* Date header */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#c9a84c' }}>{date}</div>
                  <div style={{ flex:1, height:1, background:'#1a2540' }} />
                  <div style={{ fontSize:11, color:'#4a6080' }}>{dateEvents.length} events</div>
                </div>

                {/* Events for this date */}
                <div style={{ position:'relative' }}>
                  {/* Vertical line */}
                  <div style={{ position:'absolute', left:20, top:0, bottom:0, width:1, background:'#1a2540' }} />

                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {dateEvents.map((event) => {
                      const config = eventConfig[event.event_type] || eventConfig.vitals
                      const { time, relative } = formatDate(event.created_at)
                      const isExpanded = expanded[event.id]

                      return (
                        <div key={event.id} style={{ display:'flex', gap:16, paddingLeft:4 }}>

                          {/* Icon dot */}
                          <div style={{ position:'relative', zIndex:1, flexShrink:0 }}>
                            <div style={{
                              width:32, height:32,
                              background: config.bg,
                              border: `1px solid ${config.border}`,
                              borderRadius:'50%',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:14
                            }}>
                              {config.icon}
                            </div>
                          </div>

                          {/* Event card */}
                          <div style={{
                            flex:1,
                            background:'#0d1528',
                            border:`1px solid ${isExpanded ? config.border : '#1a2540'}`,
                            borderRadius:12,
                            padding:16,
                            cursor:'pointer',
                            transition:'all 0.2s',
                            marginBottom:4
                          }}
                            onClick={() => toggleExpand(event.id)}
                            onMouseEnter={e => e.currentTarget.style.borderColor=config.border}
                            onMouseLeave={e => !isExpanded && (e.currentTarget.style.borderColor='#1a2540')}
                          >
                            {/* Event header */}
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: isExpanded ? 12 : 0 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <span style={{
                                  fontSize:11, fontWeight:600,
                                  background: config.bg,
                                  color: config.color,
                                  border: `1px solid ${config.border}`,
                                  padding:'2px 8px', borderRadius:10
                                }}>
                                  {config.label}
                                </span>
                                <span style={{ fontSize:13, fontWeight:600, color:'#f0f4ff' }}>
                                  {event.title}
                                </span>
                              </div>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <span style={{ fontSize:11, color:'#4a6080' }}>{time}</span>
                                <span style={{ fontSize:11, color:'#2a3a54' }}>·</span>
                                <span style={{ fontSize:11, color:'#c9a84c' }}>{relative}</span>
                                <span style={{ fontSize:12, color:'#4a6080', marginLeft:4 }}>
                                  {isExpanded ? '▲' : '▼'}
                                </span>
                              </div>
                            </div>

                            {/* Summary */}
                            {event.summary && !isExpanded && (
                              <div style={{ fontSize:12, color:'#4a6080', marginTop:6, lineHeight:1.5 }}>
                                {event.summary}
                              </div>
                            )}

                            {/* Expanded detail */}
                            {isExpanded && event.detail_json && (
                              <div style={{ borderTop:'1px solid #1a2540', paddingTop:12 }}>
                                <div style={{ fontSize:12, color:'#8896b3', marginBottom:10 }}>
                                  {event.summary}
                                </div>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                                  {Object.entries(event.detail_json).map(([key, val]) => (
                                    val !== null && (
                                      <div key={key} style={{ background:'#080d1a', borderRadius:8, padding:'8px 10px', border:'1px solid #1a2540' }}>
                                        <div style={{ fontSize:10, color:'#4a6080', marginBottom:3, textTransform:'capitalize' }}>
                                          {key.replace(/_/g, ' ')}
                                        </div>
                                        <div style={{ fontSize:14, fontWeight:600, color: config.color }}>
                                          {val}
                                        </div>
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}