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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-green-200 bg-flood-card p-2 text-flood-text">
              Actual \ Pred
            </th>
            {labels.map((l) => (
              <th key={l} className="border border-green-200 bg-flood-card p-2">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <th className="border border-green-200 bg-flood-card p-2">{labels[i]}</th>
              {row.map((val, j) => {
                const intensity = Math.round((val / maxVal) * 180);
                return (
                  <td
                    key={j}
                    className="border border-green-200 p-2 text-center font-medium text-flood-text"
                    style={{ backgroundColor: `rgb(22, 163, 74, ${0.15 + intensity / 255})` }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function XGBoostResults({ data }) {
  if (!data?.accuracy && data?.accuracy !== 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run XGBoost Classification analysis to view results.
      </div>
    );
  }

  const fiData = (data.feature_importance || []).map((f) => ({
    name: f.feature,
    importance: f.importance,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-flood-text">
        XGBoost Classification — Fatality Risk (Dataset 2)
      </h3>

      <div className="grid grid-cols-2 gap-4 max-w-md">
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

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Feature Importance</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={fiData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
            <XAxis type="number" tick={{ fill: '#14532d' }} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#14532d', fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="importance" fill="#16a34a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-3 font-semibold text-flood-text">Confusion Matrix</h4>
        <ConfusionTable matrix={data.confusion_matrix} labels={data.class_labels} />
      </div>
    </div>
  );
}
