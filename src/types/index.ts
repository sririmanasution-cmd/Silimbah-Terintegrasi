export type Role =
  | 'peserta'
  | 'instruktur'
  | 'admin_operator'
  | 'pimpinan_operator'
  | 'superadmin'
  | 'verifikator';

export type LearningTrack = 'black_water' | 'grey_water' | 'lengkap';

export type OperatorType = 'IPLT' | 'IPAL Komunal' | 'UPTD PALD';

export interface Operator {
  id: string;
  name: string;
  type: OperatorType;
  regency: string; // Kabupaten / Kota
  logoText: string;
  participantQuota: number;
  licenseExpiry: string;
  licenseStatus: 'active' | 'expiring_soon' | 'expired';
  address: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  operatorId: string;
  track?: LearningTrack;
  classCohort?: string;
  level: number;
  levelTitle: string;
  xp: number;
  badges: string[]; // badge IDs
  completedMissions: Record<string, {
    score: number;
    stars: number;
    xpEarned: number;
    completedAt: string;
    attempts: number;
    hintsUsed: number;
  }>;
  preTestScore?: number;
  postTestScore?: number;
  certificateIssued?: boolean;
  certificateId?: string;
  isAnonymousInLeaderboard?: boolean;
  avatarSeed?: string;
  lastActive: string;
  failedAttemptsCount?: Record<string, number>;
}

export interface MissionAlertDef {
  code: string;
  triggerCondition: string;
  level: 'info' | 'warning' | 'critical';
  correctAction: string;
  clearType: 'auto' | 'manual';
  explanation: string;
  suggestedAction: string;
}

export interface Mission {
  id: string;
  track: 'black_water' | 'grey_water' | 'lengkap' | 'all';
  level: number; // 0 for Pre-test, 1-5, 6 for INT-1, 7 for Post-test
  levelLabel: string;
  title: string;
  subtitle: string;
  maxXP: number;
  targetTimeSeconds: number;
  type: 'pre_test' | 'quiz' | 'drag_drop' | 'simulation' | 'post_test';
  briefing: {
    objective: string;
    background: string;
    guideNarrative: string; // Narasi Pak Joko
  };
  theorySummary: {
    mainConcept: string;
    keyPoints: string[];
    effluentStandards?: { parameter: string; standard: string; unit: string }[];
    caseStudyTitle: string;
    caseStudyContent: string;
  };
  simulationConfig?: {
    diagramType: 'black_water_basic' | 'septic_drag_drop' | 'septic_desludging' | 'iplt_daily' | 'iplt_crisis' | 'grease_trap' | 'biofilter' | 'wetland' | 'reuse_crisis' | 'integrated_ipal';
    objects: SimulationObjectDef[];
    targetAlerts: string[];
  };
}

export interface SimulationObjectDef {
  id: string;
  name: string;
  category: 'inlet' | 'treatment' | 'storage' | 'disposal' | 'pump' | 'control';
  functionDesc: string;
  operatingPrinciple: string;
  normalParameters: string;
  commonFieldMistakes: string;
  standardReference: string;
  iconName: string;
}

export interface ActiveAlert {
  id: string;
  code: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timeTriggered: number; // seconds into simulation
  targetResponseSeconds: number;
  targetAction: string;
  status: 'active' | 'resolved_auto' | 'resolved_manual';
  resolvedAt?: number;
}

export interface SimulationTelemetry {
  sludgeHeightPercent: number; // 0 - 100%
  flowRate: number; // m3/day
  pH: number; // normal 6.0 - 9.0
  BOD: number; // mg/L (limit <= 30)
  COD: number; // mg/L (limit <= 100)
  TSS: number; // mg/L (limit <= 30)
  oilAndGrease: number; // mg/L (limit <= 5)
  totalColiform: number; // CFU/100 mL (limit <= 3000)
  driedSludgeLevelPercent?: number; // 0 - 100%
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  operatorId: string;
  operatorName: string;
  operatorType: OperatorType;
  track: LearningTrack;
  finalScore: number;
  predicate: 'Lulus' | 'Lulus, Sangat Baik' | 'Lulus, Dengan Pujian';
  finalLevelTitle: string;
  issueDate: string;
  status: 'berlaku' | 'dicabut';
  revocationReason?: string;
  instructorName: string;
  directorName: string;
  verificationCode: string;
}

export interface QuizQuestion {
  id: number;
  track: 'black_water' | 'grey_water' | 'lengkap' | 'all';
  level: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface FieldFacility {
  id: string;
  operatorId: string;
  name: string;
  type: 'IPAL Komunal' | 'IPLT' | 'Tangki Septik Bersama';
  capacity: string;
  location: string;
  operationalStatus: 'Optimal' | 'Perlu Perawatan' | 'Kritis';
  lastInspection: string;
  lastDesludgeDate?: string;
  latestEffluentBOD?: number;
  latestEffluentTSS?: number;
}
