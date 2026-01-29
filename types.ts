export type UserRole = 'PATIENT' | 'DOCTOR';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  specialty?: string;
  avatar: string;
  autoReplyEnabled?: boolean;
  autoReplyMessage?: string;
  maxAppointmentsPerDay?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string; 
  createdAt: string;
}
