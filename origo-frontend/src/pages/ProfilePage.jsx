import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Settings, MapPin, Calendar, Edit3, Loader } from 'lucide-react';
import { MOCK_USER } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // HARDCODED DEMO: Always use mock user
    setProfile(MOCK_USER);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          <Loader className="animate-spin text-primary-500" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
     return (
        <DashboardLayout>
           <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
              <h2 className="text-xl">Profile not found.</h2>
              <Button onClick={() => window.location.href='/onboarding'} className="mt-4">Complete Your Profile</Button>
           </div>
        </DashboardLayout>
     );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen pb-20">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary-900 to-secondary-900 relative">
           {profile.cover_photo_url ? (
             <img 
               src={profile.cover_photo_url} 
               className="w-full h-full object-cover opacity-80"
               alt="Cover"
             />
           ) : (
             <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black opacity-50" />
           )}
           <button className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60">
             <Edit3 size={18} />
           </button>
         </div>

        <div className="max-w-5xl mx-auto px-6">
           {/* Profile Header */}
           <div className="relative -mt-20 flex flex-col md:flex-row items-end md:items-end gap-6 mb-8">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-bg-primary overflow-hidden bg-bg-secondary relative group cursor-pointer">
               <img 
                  src={profile.profile_photo_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=random`} 
                  className="w-full h-full object-cover" 
                  alt={profile.full_name}
               />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Edit3 className="text-white" />
               </div>
             </div>
             
             <div className="flex-1 mb-2">
               <h1 className="text-3xl font-bold flex items-center gap-2">
                 {profile.full_name}
                 {profile.is_verified && <span className="w-2 h-2 rounded-full bg-blue-500 block" title="Verified" />}
                 {profile.account_status === 'active' && <span className="w-2 h-2 rounded-full bg-green-500 block animate-pulse" title="Online" />}
               </h1>
               <p className="text-text-secondary">
                 {profile.year_of_study ? `Year ${profile.year_of_study}` : 'Student'} • {profile.colleges?.name || 'College'}
               </p>
             </div>

             <div className="flex gap-3 mb-2">
               <Link to="/settings">
                 <Button variant="outline" className="flex items-center gap-2"><Settings size={18} /> Edit Profile</Button>
               </Link>
             </div>
           </div>

           {/* Layout Grid */}
           <div className="grid md:grid-cols-3 gap-8">
             
             {/* Left Sidebar Info */}
             <div className="space-y-6">
                {/* About */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                   <h3 className="font-bold border-b border-white/5 pb-2">About</h3>
                   <p className="text-text-secondary leading-relaxed">
                     {profile.bio || "No bio yet."}
                   </p>
                   
                   <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-text-secondary">
                         <Calendar size={18} className="text-primary-400" />
                         <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary">
                         <MapPin size={18} className="text-secondary-400" />
                         <span>{profile.colleges?.location || "India"}</span>
                      </div>
                   </div>
                </div>

                {/* Interests (Using Onboarding Data if available) */}
                <div className="glass-card p-6 rounded-2xl">
                   <h3 className="font-bold border-b border-white/5 pb-4 mb-4">Interests</h3>
                   <div className="flex flex-wrap gap-2">
                      {profile.onboarding_data?.free_time?.map((tag, i) => (
                         <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-sm border border-white/10 hover:border-primary-500/50 transition-colors">
                            {tag}
                         </span>
                      )) || <span className="text-text-tertiary text-sm">No interests added.</span>}
                   </div>
                </div>
             </div>

             {/* Right Content Area (Placeholder for Posts/Activity) */}
             <div className="md:col-span-2 space-y-6">
                <div className="glass-card p-2 rounded-2xl flex p-1 bg-black/20">
                   <button className="flex-1 py-3 rounded-xl bg-white/10 font-medium shadow-sm">My Vibe</button>
                   <button className="flex-1 py-3 rounded-xl hover:bg-white/5 text-text-secondary transition-colors">Communities</button>
                </div>

                {/* Vibe Check / Onboarding Summary */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="font-bold text-xl mb-4">Vibe Check</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-xs text-text-tertiary uppercase block mb-1">Social Battery</span>
                            <span className="font-medium text-primary-300">{profile.onboarding_data?.social_level || 'Unknown'}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-xs text-text-tertiary uppercase block mb-1">Communication</span>
                            <span className="font-medium text-secondary-300">{profile.onboarding_data?.communication_style || 'Unknown'}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-xs text-text-tertiary uppercase block mb-1">Weekend Style</span>
                            <span className="font-medium text-pink-300">{profile.onboarding_data?.weekend_vibe || 'Unknown'}</span>
                        </div>
                         <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-xs text-text-tertiary uppercase block mb-1">Friend Group</span>
                            <span className="font-medium text-blue-300">{profile.onboarding_data?.group_size || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
             </div>

           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
