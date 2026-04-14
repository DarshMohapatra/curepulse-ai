import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import { vitalsAPI } from '../../services/api'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
  Area, ComposedChart
} from 'recharts'

export default function VitalsHistory() {
  const user = useAuthStore((state) => state.user)
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const navigate = useNavigate()
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeChart, setActiveChart] = useState('heart_rate')
  const [forecast, setForecast] = useState(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastVital, setForecastVital] = useState('bp_systolic')

  useEffect(() => { loadFromStorage() }, [])
  useEffect(() => { if (user?.id) fetchVitals() }, [user])

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

  useEffect(() => { if (user?.id) fetchForecast() }, [user, forecastVital])

  const fetchForecast = async () => {
    setForecastLoading(true)
    try {
      const res = await vitalsAPI.forecast(user.id, forecastVital, 7)
      setForecast(res.data)
    } catch {
      setForecast(null)
    } finally {
      setForecastLoading(false)
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
    return d.toLocaleDateString('en-IN', {
      day:'numeric', month:'short',
      hour:'2-digit', minute:'2-digit'
    })
  }

  // Prepare chart data — oldest first
  const chartData = [...vitals].reverse().map((v, i) => ({
    index: i + 1,
    date: new Date(v.recorded_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' }),
    heart_rate: v.heart_rate,
    spo2: v.spo2,
    temperature: v.temperature,
    blood_glucose: v.blood_glucose,
    bp_systolic: v.bp_systolic,
    bp_diastolic: v.bp_diastolic,
  }))

  const charts = [
    {
      key: 'heart_rate',
      label: 'Heart Rate',
      unit: 'bpm',
      icon: '❤️',
      color: '#10b981',
      refMin: 60,
      refMax: 100,
    },
    {
      key: 'bp_systolic',
      label: 'Blood Pressure',
      unit: 'mmHg',
      icon: '🩸',
      color: '#c9a84c',
      refMin: 90,
      refMax: 130,
      secondKey: 'bp_diastolic',
      secondColor: '#e8c76a',
    },
    {
      key: 'spo2',
      label: 'SpO2',
      unit: '%',
      icon: '🫁',
      color: '#3b82f6',
      refMin: 95,
      refMax: 100,
    },
    {
      key: 'temperature',
      label: 'Temperature',
      unit: '°F',
      icon: '🌡️',
      color: '#8b5cf6',
      refMin: 97,
      refMax: 99,
    },
    {
      key: 'blood_glucose',
      label: 'Blood Glucose',
      unit: 'mg/dL',
      icon: '🧪',
      color: '#f59e0b',
      refMin: 70,
      refMax: 100,
    },
  ]

  const activeChartConfig = charts.find(c => c.key === activeChart)

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background:'#0d1528', border:'1px solid #c9a84c', borderRadius:10, padding:'10px 14px' }}>
          <div style={{ fontSize:12, color:'#4a6080', marginBottom:6 }}>{payload[0]?.payload?.date}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ fontSize:13, fontWeight:600, color:p.color }}>
              {p.value} {activeChartConfig?.unit}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080d1a', color:'#f0f4ff' }}>

      {/* Navbar */}
      <div style={{ background:'#0a0f1e', borderBottom:'1px solid #1a2540', padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontWeight:700, fontSize:16 }}>CurePulse AI</span>
          <span style={{ width:1, height:20, background:'#1a2540', margin:'0 12px' }} />
          <span style={{ fontSize:13, color:'#4a6080' }}>Vitals History</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => navigate('/patient/vitals/entry')}
            style={{ background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:8, padding:'7px 16px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
            + Record New
          </button>
          <button onClick={() => navigate('/patient/dashboard')}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid #1a2540', color:'#f0f4ff', borderRadius:8, padding:'7px 16px', fontSize:13, cursor:'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>Vitals History</h1>
          <p style={{ fontSize:14, color:'#4a6080' }}>{vitals.length} readings recorded</p>
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#4a6080' }}>Loading...</div>
        )}

        {!loading && vitals.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', background:'#0d1528', border:'1px solid #1a2540', borderRadius:16 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📊</div>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>No vitals recorded yet</div>
            <div style={{ fontSize:14, color:'#4a6080', marginBottom:24 }}>Start tracking your health</div>
            <button onClick={() => navigate('/patient/vitals/entry')}
              style={{ background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              Record First Vitals →
            </button>
          </div>
        )}

        {!loading && vitals.length > 0 && (
          <>
            {/* Chart tabs */}
            <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:24, marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:15, fontWeight:600 }}>Trend Charts</h2>
                <span style={{ fontSize:12, color:'#4a6080' }}>
                  {vitals.length} data points · shaded area = normal range
                </span>
              </div>

              {/* Chart selector */}
              <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
                {charts.map(c => (
                  <button key={c.key}
                    onClick={() => setActiveChart(c.key)}
                    style={{
                      background: activeChart === c.key ? `${c.color}22` : 'transparent',
                      border: `1px solid ${activeChart === c.key ? c.color : '#1a2540'}`,
                      color: activeChart === c.key ? c.color : '#4a6080',
                      borderRadius:8, padding:'6px 14px', fontSize:12,
                      fontWeight:600, cursor:'pointer', transition:'all 0.2s'
                    }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              {/* Chart */}
              {activeChartConfig && (
                <div style={{ height:260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top:10, right:20, left:0, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill:'#4a6080', fontSize:11 }}
                        axisLine={{ stroke:'#1a2540' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill:'#4a6080', fontSize:11 }}
                        axisLine={{ stroke:'#1a2540' }}
                        tickLine={false}
                        width={40}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      {/* Normal range reference lines */}
                      <ReferenceLine
                        y={activeChartConfig.refMax}
                        stroke={activeChartConfig.color}
                        strokeDasharray="4 4"
                        strokeOpacity={0.4}
                        label={{ value:'Max normal', fill:activeChartConfig.color, fontSize:10 }}
                      />
                      <ReferenceLine
                        y={activeChartConfig.refMin}
                        stroke={activeChartConfig.color}
                        strokeDasharray="4 4"
                        strokeOpacity={0.4}
                        label={{ value:'Min normal', fill:activeChartConfig.color, fontSize:10 }}
                      />

                      {/* Main line */}
                      <Line
                        type="monotone"
                        dataKey={activeChartConfig.key}
                        stroke={activeChartConfig.color}
                        strokeWidth={2.5}
                        dot={{ fill:activeChartConfig.color, r:4, strokeWidth:0 }}
                        activeDot={{ r:6, strokeWidth:0 }}
                        connectNulls={false}
                      />

                      {/* Second line for BP diastolic */}
                      {activeChartConfig.secondKey && (
                        <Line
                          type="monotone"
                          dataKey={activeChartConfig.secondKey}
                          stroke={activeChartConfig.secondColor}
                          strokeWidth={2}
                          strokeDasharray="5 3"
                          dot={{ fill:activeChartConfig.secondColor, r:3, strokeWidth:0 }}
                          connectNulls={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Chart legend for BP */}
              {activeChartConfig?.secondKey && (
                <div style={{ display:'flex', gap:20, marginTop:12, justifyContent:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#4a6080' }}>
                    <div style={{ width:20, height:2.5, background:'#c9a84c', borderRadius:2 }} />
                    Systolic
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#4a6080' }}>
                    <div style={{ width:20, height:2, background:'#e8c76a', borderRadius:2, borderTop:'2px dashed #e8c76a' }} />
                    Diastolic
                  </div>
                </div>
              )}
            </div>

            {/* ============================================ */}
            {/* PHASE 2 — B3: Forecast Chart                */}
            {/* ============================================ */}
            <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:24, marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                  <h2 style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>7-Day Forecast</h2>
                  <p style={{ fontSize:12, color:'#4a6080' }}>AI-powered trend prediction with 95% confidence interval</p>
                </div>
                {forecast && (
                  <div style={{
                    background: forecast.trend === 'rising' ? 'rgba(239,68,68,0.1)' : forecast.trend === 'falling' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                    border: `1px solid ${forecast.trend === 'rising' ? 'rgba(239,68,68,0.25)' : forecast.trend === 'falling' ? 'rgba(59,130,246,0.25)' : 'rgba(16,185,129,0.25)'}`,
                    color: forecast.trend === 'rising' ? '#ef4444' : forecast.trend === 'falling' ? '#3b82f6' : '#10b981',
                    padding:'6px 14px', borderRadius:10, fontSize:12, fontWeight:600,
                  }}>
                    {forecast.trend === 'rising' ? '↑ Rising' : forecast.trend === 'falling' ? '↓ Falling' : '→ Stable'}
                    <span style={{ marginLeft:8, opacity:0.7 }}>
                      {forecast.weekly_change > 0 ? '+' : ''}{forecast.weekly_change}/week
                    </span>
                  </div>
                )}
              </div>

              {/* Vital selector for forecast */}
              <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
                {charts.map(c => (
                  <button key={c.key}
                    onClick={() => setForecastVital(c.key)}
                    style={{
                      background: forecastVital === c.key ? `${c.color}22` : 'transparent',
                      border: `1px solid ${forecastVital === c.key ? c.color : '#1a2540'}`,
                      color: forecastVital === c.key ? c.color : '#4a6080',
                      borderRadius:8, padding:'6px 14px', fontSize:12,
                      fontWeight:600, cursor:'pointer', transition:'all 0.2s'
                    }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              {forecastLoading && (
                <div style={{ textAlign:'center', padding:'40px 0', color:'#4a6080', fontSize:13 }}>
                  Generating forecast...
                </div>
              )}

              {!forecastLoading && !forecast && (
                <div style={{ textAlign:'center', padding:'40px 0', color:'#4a6080', fontSize:13 }}>
                  Not enough data for forecast (need 3+ readings)
                </div>
              )}

              {!forecastLoading && forecast && (() => {
                const fConfig = charts.find(c => c.key === forecastVital)
                // Combine historical (last 14 points) + forecast into one dataset
                const histSlice = forecast.historical.slice(-14)
                const combined = [
                  ...histSlice.map(h => ({
                    date: new Date(h.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' }),
                    actual: h.value,
                    forecast: null,
                    upper: null,
                    lower: null,
                  })),
                  // Bridge point: last historical = first forecast anchor
                  ...forecast.forecast.map(f => ({
                    date: new Date(f.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' }),
                    actual: null,
                    forecast: f.value,
                    upper: f.upper,
                    lower: f.lower,
                  })),
                ]
                // Connect the bridge: set forecast value on last historical point
                if (combined.length > histSlice.length) {
                  combined[histSlice.length - 1].forecast = combined[histSlice.length - 1].actual
                }

                return (
                  <div style={{ height:280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={combined} margin={{ top:10, right:20, left:0, bottom:0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" />
                        <XAxis dataKey="date" tick={{ fill:'#4a6080', fontSize:10 }} axisLine={{ stroke:'#1a2540' }} tickLine={false} />
                        <YAxis tick={{ fill:'#4a6080', fontSize:11 }} axisLine={{ stroke:'#1a2540' }} tickLine={false} width={40} />
                        <Tooltip
                          contentStyle={{ background:'#0d1528', border:'1px solid #c9a84c', borderRadius:10 }}
                          labelStyle={{ color:'#4a6080', fontSize:12 }}
                          formatter={(value, name) => {
                            if (value === null) return [null, null]
                            const labels = { actual:'Actual', forecast:'Predicted', upper:'Upper bound', lower:'Lower bound' }
                            return [`${value} ${fConfig?.unit || ''}`, labels[name] || name]
                          }}
                        />

                        {/* Confidence band (shaded area between upper and lower) */}
                        <Area type="monotone" dataKey="upper" stroke="none" fill={fConfig?.color || '#c9a84c'} fillOpacity={0.08} />
                        <Area type="monotone" dataKey="lower" stroke="none" fill="#080d1a" fillOpacity={1} />

                        {/* Reference lines for normal range */}
                        {fConfig?.refMax && (
                          <ReferenceLine y={fConfig.refMax} stroke={fConfig.color} strokeDasharray="4 4" strokeOpacity={0.3}
                            label={{ value:'Max', fill:fConfig.color, fontSize:10, opacity:0.5 }} />
                        )}
                        {fConfig?.refMin && (
                          <ReferenceLine y={fConfig.refMin} stroke={fConfig.color} strokeDasharray="4 4" strokeOpacity={0.3}
                            label={{ value:'Min', fill:fConfig.color, fontSize:10, opacity:0.5 }} />
                        )}

                        {/* Historical actual line (solid) */}
                        <Line type="monotone" dataKey="actual" stroke={fConfig?.color || '#c9a84c'} strokeWidth={2.5}
                          dot={{ fill:fConfig?.color || '#c9a84c', r:3, strokeWidth:0 }} connectNulls={false} />

                        {/* Forecast line (dashed) */}
                        <Line type="monotone" dataKey="forecast" stroke={fConfig?.color || '#c9a84c'} strokeWidth={2.5}
                          strokeDasharray="6 4" dot={{ fill:fConfig?.color || '#c9a84c', r:3, strokeWidth:0, fillOpacity:0.6 }} connectNulls={false} />

                        {/* Upper/lower bounds (thin dashed) */}
                        <Line type="monotone" dataKey="upper" stroke={fConfig?.color || '#c9a84c'} strokeWidth={1}
                          strokeDasharray="3 3" strokeOpacity={0.4} dot={false} connectNulls={false} />
                        <Line type="monotone" dataKey="lower" stroke={fConfig?.color || '#c9a84c'} strokeWidth={1}
                          strokeDasharray="3 3" strokeOpacity={0.4} dot={false} connectNulls={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )
              })()}

              {/* Forecast stats */}
              {!forecastLoading && forecast && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:16 }}>
                  <div style={{ background:'#080d1a', border:'1px solid #1a2540', borderRadius:10, padding:'12px 14px' }}>
                    <div style={{ fontSize:10, color:'#4a6080', marginBottom:4 }}>Trend</div>
                    <div style={{ fontSize:14, fontWeight:700, color: forecast.trend === 'rising' ? '#ef4444' : forecast.trend === 'falling' ? '#3b82f6' : '#10b981', textTransform:'capitalize' }}>
                      {forecast.trend}
                    </div>
                  </div>
                  <div style={{ background:'#080d1a', border:'1px solid #1a2540', borderRadius:10, padding:'12px 14px' }}>
                    <div style={{ fontSize:10, color:'#4a6080', marginBottom:4 }}>Daily Change</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#f0f4ff' }}>
                      {forecast.daily_change > 0 ? '+' : ''}{forecast.daily_change}
                    </div>
                  </div>
                  <div style={{ background:'#080d1a', border:'1px solid #1a2540', borderRadius:10, padding:'12px 14px' }}>
                    <div style={{ fontSize:10, color:'#4a6080', marginBottom:4 }}>Weekly Change</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#f0f4ff' }}>
                      {forecast.weekly_change > 0 ? '+' : ''}{forecast.weekly_change}
                    </div>
                  </div>
                  <div style={{ background:'#080d1a', border:'1px solid #1a2540', borderRadius:10, padding:'12px 14px' }}>
                    <div style={{ fontSize:10, color:'#4a6080', marginBottom:4 }}>Confidence</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#c9a84c' }}>{forecast.confidence_level}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Readings list */}
            <div style={{ background:'#0d1528', border:'1px solid #1a2540', borderRadius:16, padding:24 }}>
              <h2 style={{ fontSize:15, fontWeight:600, marginBottom:20 }}>All Readings</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {vitals.map((v, i) => (
                  <div key={v.id}
                    style={{ background:'#080d1a', border:'1px solid #1a2540', borderRadius:12, padding:16, transition:'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#c9a84c'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#1a2540'}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:26, height:26, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#c9a84c' }}>
                          {vitals.length - i}
                        </div>
                        <span style={{ fontSize:13, color:'#8896b3' }}>{formatDate(v.recorded_at)}</span>
                      </div>
                      {i === 0 && (
                        <span style={{ fontSize:11, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#10b981', padding:'2px 8px', borderRadius:10, fontWeight:600 }}>
                          Latest
                        </span>
                      )}
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8 }}>
                      {[
                        { label:'BP', value: v.bp_systolic ? `${v.bp_systolic}/${v.bp_diastolic}` : '—', unit:'mmHg', icon:'🩸', color: v.bp_systolic > 130 ? '#ef4444' : '#10b981' },
                        { label:'Heart Rate', value: v.heart_rate || '—', unit:'bpm', icon:'❤️', color: getStatusColor('heart_rate', v.heart_rate) },
                        { label:'SpO2', value: v.spo2 || '—', unit:'%', icon:'🫁', color: getStatusColor('spo2', v.spo2) },
                        { label:'Temp', value: v.temperature || '—', unit:'°F', icon:'🌡️', color: getStatusColor('temperature', v.temperature) },
                        { label:'Glucose', value: v.blood_glucose || '—', unit:'mg/dL', icon:'🧪', color: getStatusColor('blood_glucose', v.blood_glucose) },
                        { label:'Source', value: v.source, unit:'', icon:'📝', color:'#4a6080' },
                      ].map(stat => (
                        <div key={stat.label} style={{ background:'#0d1528', borderRadius:8, padding:'8px 10px', border:`1px solid ${stat.color}22` }}>
                          <div style={{ fontSize:10, color:'#4a6080', marginBottom:3 }}>{stat.icon} {stat.label}</div>
                          <div style={{ fontSize:14, fontWeight:700, color:stat.color }}>{stat.value}</div>
                          <div style={{ fontSize:10, color:'#2a3a54' }}>{stat.unit}</div>
                        </div>
                      ))}
                    </div>

                    {v.notes && (
                      <div style={{ marginTop:10, padding:'7px 10px', background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:6, fontSize:12, color:'#8896b3' }}>
                        📝 {v.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}