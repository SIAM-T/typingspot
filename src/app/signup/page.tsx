"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase/config';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .transform(val => val.toLowerCase()),
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z
    .string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  // Watch username for availability check
  const username = watch('username');

  // Check username availability with debounce
  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      setUsernameAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    }
  };

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        checkUsername(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);

      // First, check if email already exists
      const { data: existingEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email.toLowerCase())
        .single();

      if (existingEmail) {
        toast({
          title: 'Error',
          description: 'This email is already registered. Please use a different email or try logging in.',
          variant: 'destructive',
        });
        return;
      }

      // Then check if username already exists
      const { data: existingUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', data.username.toLowerCase())
        .single();

      if (existingUsername) {
        toast({
          title: 'Error',
          description: 'This username is already taken. Please choose a different username.',
          variant: 'destructive',
        });
        return;
      }

      // Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username.toLowerCase(),
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!signUpData?.user?.id) {
        throw new Error('Failed to create user account. Please try again.');
      }

      try {
        // Create user profile
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: signUpData.user.id,
            email: data.email.toLowerCase(),
            username: data.username.toLowerCase(),
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
            total_tests: 0,
            average_wpm: 0,
            best_wpm: 0,
            average_accuracy: 0,
            daily_streak: 0,
            level: 1,
            rank_points: 0
          })
          .select()
          .single();

        if (userError) {
          console.error('User profile creation error:', userError);
          throw userError;
        }

        // Create user settings with default values
        const { error: settingsError } = await supabase
          .from('user_settings')
          .insert({
            user_id: signUpData.user.id,
            sound_enabled: true,
            theme: 'system',
            keyboard_layout: 'standard',
            show_live_wpm: true,
            show_progress_bar: true,
            font_size: 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (settingsError) {
          console.error('User settings creation error:', settingsError);
          throw settingsError;
        }

        // Create initial user stats
        const { error: statsError } = await supabase
          .from('user_stats')
          .insert({
            user_id: signUpData.user.id,
            daily_streak: 0,
            last_test_date: new Date().toISOString(),
            total_time_practiced: 0,
            level: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (statsError) {
          console.error('User stats creation error:', statsError);
          throw statsError;
        }

        toast({
          title: 'Success!',
          description: 'Account created successfully. Please check your email to verify your account.',
        });

        // Sign out the user since they need to verify their email
        await supabase.auth.signOut();
        
        // Redirect to confirmation page with email
        router.push(`/confirm-email?email=${encodeURIComponent(data.email)}`);

      } catch (dbError: any) {
        console.error('Database error:', dbError);
        
        // Try to clean up the auth user if db operations failed
        await supabase.auth.signOut();

        throw new Error(dbError.message || 'Failed to create user profile. Please try again.');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join TypingSpot and start improving your typing skills
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                {...register('username')}
                className={errors.username ? 'border-destructive' : ''}
                placeholder="johndoe"
              />
              {username && username.length >= 3 && (
                <div className="absolute right-2 top-2.5">
                  {usernameAvailable === null ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : usernameAvailable ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-destructive">✗</span>
                  )}
                </div>
              )}
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
              <li>• One special character</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign up'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
} 