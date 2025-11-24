export interface Position {
  id: string;
  name: string;
  grades: {
    intern: number;
    junior: number;
    middle: number;
    lead: number;
  };
  marketData: {
    salaryRange: number; // min salary
    vacancies: number; // percentage
    resumes: number; // percentage
  }[];
}

// Демо-данные по различным должностям
export const positions: Position[] = [
  {
    id: 'frontend',
    name: 'Frontend разработчик',
    grades: {
      intern: 45000,
      junior: 80000,
      middle: 150000,
      lead: 280000,
    },
    marketData: [
      { salaryRange: 0, vacancies: 2, resumes: 15 },
      { salaryRange: 10000, vacancies: 3, resumes: 12 },
      { salaryRange: 20000, vacancies: 5, resumes: 18 },
      { salaryRange: 30000, vacancies: 8, resumes: 14 },
      { salaryRange: 40000, vacancies: 12, resumes: 10 },
      { salaryRange: 50000, vacancies: 15, resumes: 8 },
      { salaryRange: 60000, vacancies: 14, resumes: 6 },
      { salaryRange: 70000, vacancies: 11, resumes: 5 },
      { salaryRange: 80000, vacancies: 9, resumes: 4 },
      { salaryRange: 90000, vacancies: 7, resumes: 3 },
      { salaryRange: 100000, vacancies: 5, resumes: 2 },
      { salaryRange: 110000, vacancies: 4, resumes: 1.5 },
      { salaryRange: 120000, vacancies: 3, resumes: 0.8 },
      { salaryRange: 130000, vacancies: 1.5, resumes: 0.5 },
      { salaryRange: 140000, vacancies: 0.5, resumes: 0.2 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend разработчик',
    grades: {
      intern: 50000,
      junior: 90000,
      middle: 170000,
      lead: 320000,
    },
    marketData: [
      { salaryRange: 0, vacancies: 1, resumes: 10 },
      { salaryRange: 10000, vacancies: 2, resumes: 8 },
      { salaryRange: 20000, vacancies: 4, resumes: 12 },
      { salaryRange: 30000, vacancies: 6, resumes: 16 },
      { salaryRange: 40000, vacancies: 10, resumes: 15 },
      { salaryRange: 50000, vacancies: 14, resumes: 11 },
      { salaryRange: 60000, vacancies: 16, resumes: 8 },
      { salaryRange: 70000, vacancies: 13, resumes: 6 },
      { salaryRange: 80000, vacancies: 10, resumes: 5 },
      { salaryRange: 90000, vacancies: 8, resumes: 3 },
      { salaryRange: 100000, vacancies: 6, resumes: 2 },
      { salaryRange: 110000, vacancies: 4, resumes: 1.5 },
      { salaryRange: 120000, vacancies: 3, resumes: 1 },
      { salaryRange: 130000, vacancies: 2, resumes: 0.8 },
      { salaryRange: 140000, vacancies: 1, resumes: 0.7 },
    ],
  },
  {
    id: 'designer',
    name: 'UI/UX дизайнер',
    grades: {
      intern: 35000,
      junior: 65000,
      middle: 120000,
      lead: 220000,
    },
    marketData: [
      { salaryRange: 0, vacancies: 5, resumes: 20 },
      { salaryRange: 10000, vacancies: 8, resumes: 18 },
      { salaryRange: 20000, vacancies: 12, resumes: 16 },
      { salaryRange: 30000, vacancies: 15, resumes: 14 },
      { salaryRange: 40000, vacancies: 18, resumes: 10 },
      { salaryRange: 50000, vacancies: 14, resumes: 7 },
      { salaryRange: 60000, vacancies: 10, resumes: 5 },
      { salaryRange: 70000, vacancies: 7, resumes: 4 },
      { salaryRange: 80000, vacancies: 5, resumes: 3 },
      { salaryRange: 90000, vacancies: 3, resumes: 2 },
      { salaryRange: 100000, vacancies: 2, resumes: 0.8 },
      { salaryRange: 110000, vacancies: 0.8, resumes: 0.2 },
      { salaryRange: 120000, vacancies: 0.2, resumes: 0 },
      { salaryRange: 130000, vacancies: 0, resumes: 0 },
      { salaryRange: 140000, vacancies: 0, resumes: 0 },
    ],
  },
  {
    id: 'product-manager',
    name: 'Product менеджер',
    grades: {
      intern: 55000,
      junior: 95000,
      middle: 180000,
      lead: 350000,
    },
    marketData: [
      { salaryRange: 0, vacancies: 1, resumes: 8 },
      { salaryRange: 10000, vacancies: 2, resumes: 10 },
      { salaryRange: 20000, vacancies: 3, resumes: 12 },
      { salaryRange: 30000, vacancies: 5, resumes: 14 },
      { salaryRange: 40000, vacancies: 8, resumes: 13 },
      { salaryRange: 50000, vacancies: 12, resumes: 11 },
      { salaryRange: 60000, vacancies: 15, resumes: 9 },
      { salaryRange: 70000, vacancies: 14, resumes: 7 },
      { salaryRange: 80000, vacancies: 12, resumes: 5 },
      { salaryRange: 90000, vacancies: 9, resumes: 4 },
      { salaryRange: 100000, vacancies: 7, resumes: 3 },
      { salaryRange: 110000, vacancies: 5, resumes: 2 },
      { salaryRange: 120000, vacancies: 4, resumes: 1.5 },
      { salaryRange: 130000, vacancies: 2, resumes: 0.5 },
      { salaryRange: 140000, vacancies: 1, resumes: 0 },
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data аналитик',
    grades: {
      intern: 40000,
      junior: 75000,
      middle: 140000,
      lead: 260000,
    },
    marketData: [
      { salaryRange: 0, vacancies: 3, resumes: 18 },
      { salaryRange: 10000, vacancies: 5, resumes: 16 },
      { salaryRange: 20000, vacancies: 8, resumes: 15 },
      { salaryRange: 30000, vacancies: 11, resumes: 14 },
      { salaryRange: 40000, vacancies: 14, resumes: 11 },
      { salaryRange: 50000, vacancies: 16, resumes: 8 },
      { salaryRange: 60000, vacancies: 13, resumes: 6 },
      { salaryRange: 70000, vacancies: 10, resumes: 5 },
      { salaryRange: 80000, vacancies: 8, resumes: 3 },
      { salaryRange: 90000, vacancies: 5, resumes: 2 },
      { salaryRange: 100000, vacancies: 4, resumes: 1.5 },
      { salaryRange: 110000, vacancies: 2, resumes: 0.5 },
      { salaryRange: 120000, vacancies: 1, resumes: 0 },
      { salaryRange: 130000, vacancies: 0, resumes: 0 },
      { salaryRange: 140000, vacancies: 0, resumes: 0 },
    ],
  },
];

// Функция для пересчета данных с разной плотностью сегментов
export function recalculateSegments(
  originalData: Position['marketData'],
  density: 5000 | 10000 | 20000
): Position['marketData'] {
  if (density === 10000) {
    return originalData;
  }

  const result: Position['marketData'] = [];
  
  if (density === 5000) {
    // Разделяем каждый сегмент на два
    for (let i = 0; i < originalData.length; i++) {
      const current = originalData[i];
      const vacanciesPerSegment = current.vacancies / 2;
      const resumesPerSegment = current.resumes / 2;
      
      result.push({
        salaryRange: current.salaryRange,
        vacancies: vacanciesPerSegment,
        resumes: resumesPerSegment,
      });
      
      result.push({
        salaryRange: current.salaryRange + 5000,
        vacancies: vacanciesPerSegment,
        resumes: resumesPerSegment,
      });
    }
  } else if (density === 20000) {
    // Объединяем каждые два сегмента
    for (let i = 0; i < originalData.length; i += 2) {
      const current = originalData[i];
      const next = originalData[i + 1];
      
      if (next) {
        result.push({
          salaryRange: current.salaryRange,
          vacancies: current.vacancies + next.vacancies,
          resumes: current.resumes + next.resumes,
        });
      } else {
        result.push(current);
      }
    }
  }
  
  return result;
}
