import { useState } from 'react';
import { LucideIcon, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
  itemType?: 'service' | 'model' | 'dataset';
  modelType?: 'centralized' | 'federated';
  domain?: 'healthcare' | 'agriculture';
  accessStatus?: 'none' | 'pending' | 'granted';
  anonymizationStatus?: 'anonymized' | 'raw';
}

interface CatalogSectionProps {
  items: CatalogItem[];
  onOpenWorkspace?: (item: CatalogItem) => void;
  onRequestAccess?: (item: CatalogItem) => void;
}

function AnonymizationBadge({ status }: { status: 'anonymized' | 'raw' }) {
  if (status === 'anonymized') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-full">
        <CheckCircle className="w-3.5 h-3.5" />
        Anonymized
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium rounded-full">
      <AlertCircle className="w-3.5 h-3.5" />
      Raw data – requires processing
    </span>
  );
}

function DatasetDetail({ item, onBack }: { item: CatalogItem; onBack: () => void }) {
  const Icon = item.icon;
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-purple-100 rounded-lg">
          <Icon className="w-5 h-5 text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{item.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5 capitalize">Dataset</p>
        </div>
      </div>

      <p className="text-slate-600 mb-5">{item.description}</p>

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {item.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.anonymizationStatus && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Anonymization Status
          </p>
          <AnonymizationBadge status={item.anonymizationStatus} />
        </div>
      )}

      <div>
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Back to Catalog
        </button>
      </div>
    </div>
  );
}

export function CatalogSection({ items, onOpenWorkspace, onRequestAccess }: CatalogSectionProps) {
  const [selectedDataset, setSelectedDataset] = useState<CatalogItem | null>(null);

  if (selectedDataset) {
    return <DatasetDetail item={selectedDataset} onBack={() => setSelectedDataset(null)} />;
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const isModel = item.itemType === 'model';
        const isDataset = item.itemType === 'dataset';
        const status = item.accessStatus ?? 'none';

        return (
          <div
            key={item.id}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon className="w-6 h-6 text-purple-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {isDataset && item.anonymizationStatus && (
                  <div className="mt-3">
                    <AnonymizationBadge status={item.anonymizationStatus} />
                  </div>
                )}
              </div>

              {isDataset ? (
                <>
                  {status === 'none' && (
                    <button
                      onClick={() => onRequestAccess?.(item)}
                      className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap text-sm font-medium"
                    >
                      Request Access
                    </button>
                  )}
                  {status === 'pending' && (
                    <span className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium whitespace-nowrap cursor-default">
                      Pending review
                    </span>
                  )}
                  {status === 'granted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDataset(item)}
                        className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap text-sm font-medium"
                      >
                        View Dataset
                      </button>
                      <button
                        onClick={() => onOpenWorkspace?.(item)}
                        className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors whitespace-nowrap text-sm font-medium"
                      >
                        Open Workspace
                      </button>
                    </div>
                  )}
                </>
              ) : isModel ? (
                <>
                  {status === 'none' && (
                    <button
                      onClick={() => onRequestAccess?.(item)}
                      className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap text-sm font-medium"
                    >
                      Request Access
                    </button>
                  )}
                  {status === 'pending' && (
                    <span className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium whitespace-nowrap cursor-default">
                      Pending review
                    </span>
                  )}
                  {status === 'granted' && (
                    <button
                      onClick={() => onOpenWorkspace?.(item)}
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors whitespace-nowrap text-sm font-medium"
                    >
                      Open Workspace
                    </button>
                  )}
                </>
              ) : item.accessStatus !== undefined ? (
                <>
                  {status === 'none' && (
                    <button
                      onClick={() => onRequestAccess?.(item)}
                      className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap text-sm font-medium"
                    >
                      Request Access
                    </button>
                  )}
                  {status === 'pending' && (
                    <span className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium whitespace-nowrap cursor-default">
                      Pending review
                    </span>
                  )}
                  {status === 'granted' && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium whitespace-nowrap">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Access Granted
                    </span>
                  )}
                </>
              ) : (
                <button className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors">
                  Access
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
