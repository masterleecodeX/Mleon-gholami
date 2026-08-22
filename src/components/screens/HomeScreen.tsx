import { useAppStore } from '../../store/useAppStore';
import { motion } from 'motion/react';

export function HomeScreen() {
  const setAppState = useAppStore((state) => state.setAppState);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-4">
          Create your 3D self.
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 mb-12 font-medium max-w-md">
          Scan your head from every angle and create a realistic 3D model of your face.
        </p>
        
        <button
          onClick={() => setAppState('CAMERA_PERMISSION')}
          className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full font-medium text-lg transition-colors shadow-sm active:scale-95 transform"
        >
          Start Scan
        </button>
        
        <p className="mt-6 text-sm text-neutral-400 font-medium">
          Your camera is used only during the scanning process.
        </p>
      </motion.div>
    </div>
  );
}
