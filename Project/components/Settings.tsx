
import React, { useState } from 'react';
import { Database, RefreshCw, Trash2, ShieldCheck, Download, Upload, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

interface SettingsProps {
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onReset }) => {
  const [isReseting, setIsReseting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleReset = async () => {
    if (!window.confirm("Restore factory demo data? Current records will be lost.")) return;
    setIsReseting(true);
    await api.resetToDefaults();
    onReset();
    setIsReseting(false);
    alert("System restored to demo defaults.");
  };

  const handleClear = async () => {
    if (!window.confirm("DANGER: This will permanently delete ALL students and logs. Continue?")) return;
    setIsClearing(true);
    await api.clearDatabase();
    onReset();
    setIsClearing(false);
    alert("Database purged.");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900">System Configuration</h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">Manage biometric database and system integrity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Data Persistence Section */}
        <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Database size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900">Persistence Management</h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Database Engine</h3>
              <p className="text-sm text-slate-500 mb-4">The system is currently using "FaceTrack-v2-Encrypted" local storage engine.</p>
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <ShieldCheck size={14} />
                <span>Optimized & Secure</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleReset}
                disabled={isReseting}
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
              >
                <RefreshCw size={24} className={`text-slate-400 group-hover:text-indigo-600 mb-3 ${isReseting ? 'animate-spin text-indigo-600' : ''}`} />
                <span className="text-sm font-bold text-slate-900">Seed Demo</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all group"
              >
                <Download size={24} className="text-slate-400 group-hover:text-slate-900 mb-3" />
                <span className="text-sm font-bold text-slate-900">Export SQL</span>
              </button>
            </div>
          </div>
        </section>

        {/* Security & Danger Zone */}
        <section className="space-y-8">
          <div className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100 shadow-xl shadow-rose-100/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-rose-500 rounded-2xl text-white">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-black text-rose-900">Danger Zone</h2>
            </div>
            
            <p className="text-rose-700 text-sm font-medium mb-6">These actions are irreversible. Please ensure you have backed up your student biometric data before proceeding.</p>
            
            <button 
              onClick={handleClear}
              disabled={isClearing}
              className="w-full flex items-center justify-between p-6 bg-white border border-rose-200 rounded-3xl hover:bg-rose-600 hover:text-white transition-all group shadow-sm"
            >
              <div className="text-left">
                <p className="font-black text-rose-900 group-hover:text-white transition-colors">Wipe All Records</p>
                <p className="text-xs text-rose-500 group-hover:text-rose-100 transition-colors">Clears all students and attendance history.</p>
              </div>
              <Trash2 size={24} className="text-rose-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          <div className="bg-indigo-900 p-8 rounded-[2rem] text-white shadow-2xl">
             <h3 className="font-black text-lg mb-4">API Metadata</h3>
             <div className="space-y-3">
               <div className="flex justify-between text-xs py-2 border-b border-indigo-800">
                 <span className="text-indigo-400 font-bold uppercase">AI Model</span>
                 <span className="font-mono">gemini-3-flash-preview</span>
               </div>
               <div className="flex justify-between text-xs py-2 border-b border-indigo-800">
                 <span className="text-indigo-400 font-bold uppercase">Biometric Hash</span>
                 <span className="font-mono text-[10px]">SHA-256 Enabled</span>
               </div>
               <div className="flex justify-between text-xs py-2">
                 <span className="text-indigo-400 font-bold uppercase">Version</span>
                 <span className="font-mono">2.4.0-stable</span>
               </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
