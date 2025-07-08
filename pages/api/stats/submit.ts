// POST /api/stats/submit
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, entries } = req.body;
  const today = new Date();
  const endOfWeek = new Date(today.setDate(today.getDate() + (7 - today.getDay())));

  const payload = Object.entries(entries).map(([stat_name, value]) => ({
    user_id: userId,
    stat_name,
    value: Number(value),
    week_ending: endOfWeek.toISOString(),
  }));

  const { error } = await supabase.from('stats').insert(payload);
  if (error) return res.status(500).json({ error });

  res.status(200).json({ message: 'Stats saved' });
}
