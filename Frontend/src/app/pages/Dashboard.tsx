import { motion } from 'motion/react';
import { Sparkles, Calendar, PartyPopper, TrendingUp, Instagram, Linkedin, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function Dashboard() {
  const quickStats = [
    { label: 'Content Generated', value: '47', change: '+12 this week', color: 'from-[#2EC4B6] via-[#4D9DE0] to-[#818CF8]', icon: Sparkles },
    { label: 'Posts Scheduled', value: '12', change: 'Next 7 days', color: 'from-[#4D9DE0] via-[#818CF8] to-[#A78BFA]', icon: Calendar },
    { label: 'Engagement Rate', value: '8.4%', change: '↑ 2.3% from last week', color: 'from-[#FF9F1C] via-[#FF6B9D] to-[#FFB088]', icon: TrendingUp },
  ];

  const upcomingFestival = {
    name: 'Holi',
    date: 'March 14, 2026',
    daysLeft: 27,
    color: 'from-[#FF6B9D] via-[#FF9F1C] to-[#FFB088]',
    emoji: '🎨'
  };

  const recentContent = [
    { platform: 'Instagram', text: 'Celebrating Women\'s Day with our amazing community! 💪✨', date: '2 hours ago', icon: Instagram, color: 'text-pink-500' },
    { platform: 'LinkedIn', text: 'Excited to announce our new product line launching next month...', date: '5 hours ago', icon: Linkedin, color: 'text-blue-600' },
    { platform: 'WhatsApp', text: 'Good morning! Here\'s your exclusive discount code for today: SAVE20', date: '1 day ago', icon: MessageSquare, color: 'text-green-500' },
  ];

  const weekPlan = [
    { day: 'Monday', type: 'Educational', topic: 'Tips & Tricks', color: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700' },
    { day: 'Wednesday', type: 'Engagement', topic: 'Customer Story', color: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700' },
    { day: 'Friday', type: 'Promotion', topic: 'Weekend Offer', color: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700' },
    { day: 'Sunday', type: 'Story', topic: 'Behind the Scenes', color: 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-3xl p-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all border border-white/40 relative overflow-hidden group"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`
                }}
              />
              <div className="flex items-start justify-between mb-4 relative z-10">
                <motion.div 
                  className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(46,196,182,0.3)]`}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#0F172A] to-[#64748B] bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#64748B] mb-2">{stat.label}</div>
              <motion.div 
                className="text-xs text-[#22C55E] font-medium flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <motion.span
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ↗
                </motion.span>
                {stat.change}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Generate New Content Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <Link to="/app/generate">
            <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-[0_16px_48px_rgba(46,196,182,0.4)] hover:shadow-[0_24px_72px_rgba(46,196,182,0.5)] transition-all cursor-pointer group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2EC4B6] via-[#4D9DE0] to-[#818CF8]" />
              <motion.div 
                className="absolute inset-0 opacity-30"
                animate={{ 
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Generate New Content</h3>
                    <p className="text-white/90">Create engaging posts with AI in seconds</p>
                  </div>
                  <motion.div 
                    className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className="w-8 h-8" />
                  </motion.div>
                </div>
                <motion.div 
                  className="flex items-center gap-2 text-white/90"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="font-medium">Start Creating</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* This Week's Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-card-strong rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all border border-white/40"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#0F172A]">This Week's Plan</h3>
            <Link 
              to="/app/planner"
              className="text-sm bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] bg-clip-text text-transparent hover:underline flex items-center gap-1 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {weekPlan.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
                className="flex items-center gap-3"
              >
                <div className="w-24 text-sm font-medium text-[#64748B]">{item.day}</div>
                <div className={`flex-1 ${item.color} rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all`}>
                  <div>
                    <div className="font-semibold">{item.type}</div>
                    <div className="text-xs opacity-75">{item.topic}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Festival & Recent Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Festival */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <Link to="/app/festivals">
            <div className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-[0_16px_48px_rgba(255,107,157,0.4)] hover:shadow-[0_24px_72px_rgba(255,107,157,0.5)] transition-all cursor-pointer group h-full`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${upcomingFestival.color}`} />
              <motion.div 
                className="absolute top-0 right-0 text-9xl opacity-10"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {upcomingFestival.emoji}
              </motion.div>
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <PartyPopper className="w-6 h-6" />
                  <span className="text-sm font-medium backdrop-blur-sm bg-white/20 px-3 py-1 rounded-full border border-white/30">Upcoming Festival</span>
                </div>
                <h3 className="text-4xl font-bold mb-2">{upcomingFestival.name}</h3>
                <p className="text-white/90 mb-4">{upcomingFestival.date}</p>
                <motion.div 
                  className="inline-block glass-card backdrop-blur-md px-5 py-2.5 rounded-full border border-white/40"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-semibold">{upcomingFestival.daysLeft} days to go ✨</span>
                </motion.div>
                <motion.div 
                  className="mt-6 flex items-center gap-2 text-white/90"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="font-medium">Generate Festival Content</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Recent Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-card-strong rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all border border-white/40"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#0F172A]">Recent Content</h3>
            <Link 
              to="/app/library"
              className="text-sm bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] bg-clip-text text-transparent hover:underline flex items-center gap-1 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentContent.map((content, index) => {
              const Icon = content.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  className="p-4 glass-card rounded-2xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all border border-white/30"
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring" }}
                    >
                      <Icon className={`w-5 h-5 mt-1 ${content.color}`} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#0F172A]">{content.platform}</span>
                        <span className="text-xs text-[#94A3B8]">{content.date}</span>
                      </div>
                      <p className="text-sm text-[#64748B] line-clamp-2">{content.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, type: "spring" }}
        whileHover={{ y: -4, scale: 1.01 }}
        className="glass-card rounded-3xl p-8 border-2 border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all"
      >
        <div className="flex items-start gap-4">
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-[#FF9F1C] to-[#FF6B9D] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,159,28,0.4)]"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <span className="text-3xl">💡</span>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Pro Tip of the Day</h3>
            <p className="text-[#64748B] mb-4 leading-relaxed">
              Post consistently during peak engagement hours (9-11 AM and 6-8 PM) to maximize your reach. 
              Use our Weekly Planner to schedule your content ahead of time!
            </p>
            <Link 
              to="/app/planner"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] bg-clip-text text-transparent hover:underline font-medium"
            >
              Plan Your Week
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}