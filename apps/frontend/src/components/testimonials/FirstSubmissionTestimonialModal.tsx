'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, X, Check, Briefcase, User as UserIcon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useToast } from '@/providers';

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface FirstSubmissionTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function FirstSubmissionTestimonialModal({
  isOpen,
  onClose,
  onSubmitted,
}: FirstSubmissionTestimonialModalProps) {
  const { user, apiFetch } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const handleFallback =
    user?.email?.split('@')[0] || user?.name?.toLowerCase().replace(/\s+/g, '_') || 'dev';

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle('Software Engineer');
      setLinkedin(`https://linkedin.com/in/${handleFallback}`);
      setTwitter(`@${handleFallback}`);
    }
  }, [user, handleFallback]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      showError('Please write a testimonial with at least 10 characters.');
      return;
    }
    if (!title.trim()) {
      showError('Please enter your professional title or role.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch('/api/testimonials', {
        method: 'POST',
        body: JSON.stringify({
          name: name || user?.name || 'Anonymous Developer',
          title: title || 'Software Engineer',
          linkedin: linkedin.trim() || null,
          twitter: twitter.trim() || null,
          content: content.trim(),
          rating,
          isFeatured: true,
        }),
      });

      showSuccess('Thank you! Your testimonial has been submitted.');
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err: any) {
      showError(err.message || 'Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    // Store dismissal time in localStorage so modal isn't repetitive
    localStorage.setItem('testimonial_modal_dismissed_at', Date.now().toString());
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100"
        >
          {/* Subtle Glow Header Banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#22C55E] via-emerald-400 to-teal-500" />

          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-900"
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                First Submission Cleared! 🎉
              </h3>
              <p className="text-xs text-zinc-400">
                You just ran code on InterviewUndo. Tell the community how it felt!
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Title Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <UserIcon size={12} className="text-zinc-500" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#22C55E] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Briefcase size={12} className="text-zinc-500" /> Your Title / Role
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#22C55E] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <LinkedinIcon className="text-sky-500" /> LinkedIn Link / Handle
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#22C55E] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                  <TwitterIcon className="text-sky-400" /> X (Twitter) Handle
                </label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#22C55E] transition-colors font-mono"
                />
              </div>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-zinc-600 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      size={20}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-[#22C55E] text-[#22C55E] filter drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]'
                          : 'text-zinc-800'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonial Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-zinc-500" /> Testimonial
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">{content.length}/500</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="What did you think of the execution speed, UI, or coding feedback?"
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#22C55E] transition-colors resize-none"
                required
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-900">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDismiss}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Remind Me Later
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#22C55E] hover:bg-[#1ea34d] text-zinc-950 font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Check size={14} /> Submit Testimonial
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
