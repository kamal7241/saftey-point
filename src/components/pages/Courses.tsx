"use client";
import { deleteCourse, fetchCourses } from "@/api/courseService";
import Table from "@/components/ui/Table";
import { SingleCourse } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePageLoading } from "@/hooks/usePageLoading";
// import NewCourseForm from "../forms/NewCourseForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Add } from "../ui/icons/Add";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";
import { toast } from "react-toastify";

const Courses = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [courses, setCourses] = useState<SingleCourse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  const limit = 10;

  // Use the page loading hook to show loading state in sidebar
  usePageLoading(loading);

  const getCourses = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchCourses(offset, limit);
    setCourses(response.courses.map((course: SingleCourse) => ({
      ...course,
      image: course.cover ? `${process.env.NEXT_PUBLIC_URL}${course.cover}` : ''
    })));
    console.log(response.courses);
    
    setTotalCount(response.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    getCourses();
  }, [currentPage]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return course[key as keyof SingleCourse]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof SingleCourse }[] = [
    { header: "course_id", accessor: "id" },
    { header: "image", accessor: "image" },
    { header: "name", accessor: "title" },
    { header: "language", accessor: "language" },
    { header: "enrollments", accessor: "enrollments" },
    { header: "sessions", accessor: "sessions" },
    { header: "level", accessor: "level" },
    { header: "status", accessor: "status" },
    { header: "created", accessor: "createdAt" },
  ];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleApplyFilters = (appliedFilters: { [key: string]: string }) =>
    setFilters(appliedFilters);
  const handleResetFilters = () => setFilters({});

  // const handleView = (id: number) => router.push(`/dashboard/courses-management/list/${id}`);
  // const handleEdit = (id: number) => console.log("Editing course with ID:", id);
  const handleDelete = async (id: number) => {
    setCourseToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      const response = await deleteCourse(courseToDelete);
      if (response.success) {
        toast.success(response.message || t("course_deleted_success"));
        getCourses(); // Refresh the courses list
      } else {
        toast.error(response.error || t("delete_failed"));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || t("delete_failed"));
      } else {
        toast.error(t("delete_failed"));
      }
    } finally {
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
    }
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("courses-management"), href: "/dashboard/courses-management" },
    { label: t("courses_list"), href: "/dashboard/courses-management/list" },
  ];

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("courses_list")} />

      <div className="mt-6 rounded-2xl bg-white">
        <div className="flex flex-wrap-reverse items-center justify-between gap-6 p-4">
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3">
            <Button
              label={t("buttons.add_course")}
              href="/dashboard/courses-management/new"
              icon={
                <span className="inline-block w-6">
                  <Add />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.filters")}
              onClick={() => setFiltersOpen(!filtersOpen)}
              variant={!filtersOpen ? "transparent" : "selected"}
            />
            <Button
              label={t("buttons.export")}
              onClick={() => console.log("Exporting courses...")}
              variant="dark"
              icon={
                <span className="inline-block w-6">
                  <Export />
                </span>
              }
            />
          </div>
        </div>

        {filtersOpen && (
          <FilterForm
            fields={[
              {
                type: "text",
                label: "Title",
                name: "title",
                placeholder: "Title",
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={filteredCourses}
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: handlePageChange,
          }}
          sortable
          rowsPerPage={limit}
          renderRowActions={(row) => (
            <div className="flex gap-2">
              {/* <Switcher /> */}
              <Button
                icon={<Eye />}
                noBackground
                textColor="blue-400"
                noLabel
                href={`/dashboard/courses-management/list/${row.id}`}
              />
              <Button
                icon={<Edit />}
                noBackground
                textColor="gray-900"
                noLabel
                href={`/dashboard/courses-management/list/${row.id}`}
              />
              <Button
                icon={<Delete />}
                noBackground
                textColor="red-500"
                noLabel
                onClick={() => handleDelete(row.id)}
              />
            </div>
          )}
          isLoading={loading}
        />
      </div>

      <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)}>
        Course Form
        {/* <NewCourseForm title={t("add_course")} sub_title={t("form_subtitle")} onClose={() => setAddPopupOpen(false)} /> */}
      </Popup>

      <Popup isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">{t("confirm_delete")}</h3>
          <p className="mb-6">{t("delete_course_confirmation")}</p>
          <div className="flex justify-end gap-4">
            <Button
              label={t("cancel")}
              onClick={() => setDeleteConfirmOpen(false)}
              variant="transparent"
            />
            <Button
              label={t("delete")}
              onClick={confirmDelete}
              variant="danger"
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Courses;
