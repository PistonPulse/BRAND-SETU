import { motion } from 'motion/react';
import { Sparkles, Calendar, PartyPopper, TrendingUp, Instagram, Linkedin, Twitter, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { getContentStats, fetchSavedContent, fetchWeeklyPlan } from '@/lib/content';
import type { SavedContent, WeeklyPlanItem } from '@/lib/content';

const PLATFORM_ICON: Record<string, typeof Instagram> = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
};
const PLATFORM_COLOR: Record<string, string> = {
  instagram: 'text-pink-500',
  linkedin: 'text-blue-600',
  twitter: 'text-sky-500',
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PLAN_COLORS: Record<string, string> = {
  Educational: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700',
  Engagement: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700',
  Promotion: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700',
  Story: 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700',
  'Behind the Scenes': 'bg-gradient-to-r from-green-100 to-green-200 text-green-700',
  Testimonial: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getNextFestival(): { name: string; date: string; daysLeft: number; color: string; emoji: string } {
  const festivals = [
    { name: 'Holi', month: 2, day: 14, color: 'from-[#FF6B9D] via-[#FF9F1C] to-[#FFB088]', emoji: '🎨' },
    { name: 'Eid al-Fitr', month: 2, day: 30, color: 'from-[#2EC4B6] via-[#4D9DE0] to-[#818CF8]', emoji: '🌙' },
    { name: 'Independence Day', month: 7, day: 15, color: 'from-[#FF9F1C] via-[#FFFFFF] to-[#22C55E]', emoji: '🇮🇳' },
    { name: 'Raksha Bandhan', month: 7, day: 28, color: 'from-[#FF6B9D] via-[#A78BFA] to-[#818CF8]', emoji: '🎀' },
    { name: 'Diwali', month: 9, day: 20, color: 'from-[#FF9F1C] via-[#FFB088] to-[#FF6B9D]', emoji: '🪔' },
    { name: 'Christmas', month: 11, day: 25, color: 'from-[#22C55E] via-[#EF4444] to-[#22C55E]', emoji: '🎄' },
    { name: 'New Year', month: 0, day: 1, color: 'from-[#818CF8] via-[#4D9DE0] to-[#2EC4B6]', emoji: '🎉' },
  ];
  const now = new Date();
  let best = festivals[0];
  let bestDiff = Infinity;
  for (const f of festivals) {
    let d = new Date(now.getFullYear(), f.month, f.day);
    if (d.getTime() < now.getTime()) d = new Date(now.getFullYear() + 1, f.month, f.day);
    const diff = d.getTime() - now.getTime();
    if (diff < bestDiff) { bestDiff = diff; best = f; }
  }
  const daysLeft = Math.ceil(bestDiff / (1000 * 60 * 60 * 24));
  const targetDate = new Date(now.getFullYear() + (bestDiff > 365 * 86400000 ? 1 : 0), best.month, best.day);
  const dateStr = targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return { name: best.name, date: dateStr, daysLeft, color: best.color, emoji: best.emoji };
}

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, thisWeek: 0 });
  const [recentContent, setRecentContent] = useState<SavedContent[]>([]);
  const [weekPlan, setWeekPlan] = useState<WeeklyPlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getContentStats(),
      fetchSavedContent(),
      fetchWeeklyPlan(),
    ]).then(([s, content, plan]) => {
      setStats(s);
      setRecentContent(content.slice(0, 3));
      setWeekPlan(plan);
    }).finally(() => setLoading(false));
  }, []);

  const upcomingFestival = getNextFestival();

  const quickStats = [
    { label: 'Content Generated', value: String(stats.total), change: `+${stats.thisWeek} this week`, color: 'from-[#2EC4B6] via-[#4D9DE0] to-[#818CF8]', icon: Sparkles },
    { label: 'Posts Planned', value: String(weekPlan.length), change: 'This week', color: 'from-[#4D9DE0] via-[#818CF8] to-[#A78BFA]', icon: Calendar },
    { label: 'Next Festival', value: `${upcomingFestival.daysLeft}d`, change: upcomingFestival.name, color: 'from-[#FF9F1C] via-[#FF6B9D] to-[#FFB088]', icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2EC4B6]" />
      </div>
    );
  }

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
            {weekPlan.length === 0 ? (
              <div className="text-center py-6 text-[#94A3B8]">
                <p className="mb-2">No content planned yet</p>
                <Link to="/app/planner" className="text-[#2EC4B6] hover:underline text-sm font-medium">Create your first plan →</Link>
              </div>
            ) : weekPlan.slice(0, 4).map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
                className="flex items-center gap-3"
              >
                <div className="w-24 text-sm font-medium text-[#64748B]">{DAY_NAMES[item.day_of_week]}</div>
                <div className={`flex-1 ${PLAN_COLORS[item.content_type] ?? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'} rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all`}>
                  <div>
                    <div className="font-semibold">{item.content_type}</div>
                    <div className="text-xs opacity-75">{item.title}</div>
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
            {recentContent.length === 0 ? (
              <div className="text-center py-6 text-[#94A3B8]">
                <p className="mb-2">No content generated yet</p>
                <Link to="/app/generate" className="text-[#2EC4B6] hover:underline text-sm font-medium">Generate your first content →</Link>
              </div>
            ) : recentContent.map((item, index) => {
              const Icon = PLATFORM_ICON[item.platform] ?? Sparkles;
              const color = PLATFORM_COLOR[item.platform] ?? 'text-gray-500';
              return (
                <motion.div 
                  key={item.id}
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
                      <Icon className={`w-5 h-5 mt-1 ${color}`} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#0F172A] capitalize">{item.platform}</span>
                        <span className="text-xs text-[#94A3B8]">{timeAgo(item.created_at)}</span>
                      </div>
                      <p className="text-sm text-[#64748B] line-clamp-2">{item.content}</p>
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