import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const RegisterDoctor: React.FC<{onBack: () => void, onSuccess: (d: any) => void}> = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', specialty: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('doctors').insert([{ full_name: formData.fullName, email: formData.email, password: formData.password, specialty: formData.specialty }]).select().single();
    if (!error) onSuccess({ ...data, role: 'DOCTOR', name: data.full_name, avatar: `https://ui-avatars.com/api/?name=${data.full_name}` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 font-arabic p-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md space-y-4">
        <h2 className="text-3xl font-black mb-8">تسجيل طبيب</h2>
        <input placeholder="الاسم الكامل" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={e => setFormData({...formData, fullName: e.target.value})} />
        <input placeholder="البريد الإلكتروني" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input placeholder="التخصص" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={e => setFormData({...formData, specialty: e.target.value})} />
        <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={e => setFormData({...formData, password: e.target.value})} />
        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black">تفعيل حساب الطبيب</button>
        <button type="button" onClick={onBack} className="w-full text-slate-400 font-bold">رجوع</button>
      </form>
    </div>
  );
};

export default RegisterDoctor;
