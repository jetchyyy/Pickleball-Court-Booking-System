import { supabase } from '../lib/supabaseClient';

// Sign up (for admin)
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw error;
  
  // Optionally add to admin_users table
  if (data.user) {
    await supabase.from('admin_users').insert([{
      id: data.user.id,
      email: data.user.email
    }]);
  }
  
  return data;
}

// Sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
}

// Get current user
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  
  return data.user;
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

// Check if user is admin (optional - can expand)
export async function isAdmin() {
  const user = await getCurrentUser();
  
  if (!user) return false;
  
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return !!data;
}

/**
 * Change the current user's password
 * @param {string} currentPassword - The user's current password
 * @param {string} newPassword - The new password to set
 * @returns {Promise} - Resolves if successful, rejects with error if not
 */
export async function changePassword(currentPassword, newPassword) {
  try {
    // First, verify the current password by attempting to sign in
    const user = await getCurrentUser();
    
    if (!user || !user.email) {
      throw new Error('No authenticated user found');
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // If current password is correct, update to new password
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Send a password reset email
 * @param {string} email - The email address to send the reset link to
 */
export async function sendPasswordResetEmail(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  });

  if (error) {
    throw error;
  }
}