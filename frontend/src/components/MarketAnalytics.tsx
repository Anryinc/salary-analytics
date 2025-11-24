import { useState } from 'react';
import { positions, recalculateSegments, type Position } from '../data/salaryData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function MarketAnalytics() {
  const [selectedPosition, setSelectedPosition] = useState<Position>(positions[0]);
  const [density, setDensity] = useState<5000 | 10000 | 20000>(10000);

  const chartData = recalculateSegments(selectedPosition.marketData, density).map(item => ({
    range: `${item.salaryRange / 1000}-${(item.salaryRange + density) / 1000}к`,
    'Вакансии': item.vacancies,
    'Резюме': item.resumes,
  }));

  const handlePositionChange = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (position) {
      setSelectedPosition(position);
    }
  };

  return (
    <div className="space-y-6">
      {/* Position Selector */}
      <Card className="p-6 bg-white border-green-100">
        <div className="flex items-center gap-4">
          <label className="text-gray-700 min-w-fit">Выберите должность:</label>
          <Select value={selectedPosition.id} onValueChange={handlePositionChange}>
            <SelectTrigger className="w-full max-w-md border-green-200 focus:ring-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {positions.map(position => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Salary by Grade Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Интерн</span>
            </div>
            <div className="text-gray-900">{selectedPosition.grades.intern.toLocaleString('ru-RU')} ₽</div>
            <div className="text-xs text-gray-500">средняя зарплата</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-100 to-white border-green-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Джуниор</span>
            </div>
            <div className="text-gray-900">{selectedPosition.grades.junior.toLocaleString('ru-RU')} ₽</div>
            <div className="text-xs text-gray-500">средняя зарплата</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-200 to-white border-green-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Мидл</span>
            </div>
            <div className="text-gray-900">{selectedPosition.grades.middle.toLocaleString('ru-RU')} ₽</div>
            <div className="text-xs text-gray-500">средняя зарплата</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-300 to-white border-green-400">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-900">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Лид</span>
            </div>
            <div className="text-gray-900">{selectedPosition.grades.lead.toLocaleString('ru-RU')} ₽</div>
            <div className="text-xs text-gray-500">средняя зарплата</div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6 bg-white border-green-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Распределение вакансий и резюме по сегментам зарплат</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Плотность сегментов:</span>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setDensity(5000)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    density === 5000
                      ? 'bg-green-500 text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  5k
                </button>
                <button
                  onClick={() => setDensity(10000)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    density === 10000
                      ? 'bg-green-500 text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  10k
                </button>
                <button
                  onClick={() => setDensity(20000)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    density === 20000
                      ? 'bg-green-500 text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  20k
                </button>
              </div>
            </div>
          </div>

          <div className="h-96 min-h-[384px]">
            <ResponsiveContainer width="100%" height={384}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  label={{ value: 'Процент (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
                <Bar dataKey="Вакансии" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Резюме" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Вакансии - количество открытых вакансий в сегменте</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Резюме - количество кандидатов в сегменте</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}