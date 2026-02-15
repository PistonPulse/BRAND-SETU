import { motion } from 'motion/react';
import { Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

export function FestivalIdeas() {
  const festivals = [
    {
      name: 'Holi',
      date: 'March 14, 2026',
      daysLeft: 27,
      emoji: '🎨',
      color: 'from-pink-400 to-purple-400',
      ideas: [
        'Colorful product showcase',
        'Festival discount offers',
        'Customer celebration stories'
      ]
    },
    {
      name: 'Eid',
      date: 'March 31, 2026',
      daysLeft: 44,
      emoji: '🌙',
      color: 'from-emerald-400 to-teal-400',
      ideas: [
        'Special Eid greetings',
        'Gift collection promotion',
        'Community celebration posts'
      ]
    },
    {
      name: 'Ram Navami',
      date: 'April 6, 2026',
      daysLeft: 50,
      emoji: '🪔',
      color: 'from-orange-400 to-red-400',
      ideas: [
        'Traditional blessings',
        'Festival special offers',
        'Cultural content'
      ]
    },
    {
      name: 'Mahavir Jayanti',
      date: 'April 8, 2026',
      daysLeft: 52,
      emoji: '🙏',
      color: 'from-yellow-400 to-orange-400',
      ideas: [
        'Peace & harmony message',
        'Spiritual content',
        'Community greetings'
      ]
    },
    {
      name: 'Baisakhi',
      date: 'April 14, 2026',
      daysLeft: 58,
      emoji: '🌾',
      color: 'from-green-400 to-yellow-400',
      ideas: [
        'Harvest celebration',
        'Punjabi culture showcase',
        'Festival greetings'
      ]
    },
    {
      name: 'Raksha Bandhan',
      date: 'August 9, 2026',
      daysLeft: 175,
      emoji: '🎀',
      color: 'from-rose-400 to-pink-400',
      ideas: [
        'Sibling love stories',
        'Gift ideas promotion',
        'Family bonding content'
      ]
    },
    {
      name: 'Independence Day',
      date: 'August 15, 2026',
      daysLeft: 181,
      emoji: '🇮🇳',
      color: 'from-orange-500 via-white to-green-500',
      ideas: [
        'Patriotic content',
        'Made in India showcase',
        'National pride posts'
      ]
    },
    {
      name: 'Ganesh Chaturthi',
      date: 'August 22, 2026',
      daysLeft: 188,
      emoji: '🐘',
      color: 'from-amber-400 to-orange-400',
      ideas: [
        'Festival blessings',
        'Cultural celebrations',
        'Special offers'
      ]
    },
    {
      name: 'Navratri',
      date: 'October 3, 2026',
      daysLeft: 230,
      emoji: '💃',
      color: 'from-purple-400 to-pink-400',
      ideas: [
        'Dandiya nights promotion',
        'Traditional wear showcase',
        '9 days content series'
      ]
    },
    {
      name: 'Dussehra',
      date: 'October 12, 2026',
      daysLeft: 239,
      emoji: '🏹',
      color: 'from-red-500 to-orange-500',
      ideas: [
        'Victory celebrations',
        'Good over evil theme',
        'Festival discounts'
      ]
    },
    {
      name: 'Diwali',
      date: 'November 1, 2026',
      daysLeft: 259,
      emoji: '🪔',
      color: 'from-yellow-500 via-orange-500 to-red-500',
      ideas: [
        'Festival lighting showcase',
        'Gift hampers promotion',
        'Prosperity wishes'
      ]
    },
    {
      name: 'Christmas',
      date: 'December 25, 2026',
      daysLeft: 313,
      emoji: '🎄',
      color: 'from-red-500 to-green-500',
      ideas: [
        'Holiday greetings',
        'Gift collection',
        'Year-end celebrations'
      ]
    }
  ];

  const getStatusBadge = (daysLeft: number) => {
    if (daysLeft <= 7) return { text: 'This Week!', color: 'bg-red-100 text-red-700 border-red-300' };
    if (daysLeft <= 30) return { text: 'Coming Soon', color: 'bg-orange-100 text-orange-700 border-orange-300' };
    if (daysLeft <= 60) return { text: 'Plan Ahead', color: 'bg-blue-100 text-blue-700 border-blue-300' };
    return { text: 'Future', color: 'bg-gray-100 text-gray-700 border-gray-300' };
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Festival Ideas</h1>
          <p className="text-[#64748B]">Never miss an opportunity to connect with your audience during festivals</p>
        </div>

        {/* Featured Festival */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className={`bg-gradient-to-br ${festivals[0].color} rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 text-[200px] opacity-10 leading-none">
              {festivals[0].emoji}
            </div>
            <div className="relative z-10">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-medium">🎉 Next Festival</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{festivals[0].name}</h2>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">{festivals[0].date}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                  <span className="text-sm font-medium">{festivals[0].daysLeft} days to go</span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {festivals[0].ideas.map((idea, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>{idea}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/app/generate">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#2EC4B6] px-8 py-4 rounded-2xl font-medium hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate {festivals[0].name} Content
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* All Festivals Grid */}
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">All Festivals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map((festival, index) => {
              const status = getStatusBadge(festival.daysLeft);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
                >
                  {/* Festival Header */}
                  <div className={`bg-gradient-to-br ${festival.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 text-8xl opacity-20 leading-none">
                      {festival.emoji}
                    </div>
                    <div className="relative z-10">
                      <div className={`inline-block ${status.color} border-2 px-3 py-1 rounded-full mb-3`}>
                        <span className="text-xs font-medium">{status.text}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{festival.name}</h3>
                      <div className="text-sm opacity-90 mb-1">{festival.date}</div>
                      <div className="text-sm font-medium">{festival.daysLeft} days left</div>
                    </div>
                  </div>

                  {/* Festival Ideas */}
                  <div className="p-6">
                    <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#2EC4B6]" />
                      Campaign Ideas
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {festival.ideas.map((idea, ideaIndex) => (
                        <li key={ideaIndex} className="text-sm text-[#64748B] flex items-start gap-2">
                          <span className="text-[#2EC4B6] mt-1">•</span>
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/app/generate">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-[#2EC4B6] text-white py-3 rounded-xl hover:bg-[#26a99d] transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate Content
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 bg-gradient-to-br from-[#EEF2FF] to-[#F0F9FF] rounded-3xl p-8 border-2 border-[#E5E7EB]"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#FF9F1C] rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Festival Marketing Tips</h3>
              <ul className="space-y-2 text-[#64748B]">
                <li className="flex items-start gap-2">
                  <span className="text-[#2EC4B6] mt-1">✓</span>
                  <span>Start planning your content at least 2 weeks before the festival</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2EC4B6] mt-1">✓</span>
                  <span>Create a content series leading up to the festival for maximum engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2EC4B6] mt-1">✓</span>
                  <span>Use local languages and cultural references to connect better with your audience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2EC4B6] mt-1">✓</span>
                  <span>Combine festival greetings with special offers for better conversions</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
