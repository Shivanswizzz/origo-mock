import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Calendar, MapPin, Ticket, Share2 } from 'lucide-react';

export default function EventDetailsPage() {
  const { id } = useParams();

  return (
    <DashboardLayout>
       <div className="relative h-[50vh]">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 container mx-auto">
             <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-lg bg-pink-500 text-white text-xs font-bold mb-3 inline-block">PARTY</span>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">Neon Night 2025</h1>
                  <div className="flex flex-wrap gap-6 text-lg text-text-secondary">
                     <div className="flex items-center gap-2"><Calendar className="text-primary-400" /> Jan 1, 2025 • 8:00 PM</div>
                     <div className="flex items-center gap-2"><MapPin className="text-primary-400" /> Student Center</div>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-2xl min-w-[300px] border-primary-500/30">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-text-secondary">Price</span>
                      <span className="text-3xl font-bold">₹299</span>
                   </div>
                   <Button className="w-full mb-3" size="lg">Get Tickets</Button>
                   <p className="text-xs text-center text-text-tertiary">120 tickets remaining</p>
                </div>
             </div>
          </div>
       </div>

       <div className="container mx-auto p-6 md:p-10 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
             <section>
               <h2 className="text-2xl font-bold mb-4">About Event</h2>
               <p className="text-text-secondary leading-relaxed space-y-4">
                 Get ready for the biggest glow-in-the-dark party of the year! DJ Snake (not really) will be spinning tracks all night.
                 Wear white or neon colors to glow under the UV lights. Free drinks for the first 50 entries.
               </p>
             </section>
          </div>

          <div>
             <div className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="font-bold">Hosted By</h3>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-600" />
                   <div>
                      <div className="font-bold text-sm">Cultural Council</div>
                      <div className="text-xs text-text-tertiary">Verified Organizer</div>
                   </div>
                </div>
                <Button variant="ghost" className="w-full border border-white/10">Contact Host</Button>
             </div>
          </div>
       </div>
    </DashboardLayout>
  );
}
