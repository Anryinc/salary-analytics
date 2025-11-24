import { useState } from 'react';
import { MarketAnalytics } from './components/MarketAnalytics';
import { GradeCreation } from './components/GradeCreation';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'grades'>('analytics');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-gray-900">Аналитика зарплат и грейдов</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 transition-colors
                ${activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Аналитика рынка
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 transition-colors
                ${activeTab === 'grades'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Создание сетки грейдов
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8 pb-12">
          {activeTab === 'analytics' ? <MarketAnalytics /> : <GradeCreation />}
        </div>
      </div>
    </div>
  );
}
