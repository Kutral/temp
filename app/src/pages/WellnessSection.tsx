import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────
type TimerMode = 'focus' | 'shortBreak' | 'longBreak'
type TimerState = 'idle' | 'running' | 'paused'
type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out'

interface PomodoroSettings {
  focus: number
  shortBreak: number
  longBreak: number
  sessionsBeforeLong: number
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLong: 4,
}

const BREATH_PHASE_DURATION = 4000 // 4 seconds per phase
const BREATH_PHASES: BreathPhase[] = ['inhale', 'hold-in', 'exhale', 'hold-out']
const BREATH_LABELS: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  'hold-in': 'Hold',
  exhale: 'Breathe Out',
  'hold-out': 'Hold',
}
const BREATH_SUBLABELS: Record<BreathPhase, string> = {
  inhale: 'Expand your lungs slowly',
  'hold-in': 'Keep the air inside',
  exhale: 'Release gently',
  'hold-out': 'Stay empty and calm',
}

// ─── Notification helpers ───────────────────────────────────────────────
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

function sendNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '🍅',
      tag: 'pomodoro-timer',
      requireInteraction: true,
    })
    // Auto-close after 8s
    setTimeout(() => notification.close(), 8000)
  }
}

// ─── Audio helper ───────────────────────────────────────────────────────
function playChime() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1.5)
    // Second harmonic
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15) // A5
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8)
    osc2.start(ctx.currentTime + 0.15)
    osc2.stop(ctx.currentTime + 1.8)
  } catch {
    // Silently fail if audio context is not available
  }
}

function playBreathTick() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(396, ctx.currentTime) // G4 solfeggio
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch {
    // Silently fail
  }
}

