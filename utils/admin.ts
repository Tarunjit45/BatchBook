// Admin configuration
export const ADMIN_EMAILS = ['tarunjitbiswas24@gmail.com'];

// Helper function to check if user is admin
export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};
