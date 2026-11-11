import React from 'react';
import {
  SimulationTelemetry,
  ActiveAlert,
  SimulationObjectDef,
} from '../../types';
import {
  Droplets,
  Truck,
  Filter,
  Wind,
  Flower2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Archive,
  Info,
  Sun,
  ShieldAlert,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface CanvasProps {
  missionId: string;
  telemetry: SimulationTelemetry;
  activeAlerts: ActiveAlert[];
  onSelectObject: (obj: SimulationObjectDef) => void;
  onExecuteAction: (actionName: string, actionType: string) => void;
  draggedComponents?: string[];
  onDropComponent?: (slotId: string, compId: string) => void;
  objects: SimulationObjectDef[];
}

export const InteractiveInstallationCanvas: React.FC<CanvasProps> = ({
  missionId,
  telemetry,
  activeAlerts,
  onSelectObject,
  onExecuteAction,
  draggedComponents = [],
  onDropComponent,
  objects,
}) => {
  const findObj = (cat: string) =>
    objects.find((o) => o.category === cat) || objects[0];

  const hasAlert = (code: string) => activeAlerts.some((a) => a.code === code);
  const isCriticalAlert = (code: string) =>
    activeAlerts.some((a) => a.code === code && a.level === 'critical');

  /* -------------------------------------------------------------------------- */
  /* BW-2: RAKIT TANGKI SEPTIK KEDAP INTERAKTIF (SNI 2398:2017)                */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'BW-2') {
    const isInstalled = (compId: string) => draggedComponents.includes(compId);
    const completedCount = draggedComponents.length;
    const isComplete = completedCount === 8;

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Ground & Concrete Shell */}
          <rect x="0" y="80" width="800" height="320" fill="#1e1810" opacity="0.6" />
          <rect x="0" y="76" width="800" height="8" fill="#15803d" />

          {/* Septic Tank Concrete Outer Shell */}
          <rect
            x="140"
            y="110"
            width="380"
            height="240"
            rx="14"
            fill="#0f172a"
            stroke="#475569"
            strokeWidth="8"
          />

          {/* Component 1: Inlet T-Pipe (Left) */}
          {isInstalled('comp_inlet_t') ? (
            <g className="cursor-pointer" onClick={() => onSelectObject(findObj('inlet'))}>
              <path d="M 60 70 L 170 70 L 170 180" fill="none" stroke="#38bdf8" strokeWidth="12" />
              <path d="M 170 120 L 170 190" fill="none" stroke="#0284c7" strokeWidth="10" />
              <circle cx="170" cy="180" r="7" fill="#38bdf8" />
              <text x="110" y="60" fill="#38bdf8" fontSize="10" fontWeight="bold">
                1. Inlet Tee ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_inlet', 'comp_inlet_t')}>
              <path d="M 60 70 L 170 70 L 170 180" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="6 4" />
              <rect x="75" y="48" width="85" height="18" rx="4" fill="#334155" />
              <text x="117" y="61" fill="#94a3b8" fontSize="9" textAnchor="middle">
                [+ Pasang Inlet T]
              </text>
            </g>
          )}

          {/* Component 2: Ruang Pengendapan Primer (2/3 Volume) */}
          {isInstalled('comp_sediment_room') ? (
            <g>
              <rect x="150" y="125" width="230" height="215" fill="#042f2e" opacity="0.7" />
              <rect x="150" y="270" width="230" height="70" fill="#451a03" opacity="0.85" />
              <text x="265" y="220" fill="#5eead4" fontSize="11" fontWeight="bold" textAnchor="middle">
                2. Ruang Pengendapan (2/3) ✓
              </text>
              <text x="265" y="305" fill="#fef08a" fontSize="9" textAnchor="middle">
                Endapan Lumpur Anaerobik
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_sediment', 'comp_sediment_room')}>
              <rect x="150" y="125" width="230" height="215" fill="#1e293b" opacity="0.4" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="265" y="235" fill="#94a3b8" fontSize="10" textAnchor="middle">
                [+ Pasang Ruang Pengendapan 2/3]
              </text>
            </g>
          )}

          {/* Component 3: Baffle Partition Wall */}
          {isInstalled('comp_baffle') ? (
            <g>
              <rect x="380" y="118" width="14" height="175" fill="#64748b" rx="2" />
              <text x="387" y="200" fill="#ffffff" fontSize="9" fontWeight="bold" transform="rotate(-90 387 200)" textAnchor="middle">
                3. Baffle Penyekat ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_baffle', 'comp_baffle')}>
              <rect x="380" y="118" width="14" height="175" fill="#334155" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              <text x="387" y="200" fill="#94a3b8" fontSize="8" transform="rotate(-90 387 200)" textAnchor="middle">
                [+ Dinding Baffle]
              </text>
            </g>
          )}

          {/* Component 4: Ruang Penguraian Sekunder (1/3 Volume) */}
          {isInstalled('comp_chamber2') ? (
            <g>
              <rect x="394" y="125" width="118" height="215" fill="#0369a1" opacity="0.5" />
              <text x="453" y="220" fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                4. Ruang Ke-2 (1/3) ✓
              </text>
              <text x="453" y="238" fill="#bae6fd" fontSize="8" textAnchor="middle">
                Klarifikasi Efluen
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_chamber2', 'comp_chamber2')}>
              <rect x="394" y="125" width="118" height="215" fill="#1e293b" opacity="0.4" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="453" y="235" fill="#94a3b8" fontSize="9" textAnchor="middle">
                [+ Ruang 1/3]
              </text>
            </g>
          )}

          {/* Component 5: Pipa Hawa Ventilasi */}
          {isInstalled('comp_vent_pipe') ? (
            <g>
              <rect x="460" y="30" width="8" height="80" fill="#38bdf8" />
              <polygon points="455,30 473,30 464,18" fill="#0284c7" />
              <text x="464" y="12" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                5. Pipa Hawa ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_vent', 'comp_vent_pipe')}>
              <line x1="464" y1="30" x2="464" y2="110" stroke="#64748b" strokeWidth="3" strokeDasharray="4 3" />
              <text x="464" y="25" fill="#94a3b8" fontSize="8" textAnchor="middle">
                [+ Pipa Ventilasi]
              </text>
            </g>
          )}

          {/* Component 6: Manhole / Lubang Kontrol */}
          {isInstalled('comp_manhole') ? (
            <g>
              <rect x="290" y="78" width="60" height="34" fill="#475569" stroke="#334155" strokeWidth="2" />
              <rect x="284" y="72" width="72" height="8" rx="2" fill="#14b8a6" />
              <text x="320" y="65" fill="#5eead4" fontSize="9" fontWeight="bold" textAnchor="middle">
                6. Manhole Kedap ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_manhole', 'comp_manhole')}>
              <rect x="290" y="78" width="60" height="34" fill="#334155" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
              <text x="320" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle">
                [+ Manhole]
              </text>
            </g>
          )}

          {/* Component 7: Outlet T-Pipe */}
          {isInstalled('comp_outlet_t') ? (
            <g>
              <path d="M 495 150 L 495 210" fill="none" stroke="#38bdf8" strokeWidth="8" />
              <path d="M 495 160 L 580 160 L 580 230" fill="none" stroke="#38bdf8" strokeWidth="10" />
              <text x="540" y="150" fill="#38bdf8" fontSize="10" fontWeight="bold">
                7. Outlet Tee ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_outlet', 'comp_outlet_t')}>
              <path d="M 495 160 L 580 160 L 580 230" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="4 3" />
              <text x="540" y="150" fill="#94a3b8" fontSize="8">
                [+ Outlet T]
              </text>
            </g>
          )}

          {/* Component 8: Bidang Resapan Kerikil */}
          {isInstalled('comp_drain_field') ? (
            <g>
              <rect x="570" y="220" width="200" height="120" rx="10" fill="#1e293b" stroke="#059669" strokeWidth="3" />
              {[...Array(12)].map((_, i) => (
                <circle
                  key={i}
                  cx={590 + (i % 4) * 45}
                  cy={245 + Math.floor(i / 4) * 35}
                  r="7"
                  fill="#64748b"
                />
              ))}
              <text x="670" y="240" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                8. Bidang Resapan SNI ✓
              </text>
              <text x="670" y="325" fill="#a7f3d0" fontSize="9" textAnchor="middle">
                Resapan Aman ke Air Tanah
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_drain', 'comp_drain_field')}>
              <rect x="570" y="220" width="200" height="120" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="670" y="280" fill="#94a3b8" fontSize="10" textAnchor="middle">
                [+ Pasang Bidang Resapan]
              </text>
            </g>
          )}

          {/* Flow Animation when Complete */}
          {isComplete && (
            <g>
              <path d="M 60 70 L 170 70 L 170 180" fill="none" stroke="#ffffff" strokeWidth="3" className="anim-flow-pipe" />
              <path d="M 495 160 L 580 160 L 580 230" fill="none" stroke="#ffffff" strokeWidth="3" className="anim-flow-pipe" />
              <rect x="250" y="16" width="300" height="32" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="2" />
              <text x="400" y="36" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ✨ TANGKI SEPTIK KEDAP SELESAI DIRAKIT SESUAI SNI 2398
              </text>
            </g>
          )}
        </svg>

        <div className="absolute top-3 left-3 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-xs text-slate-300 font-mono">
          Progres Rakit: <strong className="text-teal-400">{completedCount} / 8</strong> Komponen
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* BW-3: SIMULASI TANGKI SEPTIK & PENYEDOTAN TRUK TINJA                       */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'BW-3') {
    const isSludgeOverload = telemetry.sludgeHeightPercent >= 60; // AL-01
    const isLeaking = hasAlert('AL-02'); // AL-02 rembesan
    const sludgeHeightY = Math.min(100, Math.max(20, telemetry.sludgeHeightPercent));

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-sky-900/60 via-slate-900 to-amber-950/40 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <defs>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d2817" />
              <stop offset="100%" stopColor="#1f140a" />
            </linearGradient>
            <linearGradient id="waterClearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0d213a" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="sludgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5c3a1e" />
              <stop offset="100%" stopColor="#301b0b" />
            </linearGradient>
            <linearGradient id="scumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#87683b" />
              <stop offset="100%" stopColor="#4f3818" />
            </linearGradient>
          </defs>

          {/* Ground Soil & Surface Line */}
          <rect x="0" y="80" width="800" height="320" fill="url(#groundGrad)" />
          {/* Grass strip */}
          <rect x="0" y="76" width="800" height="8" fill="#2d5a27" />

          {/* Above Ground Elements: Toilet House & UPTD Desludging Truck */}
          {/* House Wall / Toilet Connection */}
          <rect x="10" y="10" width="120" height="70" fill="#334155" rx="4" />
          <polygon points="5,15 70,-5 135,15" fill="#991b1b" />
          <text x="70" y="45" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
            Kloset Rumah
          </text>
          <text x="70" y="60" fill="#94a3b8" fontSize="9" textAnchor="middle">
            Air Gelontor & Tinja
          </text>

          {/* UPTD Vacuum Truck (Desludging Tanker) */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectObject(findObj('storage'))}
          >
            {/* Truck Cab */}
            <rect x="520" y="32" width="75" height="48" rx="5" fill="#0284c7" />
            <rect x="555" y="38" width="35" height="22" rx="3" fill="#e0f2fe" opacity="0.85" />
            {/* Truck Tank */}
            <rect x="420" y="24" width="105" height="56" rx="16" fill="#0369a1" />
            <text x="472" y="56" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              Truk Tinja UPTD
            </text>
            {/* Wheels */}
            <circle cx="450" cy="80" r="10" fill="#0f172a" />
            <circle cx="450" cy="80" r="4" fill="#94a3b8" />
            <circle cx="565" cy="80" r="10" fill="#0f172a" />
            <circle cx="565" cy="80" r="4" fill="#94a3b8" />
          </g>

          {/* Suction Hose into Septic Tank Manhole */}
          <path
            d="M 430 65 Q 360 70 330 110 L 330 200"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {telemetry.sludgeHeightPercent < 60 && (
            <path
              d="M 430 65 Q 360 70 330 110 L 330 200"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              className="anim-flow-pipe"
            />
          )}

          {/* Underground Watertight Septic Tank Outer Shell */}
          <rect
            x="160"
            y="110"
            width="340"
            height="240"
            rx="12"
            fill="#1e293b"
            stroke={isLeaking ? '#ef4444' : '#64748b'}
            strokeWidth="8"
          />
          {/* Manhole Neck & Cover */}
          <rect x="300" y="80" width="60" height="34" fill="#475569" stroke="#334155" strokeWidth="2" />
          <rect x="294" y="74" width="72" height="8" rx="2" fill="#94a3b8" />
          <text x="330" y="70" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
            Manhole
          </text>

          {/* Vent Pipe (Pipa Hawa Ventilasi) with gas emission */}
          <rect x="440" y="40" width="8" height="72" fill="#94a3b8" />
          <path d="M 436 40 L 452 40 L 444 32 Z" fill="#64748b" />
          <text x="444" y="24" fill="#38bdf8" fontSize="9" textAnchor="middle" className="animate-pulse">
            Gas CH₄ / H₂S ⇡
          </text>

          {/* Inside Septic Tank: Chamber 1 (2/3 volume) & Chamber 2 (1/3 volume) */}
          <g>
            {/* Water body */}
            <rect x="168" y="140" width="324" height="202" fill="url(#waterClearGrad)" />

            {/* Baffle Wall (Dinding Penyekat) */}
            <rect x="370" y="118" width="10" height="180" fill="#475569" />
            {/* Underflow orifice between chambers */}
            <rect x="370" y="298" width="10" height="30" fill="none" stroke="#38bdf8" strokeDasharray="3 3" />

            {/* Scum Layer (Lapisan Lemak/Busa Atas) */}
            <rect x="168" y="140" width="202" height="22" fill="url(#scumGrad)" rx="2" />
            <text x="260" y="155" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lapisan Scum (Minyak/Buih)
            </text>

            {/* Dynamic Bottom Sludge Layer (Endapan Lumpur Anaerobik) */}
            {/* Height calculated dynamically */}
            <rect
              x="168"
              y={342 - (sludgeHeightY * 1.6)}
              width="202"
              height={sludgeHeightY * 1.6}
              fill="url(#sludgeGrad)"
              className={isSludgeOverload ? 'animate-pulse' : ''}
            />
            {/* Secondary Chamber Sludge (lighter) */}
            <rect
              x="380"
              y={342 - (sludgeHeightY * 0.5)}
              width="112"
              height={sludgeHeightY * 0.5}
              fill="url(#sludgeGrad)"
            />

            {/* 2/3 Height Limit Indicator Line (AL-01 Trigger Point) */}
            <line
              x1="168"
              y1="235"
              x2="370"
              y2="235"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <rect x="175" y="222" width="140" height="16" rx="3" fill="#b91c1c" />
            <text x="245" y="234" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              AMBANG 2/3 TINGGI LUMPUR
            </text>

            {/* Sludge height label */}
            <text
              x="260"
              y={Math.max(260, 335 - (sludgeHeightY * 1.2))}
              fill="#ffffff"
              fontSize="11"
              fontWeight="extrabold"
              textAnchor="middle"
            >
              Lumpur Tinja: {telemetry.sludgeHeightPercent}%
            </text>
          </g>

          {/* Inlet T-Pipe from house */}
          <path d="M 120 70 L 190 70 L 190 175" fill="none" stroke="#64748b" strokeWidth="12" />
          <path d="M 190 125 L 190 185" fill="none" stroke="#94a3b8" strokeWidth="8" />
          <path d="M 120 70 L 190 70 L 190 175" fill="none" stroke="#f59e0b" strokeWidth="4" className="anim-flow-pipe" />

          {/* Outlet T-Pipe to soakaway */}
          <path d="M 480 155 L 480 205" fill="none" stroke="#64748b" strokeWidth="8" />
          <path d="M 480 165 L 560 165 L 560 220" fill="none" stroke="#64748b" strokeWidth="10" />
          <path d="M 480 165 L 560 165 L 560 220" fill="none" stroke="#38bdf8" strokeWidth="3" className="anim-flow-pipe" />

          {/* Soakaway Drain Field (Bidang Resapan Kerikil) */}
          <g>
            <rect x="540" y="210" width="220" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
            {/* Gravel dots */}
            {[...Array(15)].map((_, i) => (
              <circle
                key={i}
                cx={560 + (i % 5) * 40}
                cy={240 + Math.floor(i / 5) * 35}
                r="6"
                fill="#64748b"
              />
            ))}
            <text x="650" y="232" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              Bidang Resapan Tanah
            </text>
            <text x="650" y="250" fill="#94a3b8" fontSize="9" textAnchor="middle">
              Kerikil & Pasir SNI 2398
            </text>
            <text x="650" y="320" fill="#34d399" fontSize="10" textAnchor="middle">
              Air Meresap Aman Tanpa Bau
            </text>
          </g>

          {/* Alert Status Pin */}
          {isSludgeOverload && (
            <g className="animate-bounce">
              <rect x="230" y="100" width="130" height="24" rx="6" fill="#dc2626" />
              <text x="295" y="116" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                ⚠️ AL-01: SEGERA SEDOT
              </text>
            </g>
          )}
        </svg>

        {/* Floating Quick Action Button overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => onExecuteAction('Jadwalkan penyedotan truk tinja berizin', 'desludge')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <Truck className="w-4 h-4" />
            <span>Panggil Truk Sedot UPTD</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-2: SIMULASI GREASE TRAP DAPUR (BAK PENANGKAP LEMAK)                     */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-2') {
    const isOilHigh = telemetry.oilAndGrease >= 25; // AL-07
    const oilThickness = Math.min(80, Math.max(15, telemetry.oilAndGrease * 2.4));

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Kitchen Sink & Counter */}
          <rect x="20" y="20" width="220" height="70" fill="#334155" rx="6" />
          <rect x="50" y="25" width="160" height="45" fill="#475569" rx="4" />
          {/* Faucet */}
          <path d="M 130 25 L 130 5 Q 130 -10 145 -10 L 155 -10 L 155 10" fill="none" stroke="#cbd5e1" strokeWidth="6" />
          <text x="130" y="55" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
            Wastafel Cuci Piring Dapur
          </text>
          {/* Oily Drain Stream */}
          <path d="M 130 70 L 130 140 L 260 140" fill="none" stroke="#eab308" strokeWidth="8" className="anim-flow-pipe" />
          <text x="190" y="130" fill="#fde047" fontSize="9" textAnchor="middle">
            Limbah Lemak & Remah Makanan
          </text>

          {/* Grease Trap Main Chamber Body */}
          <rect x="250" y="110" width="460" height="230" rx="14" fill="#0f172a" stroke="#64748b" strokeWidth="6" />
          <text x="480" y="98" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
            Bak Perangkap Lemak (Grease Trap Tiga Kompartemen)
          </text>

          {/* Water body */}
          <rect x="256" y="145" width="448" height="190" fill="#0369a1" opacity="0.4" />

          {/* Compartment 1: Removable Food Strainer Basket */}
          <rect x="270" y="130" width="85" height="90" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <text x="312" y="170" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
            Keranjang Sisa
          </text>
          <text x="312" y="185" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Nasi & Sayuran
          </text>

          {/* Baffle Plate 1 (Retaining Oil) */}
          <rect x="385" y="115" width="12" height="150" fill="#64748b" rx="2" />
          {/* Underflow water opening */}
          <path d="M 360 285 Q 390 295 420 285" fill="none" stroke="#38bdf8" strokeWidth="4" className="anim-flow-pipe" />

          {/* Compartment 2: Flotation Zone with Floating Oil & Grease Layer */}
          {/* Oil Layer at surface */}
          <rect
            x="397"
            y="145"
            width="200"
            height={oilThickness}
            fill="#eab308"
            opacity="0.9"
            className={isOilHigh ? 'animate-pulse' : ''}
          />
          <text x="497" y={145 + Math.min(30, oilThickness / 2 + 5)} fill="#713f12" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            Lapisan Minyak & Lemak: {telemetry.oilAndGrease}%
          </text>

          {/* 25% Threshold Warning Line */}
          <line x1="397" y1="195" x2="597" y2="195" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
          <rect x="420" y="187" width="150" height="16" rx="3" fill="#991b1b" />
          <text x="495" y="199" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
            AMBANG MAKS 25% (AL-07)
          </text>

          {/* Baffle Plate 2 (Final Weir) */}
          <rect x="600" y="185" width="12" height="150" fill="#64748b" rx="2" />

          {/* Clean Effluent Outlet to Sewer */}
          <path d="M 612 250 L 750 250" fill="none" stroke="#38bdf8" strokeWidth="10" />
          <path d="M 612 250 L 750 250" fill="none" stroke="#ffffff" strokeWidth="3" className="anim-flow-pipe" />
          <text x="680" y="240" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
            Air Jernih ke Biofilter
          </text>
          <text x="680" y="275" fill="#34d399" fontSize="9" textAnchor="middle">
            Minyak & Lemak ≤ 5 mg/L
          </text>

          {/* Alert Pop-over */}
          {isOilHigh && (
            <g className="animate-bounce">
              <rect x="425" y="60" width="150" height="26" rx="6" fill="#dc2626" />
              <text x="500" y="77" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                ⚠️ AL-07: LEMAK &ge; 25%
              </text>
            </g>
          )}
        </svg>

        {/* Quick Action Button overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => onExecuteAction('Sendok dan bersihkan kerak lemak grease trap', 'clean_grease')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <Filter className="w-4 h-4" />
            <span>Sendok Bersihkan Lemak</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-3: SIMULASI BIOFILTER ANAEROB-AEROB                                     */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-3') {
    const isClogged = hasAlert('AL-10'); // AL-10 clogging
    const isFlowHigh = hasAlert('AL-09'); // AL-09 high debit

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-teal-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Main Tank Body */}
          <rect x="50" y="70" width="700" height="280" rx="16" fill="#0f172a" stroke="#475569" strokeWidth="6" />

          {/* Chamber 1: Anaerobic Biofilter */}
          <rect x="60" y="80" width="220" height="260" fill="#042f2e" opacity="0.6" />
          <text x="170" y="105" fill="#2dd4bf" fontSize="12" fontWeight="bold" textAnchor="middle">
            1. Ruang Biofilter Anaerobik
          </text>
          {/* Honeycomb Media (Media Sarang Tawon PVC) */}
          <rect x="85" y="140" width="170" height="130" fill="#134e4a" stroke="#2dd4bf" strokeWidth="2" rx="6" />
          {[...Array(12)].map((_, i) => (
            <circle
              key={i}
              cx={110 + (i % 4) * 40}
              cy={165 + Math.floor(i / 4) * 35}
              r="12"
              fill="none"
              stroke="#5eead4"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          ))}
          <text x="170" y="295" fill="#99f6e4" fontSize="9" textAnchor="middle">
            Media Sarang Tawon (Biofilm)
          </text>

          {/* Chamber 2: Aerobic Biofilter with Blower Aeration Bubbles */}
          <rect x="290" y="80" width="230" height="260" fill="#022c22" opacity="0.6" />
          <text x="405" y="105" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
            2. Ruang Biofilter Aerobik
          </text>
          {/* Aerobic Bio-Ball Media */}
          <rect x="315" y="140" width="180" height="130" fill="#064e3b" stroke="#34d399" strokeWidth="2" rx="6" />
          {/* Blower Diffuser Pipe at bottom */}
          <rect x="330" y="275" width="150" height="8" fill="#cbd5e1" rx="2" />
          {/* Animated Rising Bubbles */}
          {[...Array(6)].map((_, i) => (
            <circle
              key={i}
              cx={345 + i * 24}
              cy={260}
              r="4"
              fill="#e0f2fe"
              className={`anim-bubble-${(i % 3) + 1}`}
            />
          ))}
          <text x="405" y="295" fill="#6ee7b7" fontSize="9" textAnchor="middle">
            Difuser Udara Mikrobubble (DO &gt; 2 mg/L)
          </text>

          {/* Chamber 3: Sedimentation & Clarifier */}
          <rect x="530" y="80" width="210" height="260" fill="#0f172a" opacity="0.6" />
          <text x="635" y="105" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
            3. Bak Sedimentasi & Efluen
          </text>
          {/* Settling Hopper */}
          <polygon points="550,220 720,220 635,320" fill="#1e293b" />
          <text x="635" y="250" fill="#94a3b8" fontSize="9" textAnchor="middle">
            Zona Pengendapan Flok
          </text>

          {/* Interconnecting flow arrows */}
          <path d="M 20 180 L 85 180" fill="none" stroke="#2dd4bf" strokeWidth="6" className="anim-flow-pipe" />
          <path d="M 270 120 L 310 120" fill="none" stroke="#34d399" strokeWidth="6" className="anim-flow-pipe" />
          <path d="M 500 120 L 545 120" fill="none" stroke="#38bdf8" strokeWidth="6" className="anim-flow-pipe" />
          <path d="M 720 150 L 780 150" fill="none" stroke="#38bdf8" strokeWidth="8" className="anim-flow-pipe" />

          {/* Effluent Quality Callout */}
          <rect x="580" y="165" width="115" height="35" rx="6" fill="#065f46" />
          <text x="637" y="180" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
            BOD: {telemetry.BOD} mg/L
          </text>
          <text x="637" y="194" fill="#a7f3d0" fontSize="8" textAnchor="middle">
            Baku Mutu: &le; 30 mg/L
          </text>
        </svg>

        {/* Action Button */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {hasAlert('AL-09') && (
            <button
              onClick={() => onExecuteAction('Atur katup ekualisasi debit masuk', 'equalize_flow')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <Sliders className="w-4 h-4" />
              <span>Atur Ekualisasi Debit (AL-09)</span>
            </button>
          )}
          <button
            onClick={() => onExecuteAction('Lakukan backwash cuci media biofilter', 'backwash')}
            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <Wind className="w-4 h-4" />
            <span>Backwash Media Biofilter (AL-10)</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-4: CONSTRUCTED WETLAND (LAHAN BASAH FITOREMEDIASI)                      */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-4') {
    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-sky-900/60 to-emerald-950/70 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Sky & Sun */}
          <circle cx="720" cy="50" r="28" fill="#facc15" opacity="0.8" />

          {/* Wetland Basin Basin */}
          <rect x="80" y="180" width="640" height="180" rx="14" fill="#1e293b" stroke="#475569" strokeWidth="6" />

          {/* Multi-layered Filter Media */}
          {/* Top Layer: Fine Pea Gravel */}
          <rect x="90" y="190" width="620" height="40" fill="#475569" />
          {/* Middle Layer: Coarse Gravel */}
          <rect x="90" y="230" width="620" height="70" fill="#334155" />
          {/* Bottom Layer: Large Drainage Stones */}
          <rect x="90" y="300" width="620" height="50" fill="#1e293b" />

          {/* Subsurface Water Level Indicator (5 cm below surface) */}
          <line x1="90" y1="210" x2="710" y2="210" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 4" />
          <text x="400" y="206" fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">
            Muka Air di Bawah Kerikil (Bebas Bau & Nyamuk)
          </text>

          {/* Swaying Wetland Plants (Typha latifolia & Akar Wangi) */}
          {[160, 260, 360, 460, 560, 640].map((posX, idx) => (
            <g key={idx} className={idx % 2 === 0 ? 'anim-plant-1' : 'anim-plant-2'}>
              {/* Plant Stem & Leaves */}
              <path
                d={`M ${posX} 190 Q ${posX - 8} 100 ${posX - 18} 60`}
                fill="none"
                stroke="#15803d"
                strokeWidth="4"
              />
              <path
                d={`M ${posX} 190 Q ${posX + 8} 90 ${posX + 15} 50`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
              />
              <path
                d={`M ${posX} 190 L ${posX} 40`}
                fill="none"
                stroke="#16a34a"
                strokeWidth="5"
              />
              {/* Typha brown hotdog tip */}
              <rect x={posX - 4} y="45" width="8" height="35" rx="4" fill="#78350f" />
              {/* Underground Rhizosphere Root Network */}
              <path
                d={`M ${posX} 190 Q ${posX - 15} 240 ${posX - 10} 280 M ${posX} 190 Q ${posX + 15} 240 ${posX + 20} 270`}
                fill="none"
                stroke="#ca8a04"
                strokeWidth="2"
                opacity="0.8"
              />
            </g>
          ))}

          {/* Adjustable Outlet Swivel Pipe */}
          <path d="M 680 220 L 730 220 L 730 260 L 770 260" fill="none" stroke="#94a3b8" strokeWidth="8" />
          <text x="715" y="280" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
            Efluen Alami Bersih
          </text>
        </svg>

        {/* Action Button */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => onExecuteAction('Atur level pipa outlet wetland', 'fix_wetland')}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <Flower2 className="w-4 h-4" />
            <span>Atur Elevasi Outlet Wetland</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-5: PAKAI ULANG AMAN (WATER REUSE & DISINFEKSI KLORINASI)               */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-5') {
    const isColiformHigh = telemetry.totalColiform > 3000;
    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Header text */}
          <text x="400" y="32" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle">
            Unit Disinfeksi Klorinasi & Jaringan Pipa Ungu (Water Reuse System)
          </text>
          
          {/* Inflow from secondary biofilter */}
          <path d="M 20 180 L 120 180" fill="none" stroke="#38bdf8" strokeWidth="8" className="anim-flow-pipe" />
          <text x="70" y="165" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
            Air Olahan Jernih
          </text>

          {/* Unit 1: Injeksi Klorin / Kaporit */}
          <g>
            <rect x="120" y="90" width="160" height="210" rx="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="4" />
            <text x="200" y="115" fill="#e0e7ff" fontSize="11" fontWeight="bold" textAnchor="middle">
              1. Kontak Disinfeksi
            </text>
            <text x="200" y="130" fill="#a5b4fc" fontSize="8" textAnchor="middle">
              Injeksi Kaporit (0.2–0.5 ppm)
            </text>
            {/* Spiral contact maze */}
            <path d="M 140 160 L 260 160 M 140 200 L 260 200 M 140 240 L 260 240" stroke="#6366f1" strokeWidth="4" />
            <circle cx="200" cy="180" r="14" fill="#a855f7" opacity="0.3" />
            <text x="200" y="184" fill="#f5d0fe" fontSize="9" fontWeight="bold" textAnchor="middle">
              Cl₂ Aktif
            </text>
          </g>

          {/* Pipe 2 to storage tank */}
          <path d="M 280 190 L 340 190" fill="none" stroke="#a855f7" strokeWidth="6" className="anim-flow-pipe" />

          {/* Unit 2: Tangki Penampung Daur Ulang Pipa Ungu */}
          <g>
            <rect x="340" y="75" width="220" height="235" rx="14" fill="#0f172a" stroke="#a855f7" strokeWidth="5" />
            <text x="450" y="102" fill="#f5d0fe" fontSize="12" fontWeight="bold" textAnchor="middle">
              2. Tangki Air Daur Ulang
            </text>
            {/* Water body */}
            <rect x="350" y="120" width="200" height="180" rx="8" fill="#4c1d95" opacity="0.4" />
            
            {/* Sensor Status */}
            <rect x="375" y="135" width="150" height="46" rx="6" fill={isColiformHigh ? '#7f1d1d' : '#064e3b'} />
            <text x="450" y="154" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              Total Coliform: {telemetry.totalColiform} CFU
            </text>
            <text x="450" y="171" fill={isColiformHigh ? '#fca5a5' : '#86efac'} fontSize="8" textAnchor="middle">
              {isColiformHigh ? '⚠️ BAHAYA PATOGEN (AL-13)' : '✓ AMAN SESUAI BAKU MUTU'}
            </text>
          </g>

          {/* Unit 3: Distribusi Pipa Ungu (Purple Pipe) ke Taman */}
          <g>
            {/* Purple pipe out */}
            <path d="M 560 190 L 640 190 L 640 150 L 760 150" fill="none" stroke="#a855f7" strokeWidth="12" />
            <text x="640" y="125" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle">
              Jaringan Pipa Ungu
            </text>
            <text x="640" y="138" fill="#e9d5ff" fontSize="8" textAnchor="middle">
              (Standar Khusus Air Non-Konsumsi)
            </text>

            {/* Sprinkler / Taman */}
            <rect x="670" y="190" width="115" height="110" rx="8" fill="#14532d" opacity="0.6" />
            <text x="727" y="225" fill="#86efac" fontSize="11" fontWeight="bold" textAnchor="middle">
              Taman Kota
            </text>
            <text x="727" y="245" fill="#bbf7d0" fontSize="8" textAnchor="middle">
              Penyiraman Aman
            </text>
          </g>
        </svg>

        {/* Action Button */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => onExecuteAction('Hentikan pakai ulang dan beri disinfeksi klorin', 'disinfect_coliform')}
            className={`px-3.5 py-2 ${isColiformHigh ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Disinfeksi Klorinasi Air Daur Ulang</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* BW-4 / BW-5: OPERASI HARIAN & KRISIS IPLT                                  */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'BW-4' || missionId === 'BW-5') {
    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Station 1: Truk & Bar Screen / SSC */}
          <g>
            <rect x="20" y="100" width="130" height="180" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
            <text x="85" y="125" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              1. Dumping Station & SSC
            </text>
            <text x="85" y="140" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Pemisah Padatan Kasar
            </text>
            <rect x="40" y="160" width="90" height="90" fill="#0f172a" rx="6" />
            <path d="M 60 160 L 60 250 M 85 160 L 85 250 M 110 160 L 110 250" stroke="#f59e0b" strokeWidth="3" />
          </g>

          {/* Pipe 1 */}
          <path d="M 150 190 L 190 190" fill="none" stroke="#f59e0b" strokeWidth="6" className="anim-flow-pipe" />

          {/* Station 2: Kolam Anaerobik Stabilisasi */}
          <g>
            <rect x="190" y="100" width="180" height="180" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
            <text x="280" y="125" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              2. Kolam Anaerobik
            </text>
            <text x="280" y="140" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Fermentasi 20–30 Hari
            </text>
            <rect x="205" y="155" width="150" height="100" fill="#3d2817" rx="6" />
            <rect x="205" y="155" width="150" height="20" fill="#713f12" />
            <text x="280" y="170" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">
              Lapisan Scum Alami
            </text>
            <text x="280" y="215" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              BOD: {telemetry.BOD} mg/L
            </text>
          </g>

          {/* Pipe 2 */}
          <path d="M 370 190 L 410 190" fill="none" stroke="#38bdf8" strokeWidth="6" className="anim-flow-pipe" />

          {/* Station 3: Kolam Fakultatif & Maturasi */}
          <g>
            <rect x="410" y="100" width="170" height="180" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
            <text x="495" y="125" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              3. Kolam Fakultatif
            </text>
            <text x="495" y="140" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Reduksi Bakteri Alami
            </text>
            <rect x="425" y="155" width="140" height="100" fill="#065f46" rx="6" />
            <text x="495" y="210" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">
              Klarifikasi Surya
            </text>
          </g>

          {/* Station 4: Sludge Drying Bed (Bak Pengering Lumpur) */}
          <g>
            <rect x="610" y="100" width="170" height="180" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
            <text x="695" y="125" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              4. Sludge Drying Bed
            </text>
            <text x="695" y="140" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Kadar Air &lt; 20%
            </text>
            {/* Cracked Dried Mud Cake Texture */}
            <rect x="625" y="155" width="140" height="100" fill="#451a03" rx="6" />
            <path d="M 640 180 L 680 200 L 720 185 M 670 200 L 680 240 M 710 210 L 745 235" stroke="#78350f" strokeWidth="3" />
            <text x="695" y="225" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lumpur Kering
            </text>
            <text x="695" y="240" fill="#ffffff" fontSize="9" textAnchor="middle">
              Siap Panen Pupuk
            </text>
          </g>

          {/* Sun Shining over IPLT */}
          <circle cx="700" cy="40" r="24" fill="#fbbf24" />
        </svg>

        {/* Action Button */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {hasAlert('AL-03') && (
            <button
              onClick={() => onExecuteAction('Atur antrian truk atau buka unit kolam cadangan', 'buffer_truck')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <Truck className="w-4 h-4" />
              <span>Buka Kolam Cadangan (AL-03)</span>
            </button>
          )}
          {telemetry.BOD > 30 && (
            <button
              onClick={() => onExecuteAction('Kurangi beban organik kolam anaerobik', 'reduce_bod')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Kurangi Beban BOD (AL-04)</span>
            </button>
          )}
          <button
            onClick={() => onExecuteAction('Panen lumpur kering untuk bahan kompos', 'harvest_sludge')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <Layers className="w-4 h-4" />
            <span>Panen Lumpur Kering (SDB)</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* INT-1 / DEFAULT: IPAL KOMUNAL KAWASAN TERPADU DENGAN BIO-INDIKATOR IKAN   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-teal-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
      <svg viewBox="0 0 800 400" className="w-full h-full">
        {/* Neighborhood inlet houses */}
        <rect x="20" y="30" width="160" height="60" fill="#1e293b" rx="6" />
        <text x="100" y="55" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
          Kawasan Pemukiman Warga
        </text>
        <text x="100" y="72" fill="#94a3b8" fontSize="9" textAnchor="middle">
          200 Kepala Keluarga
        </text>

        {/* Dual sewer pipelines */}
        {/* Black water pipe */}
        <path d="M 100 90 L 100 150 L 220 150" fill="none" stroke="#f59e0b" strokeWidth="8" className="anim-flow-pipe" />
        <text x="160" y="140" fill="#f59e0b" fontSize="9" fontWeight="bold">
          Black Water
        </text>
        {/* Grey water pipe */}
        <path d="M 120 90 L 120 180 L 220 180" fill="none" stroke="#38bdf8" strokeWidth="8" className="anim-flow-pipe" />
        <text x="160" y="200" fill="#38bdf8" fontSize="9" fontWeight="bold">
          Grey Water
        </text>

        {/* Combined Grit Chamber & Equalization */}
        <rect x="220" y="120" width="140" height="180" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="4" />
        <text x="290" y="145" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
          Bak Ekualisasi Terpadu
        </text>
        <rect x="235" y="170" width="110" height="110" fill="#1e293b" rx="4" />
        <text x="290" y="230" fill="#38bdf8" fontSize="10" textAnchor="middle">
          Penyetara Debit
        </text>

        {/* Anaerobic Baffled Reactor (ABR) Multi-Chamber */}
        <rect x="390" y="120" width="190" height="180" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="4" />
        <text x="485" y="145" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
          Reaktor Biologis ABR
        </text>
        {/* Chambers */}
        <line x1="450" y1="160" x2="450" y2="280" stroke="#475569" strokeWidth="4" />
        <line x1="520" y1="160" x2="520" y2="280" stroke="#475569" strokeWidth="4" />
        <path d="M 360 210 L 410 210 Q 450 260 490 210 Q 530 260 570 210" fill="none" stroke="#2dd4bf" strokeWidth="4" className="anim-flow-pipe" />

        {/* Bio-Indicator Fish Pond (Kolam Uji Ikan Sehat) */}
        <rect x="600" y="120" width="180" height="180" rx="10" fill="#0f172a" stroke="#059669" strokeWidth="4" />
        <rect x="610" y="150" width="160" height="140" fill="#0284c7" opacity="0.4" rx="8" />
        <text x="690" y="142" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
          Kolam Indikator Ikan
        </text>

        {/* Animated Swimming Koi/Fish */}
        <g className="anim-fish">
          <ellipse cx="660" cy="200" rx="14" ry="7" fill="#f97316" />
          <polygon points="672,200 682,194 682,206" fill="#f97316" />
          <circle cx="653" cy="198" r="1.5" fill="#ffffff" />
        </g>
        <g className="anim-fish" style={{ animationDelay: '1.5s' }}>
          <ellipse cx="710" cy="240" rx="12" ry="6" fill="#eab308" />
          <polygon points="720,240 730,235 730,245" fill="#eab308" />
        </g>

        <text x="690" y="275" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
          DO &gt; 3.0 mg/L · Ikan Hidup Sehat
        </text>
      </svg>

      {/* Action Button */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          onClick={() => onExecuteAction('Hentikan pakai ulang dan beri disinfeksi klorin', 'disinfect_coliform')}
          className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
        >
          <Activity className="w-4 h-4" />
          <span>Stabilkan Debit & Disinfeksi</span>
        </button>
      </div>
    </div>
  );
};
