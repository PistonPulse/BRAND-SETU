import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export interface SavedContent {
  id: string;
  user_id: string;
  platform: string;
  content: string;
  image_prompt: string | null;
  topic: string | null;
  tone: string | null;
  created_at: string;
}

export interface WeeklyPlanItem {
  id: string;
  user_id: string;
  day_of_week: number;
  content_type: string;
  title: string;
  scheduled_time: string | null;
  platform: string | null;
  created_at: string;
}

// ── Content CRUD ─────────────────────────────────────────────────────────────

export async function saveGeneratedContent(
  items: { platform: string; content: string; image_prompt?: string; topic?: string; tone?: string }[],
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const rows = items.map((item) => ({
    user_id: user.id,
    platform: item.platform,
    content: item.content,
    image_prompt: item.image_prompt ?? null,
    topic: item.topic ?? null,
    tone: item.tone ?? null,
  }));

  await supabase.from('generated_content').insert(rows);
}

export async function fetchSavedContent(): Promise<SavedContent[]> {
  const { data, error } = await supabase
    .from('generated_content')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as SavedContent[];
}

export async function deleteContent(id: string): Promise<void> {
  await supabase.from('generated_content').delete().eq('id', id);
}

export async function getContentStats(): Promise<{ total: number; thisWeek: number }> {
  const { data, error } = await supabase
    .from('generated_content')
    .select('created_at');
  if (error || !data) return { total: 0, thisWeek: 0 };

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = data.filter((r) => new Date(r.created_at) >= weekAgo).length;

  return { total: data.length, thisWeek };
}

// ── Weekly Plan CRUD ─────────────────────────────────────────────────────────

export async function fetchWeeklyPlan(): Promise<WeeklyPlanItem[]> {
  const { data, error } = await supabase
    .from('weekly_plan')
    .select('*')
    .order('day_of_week', { ascending: true });
  if (error || !data) return [];
  return data as WeeklyPlanItem[];
}

export async function addPlanItem(
  item: { day_of_week: number; content_type: string; title: string; scheduled_time?: string; platform?: string },
): Promise<WeeklyPlanItem | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('weekly_plan')
    .insert({ user_id: user.id, ...item })
    .select()
    .single();
  if (error || !data) return null;
  return data as WeeklyPlanItem;
}

export async function deletePlanItem(id: string): Promise<void> {
  await supabase.from('weekly_plan').delete().eq('id', id);
}
