import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function WeeklyPlanner() {
  const [currentWeek, setCurrentWeek] = useState(0);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const contentTypes = [
    { type: 'Educational', color: 'bg-blue-100 border-blue-300 text-blue-700', emoji: '📚' },
    { type: 'Engagement', color: 'bg-purple-100 border-purple-300 text-purple-700', emoji: '💬' },
    { type: 'Promotion', color: 'bg-orange-100 border-orange-300 text-orange-700', emoji: '🎯' },
    { type: 'Story', color: 'bg-pink-100 border-pink-300 text-pink-700', emoji: '✨' },
    { type: 'Behind the Scenes', color: 'bg-green-100 border-green-300 text-green-700', emoji: '🎬' },
    { type: 'Testimonial', color: 'bg-yellow-100 border-yellow-300 text-yellow-700', emoji: '⭐' },
  ];

  const weeklyPlan = [
    { day: 0, posts: [{ type: 'Educational', title: 'Monday Motivation Tips', time: '9:00 AM', platform: 'Instagram' }] },
    { day: 1, posts: [] },
    { day: 2, posts: [{ type: 'Engagement', title: 'Customer Poll: Favorite Product', time: '2:00 PM', platform: 'Instagram' }] },
    { day: 3, posts: [] },
    { day: 4, posts: [{ type: 'Promotion', title: 'Weekend Sale Announcement', time: '10:00 AM', platform: 'Instagram' }, { type: 'Promotion', title: 'Limited Offer', time: '6:00 PM', platform: 'WhatsApp' }] },
    { day: 5, posts: [{ type: 'Story', title: 'Behind Our Success', time: '11:00 AM', platform: 'LinkedIn' }] },
    { day: 6, posts: [{ type: 'Behind the Scenes', title: 'Sunday Workshop', time: '3:00 PM', platform: 'Instagram' }] },
  ];

  const getTypeColor = (type: string) => {
    const found = contentTypes.find(ct => ct.type === type);
    return found || contentTypes[0];
  };

  const getWeekDates = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1 + (currentWeek * 7);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.setDate(first + i));
      dates.push(date.getDate());
    }
    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Weekly Planner</h1>
            <p className="text-[#64748B]">Plan and schedule your content for the week ahead</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2EC4B6] text-white px-6 py-3 rounded-2xl hover:bg-[#26a99d] transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Content
          </motion.button>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="p-2 text-[#64748B] hover:text-[#2EC4B6] hover:bg-[#F8FAFC] rounded-xl transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">
                {currentWeek === 0 ? 'This Week' : currentWeek === 1 ? 'Next Week' : `Week ${currentWeek + 1}`}
              </h2>
              <p className="text-sm text-[#64748B]">February 16 - February 22, 2026</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="p-2 text-[#64748B] hover:text-[#2EC4B6] hover:bg-[#F8FAFC] rounded-xl transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid md:grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Day Header */}
              <div className={`p-4 ${index === 0 || index === 4 ? 'bg-gradient-to-br from-[#2EC4B6] to-[#4D9DE0]' : 'bg-[#F8FAFC]'} border-b-2 border-[#E5E7EB]`}>
                <div className={`text-sm font-medium ${index === 0 || index === 4 ? 'text-white' : 'text-[#64748B]'}`}>
                  {day}
                </div>
                <div className={`text-2xl font-bold ${index === 0 || index === 4 ? 'text-white' : 'text-[#0F172A]'}`}>
                  {weekDates[index]}
                </div>
              </div>

              {/* Day Content */}
              <div className="p-3 min-h-[300px] space-y-3">
                {weeklyPlan[index].posts.length > 0 ? (
                  weeklyPlan[index].posts.map((post, postIndex) => {
                    const typeColor = getTypeColor(post.type);
                    return (
                      <motion.div
                        key={postIndex}
                        whileHover={{ scale: 1.02 }}
                        className={`${typeColor.color} border-2 ${typeColor.color.replace('bg-', 'border-')} rounded-xl p-3 cursor-pointer group`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-lg">{typeColor.emoji}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button className="p-1 hover:bg-white/50 rounded">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:bg-white/50 rounded">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs font-medium mb-1">{post.type}</div>
                        <div className="text-sm font-bold mb-2 line-clamp-2">{post.title}</div>
                        <div className="flex items-center justify-between text-xs opacity-75">
                          <span>{post.time}</span>
                          <span>{post.platform}</span>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full h-32 border-2 border-dashed border-[#CBD5E1] rounded-xl flex flex-col items-center justify-center text-[#94A3B8] hover:border-[#2EC4B6] hover:text-[#2EC4B6] hover:bg-[#F8FAFC] transition-all group"
                  >
                    <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">Add Post</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Type Legend */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Content Types</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
            {contentTypes.map((type, index) => (
              <div
                key={index}
                className={`${type.color} border-2 rounded-xl p-3 text-center`}
              >
                <div className="text-2xl mb-1">{type.emoji}</div>
                <div className="text-xs font-medium">{type.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-br from-[#EEF2FF] to-[#F0F9FF] rounded-3xl p-6 border-2 border-[#E5E7EB]">
          <div className="flex items-start gap-4">
            <CalendarIcon className="w-6 h-6 text-[#2EC4B6] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-[#0F172A] mb-2">Planning Tips</h3>
              <ul className="space-y-1 text-sm text-[#64748B]">
                <li>• Aim for 3-5 posts per week for consistent engagement</li>
                <li>• Mix different content types to keep your audience interested</li>
                <li>• Schedule posts during peak engagement hours (9-11 AM, 6-8 PM)</li>
                <li>• Plan promotional content around weekends for better reach</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
