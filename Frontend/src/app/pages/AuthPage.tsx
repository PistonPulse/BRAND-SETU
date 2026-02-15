import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Logo } from '../components/Logo';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';

export function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/setup');
  };

  const handleGoogleSignIn = () => {
    navigate('/setup');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2EC4B6] to-[#4D9DE0] p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center text-white"
        >
          <div className="mb-8">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1631061184412-b18f5fb1dc70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGNvbGxhYm9yYXRpb24lMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzcxMTczMTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Collaboration illustration"
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
            />
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome to BrandSetu</h2>
          <p className="text-xl opacity-90 max-w-md mx-auto">
            Let's grow your brand together with AI-powered marketing that works for you
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-[#64748B]">
                {isSignUp 
                  ? "Start your journey to better marketing" 
                  : "Sign in to continue growing your brand"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-[#0F172A] mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#0F172A] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0F172A] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#2EC4B6]" />
                    <span className="text-sm text-[#64748B]">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-[#2EC4B6] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#2EC4B6] text-white py-3.5 rounded-xl hover:bg-[#26a99d] transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-[#64748B]">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white border-2 border-[#E5E7EB] text-[#0F172A] py-3.5 rounded-xl hover:border-[#2EC4B6] hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="mt-8 text-center text-[#64748B]">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-[#2EC4B6] hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-[#2EC4B6] hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#2EC4B6] hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#2EC4B6] hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
