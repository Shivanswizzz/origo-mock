import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Check, Star, Zap, Shield, Heart } from 'lucide-react';

export default function PremiumPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 min-h-screen">
         <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 text-xs font-bold border border-yellow-400/20 mb-4">
              ORIGO GOLD
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Upgrade Your Campus Life</h1>
            <p className="text-text-secondary text-lg">
              Get unlimited matches, see who likes you, and connect with students from other colleges.
            </p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {/* Free Tier */}
            <div className="glass-card p-8 rounded-3xl border-white/5 flex flex-col">
               <h3 className="text-xl font-bold mb-2">Free</h3>
               <div className="text-3xl font-bold mb-6">₹0<span className="text-sm text-text-tertiary font-normal">/mo</span></div>
               <p className="text-text-tertiary text-sm mb-6">Basics for campus networking.</p>
               <Button variant="outline" className="w-full mb-8">Current Plan</Button>
               <ul className="space-y-4 text-sm text-text-secondary flex-1">
                 {['Verified Campus Badge', 'Join 3 Communities', '5 Rizz Messages/day', 'Intra-campus matching'].map(f => (
                   <li key={f} className="flex items-center gap-3"><Check size={16} className="text-gray-500" /> {f}</li>
                 ))}
               </ul>
            </div>

            {/* Gold Tier - Best Value */}
            <div className="glass-card p-8 rounded-3xl border-primary-500 relative flex flex-col bg-gradient-to-b from-primary-900/20 to-bg-secondary transform md:-translate-y-4 shadow-2xl shadow-primary-500/20">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-b-lg">
                 MOST POPULAR
               </div>
               <h3 className="text-xl font-bold mb-2 text-primary-400">Gold</h3>
               <div className="text-3xl font-bold mb-6">₹199<span className="text-sm text-text-tertiary font-normal">/mo</span></div>
               <p className="text-text-tertiary text-sm mb-6">Unlock the full experience.</p>
               <Button variant="primary" className="w-full mb-8">Upgrade Now</Button>
               <ul className="space-y-4 text-sm text-text-secondary flex-1">
                 {[
                   'See who likes you', 
                   'Cross-campus matching', 
                   'Unlimited Rizz Messages', 
                   'Advanced Filters',
                   'Priority Profile Listing',
                   '5 Free Ships/month'
                  ].map(f => (
                   <li key={f} className="flex items-center gap-3"><Check size={16} className="text-primary-500" /> {f}</li>
                 ))}
               </ul>
            </div>

            {/* Platinum */}
             <div className="glass-card p-8 rounded-3xl border-white/5 flex flex-col">
               <h3 className="text-xl font-bold mb-2">Platinum</h3>
               <div className="text-3xl font-bold mb-6">₹499<span className="text-sm text-text-tertiary font-normal">/mo</span></div>
               <p className="text-text-tertiary text-sm mb-6">For the campus influencers.</p>
               <Button variant="outline" className="w-full mb-8">Go Platinum</Button>
               <ul className="space-y-4 text-sm text-text-secondary flex-1">
                 {['Everything in Gold', 'Profile Boost (3x views)', 'Create Paid Events', 'Golden Verification Badge', 'Concierge Support'].map(f => (
                   <li key={f} className="flex items-center gap-3"><Check size={16} className="text-yellow-500" /> {f}</li>
                 ))}
               </ul>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
}
