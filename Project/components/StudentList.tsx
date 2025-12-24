
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, ShieldCheck, EyeOff, Eye } from 'lucide-react';
import { Student } from '../types';
import { ATTENDANCE_THRESHOLD } from '../constants';

interface StudentListProps {
  students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showIdentity, setShowIdentity] = useState(false);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-slate-500">Student records are identity-masked for security.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowIdentity(!showIdentity)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all border ${
              showIdentity ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-indigo-600 border-indigo-500 text-white'
            }`}
          >
            {showIdentity ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="font-bold text-sm">{showIdentity ? 'Hide Sensitive Data' : 'Reveal Identity'}</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-48"
            />
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Biometric Token</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Attendance</th>
              <th className="px-6 py-4">Last Verification</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={student.photoUrl} 
                        className={`w-10 h-10 rounded-full object-cover border border-slate-200 transition-all duration-700 ${showIdentity ? 'blur-0' : 'blur-md grayscale'}`} 
                        alt="" 
                      />
                      {!showIdentity && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShieldCheck size={14} className="text-indigo-600 opacity-50" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{showIdentity ? student.name : `STUDENT_${student.id}`}</p>
                      <p className="text-[10px] font-mono text-slate-400">ID: {student.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase">Human Verified</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          student.attendancePercentage < ATTENDANCE_THRESHOLD ? 'bg-rose-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${student.attendancePercentage}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${
                      student.attendancePercentage < ATTENDANCE_THRESHOLD ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      {student.attendancePercentage}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {student.lastSeen || 'Pending'}
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
