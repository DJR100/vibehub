export interface ProfileData {
  id: string;
  username: string;
  bio: string;
  avatar_url?: string;
  created_at?: string;
}

export interface ProfileUpdateData {
  username?: string;
  bio?: string;
  avatar_url?: string;
} 