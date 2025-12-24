
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Users, 
  History, 
  Bell, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Plus, 
  Database,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import AttendanceScanner from './components/AttendanceScanner';
import StudentList from './components/StudentList';
import AttendanceLogs from './components/AttendanceLogs';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import RegisterStudentModal from './components/RegisterStudentModal';
import { Student, AttendanceLog } from './types';
import { api } from './services/api';

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; count?: number }> = ({ to, icon, label, count }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
          : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={`${isActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-200'}`}>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white'}`}>
          {count}
        </span>
      )}
    </Link>
  );
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing'>('connected');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchData = async () => {
    setDbStatus('syncing');
    try {
      const [fetchedStudents, fetchedLogs] = await Promise.all([
        api.getStudents(),
        api.getLogs()
      ]);
      setStudents(fetchedStudents);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setDbStatus('connected');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAttendance = useCallback(async (studentId: string, method: 'Face Recognition' | 'Manual') => {
    setDbStatus('syncing');
    try {
      const { student, log } = await api.recordAttendance(studentId, method);
      setStudents(prev => prev.map(s => s.id === studentId ? student : s));
      setLogs(prev => [log, ...prev]);
    } catch (error) {
      console.error("Attendance record failed:", error);
    } finally {
      setDbStatus('connected');
    }
  }, []);

  const handleRegisterSuccess = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleResetData = async () => {
    setLoading(true);
    await api.resetToDefaults();
    await fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
          <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-bold text-lg">FaceTrack AI</p>
          <p className="text-slate-500 text-sm animate-pulse">Initializing Secure Database...</p>
        </div>
      </div>
    );
  }

  const atRiskCount = students.filter(s => s.attendancePercentage < 75).length;

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-72 bg-indigo-950 text-white flex flex-col fixed h-full shadow-2xl z-30 transition-all duration-300">
          <div className="p-8 flex items-center space-x-4 border-b border-indigo-900/50">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block">FaceTrack</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Enterprise Edition</span>
            </div>
          </div>
          
          <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="px-4 mb-2 text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Management</p>
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink to="/scan" icon={<Camera size={20} />} label="Face Scanner" />
            <SidebarLink to="/students" icon={<Users size={20} />} label="Students Directory" />
            <SidebarLink to="/logs" icon={<History size={20} />} label="Attendance Records" />
            <SidebarLink to="/alerts" icon={<Bell size={20} />} label="At-Risk Alerts" count={atRiskCount} />
            
            <div className="pt-6">
              <p className="px-4 mb-2 text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Actions</p>
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-indigo-200 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-200 group"
              >
                <div className="p-1 bg-indigo-900 group-hover:bg-emerald-500 rounded-lg transition-colors">
                  <Plus size={18} />
                </div>
                <span className="font-medium">Register Student</span>
              </button>
              <SidebarLink to="/settings" icon={<SettingsIcon size={20} />} label="System Settings" />
            </div>
          </div>

          <div className="p-6 bg-indigo-950/80 backdrop-blur-md border-t border-indigo-900/50 space-y-5">
            <div className="bg-indigo-900/40 p-4 rounded-2xl border border-indigo-800/50">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
                <span>Database Sync</span>
                <span className={dbStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>{dbStatus}</span>
              </div>
              <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${dbStatus === 'connected' ? 'w-full bg-emerald-500' : 'w-2/3 bg-amber-500 animate-pulse'}`} />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 hover:bg-indigo-900/50 p-2 rounded-xl transition-all cursor-pointer">
              <div className="relative">
                <img src="https://ui-avatars.com/api/?name=Loshma&background=6366f1&color=fff" className="w-10 h-10 rounded-full border-2 border-indigo-500" alt="Admin" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-indigo-950 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold leading-none">Loshma</p>
                <p className="text-[10px] text-indigo-400 mt-1">Super Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 p-10 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard students={students} logs={logs} />} />
              <Route path="/scan" element={<AttendanceScanner students={students} onRecognized={handleAttendance} />} />
              <Route path="/students" element={<StudentList students={students} />} />
              <Route path="/logs" element={<AttendanceLogs logs={logs} />} />
              <Route path="/alerts" element={<Alerts students={students} />} />
              <Route path="/settings" element={<Settings onReset={handleResetData} />} />
            </Routes>
          </div>
        </main>
      </div>

      <RegisterStudentModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSuccess={handleRegisterSuccess} 
      />
    </HashRouter>
  );
};

export default App;
