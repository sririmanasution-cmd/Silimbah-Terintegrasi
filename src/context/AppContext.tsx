import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Operator,
  Mission,
  Certificate,
  FieldFacility,
  LearningTrack,
  QuizQuestion,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_OPERATORS,
  INITIAL_MISSIONS,
  INITIAL_CERTIFICATES,
  INITIAL_FACILITIES,
  QUESTION_BANK,
} from '../data/mockData';

export type ScreenId =
  | 'login'
  | 'track_select'
  | 'mission_map'
  | 'mission_briefing'
  | 'module_learning'
  | 'simulation'
  | 'quiz_exam'
  | 'debriefing'
  | 'student_dashboard'
  | 'certificate_view'
  | 'operator_dashboard'
  | 'student_detail'
  | 'account_management'
  | 'content_management'
  | 'field_data'
  | 'superadmin'
  | 'public_verification'
  | 'app_narrative';

export interface DebriefResult {
  missionId: string;
  score: number;
  stars: number;
  baseXP: number;
  bonusXP: number;
  totalXP: number;
  hintsUsed: number;
  elapsedSeconds: number;
  unlockedBadgeIds: string[];
  mistakes: string[];
  recommendedReview: string;
}

export interface AlertLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  missionId: string;
  alertCode: string;
  actionTaken: string;
  isCorrect: boolean;
  responseTimeSeconds: number;
}

interface AppContextType {
  currentUser: User | null;
  currentOperator: Operator | null;
  activeScreen: ScreenId;
  activeMissionId: string;
  currentExamType: 'pre_test' | 'post_test' | 'mission_quiz';
  inspectedStudentId: string | null;
  lastDebriefResult: DebriefResult | null;
  verifyingCertCode: string | null;

  // Data lists
  users: User[];
  operators: Operator[];
  missions: Mission[];
  certificates: Certificate[];
  facilities: FieldFacility[];
  questions: QuizQuestion[];
  alertLogs: AlertLogEntry[];
  kkmThreshold: number;

  // Navigation & Actions
  setCurrentScreen: (screen: ScreenId) => void;
  selectMission: (missionId: string, screenTarget?: ScreenId) => void;
  startExam: (type: 'pre_test' | 'post_test' | 'mission_quiz', missionId?: string) => void;
  switchUser: (username: string) => void;
  login: (username: string) => boolean;
  logout: () => void;
  setUserTrack: (userId: string, track: LearningTrack) => void;
  recordMissionCompletion: (result: DebriefResult) => void;
  inspectStudent: (studentId: string) => void;
  setVerifyingCertCode: (code: string | null) => void;
  setKkmThreshold: (kkm: number) => void;

  // Management functions
  addUser: (userData: Partial<User>) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  issueCertificate: (studentId: string) => Certificate | null;
  revokeCertificate: (certId: string, reason: string) => void;
  addFacility: (facility: Omit<FieldFacility, 'id'>) => void;
  addOperator: (operator: Omit<Operator, 'id'>) => void;
  renewOperatorLicense: (operatorId: string, newDate: string) => void;
  resetMissionsForStudent: (studentId: string) => void;
  resetAllDemoData: () => void;
  logAlertAction: (entry: Omit<AlertLogEntry, 'id' | 'timestamp'>) => void;

