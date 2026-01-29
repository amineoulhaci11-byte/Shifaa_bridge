import React from 'react';
import { User } from '../types';
import DownloadButton from './DownloadButton';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  // تمثيل لملفات المشروع للتحميل
  const projectFiles = {
    "package.json": `{ "name": "shifa-bridge", "version": "1.0.0" }`,
    "src/App.tsx": `// Main Application Code`,
    "README.txt": "مشروع جسر الشفاء - نظام طبي متكامل"
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-arabic">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xl">ج</span>
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hidden sm:block">جسر الشفاء</span>
          </div>
          <DownloadButton files={projectFiles} />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-left hidden md:block">
            <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{user.role === 'DOCTOR' ? 'طبيب معتمد' : 'حساب مريض'}</p>
          </div>
          <img src={user.avatar} className="w-10 h-10 rounded-xl border-2 border-slate-50 shadow-sm" alt="Profile" />
          <button 
            onClick={onLogout} 
            className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            title="تسجيل الخروج"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
