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
import { ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-bg-secondary">
        <div className="absolute inset-0 bg-secondary-600/10" />
        <div className="relative glass-card p-12 rounded-3xl max-w-lg border-white/10 backdrop-blur-xl">
           <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
           <p className="text-xl text-text-secondary mb-8">
             Your community is waiting. Catch up on 500+ new messages and events.
           </p>
           <div className="flex -space-x-4 mb-4">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-secondary bg-gray-600" />
             ))}
             <div className="w-10 h-10 rounded-full border-2 border-bg-secondary bg-primary-600 flex items-center justify-center text-xs font-bold">+42</div>
           </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 text-text-tertiary hover:text-white flex items-center gap-2">
           <ArrowLeft size={20} /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold mb-2">Log In</h1>
            <p className="text-text-tertiary">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              type="email" 
              placeholder="College Email" 
              {...register('email')} 
              error={errors.email?.message} 
            />
            
            <Input 
              type="password" 
              placeholder="Password" 
              {...register('password')} 
              error={errors.password?.message} 
            />

            <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                    <input type="checkbox" className="rounded bg-bg-tertiary border-white/10" />
                    Remember me
                </label>
                <a href="#" className="text-primary-500 hover:text-primary-400">Forgot Password?</a>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg" 
              isLoading={isSubmitting}
            >
              Log In
            </Button>
          </form>

          <p className="text-center text-text-tertiary">
            New here?{' '}
            <Link to="/signup" className="text-primary-500 font-semibold hover:text-primary-400">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
