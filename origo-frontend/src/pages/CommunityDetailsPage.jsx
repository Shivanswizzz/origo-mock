import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Users, MoreHorizontal } from 'lucide-react';

export default function CommunityDetailsPage() {
  const { id } = useParams();
  
  return (
    <DashboardLayout>
      <div className="min-h-screen pb-20">
         {/* Cover */}
         <div className="h-48 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
           <img 
             src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200" 
             className="w-full h-full object-cover opacity-60" 
           />
         </div>

         <div className="max-w-5xl mx-auto px-6">
            <div className="bg-bg-secondary/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 -mt-12 relative z-10 flex flex-col md:flex-row gap-6 items-start">
               <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                 TC
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold mb-1">Tech Enthusiasts</h1>
                      <div className="flex items-center gap-2 text-text-tertiary text-sm">
                        <Users size={14} /> 1,200 Members • Public Group
                      </div>
                    </div>
                    <Button>Join Community</Button>
                 </div>
                 <p className="mt-4 text-text-secondary max-w-3xl">
                   The official community for tech lovers. Coding, gadgets, AI, and everything in between. 
                   Join us for weekly hackathons and meetups.
                 </p>
               </div>
            </div>

            {/* Content Mock */}
            <div className="mt-8 grid md:grid-cols-3 gap-8">
               <div className="md:col-span-2 space-y-6">
                  {/* Feed */}
                  <div className="glass-card p-4 rounded-xl flex items-center gap-4 cursor-text hover:bg-white/5 transition-colors">
                     <div className="w-10 h-10 rounded-full bg-gray-600" />
                     <div className="text-text-tertiary">Share something with the community...</div>
                  </div>

                  {[1,2,3].map(i => (
                    <div key={i} className="glass-card p-6 rounded-xl">
                       <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-full bg-gray-600" />
                         <div>
                           <h4 className="font-bold text-sm">Rohan Das</h4>
                           <span className="text-xs text-text-tertiary">2 hrs ago</span>
                         </div>
                       </div>
                       <p className="mb-4">Anyone working on the new CP problem set? Need some help with Q3.</p>
                       <div className="flex gap-4 text-sm text-text-tertiary">
                         <button>Like</button>
                         <button>Comment</button>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-6">
                  <div className="glass-card p-6 rounded-xl">
                     <h3 className="font-bold mb-4">Admins</h3>
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-500" />
                        <span className="text-sm">Admin Name</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
}
