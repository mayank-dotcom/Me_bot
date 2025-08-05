// "use client"

// import { useState, useRef } from "react"
// import { Card, CardContent } from "@/app/components/ui/card"
// import { Badge } from "@/app/components/ui/badge"
// import { Mic, MicOff, User, Briefcase, GraduationCap, MapPin, Phone, Mail, Loader2, Volume2, Download, Github, Linkedin } from "lucide-react"

// // Declare global types at the top level
// declare global {
//   interface Window {
//     webkitAudioContext?: typeof AudioContext;
//   }
// }

// export default function VoiceAssistant() {
//   const [isListening, setIsListening] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [audioLevel, setAudioLevel] = useState(0)
//   const mediaRecorder = useRef<MediaRecorder | null>(null)
//   const audioChunks = useRef<Blob[]>([])
//   const audioContext = useRef<AudioContext | null>(null)
//   const analyser = useRef<AnalyserNode | null>(null)
//   const dataArray = useRef<Uint8Array & { buffer: ArrayBuffer } | null>(null)
//   const source = useRef<MediaStreamAudioSourceNode | null>(null)
//   const silenceTimer = useRef<NodeJS.Timeout | null>(null)
//   const animationFrameId = useRef<number | null>(null)
//   const currentAudio = useRef<HTMLAudioElement | null>(null)

//   const handleStartRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
//       // Setup media recorder
//       const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
//       mediaRecorder.current = recorder
//       audioChunks.current = []

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunks.current.push(event.data)
//         }
//       }

//       recorder.onstop = async () => {
//         setIsProcessing(true)
//         const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
//         audioChunks.current = []

//         // Stop audio processing and stream
//         if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
//         if (silenceTimer.current) clearTimeout(silenceTimer.current)
//         stream.getTracks().forEach((track) => track.stop())
//         if (audioContext.current && audioContext.current.state !== 'closed') {
//           await audioContext.current.close();
//         }
//         audioContext.current = null

//         const formData = new FormData()
//         formData.append("audio", audioBlob, "recording.webm")

//         try {
//           const response = await fetch("/api/talk", {
//             method: "POST",
//             body: formData,
//           })

//           if (!response.ok) {
//             const err = await response.json()
//             throw new Error(err.error || `API request failed with status ${response.status}`)
//           }

//           const responseAudioBlob = await response.blob()
//           const responseAudioUrl = URL.createObjectURL(responseAudioBlob)
//           const audio = new Audio(responseAudioUrl)
//           currentAudio.current = audio
          
//           // Add audio event listeners
//           audio.onplay = () => setIsPlaying(true)
//           audio.onended = () => {
//             setIsPlaying(false)
//             URL.revokeObjectURL(responseAudioUrl)
//           }
//           audio.onerror = () => setIsPlaying(false)
          
//           audio.play()
//         } catch (error) {
//           console.error("Error processing audio:", error)
//           alert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`)
//         } finally {
//           setIsProcessing(false)
//         }
//       }

//       // Setup audio analysis for silence detection
//       try {
//         audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
//         analyser.current = audioContext.current.createAnalyser()
//         analyser.current.fftSize = 256
//         const bufferLength = analyser.current.frequencyBinCount
//         // Fix: Create Uint8Array with explicit ArrayBuffer
//         dataArray.current = new Uint8Array(bufferLength)
//         source.current = audioContext.current.createMediaStreamSource(stream)
//         source.current.connect(analyser.current)

//         const detectSilence = () => {
//           if (!analyser.current || !dataArray.current) return

//           // Fix: Handle the Uint8Array properly with type assertion for Web Audio API
//           analyser.current.getByteFrequencyData(dataArray.current as Uint8Array & { buffer: ArrayBuffer })
//           const average = dataArray.current.reduce((acc, val) => acc + val, 0) / dataArray.current.length
//           setAudioLevel(average)

//           if (average < 35) { // Silence threshold
//             if (!silenceTimer.current) {
//               silenceTimer.current = setTimeout(() => {
//                 handleStopRecording()
//               }, 5000) // 5 seconds of silence
//             }
//           } else {
//             if (silenceTimer.current) {
//               clearTimeout(silenceTimer.current)
//               silenceTimer.current = null
//             }
//           }
//           animationFrameId.current = requestAnimationFrame(detectSilence)
//         }

