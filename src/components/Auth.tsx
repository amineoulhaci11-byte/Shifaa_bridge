import React, { useState } from 'react';
import { UserRole } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
  onLogin: (role: UserRole, userData?: any) => void;
  onRegisterClick: () => void;
  onDoctorRegisterClick: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegisterClick, onDoctorRegisterClick }) => {
  const [step, setStep] = useState<'CHOICE' | 'PATIENT_LOGIN' | 'DOCTOR_LOGIN'>('CHOICE');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { data, error: dbError } = await supabase.from('patients').select('*').eq('phone_number', phone).eq('password', password).single();
    if (dbError || !data) { setError('بيانات خاطئة'); } 
    else { onLogin('PATIENT', { id: data.id.toString(), name: data.full_name, role: 'PATIENT', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name)}&background=3b82f6&color=fff` }); }
    setLoading(false);
  };

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { data, error: dbError } = await supabase.from('doctors').select('*').eq('email', email).eq('password', password).single();
    if (dbError || !data) { setError('بيانات خاطئة'); } 
    else { onLogin('DOCTOR', { id: data.id.toString(), name: data.full_name, role: 'DOCTOR', specialty: data.specialty, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name)}&background=312e81&color=fff` }); }
    setLoading(false);
  };

  if (step === 'CHOICE') return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full space-y-8 text-center p-8 bg-white rounded-[3rem] shadow-xl">
        <h1 className="text-4xl font-black text-blue-600">جسر الشفاء</h1>
        <button onClick={() => setStep('PATIENT_LOGIN')} className="w-full p-6 bg-blue-50 border rounded-2xl hover:bg-blue-600 hover:text-white transition-all">أنا مريض</button>
        <button onClick={() => setStep('DOCTOR_LOGIN')} className="w-full p-6 bg-indigo-50 border rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">أنا طبيب</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full space-y-8">
        <button onClick={() => setStep('CHOICE')} className="text-slate-400 font-bold">← العودة</button>
        <form onSubmit={step === 'PATIENT_LOGIN' ? handlePatientLogin : handleDoctorLogin} className="space-y-4">
          <input 
            type={step === 'PATIENT_LOGIN' ? "tel" : "email"} 
            placeholder={step === 'PATIENT_LOGIN' ? "رقم الهاتف" : "البريد الإلكتروني"} 
            className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" 
            onChange={e => step === 'PATIENT_LOGIN' ? setPhone(e.target.value) : setEmail(e.target.value)} 
          />
          <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">{loading ? 'تحقق...' : 'دخول'}</button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
