import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import { vitalsAPI } from '../../services/api'

const inputStyle = {
  width: '100%',
  background: '#0d1528',
  border: '1.5px solid #1a2540',
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 14,
  color: '#f0f4ff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
}

const fields = [
  {
    key: 'bp_systolic',
    label: 'BP Systolic',
    unit: 'mmHg',
    placeholder: '120',
    icon: '🩸',
    hint: 'Normal: 90–120',
    type: 'number'
  },
  {
    key: 'bp_diastolic',
    label: 'BP Diastolic',
    unit: 'mmHg',
    placeholder: '80',
    icon: '🩸',
    hint: 'Normal: 60–80',
    type: 'number'
  },
  {
    key: 'heart_rate',
    label: 'Heart Rate',
    unit: 'bpm',
    placeholder: '72',
    icon: '❤️',
    hint: 'Normal: 60–100',
    type: 'number'
  },
  {
    key: 'spo2',
    label: 'SpO2',
    unit: '%',
    placeholder: '98',
    icon: '🫁',
    hint: 'Normal: 95–100',
    type: 'number'
  },
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°F',
    placeholder: '98.6',
    icon: '🌡️',
    hint: 'Normal: 97–99°F',
    type: 'number'
  },
  {
    key: 'blood_glucose',
    label: 'Blood Glucose',
    unit: 'mg/dL',
    placeholder: '90',
    icon: '🧪',
    hint: 'Fasting: 70–100',
    type: 'number'
  },
]

export default function VitalsEntry() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    bp_systolic: '',
    bp_diastolic: '',
    heart_rate: '',
    spo2: '',
    temperature: '',
    blood_glucose: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const payload = {
        patient_id: user.id,
        notes: form.notes || null,
      }
      // Only include fields that have values
      fields.forEach(f => {
        if (form[f.key] !== '') {
          payload[f.key] = parseFloat(form[f.key])
        }
      })

      await vitalsAPI.record(payload)
      setSuccess(true)
      setTimeout(() => navigate('/patient/dashboard'), 1500)
      // Reset form
      setForm({
        bp_systolic: '',
        bp_diastolic: '',
        heart_rate: '',
        spo2: '',
        temperature: '',
        blood_glucose: '',
        notes: ''
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to record vitals')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080d1a', color: '#f0f4ff' }}>

      {/* Navbar */}
      <div style={{ background: '#0a0f1e', borderBottom: '1px solid #1a2540', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>CurePulse AI</span>
          <span style={{ width: 1, height: 20, background: '#1a2540', margin: '0 12px' }} />
          <span style={{ fontSize: 13, color: '#4a6080' }}>Record Vitals</span>
        </div>
        <button onClick={() => navigate('/patient/dashboard')}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1a2540', color: '#f0f4ff', borderRadius: 8, padding: '7px 16px', fontSize: 13, cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>Record Vitals</h1>
          <p style={{ fontSize: 14, color: '#4a6080' }}>Enter your current health measurements below</p>
        </div>

        {/* Success message */}
        {success && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', fontSize: 14, padding: '14px 18px', borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>✅</span>
            Vitals recorded successfully! Your health data has been saved.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 14, padding: '14px 18px', borderRadius: 12, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* Vitals form */}
        <div style={{ background: '#0d1528', border: '1px solid #1a2540', borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f4ff', marginBottom: 24 }}>Health Measurements</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {fields.map(f => (
              <div key={f.key}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#8896b3', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{f.icon}</span> {f.label}
                    <span style={{ fontSize: 11, color: '#4a6080' }}>({f.unit})</span>
                  </label>
                  <span style={{ fontSize: 11, color: '#2a3a54' }}>{f.hint}</span>
                </div>
                <input
                  type={f.type}
                  name={f.key}
                  value={form[f.key]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a84c'}
                  onBlur={e => e.target.style.borderColor = '#1a2540'}
                />
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#8896b3', display: 'block', marginBottom: 6 }}>
              📝 Notes <span style={{ fontSize: 11, color: '#4a6080' }}>(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any symptoms, observations, or context..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#c9a84c'}
              onBlur={e => e.target.style.borderColor = '#1a2540'}
            />
          </div>
        </div>

        {/* Reference ranges card */}
        <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#c9a84c', marginBottom: 14 }}>📊 Normal Reference Ranges</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'BP Systolic', range: '90–120 mmHg' },
              { label: 'BP Diastolic', range: '60–80 mmHg' },
              { label: 'Heart Rate', range: '60–100 bpm' },
              { label: 'SpO2', range: '95–100%' },
              { label: 'Temperature', range: '97–99°F' },
              { label: 'Blood Glucose', range: '70–100 mg/dL (fasting)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                <span style={{ color: '#4a6080' }}>{r.label}</span>
                <span style={{ color: '#c9a84c', fontWeight: 500 }}>{r.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg,#c9a84c,#e8c76a)',
            color: '#080d1a',
            border: 'none',
            borderRadius: 12,
            padding: '15px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 20px rgba(201,168,76,0.25)',
            letterSpacing: '0.02em'
          }}
        >
          {loading ? 'Saving...' : '💾 Save Vitals'}
        </button>
      </div>
    </div>
  )
}