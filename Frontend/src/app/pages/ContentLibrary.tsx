import { motion } from 'motion/react';
import { Search, Copy, Trash2, Instagram, Linkedin, MessageSquare, Twitter, Mail, Facebook, Filter } from 'lucide-react';
import { useState } from 'react';

export function ContentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');

  const platforms = [
    { name: 'All', icon: Filter },
    { name: 'Instagram', icon: Instagram },
    { name: 'LinkedIn', icon: Linkedin },
    { name: 'WhatsApp', icon: MessageSquare },
    { name: 'Twitter', icon: Twitter },
    { name: 'Email', icon: Mail },
    { name: 'Facebook', icon: Facebook },
  ];

  const savedContent = [
    {
      id: 1,
      platform: 'Instagram',
      content: '🌟 Exciting News! 🌟\n\nWe\'re thrilled to introduce our latest collection that\'s been crafted with love just for you! ✨',
      date: '2 hours ago',
      tags: ['Product Launch', 'Promotional'],
      icon: Instagram,
      color: 'text-pink-500'
    },
    {
      id: 2,
      platform: 'LinkedIn',
      content: 'We\'re excited to share some exciting news with our professional network! Our team has been working tirelessly to bring you innovative solutions...',
      date: '1 day ago',
      tags: ['Business Update', 'Professional'],
      icon: Linkedin,
      color: 'text-blue-600'
    },
    {
      id: 3,
      platform: 'WhatsApp',
      content: '✨ Good morning! ✨\n\nWe have something special for you today!\n\n🎁 Use code: SPECIAL20 for 20% OFF',
      date: '2 days ago',
      tags: ['Promotion', 'Discount'],
      icon: MessageSquare,
      color: 'text-green-500'
    },
    {
      id: 4,
      platform: 'Instagram',
      content: '🎨 Happy Holi! 🎨\n\nMay your life be filled with colors of joy, happiness, and prosperity. Celebrate this festival with your loved ones!',
      date: '3 days ago',
      tags: ['Festival', 'Greeting'],
      icon: Instagram,
      color: 'text-pink-500'
    },
    {
      id: 5,
      platform: 'Facebook',
      content: 'Thank you for 10,000 followers! 🎉\n\nYour support means the world to us. Here\'s to many more milestones together!',
      date: '5 days ago',
      tags: ['Milestone', 'Engagement'],
      icon: Facebook,
      color: 'text-blue-500'
    },
    {
      id: 6,
      platform: 'LinkedIn',
      content: 'Proud to announce that we\'ve been featured in Top 10 Startups to Watch in 2026! This wouldn\'t be possible without our amazing team and supporters.',
      date: '1 week ago',
      tags: ['Achievement', 'PR'],
      icon: Linkedin,
      color: 'text-blue-600'
    },
    {
      id: 7,
      platform: 'Twitter',
      content: 'Just launched our new product line! 🚀\n\nCheck it out and let us know what you think. Your feedback matters! 💬\n\n#ProductLaunch #Innovation',
      date: '1 week ago',
      tags: ['Product', 'Launch'],
      icon: Twitter,
      color: 'text-sky-500'
    },
    {
      id: 8,
      platform: 'Email',
      content: 'Subject: Your Weekly Newsletter is Here!\n\nHello there! Here are this week\'s top stories, offers, and updates...',
      date: '2 weeks ago',
      tags: ['Newsletter', 'Email'],
      icon: Mail,
      color: 'text-purple-500'
    },
  ];

  const filteredContent = savedContent.filter(content => {
    const matchesSearch = content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = filterPlatform === 'All' || content.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-[#0F172A] mb-1">47</div>
            <div className="text-sm text-[#64748B]">Total Content</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-[#0F172A] mb-1">12</div>
            <div className="text-sm text-[#64748B]">This Week</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-[#0F172A] mb-1">6</div>
            <div className="text-sm text-[#64748B]">Platforms</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-[#0F172A] mb-1">85%</div>
            <div className="text-sm text-[#64748B]">Engagement Rate</div>
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
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <motion.button
                    key={platform.name}
                    onClick={() => setFilterPlatform(platform.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                      filterPlatform === platform.name
                        ? 'bg-[#2EC4B6] text-white border-[#2EC4B6]'
                        : 'bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#2EC4B6]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item, index) => {
              const Icon = item.icon;
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
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <span className="font-medium text-[#0F172A]">{item.platform}</span>
                      </div>
                      <span className="text-xs text-[#64748B]">{item.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-[#EEF2FF] text-[#4D9DE0] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