//         recorder.start()
//         setIsListening(true)
//         detectSilence()
//       } catch (audioError) {
//         console.error("Error setting up audio analysis:", audioError)
//         // Continue without audio analysis if it fails
//         recorder.start()
//         setIsListening(true)
//       }

//     } catch (error) {
//       console.error("Error accessing microphone:", error)
//       alert("Could not access microphone. Please check permissions and try again.")
//     }
//   }

//   const handleStopRecording = () => {
//     if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
//       mediaRecorder.current.stop()
//     }
//     if (animationFrameId.current) {
//       cancelAnimationFrame(animationFrameId.current)
//       animationFrameId.current = null
//     }
//     if (silenceTimer.current) {
//       clearTimeout(silenceTimer.current)
//       silenceTimer.current = null
//     }
//     setIsListening(false)
//     setAudioLevel(0)
//   }

//   const toggleListening = () => {
//     if (isListening) {
//       handleStopRecording()
//     } else {
//       handleStartRecording()
//     }
//   }

//   const skills = [
//     "React.js",
//     "Next.js",
//     "Node.js",
//     "Express.js",
//     "MongoDB",
//     "VectorDB",
//     "Langchain",
//     "Python",
//     "Git",
//   ]

//   const getStatusText = () => {
//     if (isPlaying) return "Speaking..."
//     if (isProcessing) return "Processing..."
//     if (isListening) return "Listening..."
//     return "Ready to talk"
//   }

//   const getStatusColor = () => {
//     if (isPlaying) return "bg-purple-500 text-white animate-pulse"
//     if (isProcessing) return "bg-yellow-500 text-white"
//     if (isListening) return "bg-green-500 text-white animate-pulse"
//     return "bg-gray-200 text-gray-700"
//   }

//   const getAvatarIcon = () => {
//     if (isPlaying) return <Volume2 className="w-16 h-16 text-white animate-pulse" />
//     if (isListening) return <Mic className="w-16 h-16 text-white animate-bounce" />
//     return <User className="w-16 h-16 text-white" />
//   }

//   const getButtonContent = () => {
//     if (isProcessing) {
//       return <Loader2 className="w-12 h-12 animate-spin text-yellow-500 drop-shadow-lg" />
//     }
//     if (isListening) {
//       return <MicOff className="w-12 h-12 text-red-500 animate-pulse drop-shadow-lg" />
//     }
//     // Blue mic icon for ready state
//     return <Mic className="w-12 h-12 text-blue-500 drop-shadow-lg hover:text-blue-600 transition-colors" />
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi, I&apos;m Mayank Mishra</h1>
//           <p className="text-xl text-gray-600">Generative AI Developer</p>
//         </div>

//         {/* Main Assistant Interface */}
//         <Card className="mb-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//           <CardContent className="p-8">
//             <div className="flex flex-col lg:flex-row items-center gap-8">
//               {/* Avatar Section */}
//               <div className="flex-shrink-0 text-center">
//                 <div className="relative">
//                   {/* Profile Image Placeholder */}
//                   <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg transition-all duration-500 ${
//                     isPlaying 
//                       ? 'bg-gradient-to-br from-purple-400 to-pink-600 animate-pulse' 
//                       : isListening 
//                       ? 'bg-gradient-to-br from-green-400 to-blue-600' 
//                       : 'bg-gradient-to-br from-blue-400 to-indigo-600'
//                   }`}>
//                     {getAvatarIcon()}
                    
//                     {/* Ripple effect when playing */}
//                     {isPlaying && (
//                       <>
//                         <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
//                         <div className="absolute inset-2 rounded-full bg-purple-300 animate-ping opacity-30 animation-delay-75"></div>
//                       </>
//                     )}
//                   </div>

//                   {/* Status Indicator */}
//                   <div
//                     className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusColor()}`}
//                   >
//                     {getStatusText()}
//                   </div>
//                 </div>

//                 {/* Voice Controls */}
//                 <div className="mt-6">
//                   <button
//                     onClick={toggleListening}
//                     disabled={isProcessing || isPlaying}
//                     className="transition-all duration-300 transform hover:scale-110 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {getButtonContent()}
//                   </button>

