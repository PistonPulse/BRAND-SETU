import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Sparkles, TrendingUp, Users, Globe, MessageSquare, Calendar, Instagram, Linkedin, Mail, Facebook, Youtube, Play, Zap, Target, BarChart3 } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from '../components/Logo';
import { FloatingPreviewCards } from '../components/FloatingPreviewCards';
import { useRef, useState, useEffect } from 'react';

export function LandingPage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500', hoverGlow: 'rgba(236, 72, 153, 0.4)' },
    { name: 'WhatsApp', icon: MessageSquare, color: 'from-green-500 to-emerald-400', hoverGlow: 'rgba(34, 197, 94, 0.4)' },
    { name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-400', hoverGlow: 'rgba(37, 99, 235, 0.4)' },
    { name: 'YouTube', icon: Youtube, color: 'from-red-500 to-rose-400', hoverGlow: 'rgba(239, 68, 68, 0.4)' },
    { name: 'Email', icon: Mail, color: 'from-purple-500 to-pink-400', hoverGlow: 'rgba(168, 85, 247, 0.4)' },
    { name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-indigo-500', hoverGlow: 'rgba(59, 130, 246, 0.4)' },
  ];

  const festivals = [
    { name: 'Diwali', emoji: '🪔', color: 'from-[#FF9F1C] to-[#FFB088]', glow: 'rgba(255, 159, 28, 0.4)' },
    { name: 'Eid', emoji: '🌙', color: 'from-[#22C55E] to-[#16A34A]', glow: 'rgba(34, 197, 94, 0.4)' },
    { name: 'Holi', emoji: '🎨', color: 'from-[#FF6B9D] to-[#FF9F1C]', glow: 'rgba(255, 107, 157, 0.4)' },
    { name: 'Navratri', emoji: '💃', color: 'from-[#6366F1] to-[#8B5CF6]', glow: 'rgba(99, 102, 241, 0.4)' },
    { name: 'Independence Day', emoji: '🇮🇳', color: 'from-[#FF9F1C] to-[#22C55E]', glow: 'rgba(255, 159, 28, 0.4)' },
  ];

  const testimonials = [
    { 
      name: 'Priya Sharma', 
      business: 'Boutique Owner, Mumbai',
      avatar: 'PS',
      text: 'BrandSetu transformed how I market my boutique. Festival posts that used to take hours now take minutes!',
      gradient: 'from-pink-500 to-purple-500'
    },
    { 
      name: 'Rajesh Kumar', 
      business: 'Tech Startup, Bangalore',
      avatar: 'RK',
      text: 'Finally, marketing content in both English and Hindi. Perfect for reaching all my customers across India.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Meera Patel', 
      business: 'Cafe Owner, Delhi',
      avatar: 'MP',
      text: 'The AI understands my brand voice perfectly. It\'s like having a marketing team in my pocket!',
      gradient: 'from-orange-500 to-rose-500'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(at 0% 0%, rgba(46, 196, 182, 0.15) 0%, transparent 50%), radial-gradient(at 100% 0%, rgba(77, 157, 224, 0.1) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 159, 28, 0.1) 0%, transparent 50%)',
              'radial-gradient(at 100% 0%, rgba(46, 196, 182, 0.15) 0%, transparent 50%), radial-gradient(at 0% 100%, rgba(77, 157, 224, 0.1) 0%, transparent 50%), radial-gradient(at 0% 0%, rgba(255, 159, 28, 0.1) 0%, transparent 50%)',
              'radial-gradient(at 0% 0%, rgba(46, 196, 182, 0.15) 0%, transparent 50%), radial-gradient(at 100% 0%, rgba(77, 157, 224, 0.1) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 159, 28, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Sticky Navigation */}
      <motion.header 
        className="sticky top-0 glass-card-strong z-50 border-b border-white/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Logo size="md" />
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/auth" 
                className="text-[#64748B] hover:text-[#0F172A] transition-all duration-300"
              >
                Sign In
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/auth"
                className="relative overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2EC4B6] via-[#3DDAD7] to-[#4D9DE0] text-white font-medium shadow-[0_8px_24px_rgba(46,196,182,0.3)] hover:shadow-[0_12px_32px_rgba(46,196,182,0.5)] transition-all duration-300 group"
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#4D9DE0] via-[#3DDAD7] to-[#2EC4B6]"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      {/* SECTION 1: CINEMATIC HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        <motion.div 
          className="container mx-auto px-6 max-w-7xl relative z-10"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8 border border-[#4D9DE0]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(77, 157, 224, 0.3)" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-[#4D9DE0]" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-[#2EC4B6] via-[#3DDAD7] to-[#4D9DE0] bg-clip-text text-transparent">
                  AI-Powered Marketing Assistant
                </span>
              </motion.div>
              
              {/* Main Headline with Shimmer */}
              <motion.h1 
                className="text-6xl lg:text-7xl font-bold text-[#0F172A] mb-6 leading-[1.1]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Bridge Your Business to{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#2EC4B6] via-[#3DDAD7] to-[#4D9DE0] bg-clip-text text-transparent">
                    Growth
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#2EC4B6] via-[#3DDAD7] to-[#4D9DE0] opacity-20 blur-xl"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
              </motion.h1>
              
              {/* Subtext */}
              <motion.p 
                className="text-xl text-[#64748B] mb-10 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Generate multilingual marketing content, festival campaigns, and growth ideas in seconds. 
                Built for the next generation of Indian businesses.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <MagneticButton>
                  <Link 
                    to="/setup"
                    className="relative overflow-hidden group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2EC4B6] via-[#3DDAD7] to-[#4D9DE0] text-white font-semibold shadow-[0_16px_48px_rgba(46,196,182,0.4)] hover:shadow-[0_24px_64px_rgba(46,196,182,0.6)] transition-all duration-300 flex items-center gap-3"
                  >
                    <span className="relative z-10">Start Creating for Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#4D9DE0] via-[#3DDAD7] to-[#2EC4B6]"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>
                </MagneticButton>
                
                <motion.button 
                  className="glass-card px-8 py-4 rounded-2xl border border-white/40 hover:border-[#2EC4B6]/40 transition-all hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] flex items-center gap-3 font-semibold text-[#0F172A]"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="flex items-center gap-8 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <StatItem value="10,000+" label="Businesses" gradient="from-[#2EC4B6] to-[#4D9DE0]" />
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-[#E5E7EB] to-transparent" />
                <StatItem value="15+" label="Languages" gradient="from-[#4D9DE0] to-[#8B5CF6]" />
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-[#E5E7EB] to-transparent" />
                <StatItem value="50K+" label="Content Created" gradient="from-[#FF9F1C] to-[#FF6B9D]" />
              </motion.div>
            </motion.div>

            {/* Right: Floating Preview Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <FloatingPreviewCards />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[#64748B]"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <motion.div 
              className="w-6 h-10 border-2 border-[#64748B]/30 rounded-full flex items-start justify-center p-1"
              whileHover={{ borderColor: 'rgba(46, 196, 182, 0.5)' }}
            >
              <motion.div
                className="w-1.5 h-2 bg-gradient-to-b from-[#2EC4B6] to-[#4D9DE0] rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <RevealSection>
        <div className="container mx-auto px-6 py-32 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <span className="text-7xl">😰</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-[#0F172A] mb-6">
              Marketing feels{' '}
              <span className="bg-gradient-to-r from-[#EF4444] to-[#F59E0B] bg-clip-text text-transparent">
                overwhelming
              </span>
            </h2>
            <p className="text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Creating content for multiple platforms, in multiple languages, for every festival and occasion? 
              It's exhausting and time-consuming.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            <ProblemCard 
              icon="⏰"
              title="Too Time-Consuming"
              description="Hours spent creating posts for each platform and language"
            />
            <ProblemCard 
              icon="💸"
              title="Expensive Agencies"
              description="Marketing agencies charge thousands per month"
            />
            <ProblemCard 
              icon="🤯"
              title="Creative Block"
              description="Running out of fresh content ideas every single day"
            />
          </motion.div>
        </div>
      </RevealSection>

      {/* SECTION 3: THE SOLUTION */}
      <RevealSection bgGradient>
        <div className="container mx-auto px-6 py-32 max-w-7xl">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full mb-6 border border-[#22C55E]/20"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)" }}
            >
              <Zap className="w-5 h-5 text-[#22C55E]" />
              <span className="font-medium bg-gradient-to-r from-[#22C55E] to-[#16A34A] bg-clip-text text-transparent">
                The Solution
              </span>
            </motion.div>
            
            <h2 className="text-6xl font-bold text-[#0F172A] mb-6">
              Meet{' '}
              <span className="bg-gradient-to-r from-[#2EC4B6] via-[#3DDAD7] to-[#4D9DE0] bg-clip-text text-transparent">
                BrandSetu
              </span>
            </h2>
            <p className="text-2xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
              Your AI-powered marketing companion that generates engaging content in seconds, 
              not hours. In any language. For any platform.
            </p>
          </motion.div>

          {/* Demo Video/Animation Placeholder */}
          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
          >
            <div className="glass-card-strong rounded-3xl p-8 border border-white/40 shadow-[0_32px_80px_rgba(0,0,0,0.12)] relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#2EC4B6]/5 to-[#4D9DE0]/5"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(46, 196, 182, 0.05) 0%, rgba(77, 157, 224, 0.05) 100%)',
                    'linear-gradient(135deg, rgba(77, 157, 224, 0.05) 0%, rgba(46, 196, 182, 0.05) 100%)',
                    'linear-gradient(135deg, rgba(46, 196, 182, 0.05) 0%, rgba(77, 157, 224, 0.05) 100%)',
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div className="relative z-10 aspect-video bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#2EC4B6] to-[#4D9DE0] rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_40px_rgba(46,196,182,0.5)]"
                >
                  <Play className="w-10 h-10 text-white ml-1" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* SECTION 4: HOW IT WORKS */}
      <RevealSection>
        <div className="container mx-auto px-6 py-32 max-w-7xl">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-[#0F172A] mb-6">
              How It Works
            </h2>
            <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
              Start creating amazing content in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              step="1"
              icon={Target}
              title="Tell us about your business"
              description="Share your business details, industry, and brand voice"
              delay={0}
            />
            <StepCard 
              step="2"
              icon={Globe}
              title="Choose your goals"
              description="Select content type, platform, and language"
              delay={0.2}
            />
            <StepCard 
              step="3"
              icon={Sparkles}
              title="Generate & Publish"
              description="Get AI-powered content ready to share instantly"
              delay={0.4}
            />
          </div>
        </div>
      </RevealSection>

      {/* SECTION 5: PUBLISH EVERYWHERE */}
      <RevealSection bgGradient>
        <div className="container mx-auto px-6 py-32 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-[#0F172A] mb-6">
              Publish{' '}
              <span className="bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] bg-clip-text text-transparent">
                Everywhere
              </span>
            </h2>
            <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
              Create content optimized for all major platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -8,
                    boxShadow: `0 20px 60px ${platform.hoverGlow}`
                  }}
                  className="glass-card-strong rounded-3xl p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all cursor-pointer border border-white/40 group"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${platform.color} bg-clip-text text-transparent`} strokeWidth={1.5} />
                  </motion.div>
                  <div className="font-semibold text-[#0F172A] group-hover:bg-gradient-to-r group-hover:from-[#2EC4B6] group-hover:to-[#4D9DE0] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {platform.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </RevealSection>

      {/* SECTION 6: FESTIVAL CAMPAIGNS */}
      <RevealSection>
        <div className="container mx-auto px-6 py-32 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <span className="text-7xl">🎉</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-[#0F172A] mb-6">
              Festival Campaigns Made{' '}
              <span className="bg-gradient-to-r from-[#FF9F1C] to-[#FF6B9D] bg-clip-text text-transparent">
                Magical
              </span>
            </h2>
            <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
              Never miss a festival moment. Generate culturally relevant content for every celebration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {festivals.map((festival, index) => (
              <motion.div
                key={festival.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  boxShadow: `0 20px 60px ${festival.glow}`
                }}
                className="glass-card-strong rounded-3xl p-6 text-center relative overflow-hidden border-2 border-white/40 group cursor-pointer"
              >
                {/* Glow Halo */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${festival.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  animate={{
                    opacity: [0.05, 0.15, 0.05]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Gradient Border */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${festival.color} opacity-0 group-hover:opacity-20 rounded-3xl`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.2, opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                />
                
                <div className="relative z-10">
                  <motion.div
                    className="text-6xl mb-4"
                    whileHover={{ 
                      scale: 1.3, 
                      rotate: [0, -10, 10, -10, 0] 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {festival.emoji}
                  </motion.div>
                  <div className="font-bold text-[#0F172A]">{festival.name}</div>
                </div>
                
                {/* Sparkle Effect */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* SECTION 7: SOCIAL PROOF */}
      <RevealSection bgGradient>
        <div className="container mx-auto px-6 py-32 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-[#0F172A] mb-6">
              Loved by Businesses{' '}
              <span className="bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] bg-clip-text text-transparent">
                Across Bharat
              </span>
            </h2>
            <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
              See what our customers have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card-strong rounded-3xl p-8 shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.12)] transition-all border border-white/40"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 + i * 0.05 }}
                      viewport={{ once: true }}
                      className="text-[#FF9F1C] text-xl"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <p className="text-[#0F172A] mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A]">{testimonial.name}</div>
                    <div className="text-sm text-[#64748B]">{testimonial.business}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* SECTION 8: FINAL CTA */}
      <RevealSection>
        <div className="container mx-auto px-6 py-32 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-[2.5rem] p-16 text-center text-white shadow-[0_32px_80px_rgba(0,0,0,0.15)]"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2EC4B6] via-[#4D9DE0] to-[#6366F1]" />
            <motion.div 
              className="absolute inset-0 opacity-30"
              animate={{ 
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 100%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-5xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Ready to Transform Your Marketing?
              </motion.h2>
              <motion.p 
                className="text-xl mb-10 opacity-90 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Join thousands of businesses using AI to power their growth. Start creating in seconds.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <MagneticButton>
                  <Link 
                    to="/setup"
                    className="inline-flex items-center gap-3 glass-card-strong text-[#2EC4B6] px-10 py-5 rounded-2xl hover:shadow-[0_24px_64px_rgba(255,255,255,0.3)] transition-all group border border-white/40 font-bold text-lg"
                  >
                    Start Free Today
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>
              </motion.div>

              <motion.p
                className="mt-8 text-sm opacity-75"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.75 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                No credit card required • Setup in 2 minutes • Cancel anytime
              </motion.p>
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* Footer */}
      <footer className="glass-card-strong border-t border-white/30 py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <Logo size="md" />
              <p className="text-[#64748B] mt-4 leading-relaxed">
                Bridging businesses with growth through AI-powered marketing.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Product</h4>
              <ul className="space-y-3 text-[#64748B]">
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Resources</h4>
              <ul className="space-y-3 text-[#64748B]">
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Company</h4>
              <ul className="space-y-3 text-[#64748B]">
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#2EC4B6] transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/30 pt-8 text-center text-[#64748B]">
            <p>© 2026 BrandSetu. Made with ❤️ for Bharat's entrepreneurs.</p>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <FloatingBackToTop />
    </div>
  );
}

// Helper Components

function StatItem({ value, label, gradient }: { value: string; label: string; gradient: string }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <div className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-sm text-[#64748B] mt-1">{label}</div>
    </motion.div>
  );
}

function ProblemCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-3xl p-8 border border-white/40 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all"
    >
      <motion.div
        className="text-6xl mb-4"
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-[#0F172A] mb-3">{title}</h3>
      <p className="text-[#64748B]">{description}</p>
    </motion.div>
  );
}

function StepCard({ step, icon: Icon, title, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card-strong rounded-3xl p-8 shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.12)] transition-all border border-white/40 relative overflow-hidden group"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#2EC4B6]/5 to-[#4D9DE0]/5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="relative z-10">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-[#2EC4B6] via-[#3DDAD7] to-[#4D9DE0] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-[0_0_30px_rgba(46,196,182,0.4)]"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {step}
        </motion.div>
        <div className="mb-4">
          <Icon className="w-8 h-8 text-[#2EC4B6]" />
        </div>
        <h3 className="text-xl font-bold text-[#0F172A] mb-3">{title}</h3>
        <p className="text-[#64748B] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function RevealSection({ children, bgGradient = false }: { children: React.ReactNode; bgGradient?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`relative ${bgGradient ? 'bg-gradient-to-b from-transparent via-[#F8FAFC] to-transparent' : ''}`}
    >
      {children}
    </motion.section>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 3;
    const y = (e.clientY - rect.top - rect.height / 2) / 3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

function FloatingBackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 glass-card-strong rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_rgba(46,196,182,0.3)] border border-white/40 group"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] bg-clip-text text-transparent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}