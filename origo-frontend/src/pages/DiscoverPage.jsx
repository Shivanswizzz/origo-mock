import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Filter, MessageCircle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          college:colleges(name)
        `)
        .eq('is_verified', true)
        .limit(20);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
       console.error('Error fetching profiles', error);
       toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 min-h-screen relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
             <div className="relative w-full md:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
               <input 
                 type="text" 
                 placeholder="Search by interests, college..." 
                 className="w-full bg-bg-secondary/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-text-primary placeholder:text-text-tertiary"
               />
             </div>
             
             <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none" onClick={() => setShowFilters(!showFilters)}>
                  <Filter size={18} className="mr-2" /> Filters
                </Button>
                <div className="flex bg-bg-secondary/50 rounded-xl p-1 border border-white/10">
                   <button className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium">Nearby</button>
                   <button className="px-4 py-2 rounded-lg text-text-tertiary hover:text-white text-sm font-medium transition-colors">New</button>
                </div>
             </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-text-tertiary col-span-full text-center py-10">Loading profiles...</p>
            ) : profiles.map((profile, idx) => (
              <motion.div 
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={profile.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`} alt={profile.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 text-sm font-bold text-green-400">
                    {90 + (idx % 10)}% Match
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{profile.full_name}, {new Date().getFullYear() - new Date(profile.date_of_birth || '2000-01-01').getFullYear()}</h3>
                    <p className="text-sm text-gray-300 opacity-90">{profile.college?.name} • Year {profile.year_of_study}</p>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  {/* Mock Interests for now if column is just jsonb or not joined */}
                  <div className="flex flex-wrap gap-2">
                    {['Coding', 'Music', 'Travel'].map(int => (
                      <span key={int} className="px-2 py-1 rounded-md bg-white/5 text-xs text-text-secondary border border-white/5">{int}</span>
                    ))}
                  </div>
                  <p className="text-sm text-text-tertiary line-clamp-2">{profile.bio || 'New student at Origo.'}</p>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-0"
                      onClick={() => navigate(`/chat/${profile.id}`)}
                    >
                      <MessageCircle size={18} className="mr-2" /> Rizz
                    </Button>
                    <Button variant="ghost" className="w-12 px-0 hover:text-blue-400">
                      <Sparkles size={20} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filter Panel (Slide-over) */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-y-0 right-0 w-full sm:w-96 bg-bg-secondary border-l border-white/10 z-50 p-6 shadow-2xl overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                </div>
                
                <div className="space-y-8">
                   <div>
                     <label className="text-sm font-semibold text-text-secondary mb-3 block">Looking For</label>
                     <div className="grid grid-cols-2 gap-3">
                       <button className="p-3 rounded-xl bg-primary-600/20 border border-primary-500 text-primary-400 font-medium">Friends</button>
                       <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-text-tertiary font-medium">Dating</button>
                     </div>
                   </div>

                   <div>
                     <label className="text-sm font-semibold text-text-secondary mb-3 block">Distance</label>
                     <input type="range" className="w-full accent-primary-500" />
                     <div className="flex justify-between text-xs text-text-tertiary mt-2">
                       <span>0km</span>
                       <span>50km</span>
                     </div>
                   </div>

                   <div>
                     <label className="text-sm font-semibold text-text-secondary mb-3 block">Colleges</label>
                     <div className="space-y-2">
                       {['IIT Delhi', 'DTU', 'NSUT', 'Miranda House'].map(c => (
                         <label key={c} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                            <input type="checkbox" className="rounded bg-bg-primary border-white/20 text-primary-500 focus:ring-primary-500" />
                            <span className="text-sm">{c}</span>
                         </label>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-bg-secondary border-t border-white/10">
                  <Button className="w-full" onClick={() => setShowFilters(false)}>Apply Filters</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
