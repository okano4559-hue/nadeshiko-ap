export type StampType = 'soccer_ball' | 'fire' | 'star' | 'thumbs_up' | null;

export interface TrainingRecord {
    id?: string; // Supabase ID (optional for local/optimistic updates)
    user_id: string; // Identifier for the user
    date: string; // YYYY-MM-DD
    score: number;
    streak?: number; // Calculated or stored
    stamp_type?: StampType;
    coach_comment?: string;
    created_at?: string;
}

export interface TrainingItem {
    name: string;
    description?: string;
    videoUrl?: string; // Optional video link
    reps?: number;
    duration?: number; // seconds
    type: 'reps' | 'duration';
    emoji: string;
    instruction: string;
    value: number;
}
