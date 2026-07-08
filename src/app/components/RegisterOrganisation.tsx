import { useState } from 'react';
import { ArrowLeft, Building2, Globe, CheckCircle } from 'lucide-react';

interface RegisterOrganisationProps {
  onBack: () => void;
  onRegistered?: () => void;
}

export function RegisterOrganisation({ onBack, onRegistered }: RegisterOrganisationProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '' as 'healthcare' | 'agriculture' | '',
    contactName: '',
    contactEmail: '',
    website: '',
    description: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    onRegistered?.();
  };

  if (isRegistered) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Organisation Registered</h1>
          <p className="text-slate-600">Your organisation has been submitted for approval to join TITAN Data Space</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-0.5">Organisation</p>
              <h2 className="text-xl font-semibold text-slate-900">{formData.name}</h2>
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full capitalize">
                {formData.domain}
              </span>
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
            onClick={() => setIsRegistered(false)}
            className="px-6 py-2.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Register Another Organisation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Register Organisation</h1>
        <p className="text-slate-600 mt-2">Join the TITAN Data Space and collaborate across the data ecosystem</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organisation Info */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Organisation Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-1.5">
                Organisation Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  placeholder="e.g. European Health Institute"
                />
              </div>
            </div>

            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-slate-900 mb-1.5">
                Domain *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('domain', 'healthcare')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    formData.domain === 'healthcare'
                      ? 'border-purple-700 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">🏥</span>
                  <span className={`font-medium ${formData.domain === 'healthcare' ? 'text-purple-700' : 'text-slate-900'}`}>
                    Healthcare
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('domain', 'agriculture')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    formData.domain === 'agriculture'
                      ? 'border-purple-700 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">🌾</span>
                  <span className={`font-medium ${formData.domain === 'agriculture' ? 'text-purple-700' : 'text-slate-900'}`}>
                    Agriculture
                  </span>
                </button>
              </div>
              <input type="hidden" required value={formData.domain} />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-slate-900 mb-1.5">
                Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  placeholder="https://"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent resize-none"
                placeholder="Briefly describe your organisation and its role in the data space"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Primary Contact</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-slate-900 mb-1.5">
                Full Name *
              </label>
              <input
                id="contactName"
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                placeholder="e.g. Jane Smith"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-900 mb-1.5">
                Email Address *
              </label>
              <input
                id="contactEmail"
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                placeholder="contact@organisation.eu"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.domain}
            className="px-6 py-2.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Register Organisation
          </button>
        </div>
      </form>
    </div>
  );
}
