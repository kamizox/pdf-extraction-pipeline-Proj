import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';

const CHART_COLORS = ['#16a34a', '#4ade80', '#86efac', '#bbf7d0', '#f97316', '#ef4444'];

export default function TimeSeriesChart({ data }) {
  if (!data?.historical?.length) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run ARIMA Time Series analysis to view this chart.
      </div>
    );
  }

  const historical = data.historical.map((h) => ({
    year: h.year,
    deaths: h.deaths,
    type: 'historical',
  }));

  const forecast = (data.forecast || []).map((f) => ({
    year: f.year,
    predicted_deaths: f.predicted_deaths,
    lower_ci: f.lower_ci,
    upper_ci: f.upper_ci,
    type: 'forecast',
  }));

  const byYear = {};
  [...historical, ...forecast].forEach((row) => {
    byYear[row.year] = { ...byYear[row.year], ...row, year: row.year };
  });
  const chartData = Object.values(byYear).sort((a, b) => a.year - b.year);

  return (
    <div className="rounded-xl border border-green-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-flood-text">
        ARIMA Forecast — Flood Deaths (2005–2030)
      </h3>
      {data.model_aic != null && (
        <p className="mb-2 text-sm text-green-700">
          AIC: {data.model_aic} — {data.model_summary}
        </p>
      )}
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
          <XAxis dataKey="year" tick={{ fill: '#14532d' }} />
          <YAxis tick={{ fill: '#14532d' }} />
          <Tooltip />
          <Legend />
          <Area
            dataKey="upper_ci"
            stroke="none"
            fill="#86efac"
            fillOpacity={0.35}
            name="Upper CI"
          />
          <Area
            dataKey="lower_ci"
            stroke="none"
            fill="#dcfce7"
            fillOpacity={0.5}
            name="Lower CI"
          />
          <Line
            type="monotone"
            dataKey="deaths"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Total Deaths (Historical)"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted_deaths"
            stroke={CHART_COLORS[4]}
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ r: 3 }}
            name="Predicted Deaths"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
