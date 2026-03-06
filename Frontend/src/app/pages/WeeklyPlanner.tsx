import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchWeeklyPlan, addPlanItem, deletePlanItem } from '@/lib/content';
import type { WeeklyPlanItem } from '@/lib/content';

export function WeeklyPlanner() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [planItems, setPlanItems] = useState<WeeklyPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState<number | null>(null); // day_of_week or null
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Educational');
  const [newTime, setNewTime] = useState('9:00 AM');
  const [newPlatform, setNewPlatform] = useState('Instagram');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWeeklyPlan().then(setPlanItems).finally(() => setLoading(false));
  }, []);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const contentTypes = [
    { type: 'Educational', color: 'bg-blue-100 border-blue-300 text-blue-700', emoji: '📚' },
    { type: 'Engagement', color: 'bg-purple-100 border-purple-300 text-purple-700', emoji: '💬' },
    { type: 'Promotion', color: 'bg-orange-100 border-orange-300 text-orange-700', emoji: '🎯' },
    { type: 'Story', color: 'bg-pink-100 border-pink-300 text-pink-700', emoji: '✨' },
    { type: 'Behind the Scenes', color: 'bg-green-100 border-green-300 text-green-700', emoji: '🎬' },
    { type: 'Testimonial', color: 'bg-yellow-100 border-yellow-300 text-yellow-700', emoji: '⭐' },
  ];

  const getTypeColor = (type: string) => {
    return contentTypes.find(ct => ct.type === type) || contentTypes[0];
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + currentWeek * 7);
    const dates: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.getDate());
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const handleAdd = async () => {
    if (showAddModal === null || !newTitle.trim()) return;
    setAdding(true);
    const item = await addPlanItem({
      day_of_week: showAddModal,
      content_type: newType,
      title: newTitle.trim(),
      scheduled_time: newTime,
      platform: newPlatform,
    });
    if (item) setPlanItems((prev) => [...prev, item]);
    setAdding(false);
    setShowAddModal(null);
    setNewTitle('');
  };

  const handleDelete = async (id: string) => {
    await deletePlanItem(id);
    setPlanItems((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2EC4B6]" />
      </div>
    );
  }

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
            onClick={() => setShowAddModal(0)}
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
              <div className={`p-4 ${planItems.some((p) => p.day_of_week === index) ? 'bg-gradient-to-br from-[#2EC4B6] to-[#4D9DE0]' : 'bg-[#F8FAFC]'} border-b-2 border-[#E5E7EB]`}>
                <div className={`text-sm font-medium ${planItems.some((p) => p.day_of_week === index) ? 'text-white' : 'text-[#64748B]'}`}>
                  {day}
                </div>
                <div className={`text-2xl font-bold ${planItems.some((p) => p.day_of_week === index) ? 'text-white' : 'text-[#0F172A]'}`}>
                  {weekDates[index]}
                </div>
              </div>

              {/* Day Content */}
              <div className="p-3 min-h-[300px] space-y-3">
                {planItems.filter((p) => p.day_of_week === index).length > 0 ? (
                  planItems.filter((p) => p.day_of_week === index).map((post) => {
                    const typeColor = getTypeColor(post.content_type);
                    return (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.02 }}
                        className={`${typeColor.color} border-2 rounded-xl p-3 cursor-pointer group`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-lg">{typeColor.emoji}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => handleDelete(post.id)} className="p-1 hover:bg-white/50 rounded">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs font-medium mb-1">{post.content_type}</div>
                        <div className="text-sm font-bold mb-2 line-clamp-2">{post.title}</div>
                        <div className="flex items-center justify-between text-xs opacity-75">
                          <span>{post.scheduled_time}</span>
                          <span>{post.platform}</span>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowAddModal(index)}
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

        {/* Add Post Modal */}
        <AnimatePresence>
          {showAddModal !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#0F172A]">Add to {weekDays[showAddModal]}</h3>
                  <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-[#F8FAFC] rounded-xl"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">Title</label>
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Monday Motivation Tips" className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">Content Type</label>
                    <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none">
                      {contentTypes.map((ct) => <option key={ct.type} value={ct.type}>{ct.emoji} {ct.type}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-1">Time</label>
                      <select value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none">
                        {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','6:00 PM','8:00 PM'].map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-1">Platform</label>
                      <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none">
                        {['Instagram','LinkedIn','Twitter','WhatsApp'].map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={handleAdd} disabled={adding || !newTitle.trim()} className="w-full bg-[#2EC4B6] text-white py-3 rounded-xl hover:bg-[#26a99d] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Add to Plan</>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
