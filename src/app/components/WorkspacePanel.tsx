import { AlertCircle, Brain, CheckCircle, Database, ExternalLink, Play, ShieldCheck } from 'lucide-react';
import type { CatalogItem } from './CatalogSection';

interface WorkspacePanelProps {
  grantedModels: CatalogItem[];
  grantedDatasets: CatalogItem[];
  selectedModel: CatalogItem | null;
  selectedDataset: CatalogItem | null;
  onSelectModel: (model: CatalogItem | null) => void;
  onSelectDataset: (dataset: CatalogItem | null) => void;
  onExecuteJob: () => void;
}

export function WorkspacePanel({
  grantedModels,
  grantedDatasets,
  selectedModel,
  selectedDataset,
  onSelectModel,
  onSelectDataset,
  onExecuteJob,
}: WorkspacePanelProps) {
  const canExecute = selectedModel !== null && selectedDataset !== null;
  const isFederated = selectedModel?.modelType === 'federated';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Selection summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Model</p>
          {selectedModel ? (
            <>
              <div className="flex items-start gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 rounded flex-shrink-0">
                  <Brain className="w-4 h-4 text-purple-700" />
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">{selectedModel.title}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    isFederated ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isFederated ? 'Federated' : 'Centralized'}
                </span>
                {isFederated ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <ShieldCheck className="w-3 h-3" />
                    Run in TEE
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                    No TEE
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400 italic">No model selected</p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Dataset</p>
          {selectedDataset ? (
            <>
              <div className="flex items-start gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 rounded flex-shrink-0">
                  <Database className="w-4 h-4 text-purple-700" />
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">{selectedDataset.title}</p>
              </div>
              {selectedDataset.anonymizationStatus === 'anonymized' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 border border-green-200 text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  Anonymized
                </span>
              ) : selectedDataset.anonymizationStatus === 'raw' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700">
                  <AlertCircle className="w-3 h-3" />
                  Raw data
                </span>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-slate-400 italic">No dataset selected</p>
          )}
        </div>
      </div>

      {/* Model selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Select Model</p>
        {grantedModels.length === 0 ? (
          <p className="text-sm text-slate-500">
            No models available.{' '}
            <span className="text-purple-700 font-medium">Request access in the Models catalog.</span>
          </p>
        ) : (
          <select
            value={selectedModel?.id ?? ''}
            onChange={(e) => {
              onSelectModel(grantedModels.find((m) => m.id === e.target.value) ?? null);
            }}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a model…</option>
            {grantedModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dataset selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Select Dataset</p>
        {grantedDatasets.length === 0 ? (
          <p className="text-sm text-slate-500">
            No datasets available.{' '}
            <span className="text-purple-700 font-medium">Request access in the Datasets catalog.</span>
          </p>
        ) : (
          <select
            value={selectedDataset?.id ?? ''}
            onChange={(e) => {
              onSelectDataset(grantedDatasets.find((d) => d.id === e.target.value) ?? null);
            }}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a dataset…</option>
            {grantedDatasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex justify-end">
        {isFederated ? (
          <button
            onClick={() => window.open('http://localhost:8080', '_blank')}
            disabled={!canExecute}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors text-sm ${
              canExecute
                ? 'bg-purple-700 text-white hover:bg-purple-800'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Launch FL Session
          </button>
        ) : (
          <button
            onClick={onExecuteJob}
            disabled={!canExecute}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors text-sm ${
              canExecute
                ? 'bg-purple-700 text-white hover:bg-purple-800'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4" />
            Execute Job
          </button>
        )}
      </div>
    </div>
  );
}
