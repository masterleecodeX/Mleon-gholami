export type AppState = 
  | 'IDLE' 
  | 'CAMERA_PERMISSION' 
  | 'READY' 
  | 'SCANNING' 
  | 'SCAN_REVIEW' 
  | 'PROCESSING' 
  | 'MODEL_READY' 
  | 'ERROR';

export type ScanZone = 
  | 'FRONT'
  | 'LEFT'
  | 'RIGHT'
  | 'TOP'
  | 'BACK'
  | 'CHIN'
  | 'LEFT_EAR'
  | 'RIGHT_EAR';

export interface CoverageData {
  FRONT: number;
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BACK: number;
  CHIN: number;
  LEFT_EAR: number;
  RIGHT_EAR: number;
}

export interface ScanResult {
  frames: string[]; // Base64 or object URLs
  coverage: CoverageData;
}
