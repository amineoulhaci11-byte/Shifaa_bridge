import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import { UserRole, User, Appointment, AppointmentStatus, Message } from './types';

import Auth from './components/Auth';
import Navbar from './components/Navbar';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import ChatCenter from './components/ChatCenter';
import RegisterPatient from './components/RegisterPatient';
import RegisterDoctor from './components/RegisterDoctor';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'AUTH' | 'REGISTER_PATIENT' | 'REGISTER_DOCTOR' | 'APP'>('AUTH');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchDoctors = useCallback(async () => {
    const { data } = await supabase.from('doctors').select('*');
    if (data) {
      setDoctors(data.map((d: any) => ({
        id: d.id.toString(),
        name: d.full_name,
        role: 'DOCTOR' as UserRole,
        specialty: d.specialty,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.full_name)}&background=312e81&color=fff`,
        maxAppointmentsPerDay: d.max_appointments_per_day || 20
      })));
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    const isPatient = user.role === 'PATIENT';
    const { data } = await supabase.from('appointments').select('*')
      .eq(isPatient ? 'patient_id' : 'doctor_id', user.id)
      .order('appointment_date', { ascending: true });
    
    if (data) {
      setAppointments(data.map((a: any) => ({
        id: a.id.toString(),
        patientId: a.patient_id,
        doctorId: a.doctor_id,
        patientName: a.patient_name || 'مريض',
        doctorName: a.doctor_name || 'طبيب',
        date: a.appointment_date,
        time: a.appointment_time,
        status: (a.status || 'PENDING').toUpperCase() as AppointmentStatus,
        notes: a.notes || ''
      })));
    }
  }, [user]);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('messages').select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });
    if (data) {
      setMessages(data.map((m: any) => ({
        id: m.id.toString(),
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        content: m.content,
        createdAt: m.created_at
      })));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDoctors();
      fetchAppointments();
      fetchMessages();
      const channel = supabase.channel('updates').on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments).subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user, fetchDoctors, fetchAppointments]);

  const handleBook = async (appt: any) => {
    const { error } = await supabase.from('appointments').insert([{
      patient_id: appt.patientId,
      doctor_id: appt.doctorId,
      appointment_date: appt.date,
      appointment_time: appt.time,
      status: 'PENDING',
      notes: appt.notes,
      patient_name: user?.name,
      doctor_name: doctors.find(d => d.id === appt.doctorId)?.name || 'طبيب'
    }]);
    if (error) return false;
    fetchAppointments();
    return true;
  };

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
  };

  const handleSendMessage = async (text: string, receiverId: string) => {
    if (!user) return;
    await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: receiverId, content: text }]);
  };

  if (view === 'AUTH') return <Auth onLogin={(role, data) => { setUser(data); setView('APP'); }} onRegisterClick={() => setView('REGISTER_PATIENT')} onDoctorRegisterClick={() => setView('REGISTER_DOCTOR')} />;
  if (view === 'REGISTER_PATIENT') return <RegisterPatient onBack={() => setView('AUTH')} onSuccess={d => { setUser(d); setView('APP'); }} />;
  if (view === 'REGISTER_DOCTOR') return <RegisterDoctor onBack={() => setView('AUTH')} onSuccess={d => { setUser(d); setView('APP'); }} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-arabic" dir="rtl">
      <Navbar user={user!} onLogout={() => { setUser(null); setView('AUTH'); }} />
      <main className="flex-1 container mx-auto p-6 max-w-6xl">
        {user?.role === 'PATIENT' ? (
          <PatientDashboard appointments={appointments} doctors={doctors} onBook={handleBook} onReview={async () => {}} user={user} onRefresh={fetchAppointments} />
        ) : (
          <DoctorDashboard appointments={appointments} user={user!} onUpdateStatus={handleUpdateStatus} onUpdateSettings={async () => {}} />
        )}
      </main>
      <ChatCenter user={user!} messages={messages} contacts={user?.role === 'PATIENT' ? doctors : []} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default App;
