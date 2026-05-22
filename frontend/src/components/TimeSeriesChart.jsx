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
  ReferenceLine,
} from 'recharts';

const HIST_COLOR = '#16a34a';
const FORECAST_COLOR = '#f97316';

export default function TimeSeriesChart({ data }) {
  if (!data?.historical?.length) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run ARIMAX Time Series analysis to view this chart.
      </div>
    );
  }

  const lastHistYear = Math.max(...data.historical.map((h) => h.year));
  const histByYear = Object.fromEntries(
    data.historical.map((h) => [h.year, h.deaths])
  );

  const chartData = data.historical.map((h) => ({
    year: h.year,
    historical_deaths: h.deaths,
    arimax_forecast: null,
    lower_ci: null,
    upper_ci: null,
  }));

  (data.forecast || []).forEach((f) => {
    chartData.push({
      year: f.year,
      historical_deaths:
        f.year === lastHistYear ? histByYear[lastHistYear] : null,
      arimax_forecast: f.predicted_deaths,
      lower_ci: f.lower_ci,
      upper_ci: f.upper_ci,
    });
  });

  chartData.sort((a, b) => a.year - b.year);

  return (
    <div className="rounded-xl border border-green-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-lg font-bold text-flood-text">
        ARIMAX Forecast — Annual Casualty Counts (2005–2030)
      </h3>
      <p className="mb-4 text-sm text-green-700">
        Solid line: observed deaths (2005–{lastHistYear}). Dotted line: ARIMAX projection
        ({data.forecast_range || '2026–2030'}) with rainfall and flooded-area covariates.
      </p>
      {data.model_aic != null && (
        <p className="mb-3 text-xs text-green-600">
          AIC: {data.model_aic} — {data.model_summary}
        </p>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 16, right: 24, left: 8, bottom: 48 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#14532d', fontSize: 11 }}
            label={{
              value: 'Year',
              position: 'insideBottom',
              offset: -8,
              fill: '#14532d',
            }}
          />
          <YAxis
            tick={{ fill: '#14532d' }}
            label={{
              value: 'Total Deaths',
              angle: -90,
              position: 'insideLeft',
              fill: '#14532d',
            }}
          />
          <Tooltip
            formatter={(value, name) => [
              value != null ? Math.round(value) : '—',
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 16 }}
          />
          <ReferenceLine
            x={lastHistYear + 0.5}
            stroke="#86efac"
            strokeDasharray="4 4"
            label={{ value: 'Forecast →', fill: '#15803d', fontSize: 11 }}
          />
          <Area
            dataKey="upper_ci"
            stroke="none"
            fill="#fed7aa"
            fillOpacity={0.4}
            name="Forecast Upper CI"
            connectNulls={false}
          />
          <Area
            dataKey="lower_ci"
            stroke="none"
            fill="#ffedd5"
            fillOpacity={0.5}
            name="Forecast Lower CI"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="historical_deaths"
            stroke={HIST_COLOR}
            strokeWidth={3}
            dot={{ r: 4, fill: HIST_COLOR }}
            name="Historical Data"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="arimax_forecast"
            stroke={FORECAST_COLOR}
            strokeWidth={3}
            strokeDasharray="8 5"
            dot={{ r: 5, fill: FORECAST_COLOR, strokeWidth: 2, stroke: '#fff' }}
            name="ARIMAX Forecast (2026–2030)"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
