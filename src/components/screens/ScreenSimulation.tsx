import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ActiveAlert,
  SimulationTelemetry,
  SimulationObjectDef,
} from '../../types';
import { ALERT_CATALOG, BAKU_MUTU_REGULATION } from '../../data/mockData';
import {
  Play,
  Pause,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  Truck,
  Droplets,
  Filter,
  Wind,
  Flower2,
  ShieldCheck,
  Activity,
  ArrowRight,
  Archive,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InteractiveInstallationCanvas } from '../simulation/InteractiveInstallationCanvas';

export const ScreenSimulation: React.FC = () => {
  const {
    activeMissionId,
    missions,
    currentUser,
    setCurrentScreen,
    recordMissionCompletion,
    logAlertAction,
  } = useApp();

  const mission = missions.find((m) => m.id === activeMissionId) || missions[3]; // default BW-3 or BW-4

  // Simulation run state
  const [isRunning, setIsRunning] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Drag and drop state for BW-2
  const [draggedComponents, setDraggedComponents] = useState<string[]>([]);
  const [bw2Completed, setBw2Completed] = useState(false);

  // Telemetry parameters
  const [telemetry, setTelemetry] = useState<SimulationTelemetry>(() => {
    if (mission.id === 'BW-3') {
      return {
        sludgeHeightPercent: 68, // triggers AL-01 immediately
        flowRate: 15,
        pH: 7.2,
        BOD: 28,
        COD: 80,
        TSS: 25,
        oilAndGrease: 2,
        totalColiform: 1500,
      };
    }
    if (mission.id === 'BW-4') {
      return {
        sludgeHeightPercent: 45,
        flowRate: 35,
        pH: 7.0,
        BOD: 42, // triggers AL-04 (critical BOD > 30)
        COD: 120,
        TSS: 20, // normal pada operasi harian IPLT standar Permen LHK (< 30 mg/L)
        oilAndGrease: 3,
        totalColiform: 2400,
        driedSludgeLevelPercent: 90, // triggers AL-06
      };
    }
    if (mission.id === 'BW-5') {
      return {
        sludgeHeightPercent: 65,
        flowRate: 50,
        pH: 6.2,
        BOD: 58, // shock load krisis
        COD: 160,
        TSS: 45, // triggers AL-14 krisis
        oilAndGrease: 4,
        totalColiform: 2200, // Efluen kolam maturasi IPLT memenuhi standar coliform <= 3000
        driedSludgeLevelPercent: 85,
      };
    }
    if (mission.id === 'GW-2') {
      return {
        sludgeHeightPercent: 20,
        flowRate: 18,
        pH: 6.8,
        BOD: 24,
        COD: 75,
        TSS: 18,
        oilAndGrease: 28, // triggers AL-07 (oil >= 25%)
        totalColiform: 800,
      };
    }
    if (mission.id === 'GW-3') {
      return {
        sludgeHeightPercent: 30,
        flowRate: 45, // triggers AL-09 (debit peak)
        pH: 7.1,
        BOD: 25,
        COD: 82,
        TSS: 35,
        oilAndGrease: 3,
        totalColiform: 1200,
      };
    }
    if (mission.id === 'GW-4') {
      return {
        sludgeHeightPercent: 25,
        flowRate: 20,
        pH: 7.0,
        BOD: 22,
        COD: 70,
        TSS: 20,
        oilAndGrease: 2,
        totalColiform: 900,
      };
    }
    if (mission.id === 'GW-5' || mission.id === 'INT-1') {
      return {
        sludgeHeightPercent: 40,
        flowRate: 50,
        pH: 7.4,
        BOD: 22, // Air daur ulang telah melewati biofilter/sedimentasi sekunder (BOD <= 30 mg/L)
        COD: 70,
        TSS: 20,
        oilAndGrease: 2,
        totalColiform: 4500, // triggers AL-13 (coliform > 3000)
      };
    }
    return {
      sludgeHeightPercent: 30,
      flowRate: 20,
      pH: 7.0,
      BOD: 20,
      COD: 60,
      TSS: 20,
      oilAndGrease: 2,
      totalColiform: 1000,
    };
  });

  // Active alerts
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>(() => {
    if (mission.id === 'BW-3') {
      return [
        {
          id: 'alt_1',
          code: 'AL-01',
          level: 'warning',
          title: 'Tinggi Lumpur Tangki Septik ≥ 2/3 (68%)',
          message: 'Lumpur anaerobik mendekati lubang pipa outlet T. Risiko pelolosan padatan!',
          timeTriggered: 0,
          targetResponseSeconds: 45,
          targetAction: 'Jadwalkan penyedotan truk tinja berizin',
          status: 'active',
        },
      ];
    }
    if (mission.id === 'BW-4') {
      return [
        {
          id: 'alt_2',
          code: 'AL-04',
          level: 'critical',
          title: 'BOD Efluen > 30 mg/L (Terukur 42 mg/L)',
          message: 'Beban organik kolam anaerobik meluap melebihi baku mutu Permen LHK 68/2016.',
          timeTriggered: 0,
          targetResponseSeconds: 30,
          targetAction: 'Kurangi beban organik, atur waktu retensi',
          status: 'active',
        },
        {
          id: 'alt_3',
          code: 'AL-06',
          level: 'info',
          title: 'Bak Pengering Lumpur (SDB) Telah Siap Panen',
          message: 'Kadar air cake lumpur di bawah 20%. Siap dibongkar untuk kompos.',
          timeTriggered: 0,
          targetResponseSeconds: 90,
          targetAction: 'Panen lumpur kering',
          status: 'active',
        },
      ];
    }
    if (mission.id === 'BW-5') {
      return [
        {
          id: 'alt_bw5_1',
          code: 'AL-03',
          level: 'critical',
          title: 'Lonjakan Ritase Truk Tinja Pasca Banjir',
          message: 'Antrean truk di dumping station melebihi kapasitas SSC harian.',
          timeTriggered: 0,
          targetResponseSeconds: 35,
          targetAction: 'Atur antrian truk atau buka unit kolam cadangan',
          status: 'active',
        },
        {
          id: 'alt_bw5_2',
          code: 'AL-04',
          level: 'critical',
          title: 'BOD Efluen Meluap > 30 mg/L (Terukur 58 mg/L)',
          message: 'Beban organik kolam anaerobik meluap akibat shock load banjir.',
          timeTriggered: 0,
          targetResponseSeconds: 30,
          targetAction: 'Kurangi beban organik, atur waktu retensi',
          status: 'active',
        },
        {
          id: 'alt_bw5_3',
          code: 'AL-06',
          level: 'warning',
          title: 'Bak SDB Penuh Memerlukan Panen Cepat',
          message: 'Kapasitas pengeringan habis, perlu pengosongan segera.',
          timeTriggered: 0,
          targetResponseSeconds: 60,
          targetAction: 'Panen lumpur kering',
          status: 'active',
        },
      ];
    }
    if (mission.id === 'GW-2') {
      return [
        {
          id: 'alt_4',
          code: 'AL-07',
          level: 'warning',
          title: 'Lapisan Lemak Grease Trap ≥ 25%',
          message: 'Ketebalan kerak minyak mencapai 28% volume bak. Segera bersihkan!',
          timeTriggered: 0,
          targetResponseSeconds: 40,
          targetAction: 'Sendok dan bersihkan kerak lemak',
          status: 'active',
        },
      ];
    }
    if (mission.id === 'GW-3') {
      return [
        {
          id: 'alt_gw3_1',
          code: 'AL-09',
          level: 'warning',
          title: 'Fluktuasi Debit Ekstrem (Peak Flow Shock)',
          message: 'Debit air limbah melonjak ke 45 L/menit melebihi kapasitas desain.',
          timeTriggered: 0,
          targetResponseSeconds: 40,
          targetAction: 'Atur katup ekualisasi debit masuk',
          status: 'active',
        },
        {
          id: 'alt_gw3_2',
          code: 'AL-10',
          level: 'critical',
          title: 'TSS Efluen Melebihi Baku Mutu (Terukur 35 mg/L)',
          message: 'Media sarang tawon biofilter jenuh, padatan tersuspensi lolos.',
          timeTriggered: 0,
          targetResponseSeconds: 30,
          targetAction: 'Lakukan pencucian balik (backwash) media',
          status: 'active',
        },
      ];
    }
    if (mission.id === 'GW-4') {
      return [
        {
          id: 'alt_gw4_1',
          code: 'AL-11',
          level: 'warning',
          title: 'Genangan Air di Permukaan Kerikil Wetland',
          message: 'Elevasi pipa outlet terlalu tinggi memicu genangan bau dan jentik.',
          timeTriggered: 0,
          targetResponseSeconds: 45,
          targetAction: 'Setel ketinggian pipa outlet wetland',
          status: 'active',
        },
      ];
    }
    if (mission.id === 'GW-5' || mission.id === 'INT-1') {
      return [
        {
          id: 'alt_5',
          code: 'AL-13',
          level: 'critical',
          title: 'Total Coliform Air Pakai Ulang > 3.000 CFU/100 mL',
          message: 'Bakteri patogen terdeteksi pada tangki air daur ulang. Bahaya penularan!',
          timeTriggered: 0,
          targetResponseSeconds: 25,
          targetAction: 'Hentikan pemakaian ulang dan lakukan disinfeksi klorinasi',
          status: 'active',
        },
      ];
    }
    return [];
  });

  // Action log & scoring tracking
  const [totalActionsTaken, setTotalActionsTaken] = useState(0);
  const [correctActionsCount, setCorrectActionsCount] = useState(0);
  const [alertsResolvedInTarget, setAlertsResolvedInTarget] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [totalSimulationTicks, setTotalSimulationTicks] = useState(1);
  const [effluentInStandardTicks, setEffluentInStandardTicks] = useState(1);
  const [selectedObjectForNarrative, setSelectedObjectForNarrative] = useState<SimulationObjectDef | null>(null);
  const [openedNarrativeIds, setOpenedNarrativeIds] = useState<Set<string>>(new Set());
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ msg: string; isSuccess: boolean } | null>(null);
  const [manualClearModalAlert, setManualClearModalAlert] = useState<ActiveAlert | null>(null);
  const [manualClearReason, setManualClearReason] = useState('sudah_ditangani');

  // Simulation timer loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
      setTotalSimulationTicks((prev) => prev + 1);

      // Check effluent quality tick
      const isEffluentGood =
        telemetry.BOD <= 30 &&
        telemetry.COD <= 100 &&
        telemetry.TSS <= 30 &&
        telemetry.pH >= 6 &&
        telemetry.pH <= 9 &&
        telemetry.oilAndGrease <= 5 &&
        telemetry.totalColiform <= 3000;

      if (isEffluentGood) {
        setEffluentInStandardTicks((prev) => prev + 1);
      }
    }, 1000 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isRunning, speedMultiplier, telemetry]);

  const showToast = (msg: string, isSuccess: boolean) => {
    setFeedbackToast({ msg, isSuccess });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  const handleUseHint = () => {
    setHintsUsedCount((prev) => prev + 1);
    setPenalties((prev) => prev + 5);

    if (activeAlerts.length > 0) {
      const highestAlert = activeAlerts.find((a) => a.level === 'critical') || activeAlerts[0];
      const alertInfo = ALERT_CATALOG.find((ac) => ac.code === highestAlert.code);
      setHintMessage(
        `Petunjuk untuk ${highestAlert.code}: ${alertInfo?.correctAction || 'Lakukan tindakan perbaikan pada unit instalasi'}. (-5 Poin penalti diterapkan)`
      );
    } else {
      setHintMessage('Seluruh parameter instalasi terpantau aman dan baku mutu memenuhi syarat! (-5 Poin penalti)');
    }
  };

  const handleOpenObjectNarrative = (obj: SimulationObjectDef) => {
    setSelectedObjectForNarrative(obj);
    setOpenedNarrativeIds((prev) => new Set([...prev, obj.id]));
  };

  // Perform Contextual Action on Canvas
  const handleExecuteAction = (actionName: string, actionType: string) => {
    setTotalActionsTaken((prev) => prev + 1);

    // Matching action with active alerts
    let matchedAlert = activeAlerts.find((a) => {
      if (actionType === 'desludge' && a.code === 'AL-01') return true;
      if (actionType === 'repair_wall' && a.code === 'AL-02') return true;
      if (actionType === 'buffer_truck' && a.code === 'AL-03') return true;
      if (actionType === 'reduce_bod' && a.code === 'AL-04') return true;
      if (actionType === 'neutralize_ph' && a.code === 'AL-05') return true;
      if (actionType === 'harvest_sludge' && a.code === 'AL-06') return true;
      if (actionType === 'clean_grease' && (a.code === 'AL-07' || a.code === 'AL-08')) return true;
      if (actionType === 'equalize_flow' && a.code === 'AL-09') return true;
      if (actionType === 'backwash' && a.code === 'AL-10') return true;
      if (actionType === 'fix_wetland' && a.code === 'AL-11') return true;
      if (actionType === 'disinfect_coliform' && a.code === 'AL-13') return true;
      if (actionType === 'clarify_tss' && a.code === 'AL-14') return true;
      return false;
    });

    if (matchedAlert) {
      // Correct action!
      setCorrectActionsCount((prev) => prev + 1);
      const isWithinTarget = timeElapsed - matchedAlert.timeTriggered <= matchedAlert.targetResponseSeconds;
      if (isWithinTarget) {
        setAlertsResolvedInTarget((prev) => prev + 1);
      }

      // Update telemetry towards normal
      if (actionType === 'desludge') {
        setTelemetry((prev) => ({ ...prev, sludgeHeightPercent: 12 }));
      } else if (actionType === 'clean_grease') {
        setTelemetry((prev) => ({ ...prev, oilAndGrease: 1.5 }));
      } else if (actionType === 'reduce_bod') {
        setTelemetry((prev) => ({ ...prev, BOD: 18, COD: 65, TSS: Math.min(prev.TSS, 20), totalColiform: Math.min(prev.totalColiform, 2000) }));
      } else if (actionType === 'disinfect_coliform') {
        setTelemetry((prev) => ({ ...prev, totalColiform: 450, BOD: Math.min(prev.BOD, 20), TSS: Math.min(prev.TSS, 20) }));
      } else if (actionType === 'harvest_sludge') {
        setTelemetry((prev) => ({ ...prev, driedSludgeLevelPercent: 5 }));
      } else if (actionType === 'equalize_flow') {
        setTelemetry((prev) => ({ ...prev, flowRate: 18, TSS: Math.min(prev.TSS, 20) }));
      } else if (actionType === 'backwash') {
        setTelemetry((prev) => ({ ...prev, TSS: 14, flowRate: Math.min(prev.flowRate, 18) }));
      } else if (actionType === 'clarify_tss') {
        setTelemetry((prev) => ({ ...prev, TSS: 14 }));
      } else if (actionType === 'buffer_truck') {
        setTelemetry((prev) => ({ ...prev, flowRate: 18, BOD: Math.min(prev.BOD, 25), totalColiform: Math.min(prev.totalColiform, 2000) }));
      } else if (actionType === 'fix_wetland') {
        setTelemetry((prev) => ({ ...prev, flowRate: 16, BOD: 18, TSS: 14 }));
      } else if (actionType === 'neutralize_ph') {
        setTelemetry((prev) => ({ ...prev, pH: 7.2 }));
      } else if (actionType === 'repair_wall') {
        setTelemetry((prev) => ({ ...prev, BOD: 16 }));
      }

      // Resolve alert automatically
      setActiveAlerts((prev) => prev.filter((a) => a.id !== matchedAlert!.id));

      logAlertAction({
        userId: currentUser?.id || 'usr_peserta_lengkap',
        userName: currentUser?.name || 'Operator',
        missionId: mission.id,
        alertCode: matchedAlert.code,
        actionTaken: actionName,
        isCorrect: true,
        responseTimeSeconds: Math.max(5, timeElapsed - matchedAlert.timeTriggered),
      });

      showToast(`Aksi Tepat: "${actionName}" berhasil menormalkan parameter ${matchedAlert.code}!`, true);
    } else {
      // Wrong action or unnecessary action
      setPenalties((prev) => prev + 2);
      logAlertAction({
        userId: currentUser?.id || 'usr_peserta_lengkap',
        userName: currentUser?.name || 'Operator',
        missionId: mission.id,
        alertCode: activeAlerts[0]?.code || 'UMUM',
        actionTaken: actionName,
        isCorrect: false,
        responseTimeSeconds: 15,
      });
      showToast(`Aksi Kurang Tepat: "${actionName}" tidak mengatasi kondisi alert utama yang aktif. (-2 Poin)`, false);
    }
  };

  // Manual Clear Handler (FR-22 & PRD Bagian 6.2)
  const handleConfirmManualClear = () => {
    if (!manualClearModalAlert) return;
    const alert = manualClearModalAlert;

    if (alert.level === 'info') {
      // Info alert clears without penalty
      setActiveAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      showToast(`Alert Info ${alert.code} ditutup. (Tanpa penalti)`, true);
    } else {
      // Warning & Critical: if condition still abnormal, hidden temporarily, returns next cycle with -5 penalty!
      setActiveAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      setPenalties((prev) => prev + 5);
      showToast(`Peringatan: Clear manual tanpa penanganan parameter dikenakan penalti -5 poin!`, false);

      // Re-trigger alert after 1 cycle (e.g. 8 seconds)
      setTimeout(() => {
        setActiveAlerts((prev) => {
          if (prev.some((a) => a.code === alert.code)) return prev;
          return [
            ...prev,
            {
              ...alert,
              id: `retrigger_${Date.now()}`,
              timeTriggered: timeElapsed + 8,
              title: `[KEMBALI MUNCUL] ${alert.title}`,
            },
          ];
        });
      }, 8000);
    }

    setManualClearModalAlert(null);
  };

  // Special Drag and Drop logic for BW-2 (Rakit Tangki Septik Kedap)
  const requiredBw2Slots = [
    { id: 'slot_inlet', label: '1. Pipa Masuk (Inlet Tee)', correctComp: 'comp_inlet_t' },
    { id: 'slot_sediment', label: '2. Ruang Pengendapan Pertama (2/3 Volume)', correctComp: 'comp_sediment_room' },
    { id: 'slot_baffle', label: '3. Dinding Penyekat (Baffle Pelat Kedap)', correctComp: 'comp_baffle' },
    { id: 'slot_chamber2', label: '4. Ruang Penguraian Kedua (1/3 Volume)', correctComp: 'comp_chamber2' },
    { id: 'slot_vent', label: '5. Pipa Hawa / Ventilasi Metana (T-Pipe)', correctComp: 'comp_vent_pipe' },
    { id: 'slot_manhole', label: '6. Lubang Kontrol / Manhole Inspeksi', correctComp: 'comp_manhole' },
    { id: 'slot_outlet', label: '7. Pipa Keluar (Outlet Tee)', correctComp: 'comp_outlet_t' },
    { id: 'slot_drain', label: '8. Bidang Resapan / Kerikil Berpori', correctComp: 'comp_drain_field' },
  ];

  const availableBw2Components = [
    { id: 'comp_inlet_t', name: 'Pipa T Masuk (Inlet Tee)', desc: 'Meredam arus air limbah agar tidak mengaduk endapan' },
    { id: 'comp_sediment_room', name: 'Ruang Pengendapan Primer', desc: 'Menampung lumpur anaerobik dasar' },
    { id: 'comp_baffle', name: 'Dinding Penyekat Baffle', desc: 'Menahan lapisan busa (scum) di permukaan' },
    { id: 'comp_chamber2', name: 'Ruang Penguraian Sekunder', desc: 'Penyempurnaan proses klarifikasi cairan' },
    { id: 'comp_vent_pipe', name: 'Pipa Hawa Ventilasi', desc: 'Membuang gas metana (CH4) berbahaya' },
    { id: 'comp_manhole', name: 'Lubang Kontrol Kedap (Manhole)', desc: 'Akses selang truk sedot tinja' },
    { id: 'comp_outlet_t', name: 'Pipa T Pengeluaran (Outlet)', desc: 'Mengalirkan air olahan dari zona tengah' },
    { id: 'comp_drain_field', name: 'Bidang Resapan Kerikil', desc: 'Resapan alami air efluen ke tanah aman' },
  ];

  const handleDropComponent = (slotId: string, compId: string) => {
    const slot = requiredBw2Slots.find((s) => s.id === slotId);
    if (slot && slot.correctComp === compId) {
      if (!draggedComponents.includes(compId)) {
        const next = [...draggedComponents, compId];
        setDraggedComponents(next);
        showToast(`Komponen tepat: ${compId.replace('comp_', '').replace('_', ' ')} terpasang sesuai SNI!`, true);
        if (next.length === requiredBw2Slots.length) {
          setBw2Completed(true);
          confetti({ particleCount: 70, spread: 60 });
        }
      }
    } else {
      showToast('Posisi komponen tidak sesuai standar SNI 2398:2017. Silakan coba pasang di slot lain.', false);
    }
  };

  // Finish Simulation and calculate score (PRD Bagian 6.4)
  // Skor = 0.4 * Ketepatan aksi + 0.3 * Ketepatan waktu respons + 0.3 * Kualitas efluen - Penalti
  const handleCompleteSimulation = () => {
    let actionAccuracy = 100;
    if (totalActionsTaken > 0) {
      actionAccuracy = Math.round((correctActionsCount / totalActionsTaken) * 100);
    }

    let responseAccuracy = 100;
    if (activeAlerts.length > 0 || alertsResolvedInTarget > 0) {
      const totalAlertsEncountered = alertsResolvedInTarget + activeAlerts.length;
      responseAccuracy = totalAlertsEncountered > 0
        ? Math.round((alertsResolvedInTarget / totalAlertsEncountered) * 100)
        : 100;
    }

    // Kualitas Efluen (PRD 5.1 & 6.4):
    // 100% jika seluruh parameter baku mutu Permen LHK 68/2016 telah dinormalkan aman pada saat selesai,
    // atau dihitung proporsional durasi kepatuhan.
    const isCurrentEffluentGood =
      telemetry.BOD <= 30 &&
      telemetry.COD <= 100 &&
      telemetry.TSS <= 30 &&
      telemetry.pH >= 6 &&
      telemetry.pH <= 9 &&
      telemetry.oilAndGrease <= 5 &&
      telemetry.totalColiform <= 3000;

    const effluentRatio = isCurrentEffluentGood
      ? 100
      : totalSimulationTicks > 0
        ? Math.round((effluentInStandardTicks / totalSimulationTicks) * 100)
        : 100;

    let finalScore = Math.round(
      0.4 * actionAccuracy + 0.3 * responseAccuracy + 0.3 * effluentRatio - penalties
    );

    // If BW-2 drag and drop
    if (mission.id === 'BW-2') {
      finalScore = Math.max(60, Math.round((draggedComponents.length / requiredBw2Slots.length) * 100) - penalties);
    }

    // Penalti critical alerts remaining: -10 each
    const criticalActive = activeAlerts.filter((a) => a.level === 'critical').length;
    finalScore = Math.max(0, Math.min(100, finalScore - criticalActive * 10));

    // Stars: 1★ 60–74, 2★ 75–89, 3★ ≥ 90
    let stars = 0;
    if (finalScore >= 90) stars = 3;
    else if (finalScore >= 75) stars = 2;
    else if (finalScore >= 60) stars = 1;

    // Bonus XP calculation (Bagian 4): +10% tanpa petunjuk, +10% di bawah waktu target
    let bonusRatio = 0;
    if (hintsUsedCount === 0) bonusRatio += 0.1;
    if (timeElapsed <= mission.targetTimeSeconds) bonusRatio += 0.1;

    const baseXP = Math.round((finalScore / 100) * mission.maxXP);
    const bonusXP = Math.round(baseXP * bonusRatio);
    const totalXP = baseXP + bonusXP;

    // Check unlocked badges
    const unlockedBadges: string[] = [];
    if (mission.id === 'BW-3' && stars === 3) {
      unlockedBadges.push('badge_penyedot');
    }
    if (correctActionsCount >= 3) {
      unlockedBadges.push('badge_alert');
    }
    if (openedNarrativeIds.size >= (mission.simulationConfig?.objects.length || 2)) {
      unlockedBadges.push('badge_teliti');
    }
    if (hintsUsedCount === 0 && stars >= 2) {
      unlockedBadges.push('badge_tanpa_petunjuk');
    }

    const mistakes: string[] = [];
    if (penalties > 0) mistakes.push(`Terdapat penalti sebesar -${penalties} poin karena penggunaan petunjuk atau clear alert tanpa penanganan.`);
    if (criticalActive > 0) mistakes.push(`${criticalActive} alert Kritis belum ditangani hingga simulasi berakhir.`);
    if (actionAccuracy < 80) mistakes.push(`Ketepatan penanganan aksi operator sebesar ${actionAccuracy}%.`);

    const recommendedReview =
      mistakes.length > 0
        ? `Tinjau kembali ${mission.theorySummary.mainConcept} dan tabel baku mutu Permen LHK 68/2016.`
        : 'Performa simulasi sangat prima dan siap melanjutkan ke misi berikutnya!';

    recordMissionCompletion({
      missionId: mission.id,
      score: finalScore,
      stars,
      baseXP,
      bonusXP,
      totalXP,
      hintsUsed: hintsUsedCount,
      elapsedSeconds: timeElapsed,
      unlockedBadgeIds: unlockedBadges,
      mistakes,
      recommendedReview,
    });
  };

  const objects = mission.simulationConfig?.objects || [
    {
      id: 'obj_default',
      name: 'Unit Instalasi Terpadu',
      category: 'treatment',
      functionDesc: 'Unit pengolahan air limbah domestik.',
      operatingPrinciple: 'Pemisahan fisis dan penguraian biologis mikroba.',
      normalParameters: 'BOD <= 30 mg/L, TSS <= 30 mg/L',
      commonFieldMistakes: 'Tidak melakukan pemantauan rutin.',
      standardReference: 'Permen LHK 68/2016',
      iconName: 'Droplets',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Toast Notification */}
        {feedbackToast && (
          <div
            className={`fixed top-18 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 max-w-md transition-all ${
              feedbackToast.isSuccess
                ? 'bg-emerald-900/95 text-emerald-200 border-emerald-700'
                : 'bg-rose-900/95 text-rose-200 border-rose-700'
            }`}
          >
            {feedbackToast.isSuccess ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{feedbackToast.msg}</span>
          </div>
        )}

        {/* Top Status Bar: Timer, Current Score, Hints left, Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              {mission.id} · {mission.levelLabel}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">{mission.title}</h2>
              <p className="text-xs text-slate-500">
                Mode Pelatihan Interaktif Operator Sanitasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Simulation Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-800">
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-slate-400 text-[11px]">/ {Math.round(mission.targetTimeSeconds / 60)}m</span>
            </div>

            {/* Hint Button */}
            <button
              onClick={handleUseHint}
              title="Buka petunjuk (-5 Poin Penalti)"
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Petunjuk ({hintsUsedCount} terpakai)</span>
            </button>

            {/* Pause / Play */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
              title={isRunning ? 'Jeda Simulasi' : 'Lanjutkan Simulasi'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Complete Simulation CTA */}
            <button
              onClick={handleCompleteSimulation}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Selesaikan Simulasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hint banner if opened */}
        {hintMessage && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{hintMessage}</span>
            </div>
            <button
              onClick={() => setHintMessage(null)}
              className="text-amber-700 hover:text-amber-900 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Alert Center Banner (PRD Hal 14: Banner di atas kanvas) */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs ${
                  alert.level === 'critical'
                    ? 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-400/20 animate-pulse'
                    : alert.level === 'warning'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      alert.level === 'critical'
                        ? 'bg-rose-600 text-white'
                        : alert.level === 'warning'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {alert.level === 'critical' ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-xs uppercase px-1.5 py-0.5 rounded bg-white/70 border border-slate-300">
                        {alert.code}
                      </span>
                      <span className="font-bold text-sm">{alert.title}</span>
                      <span className="text-[11px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/80">
                        {alert.level}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 text-slate-700">{alert.message}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Target Respons: <strong className="font-mono">{alert.targetResponseSeconds}s</strong> · Aksi Disarankan: <span className="italic">{alert.targetAction}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => setManualClearModalAlert(alert)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Clear Manual
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Canvas & Parameter Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Interactive Installation Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-md relative min-h-[460px] flex flex-col justify-between overflow-hidden">
              {/* Canvas Header */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="font-bold tracking-wide uppercase text-teal-400">
                    Kanvas Diagram Unit Pengolahan Air Limbah
                  </span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  Klik ikon (i) pada setiap unit untuk pelajari narasi pop-up
                </span>
              </div>

              {/* Special BW-2 Drag and Drop Mode */}
              {mission.id === 'BW-2' ? (
                <div className="py-2 space-y-4">
                  <InteractiveInstallationCanvas
                    missionId="BW-2"
                    telemetry={telemetry}
                    activeAlerts={activeAlerts}
                    onSelectObject={handleOpenObjectNarrative}
                    onExecuteAction={handleExecuteAction}
                    draggedComponents={draggedComponents}
                    onDropComponent={handleDropComponent}
                    objects={objects}
                  />

                  <div className="text-center">
                    <h3 className="text-sm font-bold text-amber-300">
                      Rakit Komponen Tangki Septik Kedap (SNI 2398:2017)
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Klik komponen di bawah ini untuk memasangnya ke posisi diagram di atas.
                    </p>
                  </div>

                  {/* Drop Slots Container */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {requiredBw2Slots.map((slot) => {
                      const isFilled = draggedComponents.includes(slot.correctComp);
                      return (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-xl border text-center text-xs flex flex-col items-center justify-center min-h-[90px] transition-all ${
                            isFilled
                              ? 'bg-teal-950/70 border-teal-500 text-teal-200'
                              : 'bg-slate-800/60 border-dashed border-slate-600 text-slate-400'
                          }`}
                        >
                          <span className="text-[11px] font-bold block mb-1">{slot.label}</span>
                          {isFilled ? (
                            <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Terpasang
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Slot Kosong</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Available Component Palette */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-teal-400 mb-2">
                      Pilihan Komponen Standar SNI:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableBw2Components.map((comp) => {
                        const isInstalled = draggedComponents.includes(comp.id);
                        return (
                          <button
                            key={comp.id}
                            disabled={isInstalled}
                            onClick={() => {
                              // Find appropriate slot
                              const matchingSlot = requiredBw2Slots.find((s) => s.correctComp === comp.id);
                              if (matchingSlot) {
                                handleDropComponent(matchingSlot.id, comp.id);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              isInstalled
                                ? 'bg-slate-900 border-slate-800 text-slate-600 line-through cursor-not-allowed'
                                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:border-teal-500'
                            }`}
                          >
                            <span className="font-bold text-white block text-[11px]">{comp.name}</span>
                            <span className="text-[10px] text-slate-400">{comp.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Dynamic Animated Diagram for Simulation Missions */
                <div className="py-2 space-y-4">
                  <InteractiveInstallationCanvas
                    missionId={mission.id}
                    telemetry={telemetry}
                    activeAlerts={activeAlerts}
                    onSelectObject={handleOpenObjectNarrative}
                    onExecuteAction={handleExecuteAction}
                    objects={objects}
                  />

                  {/* Unit Narrative Quick Tabs for Learning Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Pusat Informasi Objek ({openedNarrativeIds.size}/{objects.length} dipelajari):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {objects.map((obj) => {
                        const isLearned = openedNarrativeIds.has(obj.id);
                        return (
                          <button
                            key={obj.id}
                            onClick={() => handleOpenObjectNarrative(obj)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                              isLearned
                                ? 'bg-teal-950/70 border-teal-600 text-teal-300'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                              i
                            </span>
                            <span>{obj.name}</span>
                            {isLearned && <span className="text-[10px] text-teal-400">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Contextual Action Buttons per Object (PRD Bagian 6.1: Panel Aksi) */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Panel Aksi Kontekstual Operator
                  </span>
                  <span className="text-[10px] text-teal-400 font-mono">
                    Pilih tindakan tepat untuk mengembalikan parameter normal
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {mission.track === 'black_water' ? (
                    <>
                      <button
                        onClick={() =>
                          handleExecuteAction('Jadwalkan penyedotan truk tinja berizin', 'desludge')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-teal-400" />
                        <span>Jadwalkan Penyedotan Truk</span>
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Laporkan dan pilih perbaikan dinding/tutup kedap', 'repair_wall')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Perbaikan Dinding/Tutup Kedap
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Atur antrian truk atau buka unit kolam cadangan', 'buffer_truck')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Buka Kolam Cadangan IPLT
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Kurangi beban organik kolam anaerobik', 'reduce_bod')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Kurangi Beban Organik BOD
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Panen lumpur kering untuk bahan kompos', 'harvest_sludge')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Panen Lumpur Kering (SDB)
                      </button>
                    </>
                  ) : mission.track === 'grey_water' ? (
                    <>
                      <button
                        onClick={() =>
                          handleExecuteAction('Sendok dan bersihkan kerak lemak grease trap', 'clean_grease')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Filter className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bersihkan Lemak Grease Trap</span>
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Atur katup ekualisasi debit masuk', 'equalize_flow')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Atur Katup Ekualisasi Debit
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Lakukan backwash cuci media biofilter', 'backwash')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Wind className="w-3.5 h-3.5 text-teal-400" />
                        <span>Backwash Media Biofilter</span>
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Atur level pipa outlet wetland', 'fix_wetland')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Atur Pipa Outlet Wetland
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Hentikan pakai ulang dan beri disinfeksi klorin', 'disinfect_coliform')
                        }
                        className="px-3.5 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Disinfeksi Klorinasi Air Daur Ulang</span>
                      </button>
                    </>
                  ) : (
                    /* Track Lengkap / Combined Actions */
                    <>
                      <button
                        onClick={() =>
                          handleExecuteAction('Jadwalkan penyedotan truk tinja berizin', 'desludge')
                        }
                        className="px-3 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Sedot Tinja Terjadwal
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Sendok dan bersihkan kerak lemak grease trap', 'clean_grease')
                        }
                        className="px-3 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Bersihkan Lemak Grease Trap
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Lakukan backwash cuci media biofilter', 'backwash')
                        }
                        className="px-3 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Backwash Biofilter
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteAction('Hentikan pakai ulang dan beri disinfeksi klorin', 'disinfect_coliform')
                        }
                        className="px-3 py-2 bg-slate-800 hover:bg-teal-600 hover:text-white rounded-xl text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Disinfeksi Klorinasi
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Telemetry Parameters Panel (PRD Bagian 6.1) */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Panel Parameter Operasi Live
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Baku Mutu 2016</span>
              </div>

              {/* Parameter Rows */}
              <div className="space-y-3 text-xs">
                {/* Tinggi Lumpur % */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">Tinggi Lumpur Tangki</span>
                    <span
                      className={`font-mono font-bold ${
                        telemetry.sludgeHeightPercent >= 67 ? 'text-amber-600' : 'text-teal-700'
                      }`}
                    >
                      {telemetry.sludgeHeightPercent}% (Maks 67%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        telemetry.sludgeHeightPercent >= 67 ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, telemetry.sludgeHeightPercent)}%` }}
                    />
                  </div>
                </div>

                {/* BOD Efluen */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">BOD Efluen</span>
                    <span
                      className={`font-mono font-bold ${
                        telemetry.BOD > 30 ? 'text-rose-600' : 'text-teal-700'
                      }`}
                    >
                      {telemetry.BOD} mg/L (Baku ≤ 30)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        telemetry.BOD > 30 ? 'bg-rose-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, (telemetry.BOD / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* TSS Efluen */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">TSS (Padatan Melayang)</span>
                    <span
                      className={`font-mono font-bold ${
                        telemetry.TSS > 30 ? 'text-amber-600' : 'text-teal-700'
                      }`}
                    >
                      {telemetry.TSS} mg/L (Baku ≤ 30)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        telemetry.TSS > 30 ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, (telemetry.TSS / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Minyak & Lemak */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">Minyak & Lemak</span>
                    <span
                      className={`font-mono font-bold ${
                        telemetry.oilAndGrease > 5 ? 'text-rose-600' : 'text-teal-700'
                      }`}
                    >
                      {telemetry.oilAndGrease} mg/L (Baku ≤ 5)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        telemetry.oilAndGrease > 5 ? 'bg-rose-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, (telemetry.oilAndGrease / 30) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Total Coliform */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">Total Coliform</span>
                    <span
                      className={`font-mono font-bold ${
                        telemetry.totalColiform > 3000 ? 'text-rose-600' : 'text-teal-700'
                      }`}
                    >
                      {telemetry.totalColiform} CFU (Baku ≤ 3.000)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        telemetry.totalColiform > 3000 ? 'bg-rose-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, (telemetry.totalColiform / 6000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* pH Level */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Derajat Keasaman (pH)</span>
                  <span className="font-mono font-bold text-teal-700">
                    {telemetry.pH} (Normal 6.0 – 9.0)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Object Narrative Modal (FR-23: Fungsi, Cara Kerja, Parameter Normal, Kesalahan Umum) */}
      {selectedObjectForNarrative && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedObjectForNarrative.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono capitalize">
                    Kategori: {selectedObjectForNarrative.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedObjectForNarrative(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-200">
                <span className="font-bold text-teal-950 block mb-1">Fungsi Utama:</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedObjectForNarrative.functionDesc}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Prinsip & Cara Kerja:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedObjectForNarrative.operatingPrinciple}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="font-bold text-slate-900 block mb-1">Parameter Normal:</span>
                  <p className="text-teal-800 font-mono font-medium">
                    {selectedObjectForNarrative.normalParameters}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="font-bold text-slate-900 block mb-1">Rujukan Regulasi:</span>
                  <p className="text-slate-600 font-medium">
                    {selectedObjectForNarrative.standardReference}
                  </p>
                </div>
              </div>

              <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-950 block mb-1">Kesalahan Umum di Lapangan:</span>
                <p className="text-rose-900 leading-relaxed">
                  {selectedObjectForNarrative.commonFieldMistakes}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-teal-700 font-medium">
                ✓ Narasi ini tercatat untuk lencana "Pembaca Teliti"
              </span>
              <button
                onClick={() => setSelectedObjectForNarrative(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
              >
                Tutup Narasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Clear Modal with Reason Selection (FR-22 & PRD Hal 14) */}
      {manualClearModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Konfirmasi Clear Manual Alert {manualClearModalAlert.code}
            </h3>
            <p className="text-slate-600 mb-4">
              Pilih alasan penutupan alert. Jika alert bertingkat Peringatan/Kritis ditutup tanpa tindakan perbaikan yang menormalkan parameter, alert akan muncul kembali setelah 1 siklus dan skor dikurangi 5 poin (Bagian 6.2).
            </p>

            <div className="space-y-2 mb-5">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value="sudah_ditangani"
                  checked={manualClearReason === 'sudah_ditangani'}
                  onChange={(e) => setManualClearReason(e.target.value)}
                />
                <span>Sudah ditangani melalui tindakan fisik di lapangan</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value="alarm_dipahami"
                  checked={manualClearReason === 'alarm_dipahami'}
                  onChange={(e) => setManualClearReason(e.target.value)}
                />
                <span>Alarm telah dipahami dan dicatat di logbook</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value="ditunda"
                  checked={manualClearReason === 'ditunda'}
                  onChange={(e) => setManualClearReason(e.target.value)}
                />
                <span>Penanganan ditunda menunggu kedatangan suku cadang/armada</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setManualClearModalAlert(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmManualClear}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Tutup Alert Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
