import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
  if (!data?.accuracy && data?.accuracy !== 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run Neural Network (MLP) analysis to view results.
      </div>
    );
  }

  const proxyData = (data.feature_importance_proxy || []).map((f) => ({
    name: f.feature.replace('_normalized', ''),
    value: f.mean_abs_value,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-flood-text">
        Neural Network (MLP) — Damage Level Prediction
      </h3>
      <p className="text-sm text-green-700">
        Multi-dimensional infrastructure damage tiers: Low, Medium, Extreme Destruction.
      </p>

      <div className="grid max-w-md grid-cols-2 gap-4">
        <div className="rounded-xl border border-green-200 bg-flood-card p-4">
          <p className="text-xs uppercase text-green-700">Accuracy</p>
          <p className="text-2xl font-bold text-flood-text">
            {(data.accuracy * 100).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl border border-green-200 bg-flood-card p-4">
          <p className="text-xs uppercase text-green-700">F1 Score</p>
          <p className="text-2xl font-bold text-flood-text">
            {(data.f1_score * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {data.training_note && (
        <p className="text-sm text-green-700">{data.training_note}</p>
      )}

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Confusion Matrix</h4>
        <ConfusionTable matrix={data.confusion_matrix} labels={data.class_labels} />
      </div>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Feature Proxy Importance</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={proxyData} layout="vertical" margin={{ left: 140 }}>
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
