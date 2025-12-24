
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCcw, UserCheck, AlertCircle, Scan, UserPlus, ShieldAlert, Zap, Eye, Ghost } from 'lucide-react';
import { recognizeStudent } from '../services/geminiService';
import { Student, RecognitionResponse } from '../types';
import RegisterStudentModal from './RegisterStudentModal';

interface AttendanceScannerProps {
  students: Student[];
  onRecognized: (studentId: string, method: 'Face Recognition') => void;
}

const AttendanceScanner: React.FC<AttendanceScannerProps> = ({ students, onRecognized }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'loading' | 'spoof', message: string }>({
    type: 'idle',
    message: 'Liveness Probe Ready'
  });
  const [lastRecognized, setLastRecognized] = useState<RecognitionResponse | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setStatus({ type: 'error', message: 'Sensor Disconnected' });
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    setStatus({ type: 'loading', message: 'Analyzing Liveness...' });
    setLastRecognized(null);

    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
      
      try {
        const result = await recognizeStudent(imageData, students);
        
        if (!result.isLive) {
          setStatus({ type: 'spoof', message: '2D/SPOOF DETECTED' });
          setLastRecognized(result);
        } else if (result.studentId) {
          onRecognized(result.studentId, 'Face Recognition');
          setStatus({ type: 'success', message: `Human Verified: ${result.name}` });
          setLastRecognized(result);
          
          setTimeout(() => {
            setStatus({ type: 'idle', message: 'Liveness Probe Ready' });
            setLastRecognized(null);
          }, 4000);
        } else {
          setStatus({ type: 'error', message: 'Unknown Human' });
        }
      } catch (e) {
        setStatus({ type: 'error', message: 'Probe Failure' });
      }
    }
    setIsScanning(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center space-x-3">
            <span>Human Verification</span>
            <div className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded text-xs font-bold uppercase tracking-widest">Active Liveness</div>
          </h1>
          <p className="text-slate-500 font-medium">Only live subjects are granted access. Static photos are rejected.</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl border-2 flex items-center space-x-3 transition-all duration-300 shadow-sm ${
          status.type === 'loading' ? 'bg-amber-50 border-amber-200 text-amber-700' :
          status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 scale-105 shadow-emerald-100' :
          status.type === 'spoof' ? 'bg-rose-600 border-rose-400 text-white animate-pulse' :
          status.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
          'bg-white border-slate-100 text-slate-400'
        }`}>
          {status.type === 'loading' && <RefreshCcw size={18} className="animate-spin" />}
          {status.type === 'success' && <UserCheck size={18} className="animate-bounce" />}
          {status.type === 'spoof' && <Ghost size={18} />}
          {status.type === 'error' && <ShieldAlert size={18} />}
          {status.type === 'idle' && <Zap size={18} />}
          <span className="text-sm font-bold uppercase tracking-widest">{status.message}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="relative group">
            <div className="aspect-[16/9] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-all duration-500 ${status.type === 'spoof' ? 'sepia hue-rotate-180 brightness-50' : 'grayscale-[0.1]'}`}
                style={{ transform: 'scaleX(-1)' }}
              />
              
              <div className="absolute inset-0 pointer-events-none">
                {/* Viewfinder Corners */}
                <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-indigo-400/60 rounded-tl-2xl"></div>
                <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-indigo-400/60 rounded-tr-2xl"></div>
                <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-indigo-400/60 rounded-bl-2xl"></div>
                <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-indigo-400/60 rounded-br-2xl"></div>
                
                {/* Scanning Bar with Depth Effect */}
                {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-scan-fast"></div>
                )}

                {/* Depth Target */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-indigo-400/20 rounded-[4rem] border-dashed"></div>
              </div>

              {status.type === 'spoof' && (
                <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center">
                  <div className="bg-rose-600 p-8 rounded-full border-4 border-white animate-ping">
                    <ShieldAlert size={64} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={captureAndScan}
              disabled={isScanning}
              className={`flex-1 flex items-center justify-center space-x-3 py-6 rounded-3xl font-black text-lg transition-all shadow-xl group ${
                isScanning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                status.type === 'spoof' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95'
              }`}
            >
              <Eye size={24} className="group-hover:rotate-12 transition-transform" />
              <span>{isScanning ? 'ANALYZING DEPTH...' : 'INITIATE LIVENESS SCAN'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="font-black text-slate-900 text-xl mb-6 flex items-center space-x-2">
              <ShieldAlert size={24} className={status.type === 'spoof' ? 'text-rose-600' : 'text-indigo-600'} />
              <span>Security Report</span>
            </h3>
            
            <div className="min-h-[300px] flex flex-col justify-center">
              {lastRecognized ? (
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="text-center space-y-4">
                    <div className={`inline-block p-1 ${lastRecognized.isLive ? 'bg-emerald-100' : 'bg-rose-100'} rounded-full mb-2`}>
                       <div className={`w-24 h-24 ${lastRecognized.isLive ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full flex items-center justify-center text-white text-3xl font-black`}>
                        {lastRecognized.isLive ? lastRecognized.name?.charAt(0) : <Ghost size={40} />}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">{lastRecognized.isLive ? lastRecognized.name : 'SPOOF DETECTED'}</h4>
                      <p className={`font-bold uppercase tracking-widest text-xs mt-1 ${lastRecognized.isLive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {lastRecognized.isLive ? 'Liveness Confirmed' : 'Rejected: 2D Image Detected'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border ${lastRecognized.isLive ? 'bg-slate-50 border-slate-100' : 'bg-rose-50 border-rose-100'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Biometric Analysis</p>
                    <p className="text-sm font-medium text-slate-700 italic">"{lastRecognized.reasoning}"</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 py-10 opacity-40">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Scan size={32} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Align subject within depth target to initiate biometric probe...</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-950 p-8 rounded-[2rem] text-white shadow-2xl overflow-hidden relative group">
            <h3 className="font-black text-lg mb-4">Liveness Protocol</h3>
            <ul className="space-y-4">
              {[
                'Subject must perform slight eye movement',
                'No glossy photos or screens allowed',
                'Ambient light must be consistent',
                'Multiple-point depth analysis active'
              ].map((text, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-indigo-200">
                  <div className="w-5 h-5 bg-indigo-800 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black text-white">✓</div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      <RegisterStudentModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSuccess={(s) => {
          onRecognized(s.id, 'Face Recognition');
          setLastRecognized({ studentId: s.id, name: s.name, confidence: 1.0, isLive: true });
        }} 
      />
    </div>
  );
};

export default AttendanceScanner;
