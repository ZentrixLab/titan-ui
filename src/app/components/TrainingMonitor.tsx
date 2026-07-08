import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Code2, Download, ShieldCheck } from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CatalogItem } from './CatalogSection';

interface TrainingMonitorProps {
  model: CatalogItem;
  dataset: CatalogItem;
  onBack: () => void;
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

const TOTAL_STEPS = 10;
const STEP_MS = 800;

export function TrainingMonitor({ model, dataset, onBack }: TrainingMonitorProps) {
  const [step, setStep] = useState(0);
  const isFederated = model.modelType === 'federated';

  useEffect(() => {
    if (step >= TOTAL_STEPS) return;
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step]);

  const isDone = step >= TOTAL_STEPS;
  const progress = (step / TOTAL_STEPS) * 100;

  const visibleCentralized = centralizedData.slice(0, step);
  const visibleFederated = federatedData.slice(0, step);

  const finalAccuracy = isFederated
    ? federatedData[TOTAL_STEPS - 1].accuracy
    : centralizedData[TOTAL_STEPS - 1].accuracy;
  const finalLoss = centralizedData[TOTAL_STEPS - 1].loss;

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Summary bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Model:</span>
            <span className="text-xs font-semibold text-slate-900">{model.title}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                isFederated ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isFederated ? 'Federated' : 'Centralized'}
            </span>
            {isFederated && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <ShieldCheck className="w-3 h-3" />
                TEE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Dataset:</span>
            <span className="text-xs font-semibold text-slate-900">{dataset.title}</span>
            {dataset.anonymizationStatus === 'anonymized' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 border border-green-200 text-green-700">
                <CheckCircle className="w-3 h-3" />
                Anonymized
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap ml-4 mt-0.5 flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Setup
        </button>
      </div>

      {/* ── Training progress card ───────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Training &amp; Monitoring</h2>
          <span className="text-xs text-slate-500">
            {isDone
              ? 'Complete'
              : `${isFederated ? 'Round' : 'Epoch'} ${step} / ${TOTAL_STEPS}`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isFederated ? (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Aggregated Accuracy per Round
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={visibleFederated}
                margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
              >
                <XAxis
                  dataKey="round"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
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
                  isAnimationActive={false}
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
                <LineChart
                  data={visibleCentralized}
                  margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
                >
                  <XAxis
                    dataKey="epoch"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
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
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                Accuracy per Epoch
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={visibleCentralized}
                  margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
                >
                  <XAxis
                    dataKey="epoch"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
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
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ── Results panel ───────────────────────────────────────────────────── */}
      {isDone && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Results</h3>

          <div className={`grid gap-4 mb-6 ${isFederated ? 'grid-cols-1 max-w-xs' : 'grid-cols-2'}`}>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Final Accuracy</p>
              <p className="text-2xl font-bold text-purple-700">{finalAccuracy}%</p>
            </div>
            {!isFederated && (
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Final Loss</p>
                <p className="text-2xl font-bold text-slate-700">{finalLoss}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => alert('Model download will be available here (format TBD)')}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Model
            </button>
            <button
              onClick={() => alert('API endpoint will be configured here')}
              className="flex items-center gap-2 px-5 py-2.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
            >
              <Code2 className="w-4 h-4" />
              Use via API
            </button>
          </div>

          <p className="text-xs text-slate-400">Access conditions apply per your Agreement</p>
        </div>
      )}
    </div>
  );
}
