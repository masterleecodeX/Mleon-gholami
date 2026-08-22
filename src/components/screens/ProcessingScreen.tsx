import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'motion/react';

const PROCESSING_STEPS = [
  "Analyzing facial geometry...",
  "Combining scan data...",
  "Reconstructing head shape...",
  "Generating 3D model...",
  "Finalizing details..."
];

export function ProcessingScreen() {
  const setAppState = useAppStore(state => state.setAppState);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Mock processing progression
    const totalTime = 8000; // 8 seconds total
    const timePerStep = totalTime / PROCESSING_STEPS.length;
    
    let isMounted = true;
    
    // Progress bar animation
    const startTime = Date.now();
    const animateProgress = () => {
      if (!isMounted) return;
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, (elapsed / totalTime) * 100);
      setProgress(p);
      
      if (p < 100) {
        requestAnimationFrame(animateProgress);
      }
    };
    requestAnimationFrame(animateProgress);
    
    // Step text animation
    const intervals = PROCESSING_STEPS.map((_, i) => {
      if (i === 0) return null;
      return setTimeout(() => {
        if (isMounted) setCurrentStep(i);
      }, timePerStep * i);
    });
    
    // Finish
    const finishTimeout = setTimeout(() => {
      if (isMounted) {
        setAppState('MODEL_READY');
      }
    }, totalTime + 500);
    
    return () => {
      isMounted = false;
      intervals.forEach(t => t && clearTimeout(t));
      clearTimeout(finishTimeout);
    };
  }, [setAppState]);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto px-6">
      
      {/* Abstract 3D shape loading indicator (CSS driven) */}
      <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 rounded-full border-[1px] border-neutral-200"
          animate={{ rotateX: 360, rotateY: 180 }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full border-[1px] border-neutral-300"
          animate={{ rotateX: 180, rotateY: 360 }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div 
          className="absolute inset-2 rounded-full border-[1px] border-neutral-900/10"
          animate={{ rotateZ: 360 }}
          transition={{ duration: 5, ease: "linear", repeat: Infinity }}
        />
      </div>
      
      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-medium text-neutral-900 mb-6 text-center"
      >
        {PROCESSING_STEPS[currentStep]}
      </motion.div>
      
      {/* Sleek progress bar */}
      <div className="w-full max-w-xs h-1 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-neutral-900 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
    </div>
  );
}
