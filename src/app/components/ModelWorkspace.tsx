import { ArrowLeft, Brain, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export interface WorkspaceConfig {
  assetName: string;
  modelType: 'centralized' | 'federated';
  domain: 'healthcare' | 'agriculture';
}

interface ModelWorkspaceProps extends WorkspaceConfig {
  onBack: () => void;
  backLabel?: string;
}

const centralizedData = [
  { epoch: 1,  loss: 1.20, accuracy: 45 },
  { epoch: 2,  loss: 1.02, accuracy: 53 },
  { epoch: 3,  loss: 0.87, accuracy: 60 },
  { epoch: 4,  loss: 0.74, accuracy: 66 },
  { epoch: 5,  loss: 0.63, accuracy: 71 },
  { epoch: 6,  loss: 0.52, accuracy: 75 },
  { epoch: 7,  loss: 0.43, accuracy: 79 },
  { epoch: 8,  loss: 0.35, accuracy: 83 },
  { epoch: 9,  loss: 0.29, accuracy: 85 },
  { epoch: 10, loss: 0.24, accuracy: 87 },
];

const federatedData = [
  { round: 1,  accuracy: 50 },
  { round: 2,  accuracy: 57 },
  { round: 3,  accuracy: 63 },
  { round: 4,  accuracy: 68 },
  { round: 5,  accuracy: 73 },
  { round: 6,  accuracy: 78 },
  { round: 7,  accuracy: 83 },
  { round: 8,  accuracy: 87 },
  { round: 9,  accuracy: 89 },
  { round: 10, accuracy: 91 },
];

export function ModelWorkspace({ assetName, modelType, domain, onBack, backLabel = 'Back to Catalog' }: ModelWorkspaceProps) {
  const isFederated = modelType === 'federated';

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-purple-100 rounded-lg">
          <Brain className="w-5 h-5 text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Model Workspace</h1>
          <p className="text-sm text-slate-500 mt-0.5">{assetName}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-3">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Training & Monitoring</h2>
        <p className="text-slate-600 text-sm mb-6">
          {isFederated
            ? 'Federated learning run for this model'
            : 'Centralized training run for this model'}
        </p>

        {/* Status row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">
              {isFederated ? 'Connected Nodes' : 'Status'}
            </div>
            <div className="text-lg font-semibold text-slate-400">—</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">
              {isFederated ? 'Round' : 'Progress'}
            </div>
            <div className="text-lg font-semibold text-slate-400">—</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">
              {isFederated ? 'Aggregation Status' : 'Metrics'}
            </div>
            <div className="text-lg font-semibold text-slate-400">—</div>
          </div>
        </div>

        {/* Secure Aggregation badge — federated only */}
        {isFederated && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800 mb-1">
                Secure Aggregation: TEE-protected
              </p>
              <p className="text-xs text-green-700 leading-relaxed">
                Model updates from each node are aggregated inside a TEE enclave — individual
                node contributions are never exposed in plaintext to the coordinating server.
              </p>
            </div>
          </div>
        )}

        {/* Trend chart */}
        {isFederated ? (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Aggregated Accuracy per Round
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={federatedData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <XAxis
                  dataKey="round"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'Round', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[45, 100]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e8f0' }}
                  formatter={(v: number) => [`${v}%`, 'Accuracy']}
                  labelFormatter={(l: number) => `Round ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#7c3aed' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                Loss per Epoch
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={centralizedData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="epoch"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: 'Epoch', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 1.4]}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e8f0' }}
                    formatter={(v: number) => [v.toFixed(2), 'Loss']}
                    labelFormatter={(l: number) => `Epoch ${l}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="loss"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#94a3b8' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                Accuracy per Epoch
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={centralizedData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <XAxis
                    dataKey="epoch"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: 'Epoch', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[40, 100]}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e8f0' }}
                    formatter={(v: number) => [`${v}%`, 'Accuracy']}
                    labelFormatter={(l: number) => `Epoch ${l}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#7c3aed' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        {isFederated
          ? `Connected via Federated Learning Connector · ${domain === 'healthcare' ? 'ZEN/Zentrix' : 'AgriFL'} infrastructure`
          : 'Connected via Training Connector · awaiting job submission'}
      </p>
    </div>
  );
}
