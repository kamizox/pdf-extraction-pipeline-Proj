import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function pct(value) {
  if (value == null) return '—';
  return value > 1 ? value.toFixed(1) : (value * 100).toFixed(1);
}

function heatColor(value) {
  const v = Math.max(0, Math.min(1, value));
  if (v < 0.25) return `rgb(134, 239, 172)`;
  if (v < 0.5) return `rgb(74, 222, 128)`;
  if (v < 0.75) return `rgb(249, 115, 22)`;
  return `rgb(239, 68, 68)`;
}

function HeatmapGrid({ title, grid }) {
  if (!grid?.length) return null;
  return (
    <div className="flex flex-1 flex-col rounded-xl border border-green-200 bg-white p-3">
      <p className="mb-2 text-center text-xs font-bold text-flood-text">{title}</p>
      <div className="mx-auto grid grid-cols-3 gap-1">
        {grid.map((row, ri) =>
          row.map((cell, ci) => (
            <div
              key={`${ri}-${ci}`}
              className="flex h-14 w-14 items-center justify-center rounded border border-green-100 text-[10px] font-semibold text-[#14532d] shadow-sm"
              style={{ backgroundColor: heatColor(cell) }}
              title={`${cell}`}
            >
              {typeof cell === 'number' ? cell.toFixed(2) : cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ConfusionTable({ matrix, labels }) {
  if (!matrix?.length) return null;
  const maxVal = Math.max(...matrix.flat(), 1);

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="border border-green-200 bg-flood-card p-2">Actual \ Predicted</th>
          {labels.map((l) => (
            <th key={l} className="border border-green-200 bg-flood-card p-2 text-xs">
              {l}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            <th className="border border-green-200 bg-flood-card p-2 text-xs">{labels[i]}</th>
            {row.map((val, j) => {
              const intensity = Math.round((val / maxVal) * 180);
              return (
                <td
                  key={j}
                  className="border border-green-200 p-2 text-center font-medium"
                  style={{
                    backgroundColor: `rgba(22, 163, 74, ${0.15 + intensity / 255})`,
                  }}
                >
                  {val}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function CNNDamageChart({ data }) {
  if (!data || data.accuracy == null) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run CNN analysis to view results.
      </div>
    );
  }

  const labels = data.labels || data.class_labels || [];
  const fiData = (data.feature_importance || data.feature_importance_proxy || []).map((f) => ({
    name: (f.feature || '').replace('_normalized', ''),
    value: f.importance ?? f.mean_abs_value ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-flood-text">
          CNN Classification — Spatial Infrastructure Damage Tiers
        </h3>
        <p className="mt-1 text-sm text-green-700">
          Convolutional Neural Network trained on 2D Spatiotemporal Heatmap Grids of Flood
          Features
        </p>
      </div>

      <div className="grid max-w-md grid-cols-2 gap-4">
        <div className="rounded-xl border border-green-200 bg-flood-card p-4">
          <p className="text-xs uppercase text-green-700">Accuracy</p>
          <p className="text-2xl font-bold text-flood-text">{pct(data.accuracy)}%</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-flood-card p-4">
          <p className="text-xs uppercase text-green-700">F1 Score</p>
          <p className="text-2xl font-bold text-flood-text">{pct(data.f1_score)}%</p>
        </div>
      </div>

      {data.model_summary && (
        <p className="text-sm font-medium text-[#15803d]">{data.model_summary}</p>
      )}

      <div className="rounded-xl border border-green-200 bg-[#f0fdf4] p-4">
        <h4 className="mb-4 text-center text-sm font-bold tracking-wide text-flood-text">
          INPUT RASTER MATRIX GRIDS
        </h4>
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-center">
          {(data.sample_grids || []).map((sample) => (
            <HeatmapGrid key={sample.title} title={sample.title} grid={sample.grid} />
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-gray-500">
          Each 4×3 cell matrix is one flood record reshaped from 12 normalized features (0 = low,
          1 = high intensity).
        </p>
      </div>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Confusion Matrix</h4>
        <ConfusionTable matrix={data.confusion_matrix} labels={labels} />
      </div>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Feature Importance</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fiData} layout="vertical" margin={{ left: 140 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
            <XAxis type="number" tick={{ fill: '#14532d' }} />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fill: '#14532d', fontSize: 10 }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
