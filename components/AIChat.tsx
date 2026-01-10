
import React, { useState, useRef, useEffect } from 'react';
import { chatWithSuperintendent } from '../services/geminiService.ts';
import { ChatMessage } from '../types.ts';
import { Send, Bot, HardHat } from 'lucide-react';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '1', role: 'model', text: "Ready to help with site questions.", timestamp: new Date() }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]); setInput(''); setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await chatWithSuperintendent(history, input);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || "...", timestamp: new Date() }]);
    } catch (e) {} finally { setLoading(false); }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="bg-slate-900 p-4 flex items-center gap-3 text-white"><HardHat className="text-orange-500" /><div><h2 className="font-bold">Site AI Assistant</h2></div></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2"><input className="flex-1 border p-2 rounded-full" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." /><button type="submit" className="bg-orange-600 text-white p-2 rounded-full"><Send size={20}/></button></form>
    </div>
  );
};

export default AIChat;
