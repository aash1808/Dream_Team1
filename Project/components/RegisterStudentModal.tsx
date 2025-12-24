
import React, { useState } from 'react';
import { X, Camera, Upload, UserPlus } from 'lucide-react';
import { api } from '../services/api';

interface RegisterStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStudent: any) => void;
}

const RegisterStudentModal: React.FC<RegisterStudentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: `STU${Math.floor(Math.random() * 9000) + 1000}`,
    name: '',
    grade: '10th Grade',
    photoUrl: ''
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.photoUrl) return;
    
    setLoading(true);
    try {
      const newStudent = await api.registerStudent(formData);
      onSuccess(newStudent);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Register New Student</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full border-4 border-indigo-50 bg-slate-100 flex items-center justify-center overflow-hidden">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-slate-300" size={40} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
                <Upload size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g. John Doe" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Student ID</label>
              <input 
                disabled
                value={formData.id}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-xl text-slate-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Grade</label>
              <select 
                value={formData.grade}
                onChange={e => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>9th Grade</option>
                <option>10th Grade</option>
                <option>11th Grade</option>
                <option>12th Grade</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !formData.name || !formData.photoUrl}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all ${
              loading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg active:scale-[0.98]'
            }`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={20} />}
            <span>{loading ? 'Registering...' : 'Complete Registration'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudentModal;
