import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 min-h-screen">
         <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            
            <div className="flex gap-6 border-b border-white/10 overflow-x-auto pb-1">
              {['Account', 'Privacy', 'Notifications', 'Subscription'].map((tab, i) => (
                <button key={tab} className={`pb-3 text-sm font-medium whitespace-nowrap ${i === 0 ? 'text-primary-400 border-b-2 border-primary-500' : 'text-text-tertiary hover:text-white'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-8">
               <section className="space-y-4">
                 <h2 className="text-xl font-bold">Personal Information</h2>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-text-secondary mb-2">Full Name</label>
                     <Input defaultValue="Kabir Singh" />
                   </div>
                   <div>
                     <label className="block text-sm text-text-secondary mb-2">Email</label>
                     <Input defaultValue="kabir@bits-pilani.ac.in" disabled className="opacity-75" />
                   </div>
                 </div>
               </section>

               <section className="space-y-4">
                 <h2 className="text-xl font-bold">Change Password</h2>
                 <div className="space-y-3 max-w-md">
                   <Input type="password" placeholder="Current Password" />
                   <Input type="password" placeholder="New Password" />
                   <Input type="password" placeholder="Confirm New Password" />
                 </div>
                 <Button variant="outline">Update Password</Button>
               </section>

               <section className="space-y-4">
                  <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
                  <div className="glass-card p-6 rounded-xl border-red-500/20 bg-red-500/5">
                     <p className="text-sm text-text-secondary mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                     <Button variant="danger">Delete Account</Button>
                  </div>
               </section>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
}
