import { useState, useEffect } from 'react';
import type { Class, Studio, Teacher } from '../types';
import mockData from '../data/fixtures/mockSchedule.json';

interface ScheduleData {
  classes: Class[];
  studios: Studio[];
  teachers: Teacher[];
}

export const useSchedule = () => {
  const [data, setData] = useState<ScheduleData>({
    classes: [],
    studios: [],
    teachers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Transform mock data to match our types
        const transformedData: ScheduleData = {
          studios: mockData.studios,
          teachers: mockData.teachers,
          classes: mockData.classes.map(cls => ({
            ...cls,
            teacher: mockData.teachers.find(t => t.id === cls.teacherId)!,
            studio: mockData.studios.find(s => s.id === cls.studioId)!
          }))
        };
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch schedule data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClassesByDate = (date: Date) => {
    return data.classes.filter(cls => {
      const classDate = new Date(cls.startTime);
      return classDate.toDateString() === date.toDateString();
    });
  };

  const getClassesByStudio = (studioId: string) => {
    return data.classes.filter(cls => cls.studio.id === studioId);
  };

  return {
    data,
    loading,
    error,
    getClassesByDate,
    getClassesByStudio
  };
}; 