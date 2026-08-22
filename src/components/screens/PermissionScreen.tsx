import { useAppStore } from '../../store/useAppStore';
import { motion } from 'motion/react';
import { Sun, User, Move } from 'lucide-react';

export function PermissionScreen() {
  const setAppState = useAppStore((state) => state.setAppState);
  const setErrorMessage = useAppStore((state) => state.setErrorMessage);

  const requestCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // We don't store the stream here, we just check permission.
      // The scanner component will request it again to render.
      // Alternatively, we could store it in the store, but requesting again is fine.
      stream.getTracks().forEach(track => track.stop());
      setAppState('READY');
    } catch (error: any) {
      console.error(error);
      if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
        setErrorMessage('Camera access was denied. Please allow camera access in your browser settings.');
      } else {
        setErrorMessage(error.message || 'Camera access was denied or is unavailable.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center w-full"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-4">
          Ready to scan?
        </h2>
        <p className="text-lg text-neutral-500 mb-10 max-w-sm">
          Place your face inside the frame and make sure your surroundings are well lit.
        </p>
        
        <div className="flex flex-col gap-6 mb-12 w-full max-w-sm">
          <div className="flex items-center gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Good lighting</h3>
              <p className="text-sm text-neutral-500">Ensure your face is evenly lit.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Face clearly visible</h3>
              <p className="text-sm text-neutral-500">Remove glasses or masks.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700">
              <Move className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Move slowly</h3>
              <p className="text-sm text-neutral-500">Smooth movements yield better results.</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={requestCamera}
          className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full font-medium text-lg w-full max-w-xs transition-colors shadow-sm active:scale-95 transform"
        >
          Allow Camera
        </button>
        
        <button
          onClick={() => setAppState('IDLE')}
          className="mt-4 px-8 py-4 bg-transparent text-neutral-500 hover:text-neutral-800 rounded-full font-medium text-base transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
