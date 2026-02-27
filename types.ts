
export enum ReviewStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface FilmVersion {
  id: string;
  versionName: string; // 如 v1.0, v1.1
  uploadDate: string;
  status: ReviewStatus;
  aiScore: number;
  riskLevel: RiskLevel;
  notes: string;
}

export interface FilmRecord {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  status: ReviewStatus;
  riskLevel: RiskLevel;
  aiScore: number;
  submitter: string;
  versions?: FilmVersion[]; // 新增：版本列表
}

export interface AIAnalysisMarker {
  id: string;
  start: number;
  end: number;
  type: string;
  aiAnalysis: string;
}
