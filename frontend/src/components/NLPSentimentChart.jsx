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

const SentimentTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  const positive = payload.find((p) => p.name === 'Positive')?.value || 0;
  const positivePct = total ? ((positive / total) * 100).toFixed(1) : '0.0';
  return (
    <div className="max-w-xs rounded-lg border border-green-200 bg-white p-3 text-sm shadow">
      {payload.map((p) => (
        <p key={p.name} className="text-flood-text">
          <span className="font-semibold">{p.name}:</span> {p.value} records
        </p>
      ))}
      <p className="mt-2 border-t border-green-100 pt-2 text-xs text-green-800">
        {positivePct}% Positive — emergency disaster logs are overwhelmingly critical;
        low positive share is expected for casualty and damage narratives.
      </p>
    </div>
  );
};

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

  const rc = data.report_completeness || {};
  const qualityDonut = [
    { name: 'Valid Reports', value: rc.valid_reports || 0, pct: rc.valid_pct || 0 },
    {
      name: 'Incomplete Reports',
      value: rc.incomplete_reports || 0,
      pct: rc.incomplete_pct || 0,
    },
  ];
  const QUALITY_COLORS = ['#16a34a', '#f97316'];

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-bold text-flood-text">
        Text Log Quality &amp; Feedback Sentiment Analysis (Dataset 3)
      </h3>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-green-200 bg-white p-4">
          <h4 className="mb-2 font-semibold text-flood-text">Sentiment Distribution</h4>
          <p className="mb-3 text-xs text-green-700">{data.sentiment_note}</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={SENTIMENT_COLORS[entry.name] || '#86efac'}
                  />
                ))}
              </Pie>
              <Tooltip content={<SentimentTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-green-200 bg-white p-4">
          <h4 className="mb-3 font-semibold text-flood-text">Data Quality Analysis</h4>
          <p className="mb-3 text-xs text-gray-600">
            Report completeness: Valid vs Incomplete field logs (Dataset 3).
          </p>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#dcfce7] p-4 text-center">
              <p className="text-2xl font-bold text-[#15803d]">{rc.valid_pct ?? 0}%</p>
              <p className="text-xs font-semibold text-flood-text">Valid Reports</p>
              <p className="text-xs text-gray-500">{rc.valid_reports ?? 0} records</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{rc.incomplete_pct ?? 0}%</p>
              <p className="text-xs font-semibold text-flood-text">Incomplete Reports</p>
              <p className="text-xs text-gray-500">{rc.incomplete_reports ?? 0} records</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={qualityDonut}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                label={({ name, payload: pl }) =>
                  `${name} (${pl?.pct ?? 0}%)`
                }
              >
                {qualityDonut.map((entry, i) => (
                  <Cell key={entry.name} fill={QUALITY_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} (${props.payload.pct}%)`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Sentiment by Province</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={provinceData} margin={{ bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
            <XAxis
              dataKey="province"
              tick={{ fill: '#14532d', fontSize: 10 }}
              angle={-25}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fill: '#14532d' }} />
            <Tooltip content={<SentimentTooltip />} />
            <Legend />
            <Bar dataKey="Positive" stackId="a" fill="#16a34a" name="Positive" />
            <Bar dataKey="Negative" stackId="a" fill="#ef4444" name="Negative" />
            <Bar dataKey="Neutral" stackId="a" fill="#9ca3af" name="Neutral" />
          </BarChart>
        </ResponsiveContainer>
      </div>
{/* 
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
      </div> */}
    </div>
  );
}
