"use client";

import Input from "@/components/formsUI/Input";
import { Formik, Form } from "formik";
import { useTranslations } from "next-intl";

export default function HeaderSearch() {
  const t = useTranslations('common');
  const handleSearch = (values: { searchQuery: string }) => {
    console.log("Search Query:", values.searchQuery);
    // Implement the search functionality here
  };

  return (
    <div className="header-search sm:w-[300px]">
      <Formik
        initialValues={{ searchQuery: "" }}
        onSubmit={handleSearch}
      >
        {({ handleChange, values }) => (
          <Form>
            <Input
              label=""
              type="search"
              placeholder={t('searchplaceholder')}
              value={values.searchQuery}
              onChange={handleChange}
              name="searchQuery"
              icon="/images/icons/search.svg"
              border={false}
              extraClass="focus:border focus:border-1 focus:rounded-lg px-3 focus:border-solid"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