//                   {/* Audio Visualizers */}
//                   {isListening && (
//                     <div className="flex justify-center items-end gap-1 mt-4 h-8">
//                       {[...Array(7)].map((_, i) => (
//                         <div
//                           key={i}
//                           className="w-2 bg-blue-500 rounded-full transition-all duration-150 animate-pulse"
//                           style={{
//                             height: `${Math.max(4, (audioLevel * 2) / (i + 1))}px`,
//                             animationDelay: `${i * 0.1}s`,
//                           }}
//                         />
//                       ))}
//                     </div>
//                   )}

//                   {/* Playing Animation */}
//                   {isPlaying && (
//                     <div className="flex justify-center items-center gap-1 mt-4 h-8">
//                       {[...Array(5)].map((_, i) => (
//                         <div
//                           key={i}
//                           className="w-1 bg-purple-500 rounded-full animate-pulse"
//                           style={{
//                             height: `${16 + Math.sin(Date.now() * 0.01 + i) * 8}px`,
//                             animationDelay: `${i * 0.2}s`,
//                           }}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Profile Information */}
//               <div className="flex-1 text-center lg:text-left">
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">BTech CS (AI/ML) Student</h2>
//                   <p className="text-gray-600 leading-relaxed">
//                     A final-year student with a passion for building intelligent applications. Experienced in full-stack development and AI integration, seeking to solve real-world problems.
//                   </p>
//                 </div>

//                 {/* Quick Info */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
//                     <GraduationCap className="w-4 h-4" />
//                     <span>AIMT College, Lucknow</span>
//                   </div>
//                   <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
//                     <MapPin className="w-4 h-4" />
//                     <span>Lucknow, UP, India</span>
//                   </div>
//                   <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
//                     <Mail className="w-4 h-4" />
//                     <span>mayank642work@gmail.com</span>
//                   </div>
//                   <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
//                     <Phone className="w-4 h-4" />
//                     <span>+91 9984488950</span>
//                   </div>
//                 </div>

//                 {/* Skills */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Skills</h3>
//                   <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
//                     {skills.map((skill, index) => (
//                       <Badge
//                         key={index}
//                         variant="secondary"
//                         className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
//                       >
//                         {skill}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Action Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <a href="/resume.pdf" download>
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
//               <CardContent className="p-6 text-center">
//                 <Download className="w-8 h-8 text-blue-500 mx-auto mb-3" />
//                 <h3 className="font-semibold text-gray-900 mb-2">Download Resume</h3>
//                 <p className="text-sm text-gray-600">Get a copy of my resume.</p>
//               </CardContent>
//             </Card>
//           </a>

//           <a href="https://myportfolio-jscw.vercel.app/" target="_blank" rel="noopener noreferrer">
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
//               <CardContent className="p-6 text-center">
//                 <Briefcase className="w-8 h-8 text-green-500 mx-auto mb-3" />
//                 <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
//                 <p className="text-sm text-gray-600">Explore my projects on GitHub.</p>
//               </CardContent>
//             </Card>
//           </a>

//           <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <User className="w-8 h-8 text-purple-500 mx-auto mb-3" />
//               <h3 className="font-semibold text-gray-900 mb-2">Socials</h3>
//               <div className="flex justify-center gap-4">
//                 <a href="https://www.linkedin.com/in/mayank-mishra-475570328/" target="_blank" rel="noopener noreferrer">
//                   <Linkedin className="w-6 h-6 text-gray-600 hover:text-blue-700" />
//                 </a>
//                 <a href="https://github.com/mayank-dotcom" target="_blank" rel="noopener noreferrer">
//                   <Github className="w-6 h-6 text-gray-600 hover:text-gray-900" />
//                 </a>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Voice Commands Help */}
//         <Card className="bg-gray-50/80 backdrop-blur-sm border-dashed">
//           <CardContent className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-3 text-center">Try saying:</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
//               <div className="text-center">&quot;Tell me about your internship at Centennial Infotech&quot;</div>
//               <div className="text-center">&quot;What AI projects have you built?&quot;</div>
//               <div className="text-center">&quot;What are your favorite technologies?&quot;</div>
//               <div className="text-center">&quot;What are you passionate about?&quot;</div>
//               <div className="text-center">&quot;Describe your problem-solving approach&quot;</div>
//               <div className="text-center">&quot;What are your career goals?&quot;</div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <style jsx>{`
//         .animation-delay-75 {
//           animation-delay: 75ms;
//         }
//       `}</style>
//     </div>
//   )
// }









