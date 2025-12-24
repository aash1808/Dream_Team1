
import React from 'react';
import { Download, Calendar, User } from 'lucide-react';
import { AttendanceLog } from '../types';

interface AttendanceLogsProps {
  logs: AttendanceLog[];
}

const AttendanceLogs: React.FC<AttendanceLogsProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Records</h1>
          <p className="text-slate-500">Detailed logs of all student check-ins.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md">
          <Download size={18} />
          <span className="font-semibold">Export CSV</span>
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex space-x-4">
            <button className="px-4 py-1.5 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow-sm">All Logs</button>
            <button className="px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-white rounded-lg transition-all">Today</button>
            <button className="px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-white rounded-lg transition-all">This Week</button>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{logs.length} Total Entries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Date & Time</th>
                <th className="px-8 py-4">Method</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
                        {log.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{log.studentName}</p>
                        <p className="text-[10px] text-slate-400">{log.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-2 text-slate-600 text-sm">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter border ${
                      log.method === 'Face Recognition' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-700 border-slate-100'
                    }`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="flex items-center space-x-1.5 text-emerald-600 font-bold text-sm">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400 italic">
                    No attendance logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLogs;
