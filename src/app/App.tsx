import { useState } from 'react';
import { Shield, Brain, FileText, ExternalLink, Lock, Database, Monitor, Network } from 'lucide-react';
import { CatalogSection, type CatalogItem } from './components/CatalogSection';
import { ExternalServiceCard } from './components/ExternalServiceCard';
import { NewAssetForm } from './components/NewAssetForm';
import { RegisterOrganisation } from './components/RegisterOrganisation';
import { ModelWorkspace, type WorkspaceConfig } from './components/ModelWorkspace';
import { AccessRequestFlow } from './components/AccessRequestFlow';
import { WorkspacePanel } from './components/WorkspacePanel';
import { TrainingMonitor } from './components/TrainingMonitor';
import titanLogo from '../imports/image.png';

type TopTab = 'catalog' | 'workspace';
type SubView = 'default' | 'newAsset' | 'accessRequest' | 'trainingMonitor';

export default function App() {
  const [isOrganisationRegistered, setIsOrganisationRegistered] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('catalog');
  const [catalogSubTab, setCatalogSubTab] = useState<'services' | 'models' | 'datasets'>('services');
  const [subView, setSubView] = useState<SubView>('default');
  const [trainingConfig, setTrainingConfig] = useState<WorkspaceConfig | null>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [selectedModel, setSelectedModel] = useState<CatalogItem | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<CatalogItem | null>(null);
  const [workspaceMode, setWorkspaceMode] = useState<'setup' | 'monitor'>('setup');

  const [models, setModels] = useState<CatalogItem[]>([
    {
      id: 'model-1',
      title: 'Sleep Staging Model',
      description: 'Pre-trained model for automatic sleep stage classification from polysomnography signals, supporting healthcare research and clinical analysis.',
      icon: Brain,
      tags: ['Healthcare'],
      itemType: 'model',
      modelType: 'centralized',
      domain: 'healthcare',
      accessStatus: 'none',
    },
    {
      id: 'model-2',
      title: 'Natural Language Processing Model',
      description: 'Advanced transformer-based model for text analysis, sentiment detection, and language understanding.',
      icon: Brain,
      tags: ['Agriculture'],
      itemType: 'model',
      modelType: 'federated',
      domain: 'agriculture',
      accessStatus: 'none',
    },
    {
      id: 'model-4',
      title: 'Federated Learning Model - Agriculture',
      description: 'Federated crop-yield prediction model trained collaboratively across farm data sources, without centralising raw data.',
      icon: Brain,
      tags: ['Agriculture'],
      itemType: 'model',
      modelType: 'federated',
      domain: 'agriculture',
      accessStatus: 'none',
    },
  ]);

  const [services, setServices] = useState<CatalogItem[]>([
    {
      id: 'confidential-computing',
      title: 'Confidential Computing',
      description: 'Secure data processing service based on Confidential Computing and Hardware-based encryption.',
      icon: Shield,
      tags: [],
    },
    {
      id: 'fl-toolbox-healthcare',
      title: 'FL Toolbox - Healthcare',
      description: 'Federated learning service for healthcare — trains collaboratively across distributed hospital nodes without centralising raw patient data.',
      icon: Network,
      tags: ['FL Toolbox'],
      itemType: 'service',
      accessStatus: 'none',
    },
  ]);

  const [datasets, setDatasets] = useState<CatalogItem[]>([
    {
      id: 'dataset-1',
      title: 'Sleep Data',
      description: 'Sleep patterns and health metrics dataset for medical research and analysis.',
      icon: Database,
      tags: ['Healthcare'],
      itemType: 'dataset',
      anonymizationStatus: 'anonymized',
      accessStatus: 'none',
    },
    {
      id: 'dataset-2',
      title: 'Vineyard Dataset',
      description: 'Agricultural data from vineyards including soil conditions, climate patterns, and crop yields.',
      icon: Database,
      tags: ['Agriculture'],
      itemType: 'dataset',
      anonymizationStatus: 'anonymized',
      accessStatus: 'none',
    },
  ]);

  const grantedModels = models.filter((m) => m.accessStatus === 'granted');
  const grantedDatasets = datasets.filter((d) => d.accessStatus === 'granted');

  const openTrainingMonitor = (config: WorkspaceConfig) => {
    setTrainingConfig(config);
    setSubView('trainingMonitor');
  };

  const handleRequestAccess = (item: CatalogItem) => {
    setSelectedItem(item);
    setSubView('accessRequest');
  };

  const handleAccessGranted = () => {
    if (selectedItem) {
      const grantAccess = (prev: CatalogItem[]) =>
        prev.map((m) => m.id === selectedItem.id ? { ...m, accessStatus: 'granted' as const } : m);
      setModels(grantAccess);
      setDatasets(grantAccess);
      setServices(grantAccess);
      setSelectedItem(null);
    }
    setSubView('default');
  };

  const handleExecuteJob = () => {
    if (selectedModel?.modelType && selectedModel?.domain && selectedDataset) {
      setTrainingConfig({
        assetName: selectedModel.title,
        modelType: selectedModel.modelType,
        domain: selectedModel.domain,
      });
      setWorkspaceMode('monitor');
    }
  };

  // ── Registration gate ────────────────────────────────────────────────────────
  if (!isOrganisationRegistered) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <header className="mb-16">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-slate-900">TITAN Data Space</h1>
              <img src={titanLogo} alt="TITAN Logo" className="h-20 object-contain" />
            </div>
          </header>
          <RegisterOrganisation
            onRegistered={() => setIsOrganisationRegistered(true)}
            onBack={() => {}}
          />
        </div>
      </div>
    );
  }

  // ── Shared header ────────────────────────────────────────────────────────────
  const header = (
    <header className="mb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-900">TITAN Data Space</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsOrganisationRegistered(false);
              setActiveTopTab('catalog');
              setSubView('default');
              setSelectedModel(null);
              setSelectedDataset(null);
              setWorkspaceMode('setup');
            }}
            className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Logout
          </button>
          <img src={titanLogo} alt="TITAN Logo" className="h-20 object-contain" />
        </div>
      </div>
    </header>
  );

  // ── Full-page sub-views (overlay both top-level tabs) ────────────────────────
  if (subView === 'trainingMonitor' && trainingConfig) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {header}
          <ModelWorkspace {...trainingConfig} onBack={() => setSubView('default')} />
        </div>
      </div>
    );
  }

  if (subView === 'newAsset') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {header}
          <NewAssetForm onBack={() => setSubView('default')} onOpenWorkspace={openTrainingMonitor} />
        </div>
      </div>
    );
  }

  if (subView === 'accessRequest' && selectedItem) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {header}
          <AccessRequestFlow
            modelName={selectedItem.title}
            onGranted={handleAccessGranted}
            onBack={() => setSubView('default')}
          />
        </div>
      </div>
    );
  }

  // ── Main layout with top-level tabs ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {header}

        {/* Top-level navigation: Catalog | Workspace */}
        <div className="flex gap-2 mb-8 border-b-2 border-slate-200">
          <button
            onClick={() => setActiveTopTab('catalog')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-0.5 ${
              activeTopTab === 'catalog'
                ? 'text-purple-700 border-purple-700'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Catalog
            </div>
          </button>
          <button
            onClick={() => setActiveTopTab('workspace')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-0.5 ${
              activeTopTab === 'workspace'
                ? 'text-purple-700 border-purple-700'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Workspace
            </div>
          </button>
        </div>

        {activeTopTab === 'catalog' ? (
          <>
            {/* Catalog section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold text-slate-900">Assets Catalog</h2>
                <button
                  onClick={() => setSubView('newAsset')}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                >
                  New Asset
                </button>
              </div>
              <p className="text-slate-600 mb-6">Select a service, model, or dataset from our Catalog</p>

              {/* Catalog sub-tabs */}
              <div className="flex gap-2 mb-8 border-b border-slate-200">
                <button
                  onClick={() => setCatalogSubTab('services')}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                    catalogSubTab === 'services'
                      ? 'text-purple-700 border-purple-700'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Services
                  </div>
                </button>
                <button
                  onClick={() => setCatalogSubTab('models')}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                    catalogSubTab === 'models'
                      ? 'text-purple-700 border-purple-700'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Models
                  </div>
                </button>
                <button
                  onClick={() => setCatalogSubTab('datasets')}
                  className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                    catalogSubTab === 'datasets'
                      ? 'text-purple-700 border-purple-700'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Datasets
                  </div>
                </button>
              </div>

              {/* Sub-tab content */}
              <div className="grid gap-6">
                {catalogSubTab === 'services' && (
                  <>
                    <p className="text-slate-600 -mt-2 mb-2">Select a service to use from our platform</p>
                    <CatalogSection items={services} onRequestAccess={handleRequestAccess} />
                  </>
                )}
                {catalogSubTab === 'models' && (
                  <>
                    <p className="text-slate-600 -mt-2 mb-2">Explore and access pre-trained Machine Learning models</p>
                    <CatalogSection
                      items={models}
                      onRequestAccess={handleRequestAccess}
                      onOpenWorkspace={(item) => {
                        setSelectedModel(item);
                        setWorkspaceMode('setup');
                        setActiveTopTab('workspace');
                      }}
                    />
                  </>
                )}
                {catalogSubTab === 'datasets' && (
                  <>
                    <p className="text-slate-600 -mt-2 mb-2">Explore and obtain datasets from different research fields</p>
                    <CatalogSection
                      items={datasets}
                      onRequestAccess={handleRequestAccess}
                      onOpenWorkspace={(item) => {
                        setSelectedDataset(item);
                        setWorkspaceMode('setup');
                        setActiveTopTab('workspace');
                      }}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Divider with OR */}
            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-px bg-slate-300"></div>
              <span className="text-slate-500 font-medium text-sm uppercase tracking-wider">OR</span>
              <div className="flex-1 h-px bg-slate-300"></div>
            </div>

            {/* Other Services */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Other Options</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ExternalServiceCard
                  title="EOSC Portal"
                  description="Access the European Open Science Cloud infrastructure and Resource Catalog."
                  icon={ExternalLink}
                  link="https://eosc-portal.eu"
                  color="violet"
                />
                <ExternalServiceCard
                  title="Anonymization Tool"
                  description="Use the Data Anonymization Tool available in your infrastructure for anonymize your datasets before offering them in the Assets Catalog."
                  icon={Lock}
                  link="#"
                  color="violet"
                />
              </div>
            </section>
          </>
        ) : workspaceMode === 'monitor' && selectedModel && selectedDataset ? (
          <TrainingMonitor
            model={selectedModel}
            dataset={selectedDataset}
            onBack={() => {
              setWorkspaceMode('setup');
              setTrainingConfig(null);
            }}
          />
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">Workspace</h2>
            </div>
            <WorkspacePanel
              grantedModels={grantedModels}
              grantedDatasets={grantedDatasets}
              selectedModel={selectedModel}
              selectedDataset={selectedDataset}
              onSelectModel={setSelectedModel}
              onSelectDataset={setSelectedDataset}
              onExecuteJob={handleExecuteJob}
            />
          </>
        )}
      </div>
    </div>
  );
}
