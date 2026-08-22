/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { useAppStore } from './store/useAppStore';
import { HomeScreen } from './components/screens/HomeScreen';
import { PermissionScreen } from './components/screens/PermissionScreen';
import { ScannerScreen } from './components/screens/ScannerScreen';
import { ProcessingScreen } from './components/screens/ProcessingScreen';
import { ViewerScreen } from './components/screens/ViewerScreen';

export default function App() {
  const { appState, errorMessage } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'IDLE' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen w-full absolute inset-0">
            <HomeScreen />
          </motion.div>
        )}
        {appState === 'CAMERA_PERMISSION' && (
          <motion.div key="permission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen w-full absolute inset-0">
            <PermissionScreen />
          </motion.div>
        )}
        {(appState === 'READY' || appState === 'SCANNING' || appState === 'SCAN_REVIEW') && (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen w-full absolute inset-0 bg-black">
            <ScannerScreen />
          </motion.div>
        )}
        {appState === 'PROCESSING' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen w-full absolute inset-0">
            <ProcessingScreen />
          </motion.div>
        )}
        {appState === 'MODEL_READY' && (
          <motion.div key="viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen w-full absolute inset-0">
            <ViewerScreen />
          </motion.div>
        )}
        {appState === 'ERROR' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen w-full absolute inset-0">
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
               <h1 className="text-2xl font-semibold mb-4">Permission Denied</h1>
               <p className="text-neutral-500 mb-6 max-w-md">
                 {errorMessage || "Camera access was denied or is unavailable."}
               </p>
               <div className="bg-neutral-50 p-4 rounded-xl mb-8 border border-neutral-100 max-w-sm">
                 <p className="text-sm text-neutral-600">
                   <strong>Note:</strong> If you are using the AI Studio preview, your browser may block camera access. <strong>Please open this application in a new tab</strong> to grant camera permissions.
                 </p>
               </div>
               <button onClick={() => useAppStore.getState().reset()} className="px-8 py-4 bg-black text-white rounded-full font-medium">Back to Home</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
