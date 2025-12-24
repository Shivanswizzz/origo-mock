import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronRight, ChevronLeft, Check, Heart, User, Coffee, Moon, Sun, Music, Users } from 'lucide-react';
import toast from 'react-hot-toast';

// --- QUESTION DATA (The 15 Hinge-Style Questions) ---
const QUESTIONS = [
  // Category 1: Social Vibes
  {
    id: 'social_level',
    category: 'Social Vibes',
    question: "I'm more of a...",
    type: 'single',
    options: [
      { value: 'Homebody', label: 'Homebody who loves cozy nights', icon: <Moon /> },
      { value: 'Social butterfly', label: 'Social butterfly (groups)', icon: <Users /> },
      { value: 'Ambivert', label: 'Somewhere in between', icon: <User /> }
    ]
  },
  {
    id: 'weekend_vibe',
    category: 'Social Vibes',
    question: "My ideal weekend is...",
    type: 'single',
    options: [
      { value: 'Gaming/Chill', label: 'Binge-watching or Gaming' },
      { value: 'Small Group', label: 'Hanging with close friends' },
      { value: 'Party', label: 'Big party or social event' },
      { value: 'Outdoor', label: 'Outdoor adventure / Exploring' }
    ]
  },
  {
    id: 'recharge',
    category: 'Social Vibes',
    question: "I recharge by...",
    type: 'single',
    options: [
      { value: 'Alone', label: 'Spending time alone' },
      { value: 'With People', label: 'Being around people' },
      { value: 'Both', label: 'Bit of both' }
    ]
  },
  // Category 2: Communication
  {
    id: 'communication_style',
    category: 'Communication', // HIGHEST WEIGHT
    question: "I prefer to communicate through...",
    type: 'single',
    options: [
      { value: 'In-person', label: 'In-person conversations' },
      { value: 'Calls', label: 'Voice/Video calls' },
      { value: 'Texting', label: 'Texting/Messaging' },
      { value: 'Any', label: "Whatever's convenient" }
    ]
  },
  {
    id: 'texting_style',
    category: 'Communication',
    question: "My texting style is...",
    type: 'single',
    options: [
      { value: 'Quick', label: 'Quick replies, always online' },
      { value: 'Thoughtful', label: 'Thoughtful responses, slow' },
      { value: 'Memes', label: 'Memes do the talking' },
      { value: 'Short', label: 'Short and sweet' }
    ]
  },
  // Category 3: Lifestyle
  {
    id: 'sleep_schedule',
    category: 'Lifestyle',
    question: "My sleep schedule is...",
    type: 'single',
    options: [
      { value: 'Night owl', label: 'Night owl (active after 10PM)' },
      { value: 'Early bird', label: 'Early bird (love mornings)' },
      { value: 'Flexible', label: 'Whatever works that day' }
    ]
  },
  {
    id: 'planning_style',
    category: 'Lifestyle',
    question: "When making plans, I'm...",
    type: 'single',
    options: [
      { value: 'Spontaneous', label: 'Spontaneous - last minute' },
      { value: 'Planner', label: 'Planner - need it scheduled' },
      { value: 'Flexible', label: 'Flexible - can do either' }
    ]
  },
  {
    id: 'hangout_spots',
    category: 'Lifestyle',
    question: "I'm most likely found at... (Pick 2)",
    type: 'multi',
    maxSelect: 2,
    options: [
      { value: 'Cafe', label: 'Café with friends' },
      { value: 'Library', label: 'Library / Study spaces' },
      { value: 'Gym', label: 'Gym / Sports complex' },
      { value: 'Campus', label: 'Campus hangout spots' },
      { value: 'Hostel', label: 'Hostel room chilling' },
      { value: 'Events', label: 'Events and parties' }
    ]
  },
  // Category 4: Interests
  {
    id: 'music_taste',
    category: 'Interests',
    question: "My music vibe is... (Pick up to 3)",
    type: 'multi',
    maxSelect: 3,
    options: [
      { value: 'Bollywood', label: 'Bollywood/Desi pop' },
      { value: 'Pop', label: 'Western Pop/Rock' },
      { value: 'HipHop', label: 'Hip-Hop/Rap' },
      { value: 'EDM', label: 'EDM/Electronic' },
      { value: 'Indie', label: 'Indie/Alternative' },
      { value: 'Classical', label: 'Classical/Sufi' },
      { value: 'KPop', label: 'K-Pop' },
      { value: 'All', label: 'Everything/Anything' }
    ]
  },
  {
    id: 'free_time',
    category: 'Interests',
    question: "I spend free time... (Pick 2)",
    type: 'multi',
    maxSelect: 2,
    options: [
      { value: 'Gaming', label: 'Gaming / Series' },
      { value: 'Sports', label: 'Sports / Fitness' },
      { value: 'Creative', label: 'Reading / Creative stuff' },
      { value: 'Friends', label: 'Hanging with friends' },
      { value: 'Projects', label: 'Side projects / Learning' },
      { value: 'Social', label: 'Vibing on social media' }
    ]
  },
  // Category 5: Friends
  {
    id: 'friend_values',
    category: 'Friendship',
    question: "I value these in friends... (Pick 3)",
    type: 'multi',
    maxSelect: 3,
    options: [
      { value: 'Humor', label: 'Good sense of humor' },
      { value: 'Loyalty', label: 'Loyalty and Trust' },
      { value: 'Interests', label: 'Similar interests' },
      { value: 'Deep', label: 'Deep conversations' },
      { value: 'Fun', label: 'Always down to hang' },
      { value: 'Honest', label: 'Honest and direct' },
      { value: 'Support', label: 'Supportive and caring' }
    ]
  },
  {
    id: 'group_size',
    category: 'Friendship',
    question: "My ideal friend group is...",
    type: 'single',
    options: [
      { value: '1-2', label: '1-2 super close friends' },
      { value: 'Small', label: 'Small tight-knit squad (3-5)' },
      { value: 'Large', label: 'Larger friend circle' },
      { value: 'Groups', label: 'Different groups for moods' }
    ]
  },
  // Category 6: Personality
  {
    id: 'stress_handling',
    category: 'Personality',
    question: "I handle stress by...",
    type: 'single',
    options: [
      { value: 'Talk', label: 'Talking it out' },
      { value: 'Active', label: 'Working out / Active' },
      { value: 'Distract', label: 'Distracting myself' },
      { value: 'Solo', label: 'Processing alone first' }
    ]
  },
  {
    id: 'humor_style',
    category: 'Personality',
    question: "My sense of humor is... (Pick 2)",
    type: 'multi',
    maxSelect: 2,
    options: [
      { value: 'Sarcastic', label: 'Sarcastic / Witty' },
      { value: 'Dark', label: 'Dark humor' },
      { value: 'Silly', label: 'Silly / Goofy' },
      { value: 'Meme', label: 'Meme culture' },
      { value: 'Clean', label: 'Clean / Wholesome' },
      { value: 'Self', label: 'Self-deprecating' }
    ]
  },
  {
    id: 'group_role',
    category: 'Personality',
    question: "In group projects, I usually...",
    type: 'single',
    options: [
      { value: 'Lead', label: 'Take the lead' },
      { value: 'Contribute', label: 'Contribute ideas' },
      { value: 'Chill', label: 'Do my part, stay chill' },
      { value: 'Solo', label: 'Prefer working solo' }
    ]
  }
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = Intro, 1..N = Questions
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for all answers
  const [answers, setAnswers] = useState({});
  // State for basic profile info (collected before questions)
  const [basicInfo, setBasicInfo] = useState({
    bio: '',
    gender: '',
    year_of_study: 1
  });

  // Pre-Check: If user already onboarded, skip? (Optional)

  const handleAnswer = (questionId, value, type) => {
    if (type === 'single') {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
      // Auto-advance for single choice after short delay
      setTimeout(() => nextStep(), 250);
    } else {
      // Multi-select
      setAnswers(prev => {
        const current = prev[questionId] || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter(v => v !== value) };
        } else {
          // Check limit
          const q = QUESTIONS.find(q => q.id === questionId);
          if (current.length >= (q.maxSelect || 99)) return prev;
          return { ...prev, [questionId]: [...current, value] };
        }
      });
    }
  };

  const nextStep = () => {
    if (step < QUESTIONS.length + 1) { // +1 for Intro/Basic Info step
      setStep(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  const finishOnboarding = async () => {
    if (!user) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Creating your AI Profile...');

    try {
      // 1. Update Profile (Basic Info + Onboarding Data JSON)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: basicInfo.bio,
          gender: basicInfo.gender,
          year_of_study: parseInt(basicInfo.year_of_study),
          onboarding_data: answers, // Save all answers here
          is_verified: false, // Pending college email verify
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Trigger ML Embedding Generation (Ideally via Edge Function, here simplified)
      // Note: In production, Supabase Trigger would call the Python Service.
      // For now, we assume the Python Service can be called or runs on a schedule.
      // Example call to our Python Service (if accessible):
      try {
         await fetch('http://localhost:5000/api/ml/generate-embedding', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
                 user_id: user.id,
                 user_data: { 
                    ...basicInfo, 
                    answers: answers,
                    user_id: user.id 
                 } 
             })
         });
      } catch (mlErr) {
          console.error("ML Service connect failed (expected if local):", mlErr);
          // Don't block user flow if ML service is down
      }

      toast.success('Profile setup complete!', { id: toastId });
      navigate('/home');

    } catch (error) {
      console.error('Onboarding Error:', error);
      toast.error('Failed to save profile. Try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER HELPERS ---
  const currentQ = step > 0 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

  // Step 0: Basic Info Form
  if (step === 0) {
     return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-white">
           <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-md w-full glass-card p-8 rounded-3xl">
              <h1 className="text-3xl font-bold mb-2 gradients-text">Welcome to Origo</h1>
              <p className="text-text-secondary mb-8">First, the basics.</p>
              
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm text-text-secondary mb-1">Year of Study</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-500"
                        value={basicInfo.year_of_study}
                        onChange={e => setBasicInfo({...basicInfo, year_of_study: e.target.value})}
                      >
                         {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-bg-card">Year {y}</option>)}
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm text-text-secondary mb-1">Gender</label>
                      <select 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-500"
                         value={basicInfo.gender}
                         onChange={e => setBasicInfo({...basicInfo, gender: e.target.value})}
                      >
                         <option value="" className="bg-bg-card">Select Identity</option>
                         <option value="male" className="bg-bg-card">Male</option>
                         <option value="female" className="bg-bg-card">Female</option>
                         <option value="non-binary" className="bg-bg-card">Non-Binary</option>
                         <option value="prefer-not-to-say" className="bg-bg-card">Prefer not to say</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm text-text-secondary mb-1">One Line Bio</label>
                      <textarea 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-500"
                         rows={2}
                         placeholder="Computer Science student who loves..."
                         value={basicInfo.bio}
                         onChange={e => setBasicInfo({...basicInfo, bio: e.target.value})}
                      />
                  </div>
              </div>

              <Button onClick={nextStep} className="w-full mt-8" size="lg" disabled={!basicInfo.gender || !basicInfo.bio}>
                 Start Personality Quiz <ChevronRight className="ml-2" size={18} />
              </Button>
           </motion.div>
        </div>
     );
  }

  // Final Step: Complete
  if (step > QUESTIONS.length) {
      return (
          <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 text-white">
             <div className="text-center">
                 <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Check className="text-green-500 w-10 h-10" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">All Systems Go! 🚀</h2>
                 <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                     We are analyzing your vibe to find your best matches on campus.
                 </p>
                 <Button onClick={finishOnboarding} isLoading={isSubmitting} size="lg" className="px-12">
                     Enter Origo
                 </Button>
             </div>
          </div>
      );
  }

  // Question Steps
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col p-6 text-white relative overflow-hidden">
       {/* Progress */}
       <div className="w-full max-w-lg mx-auto mb-8 pt-10">
           <div className="flex justify-between text-xs text-text-tertiary mb-2 uppercase tracking-wide">
               <span>{currentQ.category}</span>
               <span>{step} / {QUESTIONS.length}</span>
           </div>
           <div className="h-1 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                 initial={{ width: 0 }}
                 animate={{ width: `${(step / QUESTIONS.length) * 100}%` }}
               />
           </div>
       </div>

       <div className="max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
           <AnimatePresence mode="wait">
               <motion.div
                 key={currentQ.id}
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -50 }}
                 className="space-y-8"
               >
                   <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                       {currentQ.question}
                   </h2>

                   <div className="space-y-3">
                       {currentQ.options.map((opt) => {
                           const isSelected = currentQ.type === 'single' 
                              ? answers[currentQ.id] === opt.value
                              : (answers[currentQ.id] || []).includes(opt.value);

                           return (
                               <motion.button
                                 key={opt.value}
                                 whileTap={{ scale: 0.98 }}
                                 onClick={() => handleAnswer(currentQ.id, opt.value, currentQ.type)}
                                 className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all
                                    ${isSelected 
                                      ? 'bg-primary-500/20 border-primary-500 text-white shadow-[0_0_20px_rgba(235,94,40,0.3)]' 
                                      : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
                                    }
                                 `}
                               >
                                   <div className={`w-6 h-6 rounded-full border flex items-center justify-center
                                      ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-white/30'}
                                   `}>
                                      {isSelected && <Check size={14} />}
                                   </div>
                                   <span className="text-lg font-medium">{opt.label}</span>
                               </motion.button>
                           );
                       })}
                   </div>

                   <div className="flex justify-between items-center pt-8">
                       <button onClick={prevStep} className="p-2 text-text-tertiary hover:text-white transition-colors">
                           <ChevronLeft size={24} />
                       </button>
                       
                       {currentQ.type === 'multi' && (
                           <Button onClick={nextStep} variant="outline" className="px-8">
                               Next <ChevronRight size={16} className="ml-2" />
                           </Button>
                       )}
                   </div>
               </motion.div>
           </AnimatePresence>
       </div>
    </div>
  );
}
