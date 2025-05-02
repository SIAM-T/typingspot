import { supabase } from '@/lib/supabase/config';

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send reset email' 
    };
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify/success`,
      }
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error resending verification email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to resend verification email' 
    };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update password' 
    };
  }
};

export const verifyPasswordResetToken = async (token: string) => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery',
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error verifying reset token:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid or expired reset token' 
    };
  }
}; 