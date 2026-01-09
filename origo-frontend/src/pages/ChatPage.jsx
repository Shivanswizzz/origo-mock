import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Send, Sparkles, Lock, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROFILES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ICEBREAKERS = [
  "I see you like Tech. Tabs or Spaces? 🤔",
  "If you could teleport to any campus right now, where would you go?",
  "That bio is chaotic energy and I'm here for it.",
  "Rate the mess food at your college from 1-10.",
  "Coffee or Chai person? Only one right answer."
];

export default function ChatPage() {
  const { userId: targetUserId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [messagesLeft, setMessagesLeft] = useState(5);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user && targetUserId) {
        initializeChat();
    }
  }, [user, targetUserId]);

  const initializeChat = async () => {
      try {
          setLoading(true);
          // HARDCODED DEMO: Find target profile in mock data
          const profile = MOCK_PROFILES.find(p => p.id === targetUserId);
          setTargetProfile(profile);

          setConversation({
              id: 'mock_conv',
              is_rizz_active: true,
              messages_sent_by_user1: 0
          });
          
          setMessagesLeft(5);
          setMessages([]);

      } catch (err) {
          console.error("Chat Init Error:", err);
          toast.error("Could not load chat");
      } finally {
          setLoading(false);
      }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !conversation) return;
    
    // HARDCODED DEMO: Optimistic update and mock reply
    const newMsg = {
        id: Date.now(),
        sender_id: user.id,
        content: inputText.trim(),
        sent_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setMessagesLeft(prev => prev - 1);

    // Mock response after 2 seconds
    setTimeout(() => {
        const reply = {
            id: Date.now() + 1,
            sender_id: targetUserId,
            content: "That's so interesting! I'd love to hear more about that. 😊",
            sent_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const useIcebreaker = (text) => {
    setInputText(text);
    setShowIcebreakers(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg-primary text-white">Loading Chat...</div>;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col md:flex-row">
       
      <div className="flex-1 flex flex-col h-screen relative">
        {/* Chat Header */}
        <header className="h-20 border-b border-white/5 bg-bg-secondary/30 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="relative">
              <img 
                src={targetProfile?.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUserId}`} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-primary" />
            </div>
            <div>
              <h3 className="font-bold">{targetProfile?.full_name || 'Student'}</h3>
              <p className="text-xs text-green-400">{targetProfile?.college?.name || 'Online'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {conversation?.is_rizz_active && (
                 <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    messagesLeft <= 2 ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-primary-500/10 border-primary-500/50 text-primary-400'
                 }`}>
                    {messagesLeft} Rizz Left
                 </div>
             )}
              {!conversation?.is_rizz_active && (
                  <div className="px-3 py-1 rounded-full text-xs font-bold border bg-green-500/10 border-green-500/50 text-green-400">
                      Connected
                  </div>
              )}
             <button className="text-text-tertiary hover:text-white"><MoreVertical size={20} /></button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-center text-text-tertiary opacity-60">
                <Sparkles size={48} className="mb-4 text-primary-500/50" />
                <p>You have 5 messages to make an impression.</p>
                <p className="text-sm">Make them count!</p>
             </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.sender_id === user?.id
                  ? 'bg-gradient-to-br from-primary-600 to-secondary-500 text-white rounded-tr-none shadow-lg shadow-primary-600/10' 
                  : 'bg-bg-secondary border border-white/5 text-text-primary rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-bg-secondary/30 border-t border-white/5">
          {messagesLeft <= 0 && conversation?.is_rizz_active ? (
            <div className="text-center p-4">
               <p className="text-text-secondary mb-3">You've used all your Rizz!</p>
               <div className="flex justify-center gap-4">
                 <Button variant="outline" size="sm">Wait for Reply</Button>
                 <Button className="flex items-center gap-2" size="sm">
                   <Lock size={14} /> Send Profile Boost ₹49
                 </Button>
               </div>
            </div>
          ) : (
            <div className="relative flex gap-3 items-center max-w-4xl mx-auto">
              {/* Icebreaker Popup */}
              <AnimatePresence>
                {showIcebreakers && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 w-full md:w-96 bg-bg-secondary border border-white/10 rounded-2xl p-4 shadow-2xl mb-4 z-20"
                  >
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="text-sm font-bold flex items-center gap-2"><Sparkles size={14} className="text-yellow-400"/> Icebreakers</h4>
                       <button onClick={() => setShowIcebreakers(false)} className="text-xs hover:text-white">Close</button>
                    </div>
                    <div className="space-y-2">
                      {ICEBREAKERS.map((txt, i) => (
                        <button 
                          key={i} 
                          onClick={() => useIcebreaker(txt)}
                          className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-sm text-text-secondary hover:text-primary-300 transition-colors"
                        >
                          {txt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setShowIcebreakers(!showIcebreakers)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-yellow-400 transition-colors"
                title="Get Icebreakers"
              >
                <Sparkles size={20} />
              </button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={conversation?.is_rizz_active ? `Type a message... (${messagesLeft} remaining)` : "Type a message..."}
                className="flex-1 bg-bg-primary/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all text-white"
              />
              
              <Button 
                onClick={handleSend} 
                className="w-12 h-12 p-0 rounded-xl flex items-center justify-center"
                disabled={!inputText.trim()}
              >
                <Send size={20} className={inputText.trim() ? "translate-x-0.5" : ""} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
