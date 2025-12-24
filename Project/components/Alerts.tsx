
import React from 'react';
import { AlertCircle, Send, Phone, Mail, UserX } from 'lucide-react';
import { Student } from '../types';
import { ATTENDANCE_THRESHOLD } from '../constants';

interface AlertsProps {
  students: Student[];
}

const Alerts: React.FC<AlertsProps> = ({ students }) => {
  const atRiskStudents = students.filter(s => s.attendancePercentage < ATTENDANCE_THRESHOLD);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Attendance Alerts</h1>
        <p className="text-slate-500">Students falling below the {ATTENDANCE_THRESHOLD}% threshold requirement.</p>
      </header>

      {atRiskStudents.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-100 p-12 rounded-3xl text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-emerald-900">All Clear!</h3>
          <p className="text-emerald-700">Currently, no students are below the attendance threshold.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {atRiskStudents.map(student => (
            <div key={student.id} className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img src={student.photoUrl} className="w-14 h-14 rounded-full border-2 border-rose-200" alt="" />
                    <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-1 rounded-full">
                      <UserX size={12} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                    <p className="text-sm text-slate-500">{student.id} • {student.grade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-rose-600">{student.attendancePercentage}%</p>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Attendance</p>
                </div>
              </div>

              <div className="bg-rose-50 p-4 rounded-2xl mb-6">
                <p className="text-sm text-rose-800 flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>Action required: Student has missed {student.totalClasses - student.classesAttended} sessions.</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                  <Mail size={18} />
                  <span>Email Guardian</span>
                </button>
                <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50">
                  <Phone size={18} />
                </button>
                <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50">
                  <Send size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
