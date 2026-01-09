import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { MOCK_EVENTS } from '../data/mockData';
import { motion } from 'framer-motion';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        // HARDCODED DEMO: Use mock events
        setTimeout(() => {
          setEvents(MOCK_EVENTS);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <DashboardLayout>
       <div className="p-6 max-w-6xl mx-auto min-h-screen">
         <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Upcoming Events</h1>
              <p className="text-text-secondary">Don't miss out on what's happening on campus.</p>
            </div>
         </div>

         {loading ? (
             <div className="text-center py-20 text-text-secondary">Loading events...</div>
         ) : events.length === 0 ? (
             <div className="text-center py-20 text-text-secondary">
                 <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
                 <h3>No upcoming events.</h3>
             </div>
         ) : (
           <div className="space-y-4">
             {events.map((event, i) => (
               <motion.div 
                 key={event.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-6 hover:bg-white/5 transition-colors group"
               >
                  {/* Date Badge */}
                  <div className="flex-shrink-0 w-full md:w-24 h-24 bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
                      <span className="text-sm text-primary-400 font-bold uppercase">
                          {event.date.split(' ')[0]}
                      </span>
                      <span className="text-3xl font-bold">
                          {event.date.split(' ')[1].replace(',', '')}
                      </span>
                  </div>

                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                          <div>
                             <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{event.title}</h3>
                             <p className="text-text-secondary text-sm mb-3">
                                {event.attendees} students attending
                             </p>
                          </div>
                          {event.is_paid && (
                             <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                Paid
                             </span>
                          )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-text-tertiary">
                          <div className="flex items-center gap-1">
                             <Clock size={14} />
                             {event.date.split(', ')[1]}
                          </div>
                          <div className="flex items-center gap-1">
                             <MapPin size={14} />
                             {event.location}
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center">
                     <Button className="w-full md:w-auto">RSVP</Button>
                  </div>
               </motion.div>
             ))}
           </div>
         )}
       </div>
    </DashboardLayout>
  );
}
