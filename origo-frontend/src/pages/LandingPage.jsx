import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { MainLayout } from '../components/layout/MainLayout';
import { Shield, Sparkles, MessageCircle, Heart, Users, Lock, ChevronRight, GraduationCap } from 'lucide-react';
import CountUp from 'react-countup';

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-600/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-sm font-medium mb-6 inline-block backdrop-blur-md">
                🎉 Join 12,000+ students from top colleges
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Where Campus <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Connections</span> <br />
                Come Alive
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Find your tribe, spark real dates, and build your network. The only verified social platform for Indian students.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="text-lg px-8">Get Started Free</Button>
              <Button size="lg" variant="ghost" className="text-lg">How It Works</Button>
            </motion.div>

             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-text-tertiary"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-bg-primary" />
                ))}
              </div>
              <p>Trusted by students from IITs, NITs & IIMs</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            {/* 3D Floating Element Placeholder */}
            <div className="relative w-full h-[600px] glass-card rounded-3xl p-6 border-white/20 transform rotate-y-12 rotate-x-12 perspective-1000 animate-float">
               <img 
                 src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                 alt="Students hanging out"
                 className="w-full h-full object-cover rounded-2xl opacity-80"
               />
               
               {/* Floating Badges */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="absolute -left-12 top-1/4 glass-card p-4 rounded-2xl flex items-center gap-3"
               >
                 <div className="w-10 h-10 rounded-full bg-accent-pink/20 flex items-center justify-center text-accent-pink">
                   <Heart size={20} fill="currentColor" />
                 </div>
                 <div>
                   <p className="font-bold">It's a Match!</p>
                   <p className="text-xs text-text-tertiary">95% Compatibility</p>
                 </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                 className="absolute -right-8 bottom-1/4 glass-card p-4 rounded-2xl flex items-center gap-3"
               >
                 <div className="w-10 h-10 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow">
                   <Users size={20} />
                 </div>
                 <div>
                   <p className="font-bold">Tech Community</p>
                   <p className="text-xs text-text-tertiary">1.2k Members joined</p>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-bg-secondary/30 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center divide-x divide-white/5">
            <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-2">
                <CountUp end={45} suffix="k+" enableScrollSpy />
              </h3>
              <p className="text-text-tertiary uppercase tracking-wider text-sm">Active Students</p>
            </div>
             <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-2">
                <CountUp end={120} suffix="+" enableScrollSpy />
              </h3>
              <p className="text-text-tertiary uppercase tracking-wider text-sm">Campuses Verified</p>
            </div>
             <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-2">
                <CountUp end={98} suffix="%" enableScrollSpy />
              </h3>
              <p className="text-text-tertiary uppercase tracking-wider text-sm">Verification Check</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-32 container mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Socializing shouldn't be superficial.</h2>
          <p className="text-text-secondary text-lg">
            Traditional apps feel empty. Origo brings purpose back to connections with verified identities and real communities.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { 
              icon: <Shield className="w-8 h-8 text-secondary-500" />, 
              title: "Verified Campus Only", 
              desc: "No bots, no creeping. Only real students from your college and verified peers."
            },
            { 
              icon: <Sparkles className="w-8 h-8 text-primary-500" />, 
              title: "Rizz in 5", 
              desc: "Break the ice instantly. A gamified way to send 5 impactful messages."
            },
            { 
              icon: <Users className="w-8 h-8 text-accent-pink" />, 
              title: "Interest Communities", 
              desc: "Find your squad. From coding clubs to travel gangs, meet people who vibe with you."
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-bg-primary/50 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-text-tertiary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-secondary-900/50" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to find your tribe?</h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Join the waitlist today and get 3 months of Premium for free when we launch at your campus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your college email" 
              className="bg-bg-primary/50 border border-white/20 rounded-xl px-6 py-4 flex-grow focus:ring-2 focus:ring-primary-500 outline-none backdrop-blur-sm"
            />
            <Button size="lg" className="whitespace-nowrap">Join Waitlist</Button>
          </div>
          <p className="mt-4 text-sm text-text-tertiary">🔒 No spam, just good vibes.</p>
        </div>
      </section>
    </MainLayout>
  );
}
