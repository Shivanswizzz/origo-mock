import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Heart, MessageCircle, MoreHorizontal, Link as LinkIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

// Dummy Feed Data
const MATCHES = [
  { id: 1, name: "Aanya", age: 19, college: "IIT Delhi", interests: ["Tech", "Dance"], img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
  { id: 2, name: "Rohan", age: 20, college: "DTU", interests: ["Gaming", "Gym"], img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
  { id: 3, name: "Priya", age: 19, college: "Miranda", interests: ["Art", "Music"], img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
  { id: 4, name: "Kabir", age: 21, college: "BITS", interests: ["Startups", "Travel"], img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" },
];

const POSTS = [
  { id: 1, author: "Tech Society", content: "Hackathon loading... 🚀 Who's ready for the biggest code fest of the year?", time: "2h ago", likes: 124, comments: 12 },
  { id: 2, author: "Rahul Sharma", content: "Just explored the new campus cafe. 10/10 recommend the cold coffee! ☕", time: "4h ago", likes: 89, comments: 23 },
  { id: 3, author: "Dance Club", content: "Auditions start tomorrow at LT-1. Bring your energy! 💃🕺", time: "5h ago", likes: 256, comments: 45 },
];

export default function HomePage() {
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
               {MATCHES.map(match => (
                 <div key={match.id} className="min-w-[160px] h-[220px] relative rounded-2xl overflow-hidden group cursor-pointer">
                   <img src={match.img} alt={match.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                     <h3 className="font-bold text-white">{match.name}, {match.age}</h3>
                     <p className="text-xs text-gray-300 truncate">{match.college}</p>
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Communities Suggestion */}
          <section>
            <h2 className="text-xl font-bold mb-6">Suggested Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Photography Club', 'Startup Network'].map(name => (
                <div key={name} className="bg-bg-secondary/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary-500/30 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-white/10" />
                  <div>
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-xs text-text-tertiary">350+ members</p>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-auto">Join</Button>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Feed */}
           <section>
            <h2 className="text-xl font-bold mb-6">Campus Highlights</h2>
            <div className="space-y-6">
              {POSTS.map(post => (
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
                 <div className="w-10 h-10 rounded-full bg-white/10 blur-sm" />
                 <div className="w-10 h-10 rounded-full bg-white/10 blur-sm" />
               </div>
               <Button size="sm" variant="primary" className="w-full text-xs">Unlock for ₹9 <Lock size={12} className="ml-2"/></Button>
             </div>
          </div>

          {/* Active Now */}
          <div>
            <h3 className="font-bold text-sm text-text-secondary mb-4 uppercase tracking-wider">Active Now</h3>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-600" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-primary" />
                  </div>
                  <span className="text-sm font-medium">Student Name</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
