const DESCRIPTIONS = {
  auto: 'Runs all 5 ML models on their dedicated datasets and recommends the best approach.',
  timeseries: 'Dataset 1 — Yearly flood metrics (21 records). ARIMA(2,1,2) forecasts deaths for the next 5 years.',
  xgboost: 'Dataset 2 — District-level records (2267). Multi-class fatality risk classification.',
  nlp: 'Dataset 3 — Incident reports (2267). Pre-labeled sentiment and text word frequency.',
  cnn: 'Dataset 4 — Damage records (2267). MLP neural net on 12 normalized features.',
  clustering: 'Dataset 5 — Risk zone records (2267). K-Means with 4 clusters on rainfall and impact metrics.',
};

const OPTIONS = [
  { value: 'auto', label: 'Auto-Detect (Run All)' },
  { value: 'timeseries', label: 'ARIMA Time Series (Dataset 1)' },
  { value: 'xgboost', label: 'XGBoost Classification (Dataset 2)' },
  { value: 'nlp', label: 'NLP Sentiment Analysis (Dataset 3)' },
  { value: 'cnn', label: 'Neural Network / CNN (Dataset 4)' },
  { value: 'clustering', label: 'K-Means Clustering (Dataset 5)' },
];

export default function AlgorithmSelector({
  selectedAlgorithm,
  onAlgorithmChange,
  onRun,
  loading,
}) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-flood-text">Algorithm</label>
      <select
        value={selectedAlgorithm}
        onChange={(e) => onAlgorithmChange(e.target.value)}
        className="w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-flood-text shadow-sm focus:border-flood-primary focus:outline-none focus:ring-2 focus:ring-green-200"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <p className="text-xs leading-relaxed text-green-800/80">
        {DESCRIPTIONS[selectedAlgorithm]}
      </p>

      <button
        type="button"
        onClick={onRun}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-flood-primary px-4 py-3 font-semibold text-white transition hover:bg-flood-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Running Analysis...
          </>
        ) : (
          'Run Analysis'
        )}
      </button>
    </div>
  );
}
