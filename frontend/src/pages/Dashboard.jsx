import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AlgorithmSelector from '../components/AlgorithmSelector';
import SummaryCards from '../components/SummaryCards';
import TimeSeriesChart from '../components/TimeSeriesChart';
import ClusteringChart from '../components/ClusteringChart';
import XGBoostResults from '../components/XGBoostResults';
import NLPSentimentChart from '../components/NLPSentimentChart';
import CNNDamageChart from '../components/CNNDamageChart';
import PlotlyViewer from '../components/PlotlyViewer';

const API = 'http://localhost:8000';
const TABS = [
  { id: 'timeseries', label: 'ARIMA' },
  { id: 'xgboost', label: 'XGBoost' },
  { id: 'nlp', label: 'NLP' },
  { id: 'cnn', label: 'CNN' },
  { id: 'clustering', label: 'KMeans' },
  { id: 'plotly', label: 'Plotly' },
];

function pickTabData(results, tab) {
  if (!results) return null;
  if (results.error) return null;
  const nested = ['timeseries', 'xgboost', 'nlp', 'cnn', 'clustering'];
  if (results.timeseries && nested.includes(tab)) {
    return results[tab] ?? null;
  }
  if (tab === 'plotly') {
    return results.timeseries ?? (results.historical ? results : null);
  }
  if (results.historical && tab === 'timeseries') return results;
  if (results.accuracy != null && results.feature_importance && tab === 'xgboost') return results;
  if (results.sentiment_distribution && tab === 'nlp') return results;
  if (results.feature_importance_proxy && tab === 'cnn') return results;
  if (results.data_with_clusters && tab === 'clustering') return results;
  return null;
}

export default function Dashboard({ uploadedDatasets }) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('auto');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timeseries');
  const [error, setError] = useState(null);
  const [datasetMeta, setDatasetMeta] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/dataset/info`)
      .then((res) => setDatasetMeta(res.data))
      .catch(() => {});
  }, []);

  const totalRecords = useMemo(() => {
    if (!datasetMeta?.datasets) return 2288;
    return datasetMeta.datasets.reduce((sum, d) => sum + (d.rows || 0), 0);
  }, [datasetMeta]);

  const provinceCount = 6;

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API}/api/analyze/${selectedAlgorithm}`);
      if (res.data?.error) {
        setError(res.data.error);
        return;
      }
      setResults(res.data);
      const tabMap = {
        auto: 'timeseries',
        timeseries: 'timeseries',
        xgboost: 'xgboost',
        nlp: 'nlp',
        cnn: 'cnn',
        clustering: 'clustering',
      };
      setActiveTab(tabMap[selectedAlgorithm] || 'timeseries');
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, [selectedAlgorithm]);

  const tabData = useMemo(
    () => ({
      timeseries: pickTabData(results, 'timeseries'),
      xgboost: pickTabData(results, 'xgboost'),
      nlp: pickTabData(results, 'nlp'),
      cnn: pickTabData(results, 'cnn'),
      clustering: pickTabData(results, 'clustering'),
      plotly: pickTabData(results, 'plotly'),
    }),
    [results]
  );

  const hasTabData = (tabId) => {
    if (tabId === 'plotly') return !!tabData.plotly;
    return !!tabData[tabId];
  };

  const autoRecommendation =
    results?.recommended_algorithm && (
      <div className="mt-4 rounded-lg border border-green-300 bg-white p-3 text-sm text-flood-text">
        <strong>Recommended:</strong> {results.recommended_algorithm}
        <br />
        <span className="text-green-800">{results.reason}</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-flood-bg text-flood-text">
      <header className="border-b border-green-200 bg-flood-card px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-flood-text">
          Pakistan Flood ML Analytics Dashboard
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full border-b border-green-200 bg-flood-card p-6 lg:w-80 lg:border-b-0 lg:border-r">
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
            onRun={runAnalysis}
            loading={loading}
          />
          {autoRecommendation}
        </aside>

        <main className="flex-1 p-6">
          {uploadedDatasets && (
            <div className="mb-4 flex flex-wrap gap-3">
              {['dataset1', 'dataset2', 'dataset3', 'dataset4', 'dataset5'].map(
                (key, i) => (
                  <span
                    key={key}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      uploadedDatasets[key]?.status === 'success'
                        ? 'bg-[#dcfce7] text-[#16a34a]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    DS{i + 1}{' '}
                    {uploadedDatasets[key]?.status === 'success' ? '✓' : '✗'}
                  </span>
                )
              )}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full border border-[#16a34a] bg-[#f0fdf4] px-3 py-1 text-xs text-[#16a34a] hover:bg-[#dcfce7]"
              >
                ↩ Re-upload
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-start justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">
              <span className="text-sm">{typeof error === 'string' ? error : JSON.stringify(error)}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-4 text-red-600 hover:text-red-900"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          <SummaryCards totalRecords={totalRecords} provinceCount={provinceCount} />

          <div className="mt-6 flex flex-wrap gap-2 border-b border-green-200 pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                disabled={!hasTabData(tab.id) && !loading}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-flood-primary text-white'
                    : 'bg-white text-flood-text hover:bg-green-100'
                } ${!hasTabData(tab.id) ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'timeseries' && <TimeSeriesChart data={tabData.timeseries} />}
            {activeTab === 'xgboost' && <XGBoostResults data={tabData.xgboost} />}
            {activeTab === 'nlp' && <NLPSentimentChart data={tabData.nlp} />}
            {activeTab === 'cnn' && <CNNDamageChart data={tabData.cnn} />}
            {activeTab === 'clustering' && <ClusteringChart data={tabData.clustering} />}
            {activeTab === 'plotly' && <PlotlyViewer data={tabData.plotly} />}
          </div>
        </main>
      </div>
    </div>
  );
}
