import { useState } from 'react';
import { ArrowLeft, Upload, Shield, Brain, Database, CheckCircle, FileSignature, Lock, FolderOpen, Search, File, FileText, FileArchive } from 'lucide-react';
import { type WorkspaceConfig } from './ModelWorkspace';

interface NewAssetFormProps {
  onBack: () => void;
  onOpenWorkspace?: (config: WorkspaceConfig) => void;
}

type AssetType = 'service' | 'model' | 'dataset';
type Step = 'form' | 'registered' | 'agreement' | 'result';

export function NewAssetForm({ onBack, onOpenWorkspace }: NewAssetFormProps) {
  const [assetType, setAssetType] = useState<AssetType>('service');
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [modelType, setModelType] = useState<'centralized' | 'federated' | ''>('');
  const [runInTee, setRunInTee] = useState(false);
  const [fileTab, setFileTab] = useState<'upload' | 'existing'>('upload');
  const [selectedExistingFile, setSelectedExistingFile] = useState<string | null>(null);
  const [fileSearch, setFileSearch] = useState('');

  const existingFiles = [
    { id: '1', name: 'patient_records_2024.csv', size: '2.4 MB', type: 'csv', modified: '2024-11-10' },
    { id: '2', name: 'crop_sensor_data_v2.zip', size: '15.8 MB', type: 'zip', modified: '2024-10-28' },
    { id: '3', name: 'climate_observations_q3.json', size: '8.1 MB', type: 'json', modified: '2024-11-01' },
    { id: '4', name: 'model_weights_resnet50.h5', size: '94.3 MB', type: 'h5', modified: '2024-09-15' },
    { id: '5', name: 'anonymized_survey_results.csv', size: '512 KB', type: 'csv', modified: '2024-11-08' },
    { id: '6', name: 'satellite_imagery_batch.tar.gz', size: '230.7 MB', type: 'tar.gz', modified: '2024-10-05' },
    { id: '7', name: 'nlp_training_corpus.zip', size: '1.2 GB', type: 'zip', modified: '2024-08-22' },
  ];

  const filteredFiles = existingFiles.filter(f =>
    f.name.toLowerCase().includes(fileSearch.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type === 'csv' || type === 'json') return <FileText className="w-4 h-4 text-slate-500" />;
    if (type === 'zip' || type === 'tar.gz') return <FileArchive className="w-4 h-4 text-slate-500" />;
    return <File className="w-4 h-4 text-slate-500" />;
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    documentation: '',
    repository: '',
    license: '',
    version: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting asset:', { assetType, modelType, runInTee, ...formData });
    setCurrentStep('registered');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ── REGISTERED SCREEN ────────────────────────────────────────────────────────
  if (currentStep === 'registered') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Asset Registered Successfully</h1>
          <p className="text-slate-600">Your asset has been added to the TITAN Data Space catalog</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              {assetType === 'service' && <Shield className="w-6 h-6 text-purple-700" />}
              {assetType === 'model' && <Brain className="w-6 h-6 text-purple-700" />}
              {assetType === 'dataset' && <Database className="w-6 h-6 text-purple-700" />}
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-600 mb-1 capitalize">{assetType}</div>
              <h2 className="text-xl font-semibold text-slate-900">{formData.title}</h2>
              <p className="text-slate-600 mt-2">{formData.description}</p>
              <div className="flex gap-4 mt-3 text-sm text-slate-600">
                <span>Version {formData.version}</span>
                <span>•</span>
                <span>{formData.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <FileSignature className="w-6 h-6 text-purple-700 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Next Step: Configure Agreement</h3>
              <p className="text-slate-700 mb-4">
                Define Policies and Contract Definitions for a registered asset
              </p>
              <button
                onClick={() => setCurrentStep('agreement')}
                className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
              >
                Open Agreement Manager
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Back to Catalog
          </button>
          <button
            onClick={() => setCurrentStep('form')}
            className="px-6 py-2.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Register Another Asset
          </button>
        </div>
      </div>
    );
  }

  // ── AGREEMENT SCREEN ─────────────────────────────────────────────────────────
  if (currentStep === 'agreement') {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentStep('registered')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Agreement Manager</h1>
          <p className="text-slate-600 mt-2">Define policies and contract terms for this asset</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <FileSignature className="w-6 h-6 text-purple-700 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract Terms</h2>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2.5 border-b border-purple-100">
                  <span className="text-sm font-medium text-slate-700">Allowed consumers</span>
                  <span className="text-sm text-slate-400">—</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-purple-100">
                  <span className="text-sm font-medium text-slate-700">Usage duration</span>
                  <span className="text-sm text-slate-400">—</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm font-medium text-slate-700">Compute constraint</span>
                  <span className="text-sm text-slate-400">—</span>
                </div>
              </div>
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
            onClick={() => setCurrentStep('result')}
            className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
          >
            Finalize Agreement
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ────────────────────────────────────────────────────────────
  if (currentStep === 'result') {
    if (assetType === 'model') {
      // Federated + Healthcare
      if (modelType === 'federated' && formData.category === 'healthcare') {
        return (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Agreement Finalized</h1>
              <p className="text-slate-600">Your federated learning asset is ready for deployment</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-purple-700 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Federated Learning — Healthcare</h2>
                  <p className="text-slate-700 mb-4">
                    This asset is configured for federated learning in the healthcare domain. A dedicated FL interface (ZEN/Zentrix) is available for managing distributed training across healthcare institutions while preserving data privacy.
                  </p>
                  <button
                    className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
                  >
                    Continue to Healthcare FL Dashboard
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onBack}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back to Catalog
              </button>
              <button
                onClick={() => setCurrentStep('form')}
                className="px-6 py-2.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Register Another Asset
              </button>
            </div>
          </div>
        );
      }

      // Centralized OR Federated + Agriculture: "Your asset is ready" + Open Model Workspace
      const isFederated = modelType === 'federated';
      return (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Agreement Finalized</h1>
            <p className="text-slate-600">Your model has been registered successfully</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <Brain className="w-6 h-6 text-purple-700 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Your asset is ready</h2>
                <p className="text-slate-700 mb-4">
                  Your model has been registered and the agreement has been finalized. Open the Model Workspace to start training and monitor progress.
                </p>
                <button
                  onClick={() => onOpenWorkspace?.({
                    assetName: formData.title,
                    modelType: modelType as 'centralized' | 'federated',
                    domain: formData.category as 'healthcare' | 'agriculture',
                  })}
                  className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
                >
                  Open Model Workspace
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {!isFederated && (
              <button className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                Download model
              </button>
            )}
            <button
              onClick={onBack}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to Catalog
            </button>
            <button
              onClick={() => setCurrentStep('form')}
              className="px-6 py-2.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Register Another Asset
            </button>
          </div>
        </div>
      );
    }

    // Service or Dataset result
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Asset Registered Successfully</h1>
          <p className="text-slate-600">Your asset has been added to the TITAN Data Space catalog and the agreement has been finalized</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              {assetType === 'service' && <Shield className="w-6 h-6 text-purple-700" />}
              {assetType === 'dataset' && <Database className="w-6 h-6 text-purple-700" />}
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-600 mb-1 capitalize">{assetType}</div>
              <h2 className="text-xl font-semibold text-slate-900">{formData.title}</h2>
              <p className="text-slate-600 mt-2">{formData.description}</p>
              <div className="flex gap-4 mt-3 text-sm text-slate-600">
                <span>Version {formData.version}</span>
                <span>•</span>
                <span>{formData.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Back to Catalog
          </button>
          <button
            onClick={() => setCurrentStep('form')}
            className="px-6 py-2.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Register Another Asset
          </button>
        </div>
      </div>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Register New Asset</h1>
        <p className="text-slate-600 mt-2">Add a new service, model, or dataset to the TITAN Data Space catalog</p>
      </div>

      {/* Asset Type Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-900 mb-3">Asset Type</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setAssetType('service')}
            className={`p-4 rounded-lg border-2 transition-all ${
              assetType === 'service'
                ? 'border-purple-700 bg-purple-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Shield className={`w-6 h-6 mx-auto mb-2 ${assetType === 'service' ? 'text-purple-700' : 'text-slate-600'}`} />
            <div className={`font-medium ${assetType === 'service' ? 'text-purple-700' : 'text-slate-900'}`}>Service</div>
          </button>
          <button
            type="button"
            onClick={() => setAssetType('model')}
            className={`p-4 rounded-lg border-2 transition-all ${
              assetType === 'model'
                ? 'border-purple-700 bg-purple-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Brain className={`w-6 h-6 mx-auto mb-2 ${assetType === 'model' ? 'text-purple-700' : 'text-slate-600'}`} />
            <div className={`font-medium ${assetType === 'model' ? 'text-purple-700' : 'text-slate-900'}`}>Model</div>
          </button>
          <button
            type="button"
            onClick={() => setAssetType('dataset')}
            className={`p-4 rounded-lg border-2 transition-all ${
              assetType === 'dataset'
                ? 'border-purple-700 bg-purple-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Database className={`w-6 h-6 mx-auto mb-2 ${assetType === 'dataset' ? 'text-purple-700' : 'text-slate-600'}`} />
            <div className={`font-medium ${assetType === 'dataset' ? 'text-purple-700' : 'text-slate-900'}`}>Dataset</div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-900 mb-1.5">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                placeholder={`Enter ${assetType} title`}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-1.5">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent resize-none"
                placeholder={`Describe your ${assetType}`}
              />
            </div>

            {/* Domain/Category + Model Type (model) or Version (service/dataset) */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-1.5">
                  {assetType === 'service' ? 'Category *' : 'Domain *'}
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                >
                  <option value="">{assetType === 'service' ? 'Select a category' : 'Select a domain'}</option>
                  {assetType === 'service' && (
                    <>
                      <option value="confidential-computing">Confidential Computing</option>
                      <option value="anonymization">Anonymization</option>
                    </>
                  )}
                  {(assetType === 'model' || assetType === 'dataset') && (
                    <>
                      <option value="healthcare">Healthcare</option>
                      <option value="agriculture">Agriculture</option>
                    </>
                  )}
                </select>
              </div>

              {assetType === 'model' ? (
                <div>
                  <label htmlFor="modelType" className="block text-sm font-medium text-slate-900 mb-1.5">
                    Model Type *
                  </label>
                  <select
                    id="modelType"
                    required
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value as 'centralized' | 'federated' | '')}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  >
                    <option value="">Select model type</option>
                    <option value="centralized">Centralized</option>
                    <option value="federated">Federated</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label htmlFor="version" className="block text-sm font-medium text-slate-900 mb-1.5">
                    Version *
                  </label>
                  <input
                    id="version"
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                    placeholder="e.g., 1.0.0"
                  />
                </div>
              )}
            </div>

            {/* Version field — shown separately for model */}
            {assetType === 'model' && (
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-slate-900 mb-1.5">
                  Version *
                </label>
                <input
                  id="version"
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  placeholder="e.g., 1.0.0"
                />
              </div>
            )}

            {/* TEE Checkbox — all asset types */}
            <div className="flex items-center gap-3 pt-1">
              <input
                id="runInTee"
                type="checkbox"
                checked={runInTee}
                onChange={(e) => setRunInTee(e.target.checked)}
                className="w-4 h-4 text-purple-700 border-slate-300 rounded focus:ring-2 focus:ring-purple-700"
              />
              <label htmlFor="runInTee" className="text-sm font-medium text-slate-900 cursor-pointer">
                Run in TEE (Trusted Execution Environment)
              </label>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Technical Details</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="documentation" className="block text-sm font-medium text-slate-900 mb-1.5">
                Documentation URL
              </label>
              <input
                id="documentation"
                type="url"
                value={formData.documentation}
                onChange={(e) => handleInputChange('documentation', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                placeholder="https://"
              />
            </div>

            <div>
              <label htmlFor="repository" className="block text-sm font-medium text-slate-900 mb-1.5">
                Repository URL
              </label>
              <input
                id="repository"
                type="url"
                value={formData.repository}
                onChange={(e) => handleInputChange('repository', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                placeholder="https://"
              />
            </div>

            <div>
              <label htmlFor="license" className="block text-sm font-medium text-slate-900 mb-1.5">
                License *
              </label>
              <select
                id="license"
                required
                value={formData.license}
                onChange={(e) => handleInputChange('license', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
              >
                <option value="">Select a license</option>
                <option value="mit">MIT License</option>
                <option value="apache-2.0">Apache License 2.0</option>
                <option value="gpl-3.0">GNU GPL v3.0</option>
                <option value="cc-by-4.0">CC BY 4.0</option>
                <option value="proprietary">Proprietary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Files Upload */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Files</h2>

          <div className="flex border-b border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => setFileTab('upload')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                fileTab === 'upload'
                  ? 'border-purple-700 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload New File
            </button>
            <button
              type="button"
              onClick={() => setFileTab('existing')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                fileTab === 'existing'
                  ? 'border-purple-700 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Select Existing File
            </button>
          </div>

          {fileTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-700 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-900 font-medium mb-1">Upload files</p>
              <p className="text-sm text-slate-600">Drag and drop or click to browse</p>
              <p className="text-xs text-slate-500 mt-2">Supported formats: .zip, .tar.gz, .pkl, .h5, .csv, .json</p>
            </div>
          )}

          {fileTab === 'existing' && (
            <div>
              <p className="text-sm text-slate-600 mb-3">Select a file already stored in the Data Space to expose it in the catalog.</p>
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  placeholder="Search files..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                />
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                {filteredFiles.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No files match your search.</p>
                ) : (
                  filteredFiles.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => setSelectedExistingFile(file.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b last:border-b-0 border-slate-100 transition-colors ${
                        selectedExistingFile === file.id
                          ? 'bg-purple-50 border-l-2 border-l-purple-700'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${selectedExistingFile === file.id ? 'text-purple-700' : 'text-slate-900'}`}>
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">{file.size} · Modified {file.modified}</p>
                      </div>
                      {selectedExistingFile === file.id && (
                        <CheckCircle className="w-4 h-4 text-purple-700 flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
              {selectedExistingFile && (
                <p className="text-xs text-purple-700 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {existingFiles.find(f => f.id === selectedExistingFile)?.name} selected
                </p>
              )}
            </div>
          )}
        </div>

        {/* Dataset Anonymization */}
        {assetType === 'dataset' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Data Privacy</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  id="anonymized"
                  type="checkbox"
                  checked={isAnonymized}
                  onChange={(e) => setIsAnonymized(e.target.checked)}
                  className="mt-1 w-4 h-4 text-purple-700 border-slate-300 rounded focus:ring-2 focus:ring-purple-700"
                />
                <label htmlFor="anonymized" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Is this Dataset already anonymized?
                </label>
              </div>

              {!isAnonymized && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-amber-900 mb-3">
                        Your dataset needs to be anonymized before it can be registered in the catalog. Use our anonymization tool to ensure data privacy compliance.
                      </p>
                      <button
                        type="button"
                        className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium"
                      >
                        Use Anonymization Tool
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
          >
            Register Asset
          </button>
        </div>
      </form>
    </div>
  );
}
