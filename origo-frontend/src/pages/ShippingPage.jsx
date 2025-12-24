import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Heart, Link as LinkIcon, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ShippingPage() {
  const { user } = useAuth();
  
  // State for Person A
  const [queryA, setQueryA] = useState('');
  const [resultsA, setResultsA] = useState([]);
  const [showResultsA, setShowResultsA] = useState(false);
  const [personA, setPersonA] = useState(null);

  // State for Person B
  const [queryB, setQueryB] = useState('');
  const [resultsB, setResultsB] = useState([]);
  const [showResultsB, setShowResultsB] = useState(false);
  const [personB, setPersonB] = useState(null);

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounced search (simplification: direct call for now)
  const searchUsers = async (query, setResults) => {
      if (!query || query.length < 2) {
          setResults([]);
          return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, profile_photo_url, college:colleges(name)')
        .ilike('full_name', `%${query}%`)
        .limit(5);
      setResults(data || []);
  };

  const handleShip = async () => {
    if (!personA || !personB) return;
    setLoading(true);
    
    try {
        // Insert ship Record
        // In real app, this initiates a payment flow first.
        // Assuming 'pending' status until paid, or assuming free for this MVP step.
        const { error } = await supabase.from('ships').insert({
            shipper_id: user.id,
            user_id_1: personA.id,
            user_id_2: personB.id,
            reason: reason,
            status: 'pending' // pending payment or revelation
        });

        if (error) throw error;
        
        toast.success(`You shipped ${personA.full_name} and ${personB.full_name}!`);
        setPersonA(null);
        setPersonB(null);
        setQueryA('');
        setQueryB('');
        setReason('');

    } catch (err) {
        toast.error(err.message || 'Failed to ship');
    } finally {
        setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20 mb-4">
               <Heart className="text-white fill-current" size={32} />
             </div>
             <h1 className="text-4xl font-bold">Ship Your Friends</h1>
             <p className="text-text-secondary max-w-lg mx-auto">
               Know two people who would be perfect together? Connect them anonymously. 
               If they match, you get the credit!
             </p>
          </div>

          {/* Shipping Tool */}
          <div className="glass-card p-8 rounded-3xl border-primary-500/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 bg-primary-500/10 rounded-bl-2xl text-primary-400 text-xs font-bold border-l border-b border-primary-500/20">
               ₹19 per ship
             </div>
             
             <div className="flex flex-col md:flex-row items-center gap-6 justify-center py-6">
                {/* Person A Search */}
                <div className="flex-1 w-full relative group">
                   <div className="w-24 h-24 mx-auto rounded-full bg-bg-secondary border-2 border-dashed border-white/20 flex items-center justify-center mb-4 group-hover:border-pink-500 transition-colors overflow-hidden">
                      {personA ? (
                          <img src={personA.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${personA.id}`} className="w-full h-full object-cover"/>
                      ) : (
                          <Search className="text-text-tertiary" />
                      )}
                   </div>
                   <div className="relative">
                       <Input 
                         placeholder="Search friend..." 
                         className="text-center"
                         value={queryA}
                         onChange={(e) => {
                             setQueryA(e.target.value);
                             searchUsers(e.target.value, setResultsA);
                         }}
                         onFocus={() => setShowResultsA(true)}
                       />
                       {showResultsA && resultsA.length > 0 && (
                           <div className="absolute top-full left-0 right-0 bg-bg-secondary border border-white/10 rounded-xl mt-2 max-h-48 overflow-y-auto z-20 shadow-xl">
                               {resultsA.map(u => (
                                   <div 
                                     key={u.id} 
                                     className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors"
                                     onClick={() => { setPersonA(u); setQueryA(u.full_name); setShowResultsA(false); }}
                                   >
                                       <img src={u.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} className="w-8 h-8 rounded-full"/>
                                       <div className="text-left">
                                           <p className="text-sm font-bold text-white">{u.full_name}</p>
                                           <p className="text-xs text-text-tertiary">{u.college?.name}</p>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
                   {personA && <button onClick={() => { setPersonA(null); setQueryA(''); }} className="absolute -top-2 right-0 text-xs text-red-400 hover:underline">Clear</button>}
                </div>

                {/* Connector */}
                <div className="flex flex-col items-center gap-2 text-pink-500">
                   <div className="w-12 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
                   <LinkIcon size={24} />
                   <div className="w-12 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
                </div>

                {/* Person B Search */}
                <div className="flex-1 w-full relative group">
                   <div className="w-24 h-24 mx-auto rounded-full bg-bg-secondary border-2 border-dashed border-white/20 flex items-center justify-center mb-4 group-hover:border-pink-500 transition-colors overflow-hidden">
                      {personB ? (
                          <img src={personB.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${personB.id}`} className="w-full h-full object-cover"/>
                      ) : (
                          <Search className="text-text-tertiary" />
                      )}
                   </div>
                   <div className="relative">
                       <Input 
                         placeholder="Search match..." 
                         className="text-center"
                         value={queryB}
                         onChange={(e) => {
                             setQueryB(e.target.value);
                             searchUsers(e.target.value, setResultsB);
                         }}
                         onFocus={() => setShowResultsB(true)}
                       />
                       {showResultsB && resultsB.length > 0 && (
                           <div className="absolute top-full left-0 right-0 bg-bg-secondary border border-white/10 rounded-xl mt-2 max-h-48 overflow-y-auto z-20 shadow-xl">
                               {resultsB.map(u => (
                                   <div 
                                     key={u.id} 
                                     className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors"
                                     onClick={() => { setPersonB(u); setQueryB(u.full_name); setShowResultsB(false); }}
                                   >
                                       <img src={u.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} className="w-8 h-8 rounded-full"/>
                                       <div className="text-left">
                                           <p className="text-sm font-bold text-white">{u.full_name}</p>
                                           <p className="text-xs text-text-tertiary">{u.college?.name}</p>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
                   {personB && <button onClick={() => { setPersonB(null); setQueryB(''); }} className="absolute -top-2 right-0 text-xs text-red-400 hover:underline">Clear</button>}
                </div>
             </div>

             <div className="max-w-md mx-auto mt-6 space-y-4">
               <textarea 
                 placeholder="Why should they meet? (Optional)" 
                 className="w-full bg-bg-primary/50 border border-white/10 rounded-xl p-4 h-24 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all text-sm text-white"
                 value={reason}
                 onChange={(e) => setReason(e.target.value)}
               />
               <Button 
                 onClick={handleShip}
                 isLoading={loading}
                 className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-0 h-12 text-lg"
                 disabled={!personA || !personB || personA.id === personB.id}
               >
                 Ship Them Now <ArrowRight size={18} className="ml-2" />
               </Button>
             </div>
          </div>

          {/* Your Ships / Shipped You */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Who Shipped You */}
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-6">
                 <Lock className="text-gray-400 mb-2" size={32} />
                 <h3 className="font-bold text-lg mb-1">Unlock Your Ships</h3>
                 <p className="text-text-tertiary text-sm mb-4">See who thinks you should be dating someone.</p>
                 <Button size="sm" variant="outline">Unlock for ₹49</Button>
               </div>
               
               <h3 className="font-bold mb-4 opacity-50">Who Shipped You</h3>
               <div className="space-y-4 opacity-30 blur-sm">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-600" />
                       <div className="w-full h-10 bg-white/5 rounded-lg" />
                    </div>
                  ))}
               </div>
            </div>

            {/* Your Active Ships */}
            <div className="glass-card p-6 rounded-3xl">
               <h3 className="font-bold mb-4">Your Active Ships</h3>
               <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between border border-white/5">
                     <div className="flex -space-x-2">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=50" className="w-8 h-8 rounded-full border-2 border-bg-secondary" />
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=50" className="w-8 h-8 rounded-full border-2 border-bg-secondary" />
                     </div>
                     <span className="text-xs font-bold text-yellow-400">Pending</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between border border-white/5">
                     <div className="flex -space-x-2">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50" className="w-8 h-8 rounded-full border-2 border-bg-secondary" />
                        <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=50" className="w-8 h-8 rounded-full border-2 border-bg-secondary" />
                     </div>
                     <span className="text-xs font-bold text-green-400">Matched! 🎉</span>
                  </div>
               </div>
               <Button variant="ghost" className="w-full mt-4 text-xs">View History</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
