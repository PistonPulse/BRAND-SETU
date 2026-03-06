import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle, Building2, Users, Target, MessageCircle, Globe, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { Logo } from '../components/Logo';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function BusinessSetup() {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    brandTone: '',
    languages: [] as string[]
  });

  // Auth guards — must be after all hooks
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EC4B6]" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.is_setup_complete) return <Navigate to="/app" replace />;

  const industries = [
    'Retail & E-commerce',
    'Food & Beverage',
    'Fashion & Beauty',
    'Technology',
    'Healthcare',
    'Education',
    'Real Estate',
    'Professional Services',
    'Arts & Crafts',
    'Other'
  ];

  const brandTones = [
    { value: 'professional', label: 'Professional', desc: 'Formal and business-focused', icon: Building2 },
    { value: 'friendly', label: 'Friendly', desc: 'Casual and approachable', icon: MessageCircle },
    { value: 'local', label: 'Local & Warm', desc: 'Community-focused and personal', icon: Users },
    { value: 'premium', label: 'Premium', desc: 'Luxury and high-end', icon: Target }
  ];

  const languages = [
    '🇬🇧 English',
    '🇮🇳 हिंदी (Hindi)',
    '🇮🇳 मराठी (Marathi)',
    '🇮🇳 ગુજરાતી (Gujarati)',
    '🇮🇳 தமிழ் (Tamil)',
    '🇮🇳 తెలుగు (Telugu)',
    '🇮🇳 বাংলা (Bengali)',
    '🇮🇳 ಕನ್ನಡ (Kannada)',
    '🇮🇳 മലയാളം (Malayalam)',
    '🇮🇳 ਪੰਜਾਬੀ (Punjabi)'
  ];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Step 3 — save to Supabase
    setIsSubmitting(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const { error } = await supabase.from('profiles').upsert({
        id: currentUser.id,
        business_name: formData.businessName,
        industry: formData.industry,
        brand_voice: formData.brandTone,
        languages: formData.languages,
        is_setup_complete: true,
      });

      if (error) {
        console.error('Profile save error:', error);
        alert('Failed to save profile. Please try again.');
        return;
      }

      await refreshProfile();
      navigate('/app');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (formData.languages.includes(lang)) {
      setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
    } else {
      setFormData({ ...formData, languages: [...formData.languages, lang] });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Logo size="md" />
          <div className="text-sm text-[#64748B]">
            Need help? <a href="#" className="text-[#2EC4B6] hover:underline">Contact Support</a>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step >= num ? '#2EC4B6' : '#E5E7EB',
                    scale: step === num ? 1.1 : 1
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white z-10"
                >
                  {step > num ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{num}</span>
                  )}
                </motion.div>
                {num < 3 && (
                  <div className="w-full h-1 mx-2 bg-[#E5E7EB] relative">
                    <motion.div
                      initial={false}
                      animate={{
                        width: step > num ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-[#2EC4B6] absolute left-0 top-0"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={step === 1 ? 'text-[#2EC4B6]' : 'text-[#64748B]'}>Business Info</span>
            <span className={step === 2 ? 'text-[#2EC4B6]' : 'text-[#64748B]'}>Brand Voice</span>
            <span className={step === 3 ? 'text-[#2EC4B6]' : 'text-[#64748B]'}>Languages</span>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Tell us about your business</h2>
                <p className="text-[#64748B]">Help us understand your business better so we can create perfect content for you</p>
              </div>

              <div>
                <label className="block text-[#0F172A] mb-2">
                  <Building2 className="inline w-5 h-5 mr-2" />
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Priya's Boutique"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-colors"
                />
                <p className="text-sm text-[#64748B] mt-1">💡 This helps personalize your content</p>
              </div>

              <div>
                <label className="block text-[#0F172A] mb-2">
                  <Target className="inline w-5 h-5 mr-2" />
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-colors"
                >
                  <option value="">Select your industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#0F172A] mb-2">
                  <Users className="inline w-5 h-5 mr-2" />
                  Target Audience
                </label>
                <textarea
                  placeholder="e.g., Young professionals, Fashion-conscious women aged 25-40, Local community members..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl focus:border-[#2EC4B6] focus:outline-none transition-colors resize-none"
                />
                <p className="text-sm text-[#64748B] mt-1">💡 Who are your ideal customers?</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Choose your brand voice</h2>
                <p className="text-[#64748B]">Select the tone that best represents how you want to communicate with your audience</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {brandTones.map((tone) => {
                  const Icon = tone.icon;
                  return (
                    <motion.button
                      key={tone.value}
                      onClick={() => setFormData({ ...formData, brandTone: tone.value })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.brandTone === tone.value
                          ? 'border-[#2EC4B6] bg-[#EEF2FF]'
                          : 'border-[#E5E7EB] hover:border-[#2EC4B6]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          formData.brandTone === tone.value ? 'bg-[#2EC4B6]' : 'bg-[#F8FAFC]'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            formData.brandTone === tone.value ? 'text-white' : 'text-[#64748B]'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#0F172A] mb-1">{tone.label}</h3>
                          <p className="text-sm text-[#64748B]">{tone.desc}</p>
                        </div>
                        {formData.brandTone === tone.value && (
                          <CheckCircle className="w-6 h-6 text-[#2EC4B6]" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-6 border-2 border-[#E5E7EB]">
                <h4 className="font-bold text-[#0F172A] mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-[#64748B]">
                  Your brand tone helps us generate content that matches your business personality. 
                  You can always adjust this later in settings.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Select your languages</h2>
                <p className="text-[#64748B]">Choose the languages you want to create content in. You can select multiple.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                      formData.languages.includes(lang)
                        ? 'border-[#2EC4B6] bg-[#EEF2FF]'
                        : 'border-[#E5E7EB] hover:border-[#2EC4B6]'
                    }`}
                  >
                    <span className="text-[#0F172A]">{lang}</span>
                    {formData.languages.includes(lang) && (
                      <CheckCircle className="w-5 h-5 text-[#2EC4B6]" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="bg-gradient-to-br from-[#2EC4B6] to-[#4D9DE0] rounded-2xl p-6 text-white">
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Reach More Customers</h4>
                    <p className="text-sm opacity-90">
                      Creating content in multiple languages helps you connect with diverse audiences 
                      across Bharat and grow your business faster.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-[#E5E7EB]">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border-2 border-[#E5E7EB] text-[#64748B] hover:border-[#2EC4B6] hover:text-[#2EC4B6] transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-[#2EC4B6] text-white py-3 rounded-xl hover:bg-[#26a99d] transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {step === 3 ? 'Complete Setup' : 'Continue'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
