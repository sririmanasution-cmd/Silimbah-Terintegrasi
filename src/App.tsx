import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ScreenLogin } from './components/screens/ScreenLogin';
import { ScreenTrackSelect } from './components/screens/ScreenTrackSelect';
import { ScreenMissionMap } from './components/screens/ScreenMissionMap';
import { ScreenMissionBriefing } from './components/screens/ScreenMissionBriefing';
import { ScreenModuleLearning } from './components/screens/ScreenModuleLearning';
import { ScreenSimulation } from './components/screens/ScreenSimulation';
import { ScreenQuizExam } from './components/screens/ScreenQuizExam';
import { ScreenDebriefing } from './components/screens/ScreenDebriefing';
import { ScreenStudentDashboard } from './components/screens/ScreenStudentDashboard';
import { ScreenCertificate } from './components/screens/ScreenCertificate';
import { ScreenOperatorDashboard } from './components/screens/ScreenOperatorDashboard';
import { ScreenStudentDetail } from './components/screens/ScreenStudentDetail';
import { ScreenAccountManagement } from './components/screens/ScreenAccountManagement';
import { ScreenContentManagement } from './components/screens/ScreenContentManagement';
import { ScreenFieldData } from './components/screens/ScreenFieldData';
import { ScreenSuperAdmin } from './components/screens/ScreenSuperAdmin';
import { ScreenPublicVerification } from './components/screens/ScreenPublicVerification';
import { ScreenAppNarrative } from './components/screens/ScreenAppNarrative';

const MainAppContent: React.FC = () => {
  const { activeScreen, currentUser } = useApp();

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'login':
        return <ScreenLogin />;
      case 'track_select':
        return <ScreenTrackSelect />;
      case 'mission_map':
        return <ScreenMissionMap />;
      case 'mission_briefing':
        return <ScreenMissionBriefing />;
      case 'module_learning':
        return <ScreenModuleLearning />;
      case 'simulation':
        return <ScreenSimulation />;
      case 'quiz_exam':
        return <ScreenQuizExam />;
      case 'debriefing':
        return <ScreenDebriefing />;
      case 'student_dashboard':
        return <ScreenStudentDashboard />;
      case 'certificate_view':
        return <ScreenCertificate />;
      case 'operator_dashboard':
        return <ScreenOperatorDashboard />;
      case 'student_detail':
        return <ScreenStudentDetail />;
      case 'account_management':
        return <ScreenAccountManagement />;
      case 'content_management':
        return <ScreenContentManagement />;
      case 'field_data':
        return <ScreenFieldData />;
      case 'superadmin':
        return <ScreenSuperAdmin />;
      case 'public_verification':
        return <ScreenPublicVerification />;
      case 'app_narrative':
        return <ScreenAppNarrative />;
      default:
        return <ScreenMissionMap />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        {renderActiveScreen()}
      </main>

      {/* Clean quiet footer */}
      {activeScreen !== 'login' && (
        <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600">
              SiLimbah — Sistem Informasi Terintegrasi Media Pembelajaran Pengelolaan Air Limbah Domestik
            </p>
            <p className="text-slate-400">
              Standar Permen LHK No. P.68/2016 · Magister Pradita University 2026
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
