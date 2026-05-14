/**
 * Centralized Type Definitions for DebateArena
 * Prevents circular dependencies and ensures type parity with Backend models.
 */

// --- User Types ---
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  globalElo: number;
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  bio?: string;
  topicRatings?: TopicRating[];
  badges?: UserBadge[];
  createdAt: string;
  updatedAt: string;
}

export interface TopicRating {
  id: string;
  userId: string;
  categoryId: string;
  elo: number;
  category?: Category;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: string;
  badge?: {
    id: string;
    name: string;
    description: string;
    icon?: string;
  };
}


// --- Session & Debate Types ---
export type DebatePhase = 'lobby' | 'phase1' | 'phase2' | 'completed';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Session {
  id: string;
  categoryId: string;
  topic: string;
  initialQuestion: string;
  status: 'open' | 'active' | 'completed' | 'cancelled';
  phase: DebatePhase;
  startTime?: string;
  endTime?: string;
  category?: Category;
  participants?: Participant[];
  subQuestions?: string[];
  observerCount?: number;
}

export interface Participant {
  id: string;
  userId: string;
  sessionId: string;
  username: string;
  role: 'creator' | 'joiner';
  stance: string;
  isReady: boolean;
  eloChange?: number;
  joinedAt: string;
  user?: User;
}

// --- Verdict & AI Types ---
export interface Verdict {
  id: string;
  sessionId: string;
  winnerId?: string;
  aiAnalysis: any; // Could be fleshed out with a specific schema later
  scores: Record<string, number>;
  createdAt: string;
}

// --- Social & Notification Types ---
export interface Challenge {
  id: string;
  challengerId: string;
  challengedId: string;
  categoryId: string;
  topic: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  challenger?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'challenge' | 'debate_start' | 'verdict_ready' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// --- API Response Wrappers ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
}

export interface LeaderboardResponse {
  data: User[];
  nextCursor: string | null;
}

export interface SessionFeedResponse {
  sessions: (Session & { 
    _count?: { observers: number },
    participants: (Participant & { user: User })[]
  })[];
  nextCursor: string | null;
}

export interface DebateHistoryItem extends Participant {
  session: Session & {
    category: Category;
    verdict?: Verdict & {
      winner?: Participant & { user: { username: string } }
    }
  };
}

