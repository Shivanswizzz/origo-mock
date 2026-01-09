import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Users, Search, Plus } from 'lucide-react';
import { MOCK_COMMUNITIES } from '../data/mockData';
import { motion } from 'framer-motion';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        setLoading(true);
        // HARDCODED DEMO: Use mock communities
        setTimeout(() => {
          setCommunities(MOCK_COMMUNITIES);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error('Error fetching communities:', error);
        setLoading(false);
      }
    }
    fetchCommunities();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Campus Communities</h1>
            <p className="text-text-secondary">Find your tribe and connect with like-minded people.</p>
          </div>
          <Button>
             <Plus size={18} className="mr-2" /> Create Community
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 rounded-xl flex gap-4 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
              <input 
                type="text" 
                placeholder="Search communities..." 
                className="w-full bg-bg-primary/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
           </div>
           {/* Simple Filters Placeholder */}
           <select className="bg-bg-primary/50 border border-white/10 rounded-lg px-4 text-white focus:outline-none">
              <option>All Types</option>
              <option>Tech</option>
              <option>Arts</option>
              <option>Sports</option>
           </select>
        </div>

        {loading ? (
           <div className="text-center py-20 text-text-secondary">Loading communities...</div>
        ) : communities.length === 0 ? (
           <div className="text-center py-20 text-text-secondary">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <h3>No communities found. Be the first to start one!</h3>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community, i) => (
              <motion.div 
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden hover:border-primary-500/50 transition-colors group"
              >
                <div className="h-32 bg-gray-800 relative">
                   {community.img ? (
                      <img src={community.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={community.name} />
                   ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-900/50 to-secondary-900/50" />
                   )}
                   <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium border border-white/10">
                      {community.category || 'General'}
                   </div>
                </div>
                
                <div className="p-5">
                   <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                   <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                     {community.description}
                   </p>
                   
                   <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-text-tertiary text-sm">
                         <Users size={16} />
                         <span>{community.members || 0} members</span>
                      </div>
                      <Button size="sm" variant="outline">Join</Button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
