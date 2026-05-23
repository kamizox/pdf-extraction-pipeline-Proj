import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';

const CLUSTER_COLORS = ['#16a34a', '#f97316', '#ef4444'];
const CLUSTER_IDS = [0, 1, 2];

const defaultLabels = {
  0: 'Low Risk Zone',
  1: 'Medium Risk Zone',
  2: 'High Risk Zone',
};

export default function ClusteringChart({ data }) {
  if (!data?.data_with_clusters?.length) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run K-Means Clustering analysis to view this chart.
      </div>
    );
  }

  const labelMap = data.cluster_labels || defaultLabels;

  const groups = CLUSTER_IDS.map((cluster) => ({
    cluster,
    name: labelMap[cluster] ?? defaultLabels[cluster],
    points: data.data_with_clusters
      .filter((d) => d.cluster === cluster)
      .map((d) => ({
        x: d.Rainfall_Actual_mm,
        y: d.Flooded_Area_sqkm,
        province: d.Province,
        district: d.District,
        zone: d.cluster_label || labelMap[cluster],
      })),
  }));

  return (
    <div className="relative rounded-xl border border-green-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-bold text-flood-text">
        Unsupervised Regional Risk Clustering (Dataset 5)
      </h3>
      <p className="mb-4 text-sm text-green-700">
        K-Means (k=3): district records grouped into automated low, medium, and high risk zones.
      </p>
      {data.silhouette_score != null && (
        <span className="absolute right-6 top-6 rounded-full bg-flood-card px-3 py-1 text-sm font-semibold text-flood-text">
          Silhouette: {data.silhouette_score}
        </span>
      )}
      <ResponsiveContainer width="100%" height={480}>
        <ScatterChart
          margin={{ top: 16, right: 24, left: 20, bottom: 88 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Rainfall"
            unit=" mm"
            tick={{ fill: '#14532d', fontSize: 11 }}
            label={{
              value: 'Rainfall (mm)',
              position: 'insideBottom',
              offset: -4,
              fill: '#14532d',
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Flooded Area"
            unit=" sqkm"
            tick={{ fill: '#14532d', fontSize: 11 }}
            label={{
              value: 'Flooded Area (sqkm)',
              angle: -90,
              position: 'insideLeft',
              fill: '#14532d',
            }}
          />
          <ZAxis range={[28, 28]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => [value, name]}
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload;
              return p
                ? `${p.district}, ${p.province} — ${p.zone}`
                : '';
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            iconType="circle"
            wrapperStyle={{ paddingTop: 20, bottom: 0 }}
          />
          {groups.map((g) => (
            <Scatter
              key={g.cluster}
              name={g.name}
              data={g.points}
              fill={CLUSTER_COLORS[g.cluster]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
