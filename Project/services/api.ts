
import { Student, AttendanceLog } from "../types";
import { INITIAL_STUDENTS } from "../constants";

const DB_KEYS = {
  STUDENTS: 'face_track_db_students_v2',
  LOGS: 'face_track_db_logs_v2'
};

/**
 * MOCK BACKEND SERVICE
 * Simulates a robust database with local storage persistence.
 */
class AttendanceAPI {
  private async delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getStudents(): Promise<Student[]> {
    await this.delay(200);
    const data = localStorage.getItem(DB_KEYS.STUDENTS);
    if (!data) {
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(data);
  }

  async getLogs(): Promise<AttendanceLog[]> {
    await this.delay(150);
    const data = localStorage.getItem(DB_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }

  async resetToDefaults(): Promise<void> {
    await this.delay(1000);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify([]));
  }

  async clearDatabase(): Promise<void> {
    await this.delay(500);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify([]));
  }

  async registerStudent(student: Omit<Student, 'attendancePercentage' | 'totalClasses' | 'classesAttended'>): Promise<Student> {
    await this.delay(800);
    const students = await this.getStudents();
    
    // Check for duplicate ID
    if (students.some(s => s.id === student.id)) {
      student.id = `STU${Math.floor(Math.random() * 9000) + 1000}`;
    }

    const newStudent: Student = {
      ...student,
      attendancePercentage: 0,
      totalClasses: 0,
      classesAttended: 0,
      lastSeen: undefined
    };
    
    const updated = [...students, newStudent];
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(updated));
    return newStudent;
  }

  async recordAttendance(studentId: string, method: 'Face Recognition' | 'Manual'): Promise<{ student: Student, log: AttendanceLog }> {
    await this.delay(400);
    const students = await this.getStudents();
    const logs = await this.getLogs();

    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) throw new Error("Student not found");

    const student = students[studentIndex];
    
    // Prevent double check-in on the same day if desired (Simple logic: just increment)
    const updatedStudent = {
      ...student,
      classesAttended: student.classesAttended + 1,
      totalClasses: student.totalClasses + 1,
      lastSeen: new Date().toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true,
        month: 'short',
        day: 'numeric'
      })
    };
    
    updatedStudent.attendancePercentage = Math.round((updatedStudent.classesAttended / updatedStudent.totalClasses) * 100);

    const newLog: AttendanceLog = {
      id: `LOG_${Date.now()}`,
      studentId,
      studentName: student.name,
      timestamp: new Date().toLocaleString(),
      method,
      status: 'Present'
    };

    students[studentIndex] = updatedStudent;
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify([newLog, ...logs]));

    return { student: updatedStudent, log: newLog };
  }
}

export const api = new AttendanceAPI();
