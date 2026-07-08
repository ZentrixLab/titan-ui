import { useState } from 'react';
import { ArrowLeft, Brain, Database, Play, ShieldCheck } from 'lucide-react';
import type { CatalogItem } from './CatalogSection';

interface ExecuteJobPanelProps {
  model: CatalogItem;
  grantedDatasets: CatalogItem[];
  onStartJob: () => void;
  onBack: () => void;
}

export function ExecuteJobPanel({ model, grantedDatasets, onStartJob, onBack }: ExecuteJobPanelProps) {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(
    grantedDatasets.length === 1 ? grantedDatasets[0].id : ''
  );

  const isFederated = model.modelType === 'federated';
  const canStart = selectedDatasetId !== '';

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-purple-100 rounded-lg">
          <Play className="w-5 h-5 text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Execute Job</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure and start a training job</p>
        </div>
      </div>

      {/* Selected model */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">Selected Model</p>
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-purple-100 rounded-lg flex-shrink-0">
            <Brain className="w-5 h-5 text-purple-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{model.title}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isFederated ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {isFederated ? 'Federated' : 'Centralized'}
              </span>
              {isFederated ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ShieldCheck className="w-3 h-3" />
                  Run in TEE
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                  No TEE
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dataset selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">Select Dataset</p>
        <div className="space-y-2">
          {grantedDatasets.map((ds) => (
            <label
              key={ds.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedDatasetId === ds.id
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="dataset"
                value={ds.id}
                checked={selectedDatasetId === ds.id}
                onChange={() => setSelectedDatasetId(ds.id)}
                className="accent-purple-700"
              />
              <Database className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">{ds.title}</p>
                {ds.tags.length > 0 && (
                  <p className="text-xs text-slate-500 mt-0.5">{ds.tags.join(', ')}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onStartJob}
          disabled={!canStart}
          className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start Job
        </button>
      </div>
    </div>
  );
}
