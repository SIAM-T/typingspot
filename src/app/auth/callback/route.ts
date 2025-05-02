import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);

    // Get the user data
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if user exists in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // Create a new user record with a generated username
        const baseUsername = user.email?.split('@')[0] || 'user';
        let username = baseUsername;
        let counter = 1;

        // Check username availability
        while (true) {
          const { data: checkUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

          if (!checkUser) break;
          username = `${baseUsername}${counter}`;
          counter++;
        }

        // Create user record
        await supabase.from('users').insert({
          id: user.id,
          username,
          email: user.email,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          total_tests: 0,
          rank_points: 0
        });

        // Create default user settings
        await supabase.from('user_settings').insert({
          user_id: user.id,
          settings: {
            soundEnabled: true,
            theme: 'system',
            keyboardLayout: 'standard',
            showLiveWPM: true,
            showProgressBar: true
          }
        });
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
} 