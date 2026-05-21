import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SENTIMENT_COLORS = { Positive: '#16a34a', Negative: '#ef4444', Neutral: '#9ca3af' };

export default function NLPSentimentChart({ data }) {
  if (!data?.sentiment_distribution) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run NLP Sentiment analysis to view this chart.
      </div>
    );
  }

  const pieData = Object.entries(data.sentiment_distribution).map(([name, value]) => ({
    name,
    value,
  }));

  const provinceData = (data.sentiment_by_province || []).slice(0, 12);

  const wordData = (data.top_words || []).map((w) => ({
    word: w.word,
    count: w.count,
  }));

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-bold text-flood-text">
        NLP Sentiment Analysis — Incident Reports (Dataset 3)
      </h3>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Sentiment Distribution</h4>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name] || '#86efac'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Sentiment by Province</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={provinceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
            <XAxis dataKey="province" tick={{ fill: '#14532d', fontSize: 10 }} angle={-25} textAnchor="end" height={70} />
            <YAxis tick={{ fill: '#14532d' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Positive" stackId="a" fill="#16a34a" />
            <Bar dataKey="Negative" stackId="a" fill="#ef4444" />
            <Bar dataKey="Neutral" stackId="a" fill="#9ca3af" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Top 10 Words</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={wordData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
            <XAxis type="number" tick={{ fill: '#14532d' }} />
            <YAxis type="category" dataKey="word" width={70} tick={{ fill: '#14532d' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#16a34a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