  // Helpers
  getStudentFinalGrade: (user: User) => {
    avgMissionScore: number;
    postTestScore: number;
    finalScore: number;
    isEligible: boolean;
    predicate: 'Lulus' | 'Lulus, Sangat Baik' | 'Lulus, Dengan Pujian' | 'Belum Lulus';
  };
  getTrackMaxXP: (track?: LearningTrack) => number;
  getLevelInfo: (xp: number, track?: LearningTrack) => { level: number; title: string; progressPercent: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'silimbah_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or mockData
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    const list: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    return list.map((user) => {
      let modified = false;
      const updatedCompleted = { ...user.completedMissions };
      Object.keys(updatedCompleted).forEach((mId) => {
        const m = updatedCompleted[mId];
        const properStars =
          m.score >= 90 ? 3 : m.score >= 75 ? 2 : m.score >= 60 ? 1 : 0;
        if (properStars > m.stars) {
          updatedCompleted[mId] = { ...m, stars: properStars };
          modified = true;
        }
      });
      return modified ? { ...user, completedMissions: updatedCompleted } : user;
    });
  });

  const [operators, setOperators] = useState<Operator[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_operators`);
    return saved ? JSON.parse(saved) : INITIAL_OPERATORS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_certificates`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [facilities, setFacilities] = useState<FieldFacility[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_facilities`);
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>(QUESTION_BANK);
  const [missions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [kkmThreshold, setKkmThreshold] = useState<number>(75);

  const [alertLogs, setAlertLogs] = useState<AlertLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alert_logs`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'log_init_1',
        timestamp: '2026-10-25 14:22',
        userId: 'usr_peserta_lengkap',
        userName: 'Agus Santoso',
        missionId: 'BW-3',
        alertCode: 'AL-01',
        actionTaken: 'Jadwalkan penyedotan truk tinja berizin',
        isCorrect: true,
        responseTimeSeconds: 12,
      },
      {
        id: 'log_init_2',
        timestamp: '2026-10-25 15:05',
        userId: 'usr_peserta_extra2',
        userName: 'Dian Permata',
        missionId: 'BW-3',
        alertCode: 'AL-01',
        actionTaken: 'Clear manual tanpa aksi',
        isCorrect: false,
        responseTimeSeconds: 45,
      },
    ];
  });

  // Active session state - defaults to peserta.lengkap for immediate rich testing
  const [currentUserId, setCurrentUserId] = useState<string>('usr_peserta_lengkap');
  const [activeScreen, setActiveScreen] = useState<ScreenId>('mission_map');
  const [activeMissionId, setActiveMissionId] = useState<string>('BW-4');
  const [currentExamType, setCurrentExamType] = useState<'pre_test' | 'post_test' | 'mission_quiz'>('pre_test');
  const [inspectedStudentId, setInspectedStudentId] = useState<string | null>('usr_peserta_lengkap');
  const [lastDebriefResult, setLastDebriefResult] = useState<DebriefResult | null>(null);
  const [verifyingCertCode, setVerifyingCertCode] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_operators`, JSON.stringify(operators));
  }, [operators]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_certificates`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_facilities`, JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_alert_logs`, JSON.stringify(alertLogs));
  }, [alertLogs]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const currentOperator = operators.find((o) => o.id === currentUser?.operatorId) || null;

  // Level & XP math according to PRD Bagian 4:
  // Track Max XP: BW: 1500, GW: 1500, Lengkap: 3150
  // Level 1: 0% - 19% (Operator Magang)
  // Level 2: 20% - 39% (Operator Muda)
  // Level 3: 40% - 59% (Operator Terampil)
  // Level 4: 60% - 79% (Operator Andal)
  // Level 5: >= 80% (Ahli Sanitasi)
  const getTrackMaxXP = (track?: LearningTrack): number => {
    if (track === 'black_water' || track === 'grey_water') return 1500;
    return 3150; // default / lengkap
  };

  const getLevelInfo = (xp: number, track?: LearningTrack) => {
    const maxXp = getTrackMaxXP(track);
    const ratio = Math.max(0, Math.min(1, xp / maxXp));
    const percent = Math.round(ratio * 100);

    if (ratio >= 0.8) {
      return { level: 5, title: 'Ahli Sanitasi', progressPercent: percent };
    }
    if (ratio >= 0.6) {
      return { level: 4, title: 'Operator Andal', progressPercent: percent };
    }
    if (ratio >= 0.4) {
      return { level: 3, title: 'Operator Terampil', progressPercent: percent };
    }
    if (ratio >= 0.2) {
      return { level: 2, title: 'Operator Muda', progressPercent: percent };
    }
    return { level: 1, title: 'Operator Magang', progressPercent: percent };
  };

  // Helper: Grade calculation
  // Nilai akhir = 40% rata-rata skor misi + 60% nilai post-test.
  const getStudentFinalGrade = (user: User) => {
    const completed = Object.values(user.completedMissions);
    // Filter out M-0 pre-test from mission avg if present
    const missionScores = Object.entries(user.completedMissions)
      .filter(([id]) => id !== 'M-0' && id !== 'M-X')
      .map(([, data]) => data.score);

    const avgMissionScore =
      missionScores.length > 0
        ? Math.round((missionScores.reduce((a, b) => a + b, 0) / missionScores.length) * 10) / 10
        : 0;

    const postTest = user.postTestScore ?? 0;
    const finalScore = Math.round((avgMissionScore * 0.4 + postTest * 0.6) * 10) / 10;

    // Required missions according to track
    let requiredMissions: string[] = [];
    if (user.track === 'black_water') {
      requiredMissions = ['BW-1', 'BW-2', 'BW-3', 'BW-4', 'BW-5'];
    } else if (user.track === 'grey_water') {
      requiredMissions = ['GW-1', 'GW-2', 'GW-3', 'GW-4', 'GW-5'];
    } else {
      requiredMissions = [
        'BW-1', 'BW-2', 'BW-3', 'BW-4', 'BW-5',
        'GW-1', 'GW-2', 'GW-3', 'GW-4', 'GW-5',
        'INT-1'
      ];
    }

    const allPassed = requiredMissions.every((mId) => {
      const rec = user.completedMissions[mId];
      return rec && rec.stars >= 1;
    });

    const isEligible = allPassed && postTest >= kkmThreshold;

    let predicate: 'Lulus' | 'Lulus, Sangat Baik' | 'Lulus, Dengan Pujian' | 'Belum Lulus' = 'Belum Lulus';
    if (isEligible) {
      if (finalScore >= 93) {
        predicate = 'Lulus, Dengan Pujian';
      } else if (finalScore >= 85) {
        predicate = 'Lulus, Sangat Baik';
      } else {
        predicate = 'Lulus';
      }
    }

    return { avgMissionScore, postTestScore: postTest, finalScore, isEligible, predicate };
  };

  const switchUser = (username: string) => {
    const target = users.find((u) => u.username === username);
    if (target) {
      setCurrentUserId(target.id);
      // Route appropriately based on role
      if (target.role === 'superadmin') {
        setActiveScreen('superadmin');
      } else if (target.role === 'peserta') {
        if (!target.track) {
          setActiveScreen('track_select');
        } else {
          setActiveScreen('mission_map');
        }
      } else if (target.role === 'instruktur' || target.role === 'pimpinan_operator') {
        setActiveScreen('operator_dashboard');
      } else if (target.role === 'admin_operator') {
        setActiveScreen('operator_dashboard');
      }
    }
  };

  const login = (username: string): boolean => {
    const target = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (target) {
      switchUser(target.username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setActiveScreen('login');
  };

  const setCurrentScreen = (screen: ScreenId) => {
    setActiveScreen(screen);
  };

  const selectMission = (missionId: string, screenTarget?: ScreenId) => {
    setActiveMissionId(missionId);
    const mission = missions.find((m) => m.id === missionId);

    if (screenTarget) {
      setActiveScreen(screenTarget);
      return;
    }

    if (!mission) return;

    if (mission.type === 'pre_test' || mission.type === 'post_test') {
      startExam(mission.type, missionId);
    } else {
      setActiveScreen('mission_briefing');
    }
  };

  const startExam = (type: 'pre_test' | 'post_test' | 'mission_quiz', missionId?: string) => {
    setCurrentExamType(type);
    if (missionId) {
      setActiveMissionId(missionId);
    }
    setActiveScreen('quiz_exam');
  };

  const setUserTrack = (userId: string, track: LearningTrack) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, track } : u))
    );
    setActiveScreen('mission_map');
  };

  const recordMissionCompletion = (result: DebriefResult) => {
    const computedStars =
      result.score >= 90 ? 3 : result.score >= 75 ? 2 : result.score >= 60 ? 1 : 0;
    const finalStars = Math.max(result.stars, computedStars);
    const sanitizedResult: DebriefResult = { ...result, stars: finalStars };

    setLastDebriefResult(sanitizedResult);
    if (!currentUser) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;

        const existingRecord = u.completedMissions[result.missionId];
        const prevScore = existingRecord ? existingRecord.score : 0;
        const highestScore = Math.max(prevScore, result.score);
        const highestStars = Math.max(existingRecord ? existingRecord.stars : 0, finalStars);

        // Calculate XP delta: PRD Bagian 4: XP hanya bertambah sebesar selisihnya
        const prevXp = existingRecord ? existingRecord.xpEarned : 0;
        const xpDelta = Math.max(0, result.totalXP - prevXp);
        const newTotalXP = u.xp + xpDelta;

        const updatedBadges = Array.from(new Set([...u.badges, ...result.unlockedBadgeIds]));
        const { level, title } = getLevelInfo(newTotalXP, u.track);

        const updatedMissions = {
          ...u.completedMissions,
          [result.missionId]: {
            score: highestScore,
            stars: highestStars,
            xpEarned: Math.max(prevXp, result.totalXP),
            completedAt: new Date().toISOString().split('T')[0],
            attempts: (existingRecord?.attempts || 0) + 1,
            hintsUsed: result.hintsUsed,
          },
        };

        let postScore = u.postTestScore;
        let preScore = u.preTestScore;
        if (result.missionId === 'M-0') {
          preScore = result.score;
        } else if (result.missionId === 'M-X') {
          postScore = result.score;
        }

        return {
          ...u,
          xp: newTotalXP,
          level,
          levelTitle: title,
          badges: updatedBadges,
          completedMissions: updatedMissions,
          preTestScore: preScore,
          postTestScore: postScore,
          lastActive: 'Aktif saat ini',
        };
      })
    );

    setActiveScreen('debriefing');
  };

  const inspectStudent = (studentId: string) => {
    setInspectedStudentId(studentId);
    setActiveScreen('student_detail');
  };

  const issueCertificate = (studentId: string): Certificate | null => {
    const student = users.find((u) => u.id === studentId);
    if (!student) return null;

    const op = operators.find((o) => o.id === student.operatorId) || operators[0];
    const { finalScore, predicate, isEligible } = getStudentFinalGrade(student);
    if (!isEligible) return null;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certCode = `VRF-SLB-${randomSuffix}`;
    const certNumber = `SILIMBAH/2026/${op.type.replace(/\s+/g, '')}-${student.id.slice(-3).toUpperCase()}/LULUS-${Math.round(finalScore)}`;

    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      certificateNumber: certNumber,
      userId: student.id,
      userName: student.name,
      operatorId: op.id,
      operatorName: op.name,
      operatorType: op.type,
      track: student.track || 'lengkap',
      finalScore,
      predicate: predicate as 'Lulus' | 'Lulus, Sangat Baik' | 'Lulus, Dengan Pujian',
      finalLevelTitle: student.levelTitle,
      issueDate: new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date()),
      status: 'berlaku',
      instructorName: 'Ibu Ratna, ST, M.Sc',
      directorName: 'Ir. H. Bambang Suryono, MT',
      verificationCode: certCode,
    };

    setCertificates((prev) => [newCert, ...prev]);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === student.id
          ? { ...u, certificateIssued: true, certificateId: newCert.id }
          : u
      )
    );

    return newCert;
  };

  const revokeCertificate = (certId: string, reason: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certId ? { ...c, status: 'dicabut', revocationReason: reason } : c
      )
    );
  };

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: userData.username || `user_${Date.now().toString().slice(-4)}`,
      name: userData.name || 'Operator Baru',
      email: userData.email || 'user@operator.id',
      role: userData.role || 'peserta',
      operatorId: userData.operatorId || currentOperator?.id || 'uptd_sukamaju',
      track: userData.track || 'lengkap',
      classCohort: userData.classCohort || 'Angkatan 1 (2026)',
      level: 1,
      levelTitle: 'Operator Magang',
      xp: 0,
      badges: [],
      completedMissions: {},
      lastActive: 'Baru didaftarkan',
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data } : u)));
  };

  const addFacility = (fac: Omit<FieldFacility, 'id'>) => {
    const newFacility: FieldFacility = {
      ...fac,
      id: `fac_${Date.now()}`,
    };
    setFacilities((prev) => [newFacility, ...prev]);
  };

  const addOperator = (op: Omit<Operator, 'id'>) => {
    const newOperator: Operator = {
      ...op,
      id: `op_${Date.now()}`,
    };
    setOperators((prev) => [...prev, newOperator]);
  };

  const renewOperatorLicense = (operatorId: string, newDate: string) => {
    setOperators((prev) =>
      prev.map((o) =>
        o.id === operatorId
          ? { ...o, licenseExpiry: newDate, licenseStatus: 'active' }
          : o
      )
    );
  };

  const resetMissionsForStudent = (studentId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === studentId
          ? {
              ...u,
              xp: 0,
              level: 1,
              levelTitle: 'Operator Magang',
              completedMissions: {},
              preTestScore: undefined,
              postTestScore: undefined,
              certificateIssued: false,
              certificateId: undefined,
              failedAttemptsCount: {},
            }
          : u
      )
    );
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_operators`);
    localStorage.removeItem(`${STORAGE_KEY}_certificates`);
    localStorage.removeItem(`${STORAGE_KEY}_facilities`);
    localStorage.removeItem(`${STORAGE_KEY}_alert_logs`);
    setUsers(INITIAL_USERS);
    setOperators(INITIAL_OPERATORS);
    setCertificates(INITIAL_CERTIFICATES);
    setFacilities(INITIAL_FACILITIES);
    setCurrentUserId('usr_peserta_lengkap');
    setActiveScreen('mission_map');
    setActiveMissionId('BW-4');
  };

  const logAlertAction = (entry: Omit<AlertLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AlertLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setAlertLogs((prev) => [newLog, ...prev.slice(0, 100)]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentOperator,
        activeScreen,
        activeMissionId,
        currentExamType,
        inspectedStudentId,
        lastDebriefResult,
        verifyingCertCode,
        users,
        operators,
        missions,
        certificates,
        facilities,
        questions,
        alertLogs,
        kkmThreshold,
        setCurrentScreen,
        selectMission,
        startExam,
        switchUser,
        login,
        logout,
        setUserTrack,
        recordMissionCompletion,
        inspectStudent,
        setVerifyingCertCode,
        setKkmThreshold,
        addUser,
        updateUser,
        issueCertificate,
        revokeCertificate,
        addFacility,
        addOperator,
        renewOperatorLicense,
        resetMissionsForStudent,
        resetAllDemoData,
        logAlertAction,
        getStudentFinalGrade,
        getTrackMaxXP,
        getLevelInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
