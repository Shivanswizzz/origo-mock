import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Heart, MessageCircle, MoreHorizontal, Link as LinkIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { MOCK_PROFILES, MOCK_POSTS, MOCK_COMMUNITIES, MOCK_EVENTS } from '../data/mockData';

export default function HomePage() {
  const navigate = useNavigate();

  const handleJoin = (e, name) => {
    e.stopPropagation();
    toast.success(`Joined ${name}! Welcome to the community.`);
  };

  const handleUnlock = () => {
    toast.dismiss();
    toast('Unlocking your ships...', { icon: '🔑' });
    setTimeout(() => {
        navigate('/ship');
    }, 1000);
  };

  const handleVibeMatch = (name) => {
    toast(`Vibing with ${name}...`, { icon: '✨' });
    setTimeout(() => {
        navigate('/discover');
    }, 800);
  };
  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row h-full">
        {/* Center Feed */}
        <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full space-y-10 pb-20">
          
          {/* Matches Horizontal Scroll */}
          <section>
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">Discover Matches</h2>
               <Button variant="ghost" size="sm" className="text-primary-400">View All</Button>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
               {MOCK_PROFILES.map(match => (
                 <div key={match.id} className="min-w-[160px] h-[220px] relative rounded-2xl overflow-hidden group cursor-pointer">
                   <img src={match.profile_photo_url} alt={match.full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                     <h3 className="font-bold text-white">{match.full_name}, {match.age}</h3>
                     <p className="text-xs text-gray-300 truncate">{match.college.name}</p>
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Communities Suggestion */}
          <section>
            <h2 className="text-xl font-bold mb-6">Suggested Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_COMMUNITIES.map(comm => (
                <div 
                  key={comm.id} 
                  onClick={() => navigate(`/communities/${comm.id}`)}
                  className="bg-bg-secondary/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary-500/30 transition-colors cursor-pointer"
                >
                  <img src={comm.img} alt={comm.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold">{comm.name}</h3>
                    <p className="text-xs text-text-tertiary">{comm.members}+ members</p>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-auto" onClick={(e) => handleJoin(e, comm.name)}>Join</Button>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Upcoming Events</h2>
              <Button variant="ghost" size="sm" className="text-primary-400" onClick={() => navigate('/events')}>Discover More</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_EVENTS.map(event => (
                <div 
                  key={event.id} 
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="text-secondary-400 font-bold text-sm mb-1">{event.date.split(',')[0]}</div>
                  <h3 className="font-bold group-hover:text-primary-400 transition-colors">{event.title}</h3>
                  <p className="text-xs text-text-tertiary mt-1">{event.location}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Feed */}
           <section>
            <h2 className="text-xl font-bold mb-6">Campus Highlights</h2>
            <div className="space-y-6">
              {MOCK_POSTS.map(post => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={post.id} 
                  className="glass-card p-6 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-500/20" />
                    <div>
                      <h4 className="font-bold text-sm">{post.author}</h4>
                      <p className="text-xs text-text-tertiary">{post.time}</p>
                    </div>
                    <button className="ml-auto text-text-tertiary"><MoreHorizontal size={18} /></button>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-4">{post.content}</p>
                  <div className="flex items-center gap-6 text-text-tertiary text-sm">
                    <button className="flex items-center gap-2 hover:text-pink-500 transition-colors"><Heart size={18} /> {post.likes}</button>
                    <button className="flex items-center gap-2 hover:text-blue-500 transition-colors"><MessageCircle size={18} /> {post.comments}</button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto"><LinkIcon size={18} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Panel */}
        <div className="hidden xl:block w-80 p-6 space-y-8 border-l border-white/5 bg-bg-secondary/10 sticky top-0 h-screen overflow-y-auto">
          {/* Who Shipped You */}
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-secondary-900/40 opacity-50" />
             <div className="relative z-10">
               <h3 className="font-bold mb-2">Who shipped you?</h3>
               <p className="text-xs text-text-secondary mb-4">2 people want you to meet someone.</p>
               <div className="flex gap-2 mb-4 justify-center">
                 <img src={MOCK_PROFILES[1].profile_photo_url} className="w-10 h-10 rounded-full object-cover" />
                 <img src={MOCK_PROFILES[2].profile_photo_url} className="w-10 h-10 rounded-full object-cover" />
               </div>
                <Button 
                    size="sm" 
                    variant="primary" 
                    className="w-full text-xs"
                    onClick={handleUnlock}
                >
                    Unlock Now <LinkIcon size={12} className="ml-2"/>
                </Button>
             </div>
          </div>

          {/* Active Now */}
          <div>
            <h3 className="font-bold text-sm text-text-secondary mb-4 uppercase tracking-wider">Active Now</h3>
            <div className="space-y-4">
              {MOCK_PROFILES.slice(0, 4).map(u => (
                <div 
                  key={u.id} 
                  onClick={() => handleVibeMatch(u.full_name)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                >
                  <div className="relative">
                    <img src={u.profile_photo_url} className="w-8 h-8 rounded-full border border-white/10" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-primary" />
                  </div>
                  <span className="text-sm font-medium">{u.full_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
