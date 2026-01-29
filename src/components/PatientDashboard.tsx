import React, { useState, useMemo, useEffect } from 'react';
import { Appointment, AppointmentStatus, User } from '../types';
import { supabase } from '../services/supabaseClient';

interface PatientDashboardProps {
  appointments: Appointment[];
  doctors: User[];
  onBook: (appt: any) => Promise<boolean>;
  user: User;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ appointments, doctors, onBook, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [formData, setFormData] = useState({ date: '', queueNumber: '', notes: '' });

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    const success = await onBook({
      patientId: user.id,
      doctorId: selectedDoctor.id,
      date: formData.date,
      time: formData.queueNumber,
      notes: formData.notes
    });
    if (success) setShowModal(false);
  };

  return (
    <div className="space-y-8 font-arabic">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl flex justify-between items-center border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800">أهلاً بك، {user.name}</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">حجز جديد</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black mb-6">مواعيدك القادمة</h3>
          {appointments.map(a => (
            <div key={a.id} className="p-4 mb-3 border rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-black">{a.doctorName}</p>
                <p className="text-xs text-slate-400">{a.date} - دور #{a.time}</p>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{a.status}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black mb-6">الأطباء المتاحون</h3>
          {doctors.map(d => (
            <div key={d.id} className="p-4 mb-3 border rounded-2xl flex items-center gap-4">
              <img src={d.avatar} className="w-12 h-12 rounded-xl" />
              <div className="flex-1">
                <p className="font-black">{d.name}</p>
                <p className="text-xs text-blue-500 font-bold">{d.specialty}</p>
              </div>
              <button onClick={() => { setSelectedDoctor(d); setShowModal(true); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">حجز</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
