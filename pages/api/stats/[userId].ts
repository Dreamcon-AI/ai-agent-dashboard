// GET /api/stats/[userId]
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req, res) {
  const { userId } = req.query;

  const { data, error } = await supabase
    .from('stats')
    .select('stat_name, value, week_ending')
    .eq('user_id', userId)
    .order('week_ending', { ascending: true });

  if (error) return res.status(500).json({ error });

  const grouped = {};
  data.forEach(({ stat_name, value, week_ending }) => {
    if (!grouped[stat_name]) grouped[stat_name] = [];
    grouped[stat_name].push({
      week: new Date(week_ending).toLocaleDateString(),
      value,
    });
  });

  const result = Object.keys(grouped).map((name) => ({
    name,
    data: grouped[name],
  }));

  res.status(200).json(result);
}
