
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Users, UserCheck, AlertTriangle } from 'lucide-react';
import { Student, AttendanceLog } from '../types';
import { ATTENDANCE_THRESHOLD } from '../constants';

interface DashboardProps {
  students: Student[];
  logs: AttendanceLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, logs }) => {
  const lowAttendanceStudents = students.filter(s => s.attendancePercentage < ATTENDANCE_THRESHOLD);
  const presentCount = students.filter(s => {
    const today = new Date().toLocaleDateString();
    return logs.some(l => l.studentId === s.id && new Date(l.timestamp).toLocaleDateString() === today);
  }).length;

  const dataPie = [
    { name: 'Present', value: presentCount },
    { name: 'Absent', value: students.length - presentCount },
  ];
  const COLORS = ['#4f46e5', '#e2e8f0'];

  const recentActivity = logs.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
        <p className="text-slate-500">Real-time attendance analytics for today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={students.length} icon={<Users className="text-indigo-600" />} />
        <StatCard title="Present Today" value={presentCount} icon={<UserCheck className="text-emerald-600" />} />
        <StatCard title="Overall Attendance" value={`${Math.round(students.reduce((acc, s) => acc + s.attendancePercentage, 0) / students.length)}%`} icon={<TrendingUp className="text-blue-600" />} />
        <StatCard title="Low Attendance" value={lowAttendanceStudents.length} icon={<AlertTriangle className="text-rose-600" />} highlight={lowAttendanceStudents.length > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Distribution */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Today's Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span className="text-sm text-slate-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <span className="text-sm text-slate-600">Absent</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-center py-12 text-slate-400">No activity recorded today.</p>
            ) : (
              recentActivity.map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-bold">
                      {log.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{log.studentName}</p>
                      <p className="text-xs text-slate-500">{log.method} • {log.timestamp}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    {log.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; highlight?: boolean }> = ({ title, value, icon, highlight }) => (
  <div className={`p-6 rounded-2xl border ${highlight ? 'border-rose-200 bg-rose-50' : 'border-slate-100 bg-white'} shadow-sm`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50">{icon}</div>
    </div>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    <h2 className="text-3xl font-bold mt-1 text-slate-900">{value}</h2>
  </div>
);

export default Dashboard;
