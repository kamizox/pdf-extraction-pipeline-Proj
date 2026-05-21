import { useState } from 'react';
import axios from 'axios';

const DATASET_CONFIG = [
  {
    key: 'dataset1',
    label: 'Dataset 1',
    title: 'ARIMA Time Series',
    description:
      'Yearly aggregated flood data (21 rows). Columns: Year, Total_Deaths, Persons_Affected, Avg_Rainfall_mm ...',
    apiEndpoint: 'dataset1',
    expectedColumns: ['Year', 'Total_Deaths', 'Persons_Affected', 'Avg_Rainfall_mm'],
  },
  {
    key: 'dataset2',
    label: 'Dataset 2',
    title: 'XGBoost Classification',
    description:
      'District-level records (2267 rows). Columns: Fatality_Category, Rainfall_Actual_mm, Flooded_Area_sqkm ...',
    apiEndpoint: 'dataset2',
    expectedColumns: ['Fatality_Category', 'Rainfall_Actual_mm', 'Flooded_Area_sqkm'],
  },
  {
    key: 'dataset3',
    label: 'Dataset 3',
    title: 'NLP Sentiment Analysis',
    description:
      'Incident text reports (2267 rows). Columns: Sentiment, Combined_Text, Cause_of_Death ...',
    apiEndpoint: 'dataset3',
    expectedColumns: ['Sentiment', 'Combined_Text', 'Province'],
  },
  {
    key: 'dataset4',
    label: 'Dataset 4',
    title: 'Neural Network / CNN',
    description:
      'Damage prediction data (2267 rows). Columns: Damage_Level, *_normalized features ...',
    apiEndpoint: 'dataset4',
    expectedColumns: ['Damage_Level', 'Damage_Label'],
  },
  {
    key: 'dataset5',
    label: 'Dataset 5',
    title: 'K-Means Clustering',
    description:
      'Risk zone clustering data (2267 rows). Columns: Flooded_Area_sqkm, Total_Deaths_Cum, Rainfall_Actual_mm ...',
    apiEndpoint: 'dataset5',
    expectedColumns: ['Flooded_Area_sqkm', 'Total_Deaths_Cum', 'Rainfall_Actual_mm'],
  },
];

export default function UploadPage({ onComplete }) {
  const [uploads, setUploads] = useState({});
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  const handleFileSelect = async (key, apiEndpoint, file) => {
    if (!file) return;
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setErrors((prev) => ({ ...prev, [key]: 'Only CSV or Excel files allowed' }));
      return;
    }

    setUploading((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: null }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_key', apiEndpoint);

    try {
      const res = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploads((prev) => ({
        ...prev,
        [key]: {
          filename: res.data.filename,
          rows: res.data.rows,
          columns: res.data.columns,
          status: 'success',
        },
      }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [key]: err.response?.data?.detail || 'Upload failed',
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const uploadedCount = Object.keys(uploads).filter(
    (k) => uploads[k]?.status === 'success'
  ).length;
  const allDone = uploadedCount === 5;

  return (
    <div className="min-h-screen bg-[#f0fdf4] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#14532d]">
          Pakistan Flood ML Analytics Dashboard
        </h1>
        <p className="mt-2 text-lg text-[#16a34a]">Upload your 5 datasets to begin analysis</p>
      </div>

      <div className="mx-auto mb-8 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DATASET_CONFIG.map((ds) => {
          const uploaded = uploads[ds.key];
          const isUploading = uploading[ds.key];
          const error = errors[ds.key];

          return (
            <div
              key={ds.key}
              className={`rounded-2xl border-2 bg-white p-6 shadow transition-all ${
                uploaded ? 'border-[#16a34a]' : 'border-[#bbf7d0]'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-xs font-bold text-[#16a34a]">
                  {ds.label}
                </span>
                {uploaded && <span className="text-lg text-green-600">✓</span>}
              </div>

              <h3 className="mb-1 text-lg font-bold text-[#14532d]">{ds.title}</h3>
              <p className="mb-4 text-xs text-gray-500">{ds.description}</p>

              <div className="mb-4 text-xs text-gray-400">
                Key columns:{' '}
                <span className="font-mono">{ds.expectedColumns.join(', ')}</span>
              </div>

              {uploaded && (
                <div className="mb-3 rounded-lg bg-[#f0fdf4] p-3 text-sm">
                  <p className="font-semibold text-[#16a34a]">✓ {uploaded.filename}</p>
                  <p className="text-gray-500">
                    {uploaded.rows} rows · {uploaded.columns} columns
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-3 rounded bg-red-50 p-2 text-xs text-red-600">{error}</div>
              )}

              <label
                className={`block w-full cursor-pointer rounded-xl px-4 py-2 text-center text-sm font-semibold transition-colors ${
                  isUploading
                    ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                    : uploaded
                      ? 'bg-[#dcfce7] text-[#16a34a] hover:bg-[#bbf7d0]'
                      : 'bg-[#16a34a] text-white hover:bg-[#15803d]'
                }`}
              >
                {isUploading ? 'Uploading...' : uploaded ? 'Re-upload' : 'Choose File'}
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) =>
                    handleFileSelect(ds.key, ds.apiEndpoint, e.target.files[0])
                  }
                />
              </label>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mb-8 max-w-6xl">
        <div className="mb-2 flex justify-between text-sm text-[#16a34a]">
          <span>Upload Progress</span>
          <span>{uploadedCount} / 5 datasets uploaded</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#dcfce7]">
          <div
            className="h-full rounded-full bg-[#16a34a] transition-all duration-500"
            style={{ width: `${(uploadedCount / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => allDone && onComplete(uploads)}
          disabled={!allDone}
          className={`rounded-2xl px-12 py-4 text-lg font-bold shadow-lg transition-all ${
            allDone
              ? 'cursor-pointer bg-[#16a34a] text-white hover:bg-[#15803d] hover:shadow-xl'
              : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
        >
          {allDone
            ? '🚀 Go to Dashboard'
            : `Upload ${5 - uploadedCount} more dataset(s) to continue`}
        </button>
      </div>
    </div>
  );
}
