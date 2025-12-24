import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const THREADS = [
  { id: 1, name: "Aanya", lastMsg: "See you at the fest! 🎉", time: "2m", unread: 2, online: true, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
  { id: 2, name: "Tech Society", lastMsg: "Reminder: Meeting at 5 PM", time: "1h", unread: 0, group: true, img: "" },
  { id: 3, name: "Kabir", lastMsg: "Bro, did you check the notes?", time: "3h", unread: 0, online: false, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" },
];

export default function MessagesPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-80px)] md:h-screen">
        {/* List Panel */}
        <div className="w-full md:w-96 border-r border-white/5 flex flex-col bg-bg-secondary/10">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
              <input 
                 type="text" 
                 placeholder="Search chats..." 
                 className="w-full bg-bg-secondary border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {THREADS.map(thread => (
              <div 
                key={thread.id} 
                onClick={() => navigate(`/chat/${thread.id}`)}
                className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5"
              >
                <div className="relative">
                   <div className={`w-12 h-12 rounded-full ${thread.group ? 'bg-indigo-500 flex items-center justify-center' : ''}`}>
                      {thread.group ? 'TS' : <img src={thread.img} className="w-full h-full rounded-full object-cover" />}
                   </div>
                   {thread.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-bg-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold truncate">{thread.name}</h4>
                    <span className="text-xs text-text-tertiary">{thread.time}</span>
                  </div>
                  <p className={`text-sm truncate ${thread.unread ? 'text-white font-medium' : 'text-text-tertiary'}`}>
                    {thread.lastMsg}
                  </p>
                </div>
                {thread.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-[10px] font-bold">
                    {thread.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder for Desktop Empty State */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-bg-primary/50 text-center p-10">
           <div>
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-text-tertiary" />
             </div>
             <h2 className="text-xl font-bold mb-2">Select a conversation</h2>
             <p className="text-text-tertiary">Or start a new one from Discover.</p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
