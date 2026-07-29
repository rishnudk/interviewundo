'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type RegisterDTO } from '@interviewprep/shared-types';
import { useAuth, useToast } from '@/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { OAuthButtons } from './OAuthButtons';
import { Component as TrustedDevelopersBadge } from '@/components/ui/avatar-demo';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterDTO) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await registerUser(data);
      showSuccess('Account created successfully! Welcome to interviewUndo.');
      router.push('/dashboard');
    } catch (err: any) {
      const errMsg = err.message || 'Registration failed. Email might already be in use.';
      setServerError(errMsg);
      showError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#09090B]/60 border border-white/5 rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden relative">
      <div className="pt-8 pb-4 px-8 text-center flex flex-col items-center">
        <h1 className="text-2xl font-bold tracking-[-0.05em] text-[#ffffff] mb-2">
          Create an account
        </h1>
        <p className="text-[#868f97] text-sm">
          Join interviewUndo to practice challenges and master tech interviews
        </p>
      </div>

      <div className="px-8 pb-8">
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="font-medium">{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name input */}
          <div className="space-y-2">
            <label
              className="text-xs font-semibold text-[#868f97] uppercase tracking-wider"
              htmlFor="name"
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className={`rounded-xl h-11 border-white/10 bg-[#131313] text-[#ffffff] placeholder:text-[#525252] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/50 shadow-inner ${
                errors.name ? 'border-red-500' : ''
              }`}
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <label
              className="text-xs font-semibold text-[#868f97] uppercase tracking-wider"
              htmlFor="email"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={`rounded-xl h-11 border-white/10 bg-[#131313] text-[#ffffff] placeholder:text-[#525252] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/50 shadow-inner ${
                errors.email ? 'border-red-500' : ''
              }`}
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label
              className="text-xs font-semibold text-[#868f97] uppercase tracking-wider"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`rounded-xl h-11 pr-11 border-white/10 bg-[#131313] text-[#ffffff] placeholder:text-[#525252] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/50 shadow-inner ${
                  errors.password ? 'border-red-500' : ''
                }`}
                {...register('password')}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#868f97] hover:text-[#ffffff] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} />

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-[#09090B] font-bold shadow-[0_4px_20px_rgba(34,197,94,0.15)] transition-all cursor-pointer mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8 flex items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="mx-4 text-[10px] text-[#868f97] font-semibold uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* OAuth Buttons */}
        <OAuthButtons disabled={isSubmitting} />

        <div className="text-center mt-6">
          <p className="text-sm text-[#868f97]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-[#ffffff] hover:text-[#22C55E] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
