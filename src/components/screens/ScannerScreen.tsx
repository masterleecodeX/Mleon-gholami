import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CoverageData, ScanZone } from '../../types';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const TOTAL_ZONES: ScanZone[] = ['FRONT', 'LEFT', 'RIGHT', 'TOP', 'CHIN', 'LEFT_EAR', 'RIGHT_EAR', 'BACK'];

export function ScannerScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { appState, setAppState, setScanResult, setErrorMessage } = useAppStore();
  
  const [coverage, setCoverage] = useState<CoverageData>({
    FRONT: 0,
    LEFT: 0,
    RIGHT: 0,
    TOP: 0,
    BACK: 0,
    CHIN: 0,
    LEFT_EAR: 0,
    RIGHT_EAR: 0,
  });
  
  const [currentGuidance, setCurrentGuidance] = useState<string>("Look straight ahead");
  const [overallProgress, setOverallProgress] = useState(0);

  // Initialize camera
  useEffect(() => {
    let active = true;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported in this browser environment.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          // When camera starts, wait a moment then move to SCANNING
          setTimeout(() => {
            if (active) setAppState('SCANNING');
          }, 1500);
        } else {
           stream.getTracks().forEach(t => t.stop());
        }
      } catch (err: any) {
        console.error("Camera error", err);
        if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
          setErrorMessage('Camera access was denied. Please allow camera access in your browser settings.');
        } else {
          setErrorMessage(err.message || 'Camera access was denied or is unavailable.');
        }
      }
    };
    startCamera();
    
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [setAppState, setErrorMessage]);

  // Mock Scanning Logic
  useEffect(() => {
    if (appState !== 'SCANNING') return;
    
    let isScanning = true;
    
    const scanSequence = [
      { zone: 'FRONT', instruction: 'Look straight ahead', time: 2000 },
      { zone: 'LEFT', instruction: 'Turn slowly to the left', time: 3000 },
      { zone: 'LEFT_EAR', instruction: 'Scanning your left ear', time: 2000 },
      { zone: 'RIGHT', instruction: 'Turn slowly to the right', time: 3500 },
      { zone: 'RIGHT_EAR', instruction: 'Scanning your right ear', time: 2000 },
      { zone: 'TOP', instruction: 'Look slightly upward', time: 2500 },
      { zone: 'CHIN', instruction: 'Tilt your head down', time: 2500 },
      { zone: 'BACK', instruction: 'Turn further to capture back', time: 3500 },
    ];
    
    let currentSequenceIndex = 0;
    
    const runScan = async () => {
      while (isScanning && currentSequenceIndex < scanSequence.length) {
        const step = scanSequence[currentSequenceIndex];
        setCurrentGuidance(step.instruction);
        
        // Animate the coverage for this zone over 'time'
        const steps = 10;
        const intervalTime = step.time / steps;
        
        for (let i = 1; i <= steps; i++) {
          if (!isScanning) return;
          await new Promise(r => setTimeout(r, intervalTime));
          
          setCoverage(prev => {
            const newCoverage = { ...prev };
            newCoverage[step.zone as ScanZone] = Math.min(100, (i / steps) * 100);
            
            // Calculate overall
            const total = Object.values(newCoverage).reduce((a, b) => a + b, 0);
            const overall = Math.round(total / (TOTAL_ZONES.length * 100) * 100);
            setOverallProgress(overall);
            
            return newCoverage;
          });
        }
        
        currentSequenceIndex++;
      }
      
      if (isScanning) {
        setCurrentGuidance("Scan complete.");
        setAppState('SCAN_REVIEW');
      }
    };
    
    runScan();
    
    return () => {
      isScanning = false;
    };
  }, [appState, setAppState]);
  
  const handleComplete = () => {
    setScanResult({ frames: [], coverage });
    setAppState('PROCESSING');
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Video Feed */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        style={{ transform: 'scaleX(-1)' }}
      />
      
      {/* Scanning UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Top Header */}
        <div className="pt-safe-top px-6 py-6 flex justify-between items-center w-full">
           <button onClick={() => setAppState('IDLE')} className="text-white/70 hover:text-white transition">Cancel</button>
           <div className="text-white font-medium">
             {appState === 'READY' ? 'Preparing...' : 'Scanning'}
           </div>
           <div className="w-16"></div> {/* Spacer for centering */}
        </div>
        
        {/* Face Guide Box */}
        <div className="flex-1 flex items-center justify-center relative w-full pointer-events-none">
          {/* Subtle bounding box for face */}
          <motion.div 
            className="w-64 h-80 rounded-[3rem] border-2 border-white/20 relative"
            animate={{ scale: appState === 'READY' ? 1.05 : 1, borderColor: appState === 'SCANNING' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          >
             {/* Corner brackets */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/60 rounded-tl-[3rem]" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/60 rounded-tr-[3rem]" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/60 rounded-bl-[3rem]" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/60 rounded-br-[3rem]" />
          </motion.div>
        </div>
        
        {/* Bottom Information */}
        <div className="pb-safe-bottom px-6 pb-12 w-full flex flex-col items-center">
           {/* Guidance Text */}
           <motion.div 
             key={currentGuidance}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-white text-xl font-medium mb-8 text-center drop-shadow-md"
           >
             {currentGuidance}
           </motion.div>
           
           {/* Progress visualization */}
           {appState === 'SCANNING' && (
             <div className="w-full max-w-sm">
               <div className="flex justify-between text-white/70 text-sm font-medium mb-2">
                 <span>Coverage</span>
                 <span>{overallProgress}%</span>
               </div>
               <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-6">
                 <motion.div 
                   className="h-full bg-white"
                   initial={{ width: 0 }}
                   animate={{ width: `${overallProgress}%` }}
                   transition={{ ease: "linear" }}
                 />
               </div>
               
               {/* Zones detail (subtle) */}
               <div className="flex flex-wrap justify-center gap-2">
                 {TOTAL_ZONES.map(zone => {
                   const isComplete = coverage[zone] >= 99;
                   return (
                     <div key={zone} className={`text-[10px] px-2 py-1 rounded-full border flex items-center gap-1 transition-colors ${isComplete ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-white/50'}`}>
                       {zone.replace('_', ' ')}
                       {isComplete && <Check className="w-3 h-3" />}
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
           
           {/* Review state */}
           {appState === 'SCAN_REVIEW' && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-sm flex flex-col items-center"
             >
               <button
                 onClick={handleComplete}
                 className="px-8 py-4 w-full bg-white text-black rounded-full font-medium text-lg mb-4 transition-transform active:scale-95"
               >
                 Create 3D Model
               </button>
               <button
                 onClick={() => {
                   setCoverage({ FRONT: 0, LEFT: 0, RIGHT: 0, TOP: 0, BACK: 0, CHIN: 0, LEFT_EAR: 0, RIGHT_EAR: 0 });
                   setOverallProgress(0);
                   setAppState('SCANNING');
                 }}
                 className="text-white/70 font-medium hover:text-white"
               >
                 Rescan
               </button>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
