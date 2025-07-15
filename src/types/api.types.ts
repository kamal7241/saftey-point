/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PricingItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  price: string;
  discount: string;
  isTheoreticalOnly: boolean;
  type: string;
  isCompanyTraining: boolean;
  courseId: number;
  countryId: null | number;
}
export interface CorporatePricingItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  city: string;
  trainees: string;
  type: string;
  fees: string;
  currency: string;
  image?: string;
}

export interface PricingListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: {
    items: PricingItem[];
    count: number;
  };
}
export interface CorporatePricingListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: {
    items: CorporatePricingItem[];
    count: number;
  };
}

export interface SessionDTO {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  courseId: number;
}

export interface SessionResponse {
  success: boolean;
  message?: string;
  error?: string;
  innerData?: any;
}

export interface CorporatePricingDTO {
  type: string;
  isCompanyTraining: boolean;
  city: string;
  trainees: number;
  fees: number;
  currency: string;
}
export interface CreateCourseDTO {
  title: string;
  status: string;
  description: string;
  validity: string;
  cover: string;
  requiresMedicalTest: boolean;
  maxAttendees: number;
  languageId: number;
  levelId: number;
  prerequisiteId: number;
  facilityId: number;
  courseTypeId: number;
}

export interface CourseResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
  innerData?: {
    id: number;
    title: string;
    status: string;
    prerequisites: string;
    validity: string;
    cover: string;
    level: string;
    language: string;
    maxAttendees: number;
    requiresMedicalTest: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  error?: string;
}

export interface CertificateDTO {
  title: string;
  validFrom: string;
  validTo: string;
  issueDate: string;
  displaySource: boolean;
  watermark: boolean;
  courseId: number;
}

export interface CertificateResponse {
  success: boolean;
  message?: string;
  error?: string;
  innerData?: any;
}

export interface ExamDTO {
  title: string;
  instructions: string;
  duration: number;
  examType: string;
  totalMarks: number;
  passMarks: number;
  courseId: number;
}

export interface ExamResponse {
  success: boolean;
  message?: string;
  error?: string;
  innerData?: any;
}

export interface ExamQuestionOption {
  optionText: string;
  isCorrect: boolean;
}

export interface ExamQuestionAnswer {
  answerText: string;
  isCorrect: boolean;
  matchWith: string;
  options: string[];
}

export interface ExamQuestionDTO {
  title: string;
  description: string;
  type: string;
  examId: number;
  options: ExamQuestionOption[];
  answers: ExamQuestionAnswer[];
}

export interface QuestionResponse {
  success: boolean;
  message?: string;
  error?: string;
  innerData?: any;
}

export interface PricingDTO {
  price: number;
  discount: number;
  isTheoreticalOnly: boolean;
  type: string;
  isCompanyTraining: boolean;
}

export interface PricingResponse {
  success: boolean;
  message?: string;
  error?: string;
  innerData?: any;
}

export interface CourseExam {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  title: string;
  duration: string;
  examType: string;
  instructions: string;
  totalMarks: string;
  passMarks: string;
  courseId: number;
}

export interface CourseExamResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: CourseExam[];
}

export interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
  options: Array<{
    optionText: string;
    isCorrect: boolean;
  }>;
}

export interface QuestionListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  innerData: Question[];
}

export interface UpdateQuestionDTO {
  title: string;
  description: string;
  type: string;
  options: Array<{
    optionText: string;
    isCorrect: boolean;
  }>;
  answers: Array<{
    answerText: string;
    isCorrect: boolean;
    matchWith: string;
    options: string[];
  }>;
}

export interface CourseTypeDTO {
  code: string;
  nameEnglish: string;
  nameArabic: string;
  isActive: boolean;
}

export interface CourseType {
  id: number;
  code: string;
  nameEnglish: string;
  nameArabic: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CourseTypeResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
  innerData?: {
    count: number;
    courseTypes: CourseType[];
  };
  error?: string;
}

export interface SingleCourseTypeResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
  innerData?: {
    courseType?: CourseType;
  };
  error?: string;
}

export interface CourseEnrollmentUser {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface UserCourseEnrollment {
  id: number;
  user: CourseEnrollmentUser;
}

export interface CourseEnrollment {
  id: number;
  createdAt: string;
  status: string;
  completedAt: string | null;
  isCompleted: boolean;
  lastActivityDate: string;
  progressPercentage: number;
  certificateIssued: boolean;
  certificateIssueDate: string | null;
  userCourseEnrollment: UserCourseEnrollment;
}

export interface CourseEnrollmentsResponse {
  items: CourseEnrollment[];
  count: number;
}

export interface HandoutDTO {
  id?: number;
  title: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  type?: string;
  accessLevel?: string;
  isRequired?: boolean;
  sortOrder?: number;
  isActive: boolean;
}

export interface Handout {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  type: string;
  accessLevel: string;
  isRequired: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface HandoutResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
  innerData?: {
    count: number;
    handouts: Handout[];
  };
  error?: string;
}

export interface SingleHandoutResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
  innerData?: {
    handout?: Handout;
  };
  error?: string;
}