import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { getSmartResponse } from '../services/gemini';

interface ChatCenterProps {
  user: User;
  messages: Message[];
  contacts: User[];
  onSendMessage: (text: string, receiverId: string) => void;
}

const ChatCenter: React.FC<ChatCenterProps> = ({ user, messages, contacts, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTypingAI, setIsTypingAI] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedContact) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text, selectedContact.id);

    if (text.includes('مساعد') || text.includes('نصيحة')) {
      setIsTypingAI(true);
      const aiReply = await getSmartResponse(text, user.role);
      setIsTypingAI(false);
      onSendMessage(`🤖 مساعد الشفاء: ${aiReply}`, user.id);
    }
  };

  const currentMessages = messages.filter(m => 
    (m.senderId === user.id && m.receiverId === selectedContact?.id) ||
    (m.senderId === selectedContact?.id && m.receiverId === user.id)
  );

  return (
    <div className={`fixed z-[100] transition-all font-arabic ${isOpen ? 'inset-0 md:inset-auto md:bottom-10 md:left-10' : 'bottom-10 left-10'}`}>
      {isOpen ? (
        <div className="w-full h-full md:w-[400px] md:h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <h3 className="font-black">{selectedContact ? selectedContact.name : 'الرسائل'}</h3>
            <button onClick={() => setIsOpen(false)} className="text-2xl">×</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {selectedContact ? currentMessages.map(m => (
              <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-3 rounded-2xl text-sm font-bold ${m.senderId === user.id ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                  {m.content}
                </div>
              </div>
            )) : contacts.map(c => (
              <button key={c.id} onClick={() => setSelectedContact(c)} className="w-full p-4 bg-white rounded-xl border flex items-center gap-3">
                <img src={c.avatar} className="w-10 h-10 rounded-lg" />
                <span className="font-black">{c.name}</span>
              </button>
            ))}
          </div>
          {selectedContact && (
            <div className="p-4 bg-white border-t flex gap-2">
              <input value={inputText} onChange={e => setInputText(e.target.value)} className="flex-1 bg-slate-100 rounded-xl px-4 outline-none font-bold" placeholder="اكتب..." />
              <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">إرسال</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-xl text-3xl">💬</button>
      )}
    </div>
  );
};

export default ChatCenter;
