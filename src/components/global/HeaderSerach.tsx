"use client";

import Input from "@/components/forms/Input";
import { Formik, Form } from "formik";

export default function HeaderSearch() {
  const handleSearch = (values: { searchQuery: string }) => {
    console.log("Search Query:", values.searchQuery);
    // Implement the search functionality here
  };

  return (
    <div className="header-search">
      <Formik
        initialValues={{ searchQuery: "" }}
        onSubmit={handleSearch}
      >
        {({ handleChange, values }) => (
          <Form>
            <Input
              label=""
              type="search"
              placeholder="Start typing to search..."
              value={values.searchQuery}
              onChange={handleChange}
              name="searchQuery"
              icon="/images/icons/search.svg"
              border={false}
              extraClass=""
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
