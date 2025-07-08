// StatTrackerAgent Frontend (React + Tailwind + Recharts)
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


const STAT_NAMES = ['Dollar Amount Sent', 'Dollar Amount Awarded'];

const STAT_THRESHOLDS = [
  { label: 'Danger', color: 'text-red-600', condition: (change) => change < -10 },
  { label: 'Emergency', color: 'text-orange-500', condition: (change) => change >= -10 && change < 0 },
  { label: 'Normal', color: 'text-green-500', condition: (change) => change >= 0 && change <= 15 },
  { label: 'Affluence', color: 'text-blue-600', condition: (change) => change > 15 },
];

export default function StatTrackerAgent() {
  const [allStats, setAllStats] = useState([]);
  const [newEntry, setNewEntry] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const fetchAllStats = async () => {
      const { data, error } = await supabase.from('stats').select('*').order('week_ending');
      if (!error) {
        const rawStats = data || [];
        const prefilled = STAT_NAMES.reduce((acc, stat) => {
          if (!rawStats.find((row) => row.stat_name === stat)) {
            acc.push({
              stat_name: stat,
              value: 0,
              week_ending: selectedWeek,
              user_id: 'public-user',
              _empty: true,
            });
          }
          return acc;
        }, [...rawStats]);

        setAllStats(prefilled);
      }
    };
    fetchAllStats();
  }, [selectedWeek]);

  const handleInputChange = (statName, value) => {
    setNewEntry({ ...newEntry, [statName]: value });
  };

  const handleSubmit = async () => {
    if (!Object.keys(newEntry).length) {
      alert('Please enter at least one statistic before submitting.');
      return;
    }

    const inserts = Object.entries(newEntry).map(([stat_name, value]) => ({
      user_id: 'public-user',
      stat_name,
      value: parseFloat(value),
      week_ending: new Date(selectedWeek).toISOString().slice(0, 10),
    }));

    const { error } = await supabase.from('stats').insert(inserts);
    if (!error) {
      alert('Submitted!');
      window.location.reload();
    }
  };

  const getStatus = (data) => {
    if (data.length < 5) return 'Insufficient Data';
    const lastFour = data.slice(-4).map(d => d.value);
    const average = lastFour.slice(0, 3).reduce((sum, val) => sum + val, 0) / 3;
    const latest = lastFour[3];
    const change = ((latest - average) / average) * 100;
    const status = STAT_THRESHOLDS.find((s) => s.condition(change));
    return <span className={status.color}>{status.label}</span>;
  };

  const groupedStats = allStats.reduce((acc, cur) => {
    if (!acc[cur.stat_name]) acc[cur.stat_name] = [];
    acc[cur.stat_name].push({ week: cur.week_ending, value: cur.value });
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-8">
      <div className="mb-4">
        <label className="block font-medium mb-2">Select Week:</label>
        <Input
          type="date"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        />
      </div>

      {STAT_NAMES.map((name, idx) => {
        const data = groupedStats[name] || [];
        return (
          <Card key={idx} className="p-4 shadow-lg">
            <CardContent>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{name}</h2>
                {data.length >= 4 ? getStatus(data) : <span className="text-gray-400">No Data</span>}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <Input
                  type="number"
                  placeholder={`Enter this week's ${name}`}
                  value={newEntry[name] || ''}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Button onClick={handleSubmit}>Submit Weekly Stats</Button>
    </div>
  );
}