import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, RotateCw, Save, Instagram, Linkedin, MessageSquare, Twitter, Mail, Facebook, Check } from 'lucide-react';
import { useState } from 'react';

export function ContentGenerator() {
  const [platform, setPlatform] = useState('Instagram');
  const [language, setLanguage] = useState('English');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500', textColor: 'text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-400', textColor: 'text-blue-600' },
    { name: 'WhatsApp', icon: MessageSquare, color: 'from-green-500 to-emerald-400', textColor: 'text-green-500' },
    { name: 'Twitter/X', icon: Twitter, color: 'from-sky-500 to-blue-400', textColor: 'text-sky-500' },
    { name: 'Email', icon: Mail, color: 'from-purple-500 to-pink-400', textColor: 'text-purple-500' },
    { name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-indigo-500', textColor: 'text-blue-500' },
  ];

  const languages = [
    '🇬🇧 English',
    '🇮🇳 हिंदी',
    '🇮🇳 मराठी',
    '🇮🇳 ગુજરાતી',
    '🇮🇳 தமிழ்',
    '🇮🇳 తెలుగు',
  ];

  const goals = [
    'Promote a product or service',
    'Engage with audience',
    'Festival greeting',
    'Special offer/promotion',
    'Educational content',
    'Behind the scenes',
    'Customer testimonial',
    'Event announcement',
  ];

  const sampleContent = {
    Instagram: "🌟 Exciting News! 🌟\n\nWe're thrilled to introduce our latest collection that's been crafted with love just for you! ✨\n\nSwipe through to discover:\n✅ Stunning new designs\n✅ Premium quality materials\n✅ Affordable pricing\n✅ Limited time offers\n\nTap the link in bio to shop now! 🛍️\n\n#NewCollection #ShopLocal #SupportSmallBusiness #Fashion #Style #BrandSetu",
    LinkedIn: "We're excited to share some exciting news with our professional network!\n\nOur team has been working tirelessly to bring you innovative solutions that drive real results. Here's what we've achieved:\n\n• 150% growth in customer satisfaction\n• Expanded our service offerings\n• Built stronger partnerships\n\nThank you for being part of our journey. Let's continue to grow together!\n\n#BusinessGrowth #Innovation #Success #Entrepreneurship",
    WhatsApp: "✨ Good morning! ✨\n\nWe have something special for you today!\n\n🎁 Use code: SPECIAL20 for 20% OFF\n⏰ Valid until midnight tonight\n🚀 Free delivery on all orders\n\nReply 'YES' to place your order or visit our store today!\n\nThank you for your continued support! 🙏",
  };

  const handleGenerate = async () => {
    if (!goal) return;
    
    setSaved(false);
    setIsGenerating(true);
    setGeneratedContent('');
    
    // Simulate typing animation
    const content = sampleContent[platform as keyof typeof sampleContent] || sampleContent.Instagram;
    const words = content.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setGeneratedContent(prev => prev + (i > 0 ? ' ' : '') + words[i]);
    }
    
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2EC4B6] via-[#4D9DE0] to-[#818CF8] bg-clip-text text-transparent mb-2">
            Generate Content
          </h1>
          <p className="text-[#64748B]">Create engaging, multilingual content powered by AI ✨</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <motion.div 
              className="glass-card-strong rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.1)] p-8 border border-white/40"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Configure Your Content</h2>

              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-[#0F172A] mb-3 font-medium">Select Platform</label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <motion.button
                        key={p.name}
                        onClick={() => setPlatform(p.name)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                          platform === p.name
                            ? 'border-transparent'
                            : 'border-white/40 glass-card hover:border-[#2EC4B6]/40'
                        }`}
                      >
                        {platform === p.name && (
                          <motion.div
                            layoutId="platformBg"
                            className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-10`}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        {platform === p.name && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20`} />
                        )}
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${p.textColor} relative z-10`} />
                        <div className="text-xs text-[#0F172A] text-center font-medium relative z-10">{p.name}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-[#0F172A] mb-3 font-medium">Select Language</label>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-medium relative ${
                        language === lang
                          ? 'border-transparent bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] text-white shadow-[0_8px_24px_rgba(46,196,182,0.3)]'
                          : 'border-white/40 glass-card text-[#64748B] hover:border-[#2EC4B6]/40'
                      }`}
                    >
                      {lang}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content Goal */}
              <div className="mb-6">
                <label className="block text-[#0F172A] mb-3 font-medium">Content Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 glass-card border-2 border-white/40 rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-all text-[#0F172A] font-medium"
                >
                  <option value="">Choose your goal...</option>
                  {goals.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Additional Context */}
              <div className="mb-6">
                <label className="block text-[#0F172A] mb-3 font-medium">Additional Details (Optional)</label>
                <textarea
                  placeholder="Add any specific details, products, or context to customize your content..."
                  rows={4}
                  className="w-full px-4 py-3 glass-card border-2 border-white/40 rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-all resize-none text-[#0F172A]"
                />
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!goal || isGenerating}
                whileHover={goal && !isGenerating ? { scale: 1.02, y: -2 } : {}}
                whileTap={goal && !isGenerating ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                  !goal || isGenerating
                    ? 'bg-[#E5E7EB] text-[#94A3B8] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#2EC4B6] via-[#4D9DE0] to-[#818CF8] text-white shadow-[0_8px_32px_rgba(46,196,182,0.4)] hover:shadow-[0_16px_48px_rgba(46,196,182,0.5)]'
                }`}
              >
                {goal && !isGenerating && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#818CF8] via-[#4D9DE0] to-[#2EC4B6]"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <span className="relative z-10 font-medium">Generating Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 relative z-10" />
                    <span className="relative z-10 font-medium">Generate Content</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Tips Card */}
            <motion.div 
              className="glass-card rounded-3xl p-6 border-2 border-white/40 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <h3 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li className="flex items-start gap-2">
                  <span className="text-[#2EC4B6] mt-1">•</span>
                  <span>Be specific about your product or offer for better results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4D9DE0] mt-1">•</span>
                  <span>Choose the right platform for your audience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9F1C] mt-1">•</span>
                  <span>You can regenerate content multiple times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#22C55E] mt-1">•</span>
                  <span>Save your favorites to the content library</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Output Panel */}
          <div>
            <motion.div 
              className="glass-card-strong rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.1)] p-8 sticky top-6 border border-white/40"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A]">Generated Content</h2>
                {generatedContent && !isGenerating && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopy}
                      className="p-2.5 text-[#64748B] hover:text-[#2EC4B6] glass-card border border-white/30 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(46,196,182,0.3)]"
                      title="Copy"
                    >
                      {copied ? <Check className="w-5 h-5 text-[#22C55E]" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleGenerate}
                      className="p-2.5 text-[#64748B] hover:text-[#FF9F1C] glass-card border border-white/30 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,159,28,0.3)]"
                      title="Regenerate"
                    >
                      <RotateCw className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSave}
                      className="p-2.5 text-[#64748B] hover:text-[#22C55E] glass-card border border-white/30 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                      title="Save"
                    >
                      {saved ? <Check className="w-5 h-5 text-[#22C55E]" /> : <Save className="w-5 h-5" />}
                    </motion.button>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!generatedContent && !isGenerating ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div 
                      className="w-24 h-24 glass-card rounded-full flex items-center justify-center mb-4 border border-white/30"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-12 h-12 text-[#CBD5E1]" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Ready to Create?</h3>
                    <p className="text-[#64748B] max-w-sm">
                      Configure your settings and click "Generate Content" to create amazing posts with AI
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <div className="min-h-[300px] p-6 glass-card rounded-2xl border border-white/30 relative overflow-hidden">
                      <div className="whitespace-pre-wrap text-[#0F172A] leading-relaxed relative z-10">
                        {generatedContent}
                        {isGenerating && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-0.5 h-5 bg-gradient-to-b from-[#2EC4B6] to-[#4D9DE0] ml-1"
                          />
                        )}
                      </div>

                      {/* Shimmer effect during generation */}
                      {isGenerating && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none z-20"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(46, 196, 182, 0.15), transparent)',
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                    </div>

                    {/* Success Animation */}
                    {generatedContent && !isGenerating && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mt-6 p-5 glass-card border-2 border-[#22C55E]/30 rounded-2xl flex items-start gap-3 relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/5 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div 
                          className="w-8 h-8 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                        <div className="flex-1 relative z-10">
                          <h4 className="font-semibold text-[#0F172A] mb-1">Content Generated! ✨</h4>
                          <p className="text-sm text-[#64748B]">
                            Your content is ready. You can copy, regenerate, or save it to your library.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}