import axios from 'axios';
import { Language, Level, Facility, LanguageResponse, LevelResponse, FacilityResponse } from '@/types/lookup.types';

const API_URL = `${process.env.NEXT_PUBLIC_URL}/api/v1`;

export const getActiveLanguages = async (): Promise<Language[]> => {
  try {
    const response = await axios.get<LanguageResponse>(`${API_URL}/languages/active`);
    return response.data.innerData.languages;
  } catch (error) {
    console.error('Error fetching active languages:', error);
    return [];
  }
};

export const getActiveLevels = async (): Promise<Level[]> => {
  try {
    const response = await axios.get<LevelResponse>(`${API_URL}/levels/active`);
    return response.data.innerData.levels;
  } catch (error) {
    console.error('Error fetching active levels:', error);
    return [];
  }
};

export const getAllFacilities = async (): Promise<Facility[]> => {
  try {
    const response = await axios.get<FacilityResponse>(`${API_URL}/facility/all`);
    return response.data.innerData.facilities;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
}; 