"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Mic, MicOff, User, Briefcase, GraduationCap, MapPin, Phone, Mail, Loader2, Volume2, Download, Github, Linkedin } from "lucide-react"

// Declare global types at the top level
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const dataArray = useRef<Uint8Array | null>(null)
  const source = useRef<MediaStreamAudioSourceNode | null>(null)
  const silenceTimer = useRef<NodeJS.Timeout | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const currentAudio = useRef<HTMLAudioElement | null>(null)

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup media recorder
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorder.current = recorder
      audioChunks.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        setIsProcessing(true)
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
        audioChunks.current = []

        // Stop audio processing and stream
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
        if (silenceTimer.current) clearTimeout(silenceTimer.current)
        stream.getTracks().forEach((track) => track.stop())
        if (audioContext.current && audioContext.current.state !== 'closed') {
          await audioContext.current.close();
        }
        audioContext.current = null

        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.webm")

        try {
          const response = await fetch("/api/talk", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error || `API request failed with status ${response.status}`)
          }

          const responseAudioBlob = await response.blob()
          const responseAudioUrl = URL.createObjectURL(responseAudioBlob)
          const audio = new Audio(responseAudioUrl)
          currentAudio.current = audio
          
          // Add audio event listeners
          audio.onplay = () => setIsPlaying(true)
          audio.onended = () => {
            setIsPlaying(false)
            URL.revokeObjectURL(responseAudioUrl)
          }
          audio.onerror = () => setIsPlaying(false)
          
          audio.play()
        } catch (error) {
          console.error("Error processing audio:", error)
          alert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`)
        } finally {
          setIsProcessing(false)
        }
      }

      // Setup audio analysis for silence detection
      try {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        analyser.current = audioContext.current.createAnalyser()
        analyser.current.fftSize = 256
        const bufferLength = analyser.current.frequencyBinCount
        // Fix: Create a properly typed Uint8Array
        const buffer = new ArrayBuffer(bufferLength)
        dataArray.current = new Uint8Array(buffer)
        source.current = audioContext.current.createMediaStreamSource(stream)
        source.current.connect(analyser.current)

        const detectSilence = () => {
          if (!analyser.current || !dataArray.current) return

          // @ts-ignore - Web Audio API type compatibility issue
          analyser.current.getByteFrequencyData(dataArray.current)
          const average = dataArray.current.reduce((acc, val) => acc + val, 0) / dataArray.current.length
          setAudioLevel(average)

          if (average < 35) { // Silence threshold
            if (!silenceTimer.current) {
              silenceTimer.current = setTimeout(() => {
                handleStopRecording()
              }, 5000) // 5 seconds of silence
            }
          } else {
            if (silenceTimer.current) {
              clearTimeout(silenceTimer.current)
              silenceTimer.current = null
            }
          }
          animationFrameId.current = requestAnimationFrame(detectSilence)
        }

        recorder.start()
        setIsListening(true)
        detectSilence()
      } catch (audioError) {
        console.error("Error setting up audio analysis:", audioError)
        // Continue without audio analysis if it fails
        recorder.start()
        setIsListening(true)
      }

    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Could not access microphone. Please check permissions and try again.")
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop()
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current)
      silenceTimer.current = null
    }
    setIsListening(false)
    setAudioLevel(0)
  }

  const toggleListening = () => {
    if (isListening) {
      handleStopRecording()
    } else {
      handleStartRecording()
    }
  }

  const skills = [
    "React.js",
    "Next.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "VectorDB",
    "Langchain",
    "Python",
    "Git",
  ]

  const getStatusText = () => {
    if (isPlaying) return "Speaking..."
    if (isProcessing) return "Processing..."
    if (isListening) return "Listening..."
    return "Ready to talk"
  }

  const getStatusColor = () => {
    if (isPlaying) return "bg-purple-500 text-white animate-pulse"
    if (isProcessing) return "bg-yellow-500 text-white"
    if (isListening) return "bg-green-500 text-white animate-pulse"
    return "bg-gray-200 text-gray-700"
  }

  const getAvatarIcon = () => {
    if (isPlaying) return <Volume2 className="w-16 h-16 text-white animate-pulse" />
    if (isListening) return <Mic className="w-16 h-16 text-white animate-bounce" />
    return <User className="w-16 h-16 text-white" />
  }

  const getButtonContent = () => {
    if (isProcessing) {
      return <Loader2 className="w-12 h-12 animate-spin text-yellow-500 drop-shadow-lg" />
    }
    if (isListening) {
      return <MicOff className="w-12 h-12 text-red-500 animate-pulse drop-shadow-lg" />
    }
    // Blue mic icon for ready state
    return <Mic className="w-12 h-12 text-blue-500 drop-shadow-lg hover:text-blue-600 transition-colors" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi, I&apos;m Mayank Mishra</h1>
          <p className="text-xl text-gray-600">Generative AI Developer</p>
        </div>

        {/* Main Assistant Interface */}
        <Card className="mb-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0 text-center">
                <div className="relative">
                  {/* Profile Image Placeholder */}
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg transition-all duration-500 ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-purple-400 to-pink-600 animate-pulse' 
                      : isListening 
                      ? 'bg-gradient-to-br from-green-400 to-blue-600' 
                      : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                  }`}>
                    {getAvatarIcon()}
                    
                    {/* Ripple effect when playing */}
                    {isPlaying && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
                        <div className="absolute inset-2 rounded-full bg-purple-300 animate-ping opacity-30 animation-delay-75"></div>
                      </>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusColor()}`}
                  >
                    {getStatusText()}
                  </div>
                </div>

                {/* Voice Controls */}
                <div className="mt-6">
                  <button
                    onClick={toggleListening}
                    disabled={isProcessing || isPlaying}
                    className="transition-all duration-300 transform hover:scale-110 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {getButtonContent()}
                  </button>

                  {/* Audio Visualizers */}
                  {isListening && (
                    <div className="flex justify-center items-end gap-1 mt-4 h-8">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-blue-500 rounded-full transition-all duration-150 animate-pulse"
                          style={{
                            height: `${Math.max(4, (audioLevel * 2) / (i + 1))}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Playing Animation */}
                  {isPlaying && (
                    <div className="flex justify-center items-center gap-1 mt-4 h-8">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-purple-500 rounded-full animate-pulse"
                          style={{
                            height: `${16 + Math.sin(Date.now() * 0.01 + i) * 8}px`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">BTech CS (AI/ML) Student</h2>
                  <p className="text-gray-600 leading-relaxed">
                    A final-year student with a passion for building intelligent applications. Experienced in full-stack development and AI integration, seeking to solve real-world problems.
                  </p>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>AIMT College, Lucknow</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Lucknow, UP, India</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>mayank642work@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>+91 9984488950</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Skills</h3>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a href="/resume.pdf" download>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Download className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Download Resume</h3>
                <p className="text-sm text-gray-600">Get a copy of my resume.</p>
              </CardContent>
            </Card>
          </a>

          <a href="https://myportfolio-jscw.vercel.app/" target="_blank" rel="noopener noreferrer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
                <p className="text-sm text-gray-600">Explore my projects on GitHub.</p>
              </CardContent>
            </Card>
          </a>

          <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Socials</h3>
              <div className="flex justify-center gap-4">
                <a href="https://www.linkedin.com/in/mayank-mishra-475570328/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-6 h-6 text-gray-600 hover:text-blue-700" />
                </a>
                <a href="https://github.com/mayank-dotcom" target="_blank" rel="noopener noreferrer">
                  <Github className="w-6 h-6 text-gray-600 hover:text-gray-900" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Commands Help */}
        <Card className="bg-gray-50/80 backdrop-blur-sm border-dashed">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">Try saying:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
              <div className="text-center">&quot;Tell me about your internship at Centennial Infotech&quot;</div>
              <div className="text-center">&quot;What AI projects have you built?&quot;</div>
              <div className="text-center">&quot;What are your favorite technologies?&quot;</div>
              <div className="text-center">&quot;What are you passionate about?&quot;</div>
              <div className="text-center">&quot;Describe your problem-solving approach&quot;</div>
              <div className="text-center">&quot;What are your career goals?&quot;</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .animation-delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  )
}