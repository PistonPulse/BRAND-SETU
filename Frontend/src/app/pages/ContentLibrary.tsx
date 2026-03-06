import { motion } from 'motion/react';
import { Search, Copy, Trash2, Instagram, Linkedin, Twitter, Filter, Loader2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchSavedContent, deleteContent, getContentStats } from '@/lib/content';
import type { SavedContent } from '@/lib/content';

const ICON_MAP: Record<string, typeof Instagram> = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
};
const COLOR_MAP: Record<string, string> = {
  instagram: 'text-pink-500',
  linkedin: 'text-blue-600',
  twitter: 'text-sky-500',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function ContentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [allContent, setAllContent] = useState<SavedContent[]>([]);
  const [stats, setStats] = useState({ total: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchSavedContent(), getContentStats()])
      .then(([content, s]) => { setAllContent(content); setStats(s); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const platforms = [
    { name: 'All', icon: Filter },
    { name: 'instagram', icon: Instagram, label: 'Instagram' },
    { name: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { name: 'twitter', icon: Twitter, label: 'Twitter' },
  ];

  const uniquePlatforms = new Set(allContent.map((c) => c.platform));

  const filteredContent = allContent.filter((item) => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.topic ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'All' || item.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDelete = async (id: string) => {
    await deleteContent(id);
    setAllContent((prev) => prev.filter((c) => c.id !== id));
    setStats((s) => ({ ...s, total: s.total - 1 }));
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
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Content Library</h1>
          <p className="text-[#64748B]">Access all your saved content in one place</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-[#0F172A] mb-1">{stats.total}</div>
            <div className="text-sm text-[#64748B]">Total Content</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-[#0F172A] mb-1">{stats.thisWeek}</div>
            <div className="text-sm text-[#64748B]">This Week</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-[#0F172A] mb-1">{uniquePlatforms.size}</div>
            <div className="text-sm text-[#64748B]">Platforms Used</div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5" />
              <input
                type="text"
                placeholder="Search content, tags, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-colors"
              />
            </div>

            {/* Platform Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <motion.button
                    key={p.name}
                    onClick={() => setFilterPlatform(p.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                      filterPlatform === p.name
                        ? 'bg-[#2EC4B6] text-white border-[#2EC4B6]'
                        : 'bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#2EC4B6]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{'label' in p ? p.label : p.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#2EC4B6]" />
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item, index) => {
              const Icon = ICON_MAP[item.platform] ?? Sparkles;
              const color = COLOR_MAP[item.platform] ?? 'text-gray-500';
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b-2 border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span className="font-medium text-[#0F172A] capitalize">{item.platform}</span>
                      </div>
                      <span className="text-xs text-[#64748B]">{timeAgo(item.created_at)}</span>
                    </div>
                    {item.topic && (
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#EEF2FF] text-[#4D9DE0] text-xs rounded-full">
                          {item.topic}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-[#64748B] text-sm line-clamp-4 mb-4 whitespace-pre-wrap">
                      {item.content}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(item.content)}
                        className="flex-1 bg-[#2EC4B6] text-white py-2.5 rounded-xl hover:bg-[#26a99d] transition-all flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 bg-[#F8FAFC] text-[#EF4444] border-2 border-[#E5E7EB] rounded-xl hover:bg-red-50 hover:border-red-300 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#CBD5E1]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Content Found</h3>
            <p className="text-[#64748B]">
              Try adjusting your search or filters to find what you're looking for
            </p>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-gradient-to-br from-[#EEF2FF] to-[#F0F9FF] rounded-3xl p-6 border-2 border-[#E5E7EB]"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#FF9F1C] rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] mb-2">Organization Tips</h3>
              <ul className="space-y-1 text-sm text-[#64748B]">
                <li>• Use tags to categorize your content for easy retrieval</li>
                <li>• Regularly review and update your saved content</li>
                <li>• Archive old or outdated content to keep your library clean</li>
                <li>• Reuse successful content with minor modifications for different platforms</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
