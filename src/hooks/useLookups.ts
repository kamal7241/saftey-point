import { useState, useEffect } from 'react';
import { getActiveLanguages, getActiveLevels, getAllFacilities } from '@/api/lookup.service';
import { Language, Level, Facility } from '@/types/lookup.types';

export const useLookups = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [languagesData, levelsData, facilitiesData] = await Promise.all([
          getActiveLanguages(),
          getActiveLevels(),
          getAllFacilities()
        ]);
        setLanguages(languagesData);
        setLevels(levelsData);
        setFacilities(facilitiesData);
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

  return { languages, levels, facilities, loading, error };
}; 