// ─── Format time ────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function WellnessSection() {
  const [activeTab, setActiveTab] = useState<'pomodoro' | 'breathing' | 'music'>('pomodoro')

  return (
    <div className="wellness-root panel-enter">
      {/* Tab Switcher */}
      <div className="wellness-tabs">
        <button
          type="button"
          className={`wellness-tab ${activeTab === 'pomodoro' ? 'wellness-tab--active' : ''}`}
          onClick={() => setActiveTab('pomodoro')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M5 3 2 6" />
            <path d="m22 6-3-3" />
            <path d="M6.38 18.7 4 21" />
            <path d="M17.64 18.67 20 21" />
          </svg>
          <span>Pomodoro Timer</span>
        </button>
        <button
          type="button"
          className={`wellness-tab ${activeTab === 'breathing' ? 'wellness-tab--active' : ''}`}
          onClick={() => setActiveTab('breathing')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6" />
            <path d="M17.5 12c-.94 3.46-4.94 6-8.5 6-3.56 0-6.06-2.54-7-6" />
          </svg>
          <span>Box Breathing</span>
        </button>
        <button
          type="button"
          className={`wellness-tab ${activeTab === 'music' ? 'wellness-tab--active wellness-tab--music' : ''}`}
          onClick={() => setActiveTab('music')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span>Focus Music</span>
        </button>
      </div>

      {/* Content */}
      <div className="wellness-content">
        {activeTab === 'pomodoro' && <PomodoroTimer />}
        {activeTab === 'breathing' && <BoxBreathing />}
        {activeTab === 'music' && <FocusMusic />}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// POMODORO TIMER
// ═══════════════════════════════════════════════════════════════════════
function PomodoroTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    try {
      const saved = localStorage.getItem('pomodoro-settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })
  const [mode, setMode] = useState<TimerMode>('focus')
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [totalFocusToday, setTotalFocusToday] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalTime = mode === 'focus'
    ? settings.focus * 60
    : mode === 'shortBreak'
      ? settings.shortBreak * 60
      : settings.longBreak * 60

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) : 0

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Persist settings
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
  }, [settings])

  // Timer logic
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            handleTimerComplete()
            return 0
          }
          if (mode === 'focus') {
            setTotalFocusToday(t => t + 1)
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState])

  const handleTimerComplete = useCallback(() => {
    playChime()
    setTimerState('idle')

    if (mode === 'focus') {
      const newCompleted = completedSessions + 1
      setCompletedSessions(newCompleted)
      sendNotification(
        '🍅 Focus Session Complete!',
        `Great work! You've completed ${newCompleted} session${newCompleted > 1 ? 's' : ''}. Time for a break.`
      )
      if (newCompleted % settings.sessionsBeforeLong === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      sendNotification(
        '☕ Break Over!',
        'Feeling refreshed? Time to get back to focused work.'
      )
      switchMode('focus')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, completedSessions, settings.sessionsBeforeLong])

  function switchMode(newMode: TimerMode) {
    setMode(newMode)
    const duration = newMode === 'focus'
      ? settings.focus
      : newMode === 'shortBreak'
        ? settings.shortBreak
        : settings.longBreak
    setTimeLeft(duration * 60)
    setTimerState('idle')
  }

  function startTimer() {
    if (timerState === 'idle' && timeLeft === 0) {
      // Reset if time already at 0
      const duration = mode === 'focus'
        ? settings.focus
        : mode === 'shortBreak'
          ? settings.shortBreak
          : settings.longBreak
      setTimeLeft(duration * 60)
    }
    setTimerState('running')
  }

  function pauseTimer() {
    setTimerState('paused')
  }

  function resetTimer() {
    setTimerState('idle')
    const duration = mode === 'focus'
      ? settings.focus
      : mode === 'shortBreak'
        ? settings.shortBreak
        : settings.longBreak
    setTimeLeft(duration * 60)
  }

  // SVG circle values
  const radius = 140
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  const modeColors: Record<TimerMode, { ring: string; glow: string; text: string; bg: string }> = {
    focus: { ring: '#f97316', glow: 'rgba(249, 115, 22, 0.35)', text: '#fdba74', bg: 'rgba(249, 115, 22, 0.06)' },
    shortBreak: { ring: '#34d399', glow: 'rgba(52, 211, 153, 0.35)', text: '#6ee7b7', bg: 'rgba(52, 211, 153, 0.06)' },
    longBreak: { ring: '#60a5fa', glow: 'rgba(96, 165, 250, 0.35)', text: '#93c5fd', bg: 'rgba(96, 165, 250, 0.06)' },
  }

  const colors = modeColors[mode]

  // Update page title
  useEffect(() => {
    if (timerState === 'running') {
      document.title = `${formatTime(timeLeft)} — ${mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}`
    } else {
      document.title = 'Zoho SOC Analyst Interview Study Guide'
    }
    return () => {
      document.title = 'Zoho SOC Analyst Interview Study Guide'
    }
  }, [timeLeft, timerState, mode])

  return (
    <div className="pomodoro-container">
      {/* Mode selector */}
      <div className="pomodoro-modes">
        {([
          { key: 'focus' as TimerMode, label: 'Focus', emoji: '🎯' },
          { key: 'shortBreak' as TimerMode, label: 'Short Break', emoji: '☕' },
          { key: 'longBreak' as TimerMode, label: 'Long Break', emoji: '🌿' },
        ]).map(({ key, label, emoji }) => (
          <button
            key={key}
            type="button"
            className={`pomodoro-mode-btn ${mode === key ? 'pomodoro-mode-btn--active' : ''}`}
            onClick={() => switchMode(key)}
            style={mode === key ? { borderColor: colors.ring, color: colors.text, background: colors.bg } : undefined}
          >
            <span className="pomodoro-mode-emoji">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Timer Ring */}
      <div className="pomodoro-ring-wrapper">
        <div
          className="pomodoro-ring-glow"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            opacity: timerState === 'running' ? 1 : 0.3,
          }}
        />
        <svg
          viewBox="0 0 320 320"
          className="pomodoro-ring-svg"
        >
          {/* Background track */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Minute ticks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 - 90) * (Math.PI / 180)
            const isMajor = i % 5 === 0
            const innerR = isMajor ? 125 : 130
            const outerR = 133
            return (
              <line
                key={i}
                x1={160 + innerR * Math.cos(angle)}
                y1={160 + innerR * Math.sin(angle)}
                x2={160 + outerR * Math.cos(angle)}
                y2={160 + outerR * Math.sin(angle)}
                stroke={isMajor ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}
                strokeWidth={isMajor ? 2 : 1}
                strokeLinecap="round"
              />
            )
          })}
          {/* Progress arc */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="pomodoro-progress-circle"
            style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
          />
          {/* Progress end dot */}
          {progress > 0.01 && (
            <circle
              cx={160 + radius * Math.cos((progress * 360 - 90) * Math.PI / 180)}
              cy={160 + radius * Math.sin((progress * 360 - 90) * Math.PI / 180)}
              r="5"
              fill={colors.ring}
              style={{ filter: `drop-shadow(0 0 6px ${colors.ring})` }}
            />
          )}
        </svg>

        <div className="pomodoro-time-display">
          <div className="pomodoro-time" style={{ color: colors.text }}>{formatTime(timeLeft)}</div>
          <div className="pomodoro-mode-label" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {mode === 'focus' ? 'Deep Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="pomodoro-controls">
        {timerState !== 'running' ? (
          <button
            type="button"
            className="pomodoro-btn pomodoro-btn--primary"
            onClick={startTimer}
            style={{ background: colors.ring, boxShadow: `0 0 30px ${colors.glow}` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
            <span>{timerState === 'paused' ? 'Resume' : 'Start'}</span>
          </button>
        ) : (
          <button
            type="button"
            className="pomodoro-btn pomodoro-btn--primary"
            onClick={pauseTimer}
            style={{ background: colors.ring, boxShadow: `0 0 30px ${colors.glow}` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            <span>Pause</span>
          </button>
        )}
        <button
          type="button"
          className="pomodoro-btn pomodoro-btn--ghost"
          onClick={resetTimer}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        <button
          type="button"
          className="pomodoro-btn pomodoro-btn--ghost"
          onClick={() => setShowSettings(!showSettings)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="pomodoro-settings">
          <h4 className="pomodoro-settings-title">Timer Settings</h4>
          <div className="pomodoro-settings-grid">
            <SettingInput
              label="Focus (min)"
              value={settings.focus}
              onChange={(v) => {
                setSettings(s => ({ ...s, focus: v }))
                if (mode === 'focus' && timerState === 'idle') setTimeLeft(v * 60)
              }}
            />
            <SettingInput
              label="Short Break"
              value={settings.shortBreak}
              onChange={(v) => {
                setSettings(s => ({ ...s, shortBreak: v }))
                if (mode === 'shortBreak' && timerState === 'idle') setTimeLeft(v * 60)
              }}
            />
            <SettingInput
              label="Long Break"
              value={settings.longBreak}
              onChange={(v) => {
                setSettings(s => ({ ...s, longBreak: v }))
                if (mode === 'longBreak' && timerState === 'idle') setTimeLeft(v * 60)
              }}
            />
            <SettingInput
              label="Sessions"
              value={settings.sessionsBeforeLong}
              onChange={(v) => setSettings(s => ({ ...s, sessionsBeforeLong: v }))}
              min={2}
              max={8}
            />
          </div>
        </div>
      )}

      {/* Session Stats */}
      <div className="pomodoro-stats">
        <div className="pomodoro-stat">
          <span className="pomodoro-stat-value" style={{ color: colors.text }}>{completedSessions}</span>
          <span className="pomodoro-stat-label">Sessions</span>
        </div>
        <div className="pomodoro-stat-divider" />
        <div className="pomodoro-stat">
          <span className="pomodoro-stat-value" style={{ color: colors.text }}>
            {Math.floor(totalFocusToday / 60)}m
          </span>
          <span className="pomodoro-stat-label">Focus Today</span>
        </div>
        <div className="pomodoro-stat-divider" />
        <div className="pomodoro-stat">
          <span className="pomodoro-stat-value" style={{ color: colors.text }}>
            {completedSessions > 0 ? `${Math.round((completedSessions / settings.sessionsBeforeLong) * 100)}%` : '—'}
          </span>
          <span className="pomodoro-stat-label">Cycle Progress</span>
        </div>
      </div>

      {/* Session dots */}
      <div className="pomodoro-session-dots">
        {Array.from({ length: settings.sessionsBeforeLong }).map((_, i) => (
          <div
            key={i}
            className={`pomodoro-dot ${i < (completedSessions % settings.sessionsBeforeLong) ? 'pomodoro-dot--filled' : ''}`}
            style={i < (completedSessions % settings.sessionsBeforeLong) ? { background: colors.ring, boxShadow: `0 0 8px ${colors.glow}` } : undefined}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Settings Input ─────────────────────────────────────────────────────
function SettingInput({
  label,
  value,
  onChange,
  min = 1,
  max = 60,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="pomodoro-setting-item">
      <label className="pomodoro-setting-label">{label}</label>
      <div className="pomodoro-setting-control">
        <button
          type="button"
          className="pomodoro-setting-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="pomodoro-setting-value">{value}</span>
        <button
          type="button"
          className="pomodoro-setting-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// BOX BREATHING
// ═══════════════════════════════════════════════════════════════════════
function BoxBreathing() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0) // 0-1
  const [cycleCount, setCycleCount] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const animationRef = useRef<number | null>(null)
  const phaseStartRef = useRef<number>(0)
  const phaseIndexRef = useRef(0)

  const phase = BREATH_PHASES[phaseIndex]

  const startBreathing = useCallback(() => {
    setIsActive(true)
    setPhaseIndex(0)
    phaseIndexRef.current = 0
    setPhaseProgress(0)
    setCycleCount(0)
    setElapsed(0)
    phaseStartRef.current = performance.now()
    playBreathTick()
  }, [])

  const stopBreathing = useCallback(() => {
    setIsActive(false)
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    setPhaseIndex(0)
    setPhaseProgress(0)
  }, [])

  useEffect(() => {
    if (!isActive) return

    let startTime = performance.now()

    const tick = (now: number) => {
      const elapsedMs = now - phaseStartRef.current
      const progress = Math.min(elapsedMs / BREATH_PHASE_DURATION, 1)
      setPhaseProgress(progress)
      setElapsed(Math.floor((now - startTime) / 1000))

      if (progress >= 1) {
        // Move to next phase
        const nextIdx = (phaseIndexRef.current + 1) % 4
        phaseIndexRef.current = nextIdx
        setPhaseIndex(nextIdx)
        phaseStartRef.current = now
        playBreathTick()

        if (nextIdx === 0) {
          setCycleCount(c => c + 1)
        }
      }

      animationRef.current = requestAnimationFrame(tick)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startTime = performance.now()
    phaseStartRef.current = performance.now()
    animationRef.current = requestAnimationFrame(tick)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isActive])

  // Visual scale for the breathing circle
  const getBreathScale = () => {
    const p = phaseProgress
    switch (phase) {
      case 'inhale':
        return 0.6 + 0.4 * easeInOutCubic(p)
      case 'hold-in':
        return 1.0
      case 'exhale':
        return 1.0 - 0.4 * easeInOutCubic(p)
      case 'hold-out':
        return 0.6
    }
  }

  // Opacity for each side of the box
  const getBoxSideProgress = (sideIndex: number): number => {
    if (phaseIndex > sideIndex) return 1
    if (phaseIndex < sideIndex) return 0
    return phaseProgress
  }

  const scale = getBreathScale()

  const phaseColors: Record<BreathPhase, string> = {
    inhale: '#67e8f9',
    'hold-in': '#a78bfa',
    exhale: '#fb923c',
    'hold-out': '#86efac',
  }

  const activeColor = phaseColors[phase]

  return (
    <div className="breathing-container">
      {/* Breathing circle + box visualization */}
      <div className="breathing-visual">
        {/* Ambient background glow */}
        <div
          className="breathing-ambient"
          style={{
            background: `radial-gradient(circle, ${activeColor}22 0%, transparent 70%)`,
            transform: `scale(${isActive ? scale * 1.3 : 1})`,
            transition: isActive ? 'transform 0.3s ease, background 0.5s ease' : 'all 0.8s ease',
          }}
        />

        {/* The Box — 4 sides that illuminate in sequence */}
        <svg viewBox="0 0 280 280" className="breathing-box-svg">
          {/* Box corners */}
          {[
            [40, 40], [240, 40], [240, 240], [40, 240],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="4"
              fill={isActive && phaseIndex >= i ? activeColor : 'rgba(255,255,255,0.15)'}
              style={{ transition: 'fill 0.4s ease' }}
            />
          ))}

          {/* Top side: inhale */}
          <line x1="40" y1="40" x2="240" y2="40"
            stroke={isActive ? activeColor : 'rgba(255,255,255,0.1)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset={isActive ? 200 - 200 * getBoxSideProgress(0) : 200}
            style={{ transition: phaseIndex === 0 ? 'none' : 'stroke-dashoffset 0.3s ease', opacity: isActive ? 1 : 0.3 }}
          />
          {/* Right side: hold-in */}
          <line x1="240" y1="40" x2="240" y2="240"
            stroke={isActive ? activeColor : 'rgba(255,255,255,0.1)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset={isActive ? 200 - 200 * getBoxSideProgress(1) : 200}
            style={{ transition: phaseIndex === 1 ? 'none' : 'stroke-dashoffset 0.3s ease', opacity: isActive ? 1 : 0.3 }}
          />
          {/* Bottom side: exhale */}
          <line x1="240" y1="240" x2="40" y2="240"
            stroke={isActive ? activeColor : 'rgba(255,255,255,0.1)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset={isActive ? 200 - 200 * getBoxSideProgress(2) : 200}
            style={{ transition: phaseIndex === 2 ? 'none' : 'stroke-dashoffset 0.3s ease', opacity: isActive ? 1 : 0.3 }}
          />
          {/* Left side: hold-out */}
          <line x1="40" y1="240" x2="40" y2="40"
            stroke={isActive ? activeColor : 'rgba(255,255,255,0.1)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset={isActive ? 200 - 200 * getBoxSideProgress(3) : 200}
            style={{ transition: phaseIndex === 3 ? 'none' : 'stroke-dashoffset 0.3s ease', opacity: isActive ? 1 : 0.3 }}
          />

          {/* Phase labels on box corners */}
          <text x="140" y="30" textAnchor="middle" fill={phaseIndex === 0 && isActive ? activeColor : 'rgba(255,255,255,0.25)'} fontSize="10" fontFamily="inherit" className="breathing-box-label">INHALE</text>
          <text x="260" y="145" textAnchor="middle" fill={phaseIndex === 1 && isActive ? activeColor : 'rgba(255,255,255,0.25)'} fontSize="10" fontFamily="inherit" className="breathing-box-label" transform="rotate(90 260 145)">HOLD</text>
          <text x="140" y="265" textAnchor="middle" fill={phaseIndex === 2 && isActive ? activeColor : 'rgba(255,255,255,0.25)'} fontSize="10" fontFamily="inherit" className="breathing-box-label">EXHALE</text>
          <text x="20" y="145" textAnchor="middle" fill={phaseIndex === 3 && isActive ? activeColor : 'rgba(255,255,255,0.25)'} fontSize="10" fontFamily="inherit" className="breathing-box-label" transform="rotate(-90 20 145)">HOLD</text>

          {/* Traveling dot indicator */}
          {isActive && (
            <circle
              cx={getDotX(phaseIndex, phaseProgress)}
              cy={getDotY(phaseIndex, phaseProgress)}
              r="6"
              fill={activeColor}
              style={{ filter: `drop-shadow(0 0 10px ${activeColor})` }}
            />
          )}
        </svg>

        {/* Center breathing circle */}
        <div
          className="breathing-orb"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            background: `radial-gradient(circle at 35% 35%, ${activeColor}44, ${activeColor}11 60%, transparent 80%)`,
            borderColor: `${activeColor}66`,
            boxShadow: isActive ? `0 0 40px ${activeColor}33, inset 0 0 30px ${activeColor}11` : 'none',
            transition: isActive ? 'transform 0.15s linear, background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease' : 'all 0.8s ease',
          }}
        >
          {isActive && (
            <div className="breathing-orb-inner">
              <span className="breathing-countdown" style={{ color: activeColor }}>
                {Math.ceil(BREATH_PHASE_DURATION / 1000 * (1 - phaseProgress))}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Phase indicator text */}
      <div className="breathing-phase-text">
        {isActive ? (
          <>
            <h3 className="breathing-phase-label" style={{ color: activeColor }}>
              {BREATH_LABELS[phase]}
            </h3>
            <p className="breathing-phase-sub">{BREATH_SUBLABELS[phase]}</p>
          </>
        ) : (
          <>
            <h3 className="breathing-phase-label" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Box Breathing
            </h3>
            <p className="breathing-phase-sub">4 seconds per phase · Inhale · Hold · Exhale · Hold</p>
          </>
        )}
      </div>

      {/* Phase progress bar */}
      {isActive && (
        <div className="breathing-phase-bar">
          {BREATH_PHASES.map((p, i) => (
            <div key={p} className="breathing-phase-segment">
              <div
                className="breathing-phase-fill"
                style={{
                  width: `${phaseIndex > i ? 100 : phaseIndex === i ? phaseProgress * 100 : 0}%`,
                  background: phaseColors[p],
                }}
              />
              <span className="breathing-phase-segment-label" style={{ color: phaseIndex === i ? phaseColors[p] : 'rgba(255,255,255,0.3)' }}>
                {p === 'hold-in' ? 'Hold' : p === 'hold-out' ? 'Hold' : p === 'inhale' ? 'In' : 'Out'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Control */}
      <div className="breathing-controls">
        {!isActive ? (
          <button
            type="button"
            className="breathing-start-btn"
            onClick={startBreathing}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
            <span>Begin Breathing</span>
          </button>
        ) : (
          <button
            type="button"
            className="breathing-stop-btn"
            onClick={stopBreathing}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
            <span>Stop</span>
          </button>
        )}
      </div>

      {/* Stats */}
      {(isActive || cycleCount > 0) && (
        <div className="breathing-stats">
          <div className="breathing-stat">
            <span className="breathing-stat-value">{cycleCount}</span>
            <span className="breathing-stat-label">Cycles</span>
          </div>
          <div className="pomodoro-stat-divider" />
          <div className="breathing-stat">
            <span className="breathing-stat-value">{formatTime(elapsed)}</span>
            <span className="breathing-stat-label">Duration</span>
          </div>
        </div>
      )}

      {/* Info card */}
      {!isActive && (
        <div className="breathing-info">
          <h4 className="breathing-info-title">What is Box Breathing?</h4>
          <p className="breathing-info-text">
            Used by Navy SEALs and first responders to manage stress, box breathing is a technique where you breathe in 4 equal phases of 4 seconds each.
            It activates your parasympathetic nervous system, lowering heart rate and cortisol levels.
          </p>
          <div className="breathing-info-steps">
            <div className="breathing-info-step" style={{ borderColor: '#67e8f922' }}>
              <span style={{ color: '#67e8f9' }}>1</span>
              <span>Inhale 4s</span>
            </div>
            <div className="breathing-info-step" style={{ borderColor: '#a78bfa22' }}>
              <span style={{ color: '#a78bfa' }}>2</span>
              <span>Hold 4s</span>
            </div>
            <div className="breathing-info-step" style={{ borderColor: '#fb923c22' }}>
              <span style={{ color: '#fb923c' }}>3</span>
              <span>Exhale 4s</span>
            </div>
            <div className="breathing-info-step" style={{ borderColor: '#86efac22' }}>
              <span style={{ color: '#86efac' }}>4</span>
              <span>Hold 4s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// FOCUS MUSIC
// ═══════════════════════════════════════════════════════════════════════
function FocusMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className="focus-music-container">
      {/* Ambient background */}
      <div className="focus-music-ambient" />

      {/* Vinyl / Album art area */}
      <div className="focus-music-visual">
        <div className={`focus-music-vinyl ${isPlaying ? 'focus-music-vinyl--spinning' : ''}`}>
          <div className="focus-music-vinyl-grooves" />
          <div className="focus-music-vinyl-grooves focus-music-vinyl-grooves--2" />
          <div className="focus-music-vinyl-grooves focus-music-vinyl-grooves--3" />
          <div className="focus-music-vinyl-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        </div>

        {/* Waveform bars */}
        <div className={`focus-music-waveform ${isPlaying ? 'focus-music-waveform--active' : ''}`}>
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="focus-music-bar"
              style={{
                animationDelay: `${i * 0.07}s`,
                height: isPlaying ? undefined : '4px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Track info */}
      <div className="focus-music-info">
        <h3 className="focus-music-title">Lofi Hip Hop Radio</h3>
        <p className="focus-music-subtitle">beats to relax/study to · 24/7 live stream</p>
      </div>

      {/* YouTube iframe — audio-first compact embed */}
      <div className={`focus-music-player ${isPlaying ? 'focus-music-player--visible' : ''}`}>
        {!isPlaying ? (
          <button
            type="button"
            className="focus-music-play-btn"
            onClick={handlePlay}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
            <span>Start Listening</span>
          </button>
        ) : (
          <div className="focus-music-iframe-wrap">
            <iframe
              ref={iframeRef}
              width="100%"
              height="80"
              src="https://www.youtube.com/embed/YmQ7jRgf4f0?si=wkpkdeB4mLKf0m-g&autoplay=1"
              title="Lofi Hip Hop Radio — Focus Music"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Expand to video toggle */}
      {isPlaying && (
        <div className="focus-music-expand">
          <div className="focus-music-iframe-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/YmQ7jRgf4f0?si=wkpkdeB4mLKf0m-g"
              title="Lofi Hip Hop Radio — Focus Music (Video)"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Tips card */}
      {!isPlaying && (
        <div className="focus-music-tips">
          <h4 className="focus-music-tips-title">Why Focus Music?</h4>
          <p className="focus-music-tips-text">
            Ambient lo-fi music reduces cognitive load and keeps your brain in a flow state.
            The repetitive, low-complexity beats mask distracting noises without demanding attention.
          </p>
          <div className="focus-music-tips-grid">
            <div className="focus-music-tip">
              <span className="focus-music-tip-icon">🧠</span>
              <span>Reduces anxiety</span>
            </div>
            <div className="focus-music-tip">
              <span className="focus-music-tip-icon">⚡</span>
              <span>Boosts focus</span>
            </div>
            <div className="focus-music-tip">
              <span className="focus-music-tip-icon">🎧</span>
              <span>Masks noise</span>
            </div>
            <div className="focus-music-tip">
              <span className="focus-music-tip-icon">🌊</span>
              <span>Flow state</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function getDotX(phaseIndex: number, progress: number): number {
  switch (phaseIndex) {
    case 0: return 40 + 200 * progress  // top: left to right
    case 1: return 240                    // right: stays at x=240
    case 2: return 240 - 200 * progress  // bottom: right to left
    case 3: return 40                     // left: stays at x=40
    default: return 40
  }
}

function getDotY(phaseIndex: number, progress: number): number {
  switch (phaseIndex) {
    case 0: return 40                     // top: stays at y=40
    case 1: return 40 + 200 * progress   // right: top to bottom
    case 2: return 240                    // bottom: stays at y=240
    case 3: return 240 - 200 * progress  // left: bottom to top
    default: return 40
  }
}
