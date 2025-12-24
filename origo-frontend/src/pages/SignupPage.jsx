import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowRight } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').regex(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?(?:ac\.in|edu|edu\.in)$/, 'Must be a college email (.edu or .ac.in)'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain one uppercase').regex(/[0-9]/, 'Must contain one number'),
  confirmPassword: z.string(),
  college: z.string().min(1, 'Please select a college')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      // In a real scenario, we might want to check the domain against the deployed function first
      // const res = await fetch('.../verify-college-email', { method: 'POST', body: JSON.stringify({ email: data.email }) });
      
      await signup({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          college: data.college
      });
      
      toast.success('Account created! Please check your email for verification.');
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-bg-secondary">
        <div className="absolute inset-0 bg-primary-600/10" />
        <img 
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmZkdDJvZTRjdTdrdjFhaGhjb2lnZXQwYzJiemx6d2g5aWoxeHlmNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6gbchrcNIt4Ma8Tu/giphy.gif" 
          alt="Networking animation"
          className="w-3/4 max-w-lg rounded-3xl shadow-2xl opacity-80"
        />
        <div className="absolute bottom-10 left-10 text-white p-8">
           <h2 className="text-4xl font-bold mb-4">Join the Campus Revolution</h2>
           <p className="text-xl text-text-secondary">Connect with 12,000+ verified students across India.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-text-tertiary">Sign up with your college email to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              placeholder="Full Name" 
              {...register('fullName')} 
              error={errors.fullName?.message}
            />
            
            <Input 
              type="email" 
              placeholder="College Email (.edu or .ac.in)" 
              {...register('email')} 
              error={errors.email?.message} 
            />
            {/* College Selection Placeholder - simplified as text input for now, ideally specific select */}
            <Input
              placeholder="Select College (e.g. IIT Delhi)"
              {...register('college')}
              error={errors.college?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="password" 
                placeholder="Password" 
                {...register('password')} 
                error={errors.password?.message} 
              />
              <Input 
                type="password" 
                placeholder="Confirm" 
                {...register('confirmPassword')} 
                error={errors.confirmPassword?.message} 
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg" 
              isLoading={isSubmitting}
            >
              Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-text-tertiary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-400">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
