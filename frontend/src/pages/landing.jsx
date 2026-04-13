import { useNavigate } from 'react-router-dom'

const S = {
  page: { background:'#080d1a', color:'#f0f4ff', fontFamily:'system-ui, sans-serif' },
  nav: { position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(8,13,26,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid #1a2540', padding:'0 64px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' },
  navLogo: { display:'flex', alignItems:'center', gap:10 },
  logoIcon: { width:36, height:36, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 },
  logoText: { fontWeight:700, fontSize:17, color:'#f0f4ff' },
  navLinks: { display:'flex', alignItems:'center', gap:32 },
  navLink: { fontSize:14, color:'#4a6080', textDecoration:'none', cursor:'pointer', transition:'color 0.2s' },
  btnOutline: { background:'transparent', border:'1px solid #1a2540', color:'#f0f4ff', borderRadius:8, padding:'8px 18px', fontSize:13, fontWeight:600, cursor:'pointer', transition:'border-color 0.2s' },
  btnGold: { background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:8, padding:'8px 18px', fontSize:13, fontWeight:700, cursor:'pointer' },
  section: { padding:'100px 64px' },
  label: { fontSize:12, fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:'#c9a84c', marginBottom:16, display:'block' },
  card: { background:'#0d1528', border:'1px solid #1a2540', borderRadius:16 },
}

const features = [
  { icon:'🤖', title:'AI Symptom Triage', desc:'NLP-powered chatbot extracts symptoms and classifies urgency into Green, Yellow, or Red using XGBoost + BioBERT.', phase:'Phase 2' },
  { icon:'🧪', title:'Lab Report Scanner', desc:'OCR pipeline extracts values from any lab report PDF, classifies them against reference ranges, and explains in plain language.', phase:'Phase 2' },
  { icon:'📊', title:'Anomaly Detection', desc:'3-layer ensemble of Z-score, Isolation Forest, and LSTM Autoencoder detects abnormal vitals in real time.', phase:'Phase 2' },
  { icon:'📹', title:'AI Teleconsultation', desc:'WebRTC video calls with live Whisper transcription, auto-generated SOAP notes, and drug interaction checking.', phase:'Phase 3' },
  { icon:'🔬', title:'Skin Condition Screener', desc:'EfficientNet-B3 CNN trained on HAM10000 classifies 7 skin conditions with GradCAM explainability heatmaps.', phase:'Phase 4' },
  { icon:'⚡', title:'Health Risk Scoring', desc:'XGBoost models predict diabetes, hypertension, and CVD risk with SHAP waterfall explanations per patient.', phase:'Phase 4' },
  { icon:'🌐', title:'Multilingual Engine', desc:'IndicTrans2 translates all AI outputs between Odia, Hindi, and English — built for every Indian user.', phase:'Phase 5' },
  { icon:'📈', title:'Vitals Forecasting', desc:'ARIMA + Prophet ensemble forecasts vitals 7 days ahead with 80% and 95% confidence intervals.', phase:'Phase 2' },
]

const steps = [
  { step:'01', title:'Patient gets screened', desc:'Enter vitals at any eClinic or at home. AI symptom triage chatbot assesses urgency instantly. Lab reports scanned and interpreted in seconds.', icon:'🏥' },
  { step:'02', title:'Vitals monitored continuously', desc:'Real-time dashboard tracks BP, SpO2, heart rate, temperature, and glucose. Anomaly detection fires the moment something looks wrong.', icon:'📡' },
  { step:'03', title:'Doctor consulted via AI-enhanced video', desc:'Pre-consult AI brief auto-generated. Live transcription during the call. SOAP notes and prescription drafted by AI — doctor reviews and approves.', icon:'👨‍⚕️' },
  { step:'04', title:'Patient receives full summary', desc:'Post-consult summary in your language. Follow-up scheduled automatically. Monthly health report sent to both patient and doctor.', icon:'📋' },
]

const stats = [
  { value:'150+', label:'Active eClinics across India', icon:'🏥' },
  { value:'1,000+', label:'Health workers on the platform', icon:'👥' },
  { value:'30', label:'AI features across 6 phases', icon:'🤖' },
  { value:'6', label:'ML models trained from scratch', icon:'🧠' },
]

const problem = [
  { stat:'1.4B', desc:'people in India with fragmented, disconnected healthcare records' },
  { stat:'1:1,700', desc:'doctor-to-patient ratio in India vs WHO recommended 1:1,000' },
  { stat:'67%', desc:'of Indians have no access to specialist care without significant travel' },
  { stat:'₹0', desc:'additional cost to patients — AI handles the routine, humans handle the complex' },
]



export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={S.page}>

      {/* Navbar */}
      <nav style={S.nav}>
        <div style={S.navLogo}>
          <div style={S.logoIcon}>🏥</div>
          <span style={S.logoText}>CurePulse AI</span>
        </div>
        <div style={S.navLinks}>
          {[
            { label:'Problem', href:'#problem' },
            { label:'Features', href:'#features' },
            { label:'How it works', href:'#how-it-works' },
          ].map(l => (
            <a key={l.label} href={l.href} style={S.navLink}
              onMouseEnter={e => e.target.style.color='#c9a84c'}
              onMouseLeave={e => e.target.style.color='#4a6080'}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnOutline} onClick={() => navigate('/login')}
            onMouseEnter={e => e.target.style.borderColor='#c9a84c'}
            onMouseLeave={e => e.target.style.borderColor='#1a2540'}>
            Sign In
          </button>
          <button style={S.btnGold} onClick={() => navigate('/signup')}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{...S.section, paddingTop:160, paddingBottom:120, textAlign:'center', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', width:700, height:700, borderRadius:'50%', background:'rgba(201,168,76,0.04)', filter:'blur(120px)', top:'50%', left:'50%', transform:'translate(-50%,-60%)', pointerEvents:'none'}} />
        <div style={{position:'relative', zIndex:1}}>

          {/* Badge */}
          <div style={{display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'6px 16px', marginBottom:28}}>
            <span style={{fontSize:12}}>✨</span>
            <span style={{fontSize:12, color:'#c9a84c', fontWeight:600}}>AI-powered healthcare platform — 30 features, 6 ML models</span>
          </div>

          {/* Headline */}
          <h1 style={{fontSize:62, fontWeight:800, lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:24, maxWidth:820, margin:'0 auto 24px'}}>
            <span style={{color:'#f0f4ff'}}>Intelligent healthcare</span><br/>
            <span style={{background:'linear-gradient(135deg,#c9a84c,#e8c76a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              for everyone in India
            </span>
          </h1>

          <p style={{fontSize:18, color:'#4a6080', lineHeight:1.8, maxWidth:620, margin:'0 auto 48px'}}>
            CurePulse AI unifies AI diagnostics, real-time vitals monitoring, and teleconsultation into one intelligent platform — built for patients, doctors, and healthcare workers across India.
          </p>

          {/* CTA Buttons */}
          <div style={{display:'flex', gap:14, justifyContent:'center', marginBottom:72}}>
            <button onClick={() => navigate('/signup')}
              style={{background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:12, padding:'15px 36px', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 32px rgba(201,168,76,0.25)'}}>
              Get Started Free →
            </button>
            <button onClick={() => navigate('/login')}
              style={{background:'rgba(255,255,255,0.04)', color:'#f0f4ff', border:'1px solid #1a2540', borderRadius:12, padding:'15px 36px', fontSize:15, fontWeight:600, cursor:'pointer'}}>
              Sign In
            </button>
          </div>

          {/* Stats bar */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:'#1a2540', border:'1px solid #1a2540', borderRadius:16, overflow:'hidden', maxWidth:860, margin:'0 auto'}}>
            {stats.map(s => (
              <div key={s.label} style={{background:'#0d1528', padding:'28px 24px', textAlign:'center'}}>
                <div style={{fontSize:30, fontWeight:800, color:'#c9a84c', marginBottom:6}}>{s.value}</div>
                <div style={{fontSize:12, color:'#4a6080', lineHeight:1.5}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" style={{...S.section, background:'#0a0f1e', borderTop:'1px solid #1a2540', borderBottom:'1px solid #1a2540'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <span style={S.label}>The Problem</span>
          <h2 style={{fontSize:38, fontWeight:700, color:'#f0f4ff', letterSpacing:'-0.5px', marginBottom:16, maxWidth:560}}>
            Healthcare in India needs a smarter solution
          </h2>
          <p style={{fontSize:15, color:'#4a6080', lineHeight:1.8, maxWidth:600, marginBottom:56}}>
            Millions across India face fragmented healthcare — disconnected records, delayed diagnoses, and no intelligent layer connecting patients to doctors. CurePulse AI was built to fix this.
          </p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
            {problem.map(p => (
              <div key={p.stat} style={{...S.card, padding:28, borderLeft:'3px solid #c9a84c'}}>
                <div style={{fontSize:36, fontWeight:800, color:'#c9a84c', marginBottom:12}}>{p.stat}</div>
                <div style={{fontSize:13, color:'#4a6080', lineHeight:1.7}}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={S.section}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <span style={S.label}>AI Features</span>
          <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:48}}>
            <h2 style={{fontSize:38, fontWeight:700, color:'#f0f4ff', letterSpacing:'-0.5px', maxWidth:480, margin:0}}>
              30 features. 6 ML models. One platform.
            </h2>
            <p style={{fontSize:14, color:'#4a6080', maxWidth:340, textAlign:'right', lineHeight:1.7}}>
              From symptom triage to skin screening — every AI feature is trained, evaluated, and explainable.
            </p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
            {features.map(f => (
              <div key={f.title}
                style={{...S.card, padding:24, cursor:'pointer', transition:'all 0.2s'}}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#1a2540'; e.currentTarget.style.transform='translateY(0)' }}>
                <div style={{fontSize:28, marginBottom:12}}>{f.icon}</div>
                <div style={{fontSize:13, fontWeight:700, color:'#f0f4ff', marginBottom:8}}>{f.title}</div>
                <div style={{fontSize:12, color:'#4a6080', lineHeight:1.6, marginBottom:14}}>{f.desc}</div>
                <div style={{fontSize:11, color:'#c9a84c', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', padding:'3px 8px', borderRadius:4, display:'inline-block', fontWeight:600}}>
                  {f.phase}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{...S.section, background:'#0a0f1e', borderTop:'1px solid #1a2540', borderBottom:'1px solid #1a2540'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <span style={S.label}>How It Works</span>
          <h2 style={{fontSize:38, fontWeight:700, color:'#f0f4ff', letterSpacing:'-0.5px', marginBottom:64, maxWidth:480}}>
            The complete healthcare loop
          </h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, position:'relative'}}>
            <div style={{position:'absolute', top:36, left:'12.5%', right:'12.5%', height:1, background:'linear-gradient(90deg,#1a2540,#c9a84c,#1a2540)', zIndex:0}} />
            {steps.map(s => (
              <div key={s.step} style={{position:'relative', zIndex:1}}>
                <div style={{width:72, height:72, background:'linear-gradient(135deg,#0d1528,#1a2540)', border:'2px solid #c9a84c', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, marginBottom:24, boxShadow:'0 0 24px rgba(201,168,76,0.15)'}}>
                  {s.icon}
                </div>
                <div style={{fontSize:11, color:'#c9a84c', fontWeight:700, letterSpacing:'0.1em', marginBottom:8}}>STEP {s.step}</div>
                <div style={{fontSize:15, fontWeight:700, color:'#f0f4ff', marginBottom:10}}>{s.title}</div>
                <div style={{fontSize:13, color:'#4a6080', lineHeight:1.7}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* CTA */}
      <section style={{...S.section, background:'#0a0f1e', borderTop:'1px solid #1a2540', textAlign:'center'}}>
        <div style={{maxWidth:600, margin:'0 auto'}}>
          <div style={{width:64, height:64, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 28px'}}>🏥</div>
          <h2 style={{fontSize:42, fontWeight:800, color:'#f0f4ff', letterSpacing:'-1px', marginBottom:16}}>
            Ready to explore?
          </h2>
          <p style={{fontSize:16, color:'#4a6080', lineHeight:1.8, marginBottom:40}}>
            CurePulse AI is a personal project demonstrating AI-powered healthcare at scale. Create an account and explore the full platform.
          </p>
          <div style={{display:'flex', gap:14, justifyContent:'center'}}>
            <button onClick={() => navigate('/signup')}
              style={{background:'linear-gradient(135deg,#c9a84c,#e8c76a)', color:'#080d1a', border:'none', borderRadius:12, padding:'15px 36px', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 32px rgba(201,168,76,0.25)'}}>
              Create Account →
            </button>
            <button onClick={() => navigate('/login')}
              style={{background:'rgba(255,255,255,0.04)', color:'#f0f4ff', border:'1px solid #1a2540', borderRadius:12, padding:'15px 36px', fontSize:15, fontWeight:600, cursor:'pointer'}}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid #1a2540', padding:'28px 64px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:28, height:28, background:'linear-gradient(135deg,#c9a84c,#e8c76a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14}}>🏥</div>
          <span style={{fontSize:14, fontWeight:600, color:'#f0f4ff'}}>CurePulse AI</span>
        </div>
        <div style={{fontSize:13, color:'#2a3a54'}}>
          Built by Darsh Mohapatra 
        </div>
        <div style={{display:'flex', gap:20}}>
          {['🔒 Secure', '🇮🇳 Made in India', '❤️ Open Source'].map(b => (
            <span key={b} style={{fontSize:12, color:'#2a3a54'}}>{b}</span>
          ))}
        </div>
      </footer>

    </div>
  )
}