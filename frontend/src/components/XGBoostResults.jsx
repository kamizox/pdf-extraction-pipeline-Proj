import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CORE_DRIVERS = new Set(['Persons_Affected', 'Rainfall_Actual_mm']);

function ConfusionTable({ matrix, labels }) {
  if (!matrix?.length) return null;
  const maxVal = Math.max(...matrix.flat(), 1);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-green-200 bg-flood-card p-2 text-flood-text">
              Actual \ Predicted
            </th>
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
              <th className="border border-green-200 bg-flood-card p-2 text-xs">
                {labels[i]}
              </th>
              {row.map((val, j) => {
                const intensity = Math.round((val / maxVal) * 180);
                return (
                  <td
                    key={j}
                    className="border border-green-200 p-2 text-center font-medium text-flood-text"
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
    </div>
  );
}

function FeatureBar({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm shadow">
      <p className="font-semibold text-flood-text">{row.name}</p>
      <p className="text-green-700">Importance: {row.importance.toFixed(4)}</p>
      {CORE_DRIVERS.has(row.name) && (
        <p className="text-xs font-medium text-[#15803d]">Core driver (rainfall / population)</p>
      )}
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
    isCore: CORE_DRIVERS.has(f.feature) || f.is_core_driver,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-flood-text">
        Multilevel Fatality Tier Classification (Dataset 2)
      </h3>
      <p className="text-sm text-green-700">
        Emergency incidents classified by rainfall and population exposure into human
        fatality tiers.
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

      <div className="rounded-xl border border-green-200 bg-white p-4">
        <h4 className="mb-1 font-semibold text-flood-text">Feature Importance</h4>
        <p className="mb-3 text-xs text-[#15803d]">
          Dark green bars: core drivers —{' '}
          <span className="font-semibold">Persons_Affected</span> and{' '}
          <span className="font-semibold">Rainfall_Actual_mm</span>
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fiData} layout="vertical" margin={{ left: 130, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
            <XAxis type="number" tick={{ fill: '#14532d' }} />
            <YAxis
              type="category"
              dataKey="name"
              width={125}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  textAnchor="end"
                  fill={CORE_DRIVERS.has(payload.value) ? '#14532d' : '#166534'}
                  fontSize={CORE_DRIVERS.has(payload.value) ? 12 : 11}
                  fontWeight={CORE_DRIVERS.has(payload.value) ? 700 : 400}
                >
                  {payload.value}
                </text>
              )}
            />
            <Tooltip content={<FeatureBar />} />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {fiData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.isCore ? '#15803d' : '#86efac'}
                  stroke={entry.isCore ? '#14532d' : 'none'}
                  strokeWidth={entry.isCore ? 1.5 : 0}
                />
              ))}
            </Bar>
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
