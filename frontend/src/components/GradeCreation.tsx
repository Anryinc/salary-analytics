import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { positions } from '../data/salaryData';
import { Plus, Trash2, Download, Calculator } from 'lucide-react';

interface CalculatedGrade {
  name: string;
  minSalary: number;
  maxSalary: number;
}

export function GradeCreation() {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [divisionType, setDivisionType] = useState<'jms' | 'custom'>('jms');
  const [useSubgrades, setUseSubgrades] = useState(false);
  const [subgradeCount, setSubgradeCount] = useState(2);
  const [customGrades, setCustomGrades] = useState(['Специалист', 'Руководитель']);
  const [limitBudget, setLimitBudget] = useState(false);
  const [maxBudget, setMaxBudget] = useState('');
  const [calculatedGrades, setCalculatedGrades] = useState<CalculatedGrade[]>([]);

  const handleAddCustomGrade = () => {
    setCustomGrades([...customGrades, `Уровень ${customGrades.length + 1}`]);
  };

  const handleRemoveCustomGrade = (index: number) => {
    if (customGrades.length > 2) {
      setCustomGrades(customGrades.filter((_, i) => i !== index));
    }
  };

  const handleUpdateCustomGrade = (index: number, value: string) => {
    const updated = [...customGrades];
    updated[index] = value;
    setCustomGrades(updated);
  };

  const calculateGrades = () => {
    if (!selectedPosition) return;

    const position = positions.find(p => p.id === selectedPosition);
    if (!position) return;

    const results: CalculatedGrade[] = [];

    if (divisionType === 'jms') {
      // Стандартное деление: интерн, джуниор, мидл, сеньор, лид
      const baseGrades = [
        { name: 'Интерн', marketValue: position.grades.intern },
        { name: 'Джуниор', marketValue: position.grades.junior },
        { name: 'Мидл', marketValue: position.grades.middle },
        { name: 'Сеньор', marketValue: Math.round((position.grades.middle + position.grades.lead) / 2) },
        { name: 'Лид', marketValue: position.grades.lead },
      ];

      if (limitBudget && maxBudget) {
        // Распределяем бюджет пропорционально рыночным значениям
        const totalMarketValue = baseGrades.reduce((sum, g) => sum + g.marketValue, 0);
        const budget = Number(maxBudget);

        baseGrades.forEach(grade => {
          const proportion = grade.marketValue / totalMarketValue;
          const avgSalary = budget * proportion;
          
          if (useSubgrades) {
            // Создаем подгрейды
            const rangePerSubgrade = avgSalary * 0.3 / subgradeCount;
            const baseMin = avgSalary * 0.85;
            
            for (let i = 0; i < subgradeCount; i++) {
              results.push({
                name: `${grade.name} ${i + 1}`,
                minSalary: Math.round(baseMin + rangePerSubgrade * i),
                maxSalary: Math.round(baseMin + rangePerSubgrade * (i + 1)),
              });
            }
          } else {
            results.push({
              name: grade.name,
              minSalary: Math.round(avgSalary * 0.85),
              maxSalary: Math.round(avgSalary * 1.15),
            });
          }
        });
      } else {
        // Используем рыночные данные
        baseGrades.forEach(grade => {
          if (useSubgrades) {
            const rangePerSubgrade = grade.marketValue * 0.3 / subgradeCount;
            const baseMin = grade.marketValue * 0.85;
            
            for (let i = 0; i < subgradeCount; i++) {
              results.push({
                name: `${grade.name} ${i + 1}`,
                minSalary: Math.round(baseMin + rangePerSubgrade * i),
                maxSalary: Math.round(baseMin + rangePerSubgrade * (i + 1)),
              });
            }
          } else {
            results.push({
              name: grade.name,
              minSalary: Math.round(grade.marketValue * 0.85),
              maxSalary: Math.round(grade.marketValue * 1.15),
            });
          }
        });
      }
    } else {
      // Кастомное деление
      if (limitBudget && maxBudget) {
        const budget = Number(maxBudget);
        const avgPerGrade = budget / customGrades.length;
        
        customGrades.forEach((gradeName, index) => {
          // Более высокие позиции получают больше
          const multiplier = 1 + (index / (customGrades.length - 1)) * 0.8;
          const avgSalary = avgPerGrade * multiplier;
          
          results.push({
            name: gradeName,
            minSalary: Math.round(avgSalary * 0.85),
            maxSalary: Math.round(avgSalary * 1.15),
          });
        });
        
        // Нормализуем чтобы сумма максимумов не превышала бюджет
        const totalMax = results.reduce((sum, g) => sum + g.maxSalary, 0);
        if (totalMax > budget) {
          const ratio = budget / totalMax;
          results.forEach(grade => {
            grade.minSalary = Math.round(grade.minSalary * ratio);
            grade.maxSalary = Math.round(grade.maxSalary * ratio);
          });
        }
      } else {
        // Используем рыночные данные как базу
        const baseMin = position.grades.junior;
        const baseMax = position.grades.lead;
        const step = (baseMax - baseMin) / (customGrades.length - 1);
        
        customGrades.forEach((gradeName, index) => {
          const avgSalary = baseMin + step * index;
          results.push({
            name: gradeName,
            minSalary: Math.round(avgSalary * 0.85),
            maxSalary: Math.round(avgSalary * 1.15),
          });
        });
      }
    }

    setCalculatedGrades(results);
  };

  const handleExport = () => {
    if (calculatedGrades.length === 0) return;

    const positionName = positions.find(p => p.id === selectedPosition)?.name || 'Неизвестная должность';
    
    const csvContent = [
      ['Должность', 'Грейд', 'Мин. зарплата (₽)', 'Макс. зарплата (₽)'],
      ...calculatedGrades.map(g => [positionName, g.name, g.minSalary, g.maxSalary])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `сетка_грейдов_${positionName}.csv`;
    link.click();
  };

  const totalBudget = calculatedGrades.reduce((sum, g) => sum + g.maxSalary, 0);

  return (
    <div className="space-y-6">
      {/* Configuration Form */}
      <Card className="p-6 bg-white border-blue-100">
        <h3 className="text-gray-900 mb-6">Настройка сетки грейдов</h3>
        
        <div className="space-y-6">
          {/* Position Selection */}
          <div className="space-y-2">
            <Label>Должность</Label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                <SelectValue placeholder="Выберите должность" />
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

          {/* Division Type */}
          <div className="space-y-3">
            <Label>Тип деления грейдов</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="divisionType"
                  checked={divisionType === 'jms'}
                  onChange={() => setDivisionType('jms')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Junior/Middle/Senior</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="divisionType"
                  checked={divisionType === 'custom'}
                  onChange={() => setDivisionType('custom')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Своё деление</span>
              </label>
            </div>
          </div>

          {/* JMS Options */}
          {divisionType === 'jms' && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="subgrades"
                    checked={useSubgrades}
                    onCheckedChange={(checked) => setUseSubgrades(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="subgrades" className="cursor-pointer">
                      Нужны ли подгрейды? (Мидл 1, Мидл 2, Мидл 3)
                    </Label>
                    {useSubgrades && (
                      <div className="flex items-center gap-3">
                        <Label className="text-sm text-gray-600">Количество подгрейдов:</Label>
                        <Input
                          type="number"
                          min="2"
                          max="9"
                          value={subgradeCount}
                          onChange={(e) => setSubgradeCount(Math.min(9, Math.max(2, Number(e.target.value))))}
                          className="w-20 border-blue-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Стандартная структура: Интерн → Джуниор → Мидл → Сеньор → Лид
                </div>
              </div>
            </Card>
          )}

          {/* Custom Division */}
          {divisionType === 'custom' && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-3">
                <Label>Названия грейдов</Label>
                {customGrades.map((grade, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={grade}
                      onChange={(e) => handleUpdateCustomGrade(index, e.target.value)}
                      placeholder={`Грейд ${index + 1}`}
                      className="flex-1 border-blue-200"
                    />
                    {customGrades.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCustomGrade(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomGrade}
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить грейд
                </Button>
              </div>
            </Card>
          )}

          {/* Budget Limit */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="limitBudget"
                checked={limitBudget}
                onCheckedChange={(checked) => setLimitBudget(checked as boolean)}
              />
              <Label htmlFor="limitBudget" className="cursor-pointer">
                Ограничить бюджет
              </Label>
            </div>
            {limitBudget && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  Максимальный бюджет на всю сетку грейдов (₽)
                </Label>
                <Input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="1000000"
                  className="border-blue-200 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Алгоритм распределит бюджет между всеми грейдами
                </p>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculateGrades}
            disabled={!selectedPosition}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Рассчитать сетку грейдов
          </Button>
        </div>
      </Card>

      {/* Results */}
      {calculatedGrades.length > 0 && (
        <Card className="p-6 bg-white border-blue-100">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">
                  Результат для {positions.find(p => p.id === selectedPosition)?.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Всего грейдов: {calculatedGrades.length}
                  {limitBudget && maxBudget && (
                    <span className="ml-4">
                      Использовано бюджета: {totalBudget.toLocaleString('ru-RU')} ₽ 
                      {' '}из {Number(maxBudget).toLocaleString('ru-RU')} ₽
                      {' '}({((totalBudget / Number(maxBudget)) * 100).toFixed(1)}%)
                    </span>
                  )}
                </p>
              </div>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспортировать
              </Button>
            </div>

            <div className="space-y-2">
              {calculatedGrades.map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm">
                      {index + 1}
                    </div>
                    <span className="text-gray-900">{grade.name}</span>
                  </div>
                  <div className="text-blue-700">
                    {grade.minSalary.toLocaleString('ru-RU')} ₽ - {grade.maxSalary.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              ))}
            </div>

            {!limitBudget && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  💡 Расчет основан на рыночных данных по выбранной должности
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {calculatedGrades.length === 0 && selectedPosition && (
        <Card className="p-12 bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="text-center space-y-2">
            <div className="text-blue-400 text-5xl mb-4">📊</div>
            <h3 className="text-gray-900">Настройте параметры и нажмите "Рассчитать"</h3>
            <p className="text-gray-500 text-sm">
              Алгоритм автоматически рассчитает зарплатные диапазоны для всех грейдов
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
