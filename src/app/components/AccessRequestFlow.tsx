import { useState } from 'react';
import { ArrowLeft, CheckCircle, FileSignature, ShieldCheck, XCircle } from 'lucide-react';

interface AccessRequestFlowProps {
  modelName: string;
  onGranted: () => void;
  onBack: () => void;
}

type FlowStep = 'review' | 'enforcing' | 'decision';

const POLICY_CHECKS = [
  'Data usage policy compliance',
  'Consumer identity verification',
  'License compatibility',
];

export function AccessRequestFlow({ modelName, onGranted, onBack }: AccessRequestFlowProps) {
  const [step, setStep] = useState<FlowStep>('review');

  // ── Step 1: Review Agreement ─────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="mb-6">
          <p className="text-sm text-slate-500 mb-1">Step 1 of 3</p>
          <h1 className="text-2xl font-bold text-slate-900">Review Agreement</h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <FileSignature className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{modelName}</h2>
              <p className="text-sm text-slate-500 mt-0.5">Access Agreement</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-5">
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-700">Usage conditions</span>
              <span className="text-sm text-slate-500 text-right max-w-xs">
                Usage conditions defined by the provider
              </span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-700">Data scope</span>
              <span className="text-sm text-slate-500 text-right max-w-xs">
                As described in the asset catalog entry
              </span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-700">Permitted use</span>
              <span className="text-sm text-slate-500 text-right max-w-xs">
                Research and non-commercial purposes only
              </span>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="text-sm font-medium text-slate-700">Retention</span>
              <span className="text-sm text-slate-500 text-right max-w-xs">
                Data must not be stored beyond the agreed session
              </span>
            </div>
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
            onClick={() => setStep('enforcing')}
            className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
          >
            Accept and Sign
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: Policy Enforcement ───────────────────────────────────────────────
  if (step === 'enforcing') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-slate-500 mb-1">Step 2 of 3</p>
          <h1 className="text-2xl font-bold text-slate-900">Policy Enforcement</h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Verifying access conditions...</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Policy checks are running automatically in the background
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-5">
            {POLICY_CHECKS.map((check) => (
              <div
                key={check}
                className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-b-0"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">{check}</span>
                <span className="ml-auto text-xs text-green-600 font-medium">Passed</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setStep('decision')}
            className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
          >
            View Decision
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: Decision (default: Access Granted) ───────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-1">Step 3 of 3</p>
        <h1 className="text-2xl font-bold text-slate-900">Decision</h1>
      </div>

      {/* Access Granted */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Granted</h2>
        <p className="text-slate-600">
          Your request was reviewed and all policy conditions were met.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
        <p className="text-sm text-green-800">
          You now have access to <span className="font-semibold">{modelName}</span>. Open the Model Workspace to start working with this asset.
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Back to Catalog
        </button>
        <button
          onClick={onGranted}
          className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
        >
          Open Workspace
        </button>
      </div>

      {/* Access Denied variant — shown below for reference in the UI */}
      <details className="mt-10 border-t border-slate-100 pt-6">
        <summary className="text-xs text-slate-400 cursor-pointer select-none">
          Show denied variant (demo only)
        </summary>
        <div className="mt-4 text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">
            Your request did not meet the required policy conditions.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-4">
          <p className="text-sm text-red-800">
            Your request did not meet the required policy conditions. Please review the agreement terms and contact the data provider for more information.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </details>
    </div>
  );
}
