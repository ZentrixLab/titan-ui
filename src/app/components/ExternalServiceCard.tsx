import { LucideIcon } from 'lucide-react';

interface ExternalServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  color: 'emerald' | 'violet';
}

export function ExternalServiceCard({ title, description, icon: Icon, link, color }: ExternalServiceCardProps) {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      border: 'border-emerald-200'
    },
    violet: {
      bg: 'bg-violet-50',
      icon: 'text-violet-600',
      button: 'bg-violet-600 hover:bg-violet-700',
      border: 'border-violet-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border ${colors.border}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 ${colors.bg} rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 ${colors.button} text-white rounded-lg transition-colors`}
      >
        Access Service
        <Icon className="w-4 h-4" />
      </a>
    </div>
  );
}
