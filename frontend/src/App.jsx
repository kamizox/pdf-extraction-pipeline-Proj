import { useState } from 'react';
import UploadPage from './pages/UploadPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [uploadedDatasets, setUploadedDatasets] = useState(null);

  return uploadedDatasets ? (
    <Dashboard uploadedDatasets={uploadedDatasets} />
  ) : (
    <UploadPage onComplete={(datasets) => setUploadedDatasets(datasets)} />
  );
}
