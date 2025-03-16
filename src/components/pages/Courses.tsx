"use client";
import { fetchCourses } from "@/api/courseService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { SingleCourse } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
import Switcher from "../ui/SmallSwitcher";

const Courses = () => {
  const t = useTranslations("common");
  const router = useRouter();
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

  const limit = 10;
  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const response = await fetchCourses(offset, limit);
      setCourses(response.courses);
      setTotalCount(response.totalCount);
      setLoading(false);
    };
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
    { header: "name", accessor: "title" },
    { header: "language", accessor: "language" },
    { header: "enrollments", accessor: "enrollments" },
    { header: "sessions", accessor: "sessions" },
    { header: "level", accessor: "level" },
    { header: "status", accessor: "status" },
  ];


  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleApplyFilters = (appliedFilters: { [key: string]: string }) =>
    setFilters(appliedFilters);
  const handleResetFilters = () => setFilters({});

  const handleView = (id: number) => router.push(`/dashboard/courses-management/list/${id}`);
  const handleEdit = (id: number) => console.log("Editing course with ID:", id);
  const handleDelete = (id: number) =>
    console.log("Deleting course with ID:", id);

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
              <Switcher />
              <Button
                icon={<Eye />}
                noBackground
                textColor="blue-400"
                noLabel
                onClick={() => handleView(row.id)}
              />
              <Button
                icon={<Edit />}
                noBackground
                textColor="gray-900"
                noLabel
                onClick={() => handleEdit(row.id)}
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
    </div>
  );
};

export default Courses;
