import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PlotlyViewer({ data }) {
  if (!data?.historical?.length) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run ARIMA analysis to load this chart.
      </div>
    );
  }

  const chartData = data.historical.map((h) => ({
    year: h.year,
    Total_Deaths: h.deaths,
    Avg_Rainfall_mm: h.rainfall,
  }));

  return (
    <div className="rounded-xl border border-green-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-flood-text">
        Multi-Metric Overview — Deaths vs Rainfall (2005–2025)
      </h3>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
          <XAxis dataKey="year" tick={{ fill: '#14532d' }} />
          <YAxis yAxisId="left" tick={{ fill: '#14532d' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#14532d' }} />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="Total_Deaths"
            fill="#16a34a"
            name="Total Deaths"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Avg_Rainfall_mm"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Avg Rainfall (mm)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
