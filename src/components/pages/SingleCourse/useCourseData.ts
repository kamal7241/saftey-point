import { useState, useEffect, useCallback } from "react";
import {
  fetchCourseById,
  fetchCourseCertificate,
  fetchCourseExams,
  fetchCoursePricing,
  fetchCourseSession,
  fetchCourseEnrollments,
} from "@/api/courseService";
import type { SingleCourse } from "@/types/ui.types";
import { CourseEnrollment } from "@/types/api.types";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";

type ActiveTab = "course_info" | "pricing" | "exam" | "certificate" | "sessions" | "enrollments";

export function useCourseData(courseID: string, activeTab: ActiveTab) {
  const tMsgs = useTranslations("messages");
  const [courseData, setCourseData] = useState<SingleCourse>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pricingData, setPricingData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [examData, setExamData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certificateData, setCertificateData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [enrollmentsData, setEnrollmentsData] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true); // General loading for initial course fetch
  const [tabLoading, setTabLoading] = useState(false); // Specific loading for tab data
  const [error, setError] = useState<string | null>(null);

  const getCourseData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourseById(Number(courseID));
      if (data) {
        setCourseData(data);
      } else {
        setError("Failed to fetch Course data.");
        showToast.error(tMsgs("error_fetching_course"));
      }
    } catch (err) {
       setError("An error occurred while fetching course data.");
       showToast.error(tMsgs("error_fetching_course"));
       console.error(err);
    } finally {
        setLoading(false);
    }
  }, [courseID, tMsgs]);

  const getCertificateData = useCallback(async () => {
    setTabLoading(true);
    try {
      const data = await fetchCourseCertificate(Number(courseID));
      setCertificateData(data || []);
    } catch (err) {
        showToast.error(tMsgs("error_fetching_certificate"));
        console.error(err);
        setCertificateData([]);
    } finally {
        setTabLoading(false);
    }
  }, [courseID, tMsgs]);

  const getSessionData = useCallback(async () => {
    setTabLoading(true);
    try {
        const data = await fetchCourseSession(Number(courseID));
        setSessionData(data || []);
    } catch (err) {
        showToast.error(tMsgs("error_fetching_sessions"));
        console.error(err);
        setSessionData([]);
    } finally {
        setTabLoading(false);
    }
  }, [courseID, tMsgs]);

  const getPricingData = useCallback(async () => {
    setTabLoading(true);
    try {
        const data = await fetchCoursePricing(Number(courseID));
        setPricingData(data || []);
    } catch (err) {
        showToast.error(tMsgs("error_fetching_pricing"));
        console.error(err);
        setPricingData([]);
    } finally {
        setTabLoading(false);
    }
  }, [courseID, tMsgs]);

  const getExamData = useCallback(async () => {
    setTabLoading(true);
    try {
        const data = await fetchCourseExams(Number(courseID));
        setExamData(data || []);
    } catch (err) {
        showToast.error(tMsgs("error_fetching_exams"));
        console.error(err);
        setExamData([]);
    } finally {
        setTabLoading(false);
    }
  }, [courseID, tMsgs]);

  const getEnrollmentsData = useCallback(async () => {
    setTabLoading(true);
    try {
        const data = await fetchCourseEnrollments(Number(courseID));
        setEnrollmentsData(data?.items || []);
    } catch (err) {
        showToast.error(tMsgs("error_fetching_enrollments"));
        console.error(err);
        setEnrollmentsData([]);
    } finally {
        setTabLoading(false);
    }
  }, [courseID, tMsgs]);

  // Fetch base course data on mount
  useEffect(() => {
    getCourseData();
  }, [getCourseData]);

  // Fetch data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case "certificate":
        getCertificateData();
        break;
      case "sessions":
        getSessionData();
        break;
      case "pricing":
        getPricingData();
        break;
      case "exam":
        getExamData();
        break;
      case "enrollments":
        getEnrollmentsData();
        break;
      // No specific fetch needed for 'course_info' as it uses courseData
      default:
        break;
    }
  }, [activeTab, getCertificateData, getSessionData, getPricingData, getExamData, getEnrollmentsData]);

  return {
    courseData,
    pricingData,
    examData,
    certificateData,
    sessionData,
    enrollmentsData,
    loading, // Initial course loading
    tabLoading, // Loading state for data fetched based on tab
    error,
    refetchCourseData: getCourseData, // Expose refetch function for main course data
    refetchPricingData: getPricingData, // Expose refetch function for pricing data
    refetchCertificateData: getCertificateData, // Expose refetch function for certificate data
    refetchSessionData: getSessionData, // Expose refetch function for session data
    refetchExamData: getExamData, // Expose refetch function for exam data
    refetchEnrollmentsData: getEnrollmentsData, // Expose refetch function for enrollments data
  };
}