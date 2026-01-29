import React, { useMemo } from 'react';
import { Appointment, AppointmentStatus, User } from '../types';

interface DoctorDashboardProps {
  appointments: Appointment[];
  user: User;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ appointments, user, onUpdateStatus }) => {
  const pending = appointments.filter(a => a.status === AppointmentStatus.PENDING);
  const accepted = appointments.filter(a => a.status === AppointmentStatus.ACCEPTED);

  return (
    <div className="space-y-8 font-arabic">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <h2 className="text-4xl font-black text-slate-800">لوحة تحكم الطبيب: {user.name}</h2>
        <div className="flex gap-4 mt-6">
          <div className="bg-blue-50 p-6 rounded-3xl flex-1 text-center">
            <p className="text-3xl font-black text-blue-600">{accepted.length}</p>
            <p className="text-sm font-bold text-blue-400">مواعيد مؤكدة</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-3xl flex-1 text-center">
            <p className="text-3xl font-black text-amber-600">{pending.length}</p>
            <p className="text-sm font-bold text-amber-400">طلبات جديدة</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="text-2xl font-black mb-8">طلبات الانتظار</h3>
        {pending.map(a => (
          <div key={a.id} className="p-6 border-b flex justify-between items-center last:border-0">
            <div>
              <p className="text-xl font-black">{a.patientName}</p>
              <p className="text-sm text-slate-400">التاريخ: {a.date} | دور رقم: {a.time}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => onUpdateStatus(a.id, AppointmentStatus.REJECTED)} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold">رفض</button>
              <button onClick={() => onUpdateStatus(a.id, AppointmentStatus.ACCEPTED)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">قبول</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
