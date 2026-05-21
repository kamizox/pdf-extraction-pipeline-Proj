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

const CLUSTER_COLORS = ['#16a34a', '#4ade80', '#f97316', '#ef4444'];

export default function ClusteringChart({ data }) {
  if (!data?.data_with_clusters?.length) {
    return (
      <div className="rounded-xl border border-green-200 bg-flood-card p-8 text-center text-green-800">
        Run K-Means Clustering analysis to view this chart.
      </div>
    );
  }

  const groups = [0, 1, 2, 3].map((cluster) => ({
    cluster,
    points: data.data_with_clusters
      .filter((d) => d.cluster === cluster)
      .map((d) => ({
        x: d.Rainfall_Actual_mm,
        y: d.Flooded_Area_sqkm,
        province: d.Province,
        district: d.District,
      })),
  }));

  return (
    <div className="relative rounded-xl border border-green-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-flood-text">
        K-Means Risk Zone Clustering (Dataset 5)
      </h3>
      {data.silhouette_score != null && (
        <span className="absolute right-6 top-6 rounded-full bg-flood-card px-3 py-1 text-sm font-semibold text-flood-text">
          Silhouette: {data.silhouette_score}
        </span>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#bbf7d0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Rainfall"
            unit=" mm"
            tick={{ fill: '#14532d' }}
            label={{ value: 'Rainfall (mm)', position: 'bottom', fill: '#14532d' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Flooded Area"
            unit=" sqkm"
            tick={{ fill: '#14532d' }}
            label={{ value: 'Flooded Area (sqkm)', angle: -90, position: 'insideLeft', fill: '#14532d' }}
          />
          <ZAxis range={[30, 30]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          {groups.map((g) => (
            <Scatter
              key={g.cluster}
              name={`Cluster ${g.cluster}`}
              data={g.points}
              fill={CLUSTER_COLORS[g.cluster]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
