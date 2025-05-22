
import { Database } from '@/integrations/supabase/types';

// Export Supabase table types for convenience
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Chat = Database['public']['Tables']['chats']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type ChatParticipant = Database['public']['Tables']['chat_participants']['Row'];
export type Attachment = Database['public']['Tables']['attachments']['Row'];
export type Label = Database['public']['Tables']['labels']['Row'];
export type ChatLabel = Database['public']['Tables']['chat_labels']['Row'];

// Extended types with additional frontend properties
export interface UserWithPresence extends Omit<Profile, 'status'> {
  status?: 'online' | 'offline';
}

export interface ChatWithDetails extends Chat {
  participants?: Profile[];
  unreadCount?: number;
  lastMessage?: Message;
  labels?: Label[];
  isActive?: boolean;
  isGroup?: boolean;
}

export interface MessageWithSender extends Message {
  sender?: Profile;
  attachments?: Attachment[];
}
