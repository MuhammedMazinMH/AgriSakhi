"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Sprout, Chrome, Facebook, Twitter } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';

type AuthMode = 'signin' | 'signup';

export default function ModernAuth() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const isSignIn = mode === 'signin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignIn) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success(t('auth.welcome'));

        router.push('/dashboard');
      } else {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        toast.success(t('auth.accountCreated'));

        setMode('signin');
        setFullName('');
        setPassword('');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('auth.error');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    router.push('/detect');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-6xl h-[600px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex">
        
        {/* Left Side - Welcome Panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="bg-white/20 p-4 rounded-full inline-block backdrop-blur-sm">
              <Sprout className="w-16 h-16" />
            </div>
            
            <h2 className="text-4xl font-bold">
              {isSignIn ? t('auth.newHere') : t('auth.welcomeBack')}
            </h2>
            
            <p className="text-lg text-white/90 max-w-sm">
              {isSignIn 
                ? t('auth.joinUs')
                : t('auth.gladToSee')
              }
            </p>
            
            <Button
              onClick={() => setMode(isSignIn ? 'signup' : 'signin')}
              variant="outline"
              className="mt-6 px-12 py-6 text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 transition-all duration-300 rounded-full"
              suppressHydrationWarning
            >
              {isSignIn ? t('auth.signup.title').toUpperCase() : t('auth.signin.title').toUpperCase()}
            </Button>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white dark:bg-gray-800">
          <div className="max-w-md mx-auto w-full space-y-8">
            
            {/* Logo for Mobile */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <Sprout className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {isSignIn ? t('auth.signin.title') : t('auth.signup.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isSignIn 
                  ? t('auth.signin.subtitle')
                  : t('auth.signup.subtitle')
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name (Sign Up Only) */}
              {!isSignIn && (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('auth.fullName')}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    suppressHydrationWarning
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.email')}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  suppressHydrationWarning
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.password')}
                  required
                  minLength={8}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  suppressHydrationWarning
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                suppressHydrationWarning
              >
                {isLoading ? t('common.loading') : (isSignIn ? t('auth.login') : t('auth.createAccount'))}
              </Button>
            </form>

            {/* Social Login */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                    {t('auth.socialLogin')}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="p-3 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  title="Google"
                  suppressHydrationWarning
                >
                  <Chrome className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  title="Facebook"
                  suppressHydrationWarning
                >
                  <Facebook className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  title="Twitter"
                  suppressHydrationWarning
                >
                  <Twitter className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden text-center pt-4">
              <p className="text-gray-600 dark:text-gray-400">
                {isSignIn ? t('auth.newHere') + ' ' : t('auth.alreadyAccount') + ' '}
                <button
                  onClick={() => setMode(isSignIn ? 'signup' : 'signin')}
                  className="text-green-600 dark:text-green-400 font-semibold hover:underline"
                  suppressHydrationWarning
                >
                  {isSignIn ? t('auth.signup.title') : t('auth.signin.title')}
                </button>
              </p>
            </div>

            {/* Guest Mode */}
            <div className="text-center">
              <button
                onClick={handleGuestMode}
                className="text-sm text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                suppressHydrationWarning
              >
                {t('auth.continueAsGuest')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
