
export interface Student {
  id: string;
  name: string;
  grade: string;
  photoUrl: string; // Base64 or URL
  attendancePercentage: number;
  totalClasses: number;
  classesAttended: number;
  lastSeen?: string;
}

export interface AttendanceLog {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  method: 'Face Recognition' | 'Manual';
  status: 'Present' | 'Late' | 'Spoof Attempt';
}

export interface RecognitionResponse {
  studentId: string | null;
  confidence: number;
  isLive: boolean; // New: Liveness detection
  name?: string;
  reasoning?: string;
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lowAttendanceCount: number;
}
