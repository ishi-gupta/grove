'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Camera, Link, ImageIcon, Send, Square, Loader2 } from 'lucide-react'

interface RootOpeningProps {
  isActive: boolean
  onSubmit: (content: string, meta?: FeedMeta) => void
  onClose: () => void
}

export interface FeedMeta {
  type: 'text' | 'image' | 'audio' | 'url'
  file?: File
  mediaUrl?: string
  audioDuration?: number
}

export default function RootOpening({ isActive, onSubmit, onClose }: RootOpeningProps) {
  const [value, setValue] = useState('')
  const [inputType, setInputType] = useState<'text' | 'url' | 'file' | 'mic' | 'camera'>('text')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const feedType = inputType === 'url' ? 'url' : 'text'
      onSubmit(value.trim(), { type: feedType })
      setValue('')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsSubmitting(true)
    try {
      onSubmit(file.name, { type: 'image', file })
      onClose()
    } finally {
      setIsSubmitting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [onSubmit, onClose])

  // Mic recording via MediaRecorder API
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], `voice-memo-${Date.now()}.webm`, {
          type: 'audio/webm',
        })
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null

        onSubmit('Voice memo', {
          type: 'audio',
          file: audioFile,
        })
        onClose()
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1)
      }, 1000)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }, [onSubmit, onClose])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
  }, [isRecording])

  // Camera capture
  const handleCameraCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })

      const video = document.createElement('video')
      video.srcObject = stream
      video.setAttribute('playsinline', 'true')

      await video.play()

      // Wait a moment for the camera to focus
      await new Promise((resolve) => setTimeout(resolve, 500))

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
      }

      stream.getTracks().forEach((track) => track.stop())

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85)
      })

      const imageFile = new File([blob], `camera-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })

      onSubmit('Camera capture', { type: 'image', file: imageFile })
      onClose()
    } catch (err) {
      console.error('Camera access denied:', err)
    }
  }, [onSubmit, onClose])

  const handleTypeChange = (type: typeof inputType) => {
    if (type === 'mic') {
      if (isRecording) {
        stopRecording()
      } else {
        startRecording()
      }
      return
    }
    if (type === 'camera') {
      handleCameraCapture()
      return
    }
    if (type === 'file') {
      fileInputRef.current?.click()
      return
    }
    setInputType(type)
  }

  const placeholder = {
    text: 'feed the tree\u2026',
    url: 'paste a link \u2014 instagram, spotify, article\u2026',
    file: 'drag a file here\u2026',
    mic: isRecording ? `recording\u2026 ${formatTime(recordingTime)}` : 'tap to record',
    camera: 'photograph something \u2014 a page, a note, a scene',
  }[inputType]

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center pb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg px-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Input type selectors */}
            <div className="flex gap-3 justify-center mb-4">
              {([
                { type: 'url' as const, icon: Link },
                { type: 'file' as const, icon: ImageIcon },
                { type: 'mic' as const, icon: isRecording ? Square : Mic },
                { type: 'camera' as const, icon: Camera },
              ]).map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className="transition-all"
                  style={{
                    color: inputType === type || (type === 'mic' && isRecording)
                      ? 'rgba(200, 180, 140, 0.8)'
                      : 'rgba(200, 180, 140, 0.25)',
                    padding: '4px',
                  }}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* Root glow */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-48 h-8 rounded-full pointer-events-none"
              style={{
                bottom: '5.5rem',
                background: 'radial-gradient(ellipse, rgba(200,180,140,0.18) 0%, transparent 70%)',
              }}
              animate={{ opacity: [0.5, 0.9, 0.5], scaleX: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Recording indicator */}
            {isRecording && (
              <motion.div
                className="flex items-center justify-center gap-2 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#e05555' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(200, 180, 140, 0.6)',
                  letterSpacing: '0.05em',
                }}>
                  {formatTime(recordingTime)} \u2014 tap mic to stop
                </span>
              </motion.div>
            )}

            {/* Input form */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                disabled={isRecording}
                className="w-full pr-12 transition-all focus:outline-none"
                style={{
                  background: 'rgba(10, 10, 20, 0.85)',
                  border: '1px solid rgba(200, 180, 140, 0.18)',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  fontSize: '14px',
                  color: 'rgba(232, 213, 183, 0.85)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(200, 180, 140, 0.12), inset 0 0 20px rgba(200, 180, 140, 0.04)',
                  opacity: isRecording ? 0.5 : 1,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 180, 140, 0.35)'
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(200, 180, 140, 0.2), inset 0 0 20px rgba(200, 180, 140, 0.06)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 180, 140, 0.18)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(200, 180, 140, 0.12), inset 0 0 20px rgba(200, 180, 140, 0.04)'
                }}
              />

              {value && !isSubmitting && (
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity"
                  style={{ color: 'rgba(200, 180, 140, 0.5)' }}
                >
                  <Send size={14} />
                </button>
              )}

              {isSubmitting && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 size={14} className="animate-spin" style={{ color: 'rgba(200, 180, 140, 0.5)' }} />
                </div>
              )}

              {/* Pulse dot when empty */}
              {!value && !isSubmitting && !isRecording && (
                <motion.div
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'rgba(200, 180, 140, 0.4)' }}
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </form>

            {/* Hint */}
            <p className="text-center mt-4" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 300,
              color: 'rgba(200, 180, 140, 0.2)',
              letterSpacing: '0.05em',
            }}>
              anything you feed the tree becomes yours
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
