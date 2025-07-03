export interface Language {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface Level {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Facility {
  id: number;
  title: string;
  titleArabic: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LanguageResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: {
    languages: Language[];
  };
}

export interface LevelResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: {
    levels: Level[];
  };
}

export interface FacilityResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: {
    count: number;
    facilities: Facility[];
  };
} 