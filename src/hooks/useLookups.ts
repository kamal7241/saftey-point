import { useState, useEffect } from 'react';
import { getActiveLanguages, getActiveLevels, getAllFacilities } from '@/api/lookup.service';
import { fetchCourseTypes } from '@/api/courseTypesService';
import { Language, Level, Facility } from '@/types/lookup.types';
import { CourseType } from '@/types/ui.types';

export const useLookups = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [languagesData, levelsData, facilitiesData, courseTypesData] = await Promise.all([
          getActiveLanguages(),
          getActiveLevels(),
          getAllFacilities(),
          fetchCourseTypes(0, 1000) // Fetch all course types
        ]);
        setLanguages(languagesData);
        setLevels(levelsData);
        setFacilities(facilitiesData);
        setCourseTypes(courseTypesData.innerData?.courseTypes || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch lookup data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { languages, levels, facilities, courseTypes, loading, error };
}; 