import { Formik, Form } from "formik";
import { useState } from "react";
import Input from "./Input";
import { SearchNormal } from "../ui/icons/SearchNormal";

interface SearchFormProps {
  onSearch: (searchTerm: string) => void; // Function to handle search
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (values: { search: string }) => {
    onSearch(values.search);
    setSearchTerm(values.search);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    submitForm: () => void
  ) => {
    if (e.key === "Enter") {
      submitForm();
    }
  };

  return (
    <Formik
      initialValues={{ search: searchTerm }}
      onSubmit={handleSearchSubmit}
    >
      {({ setFieldValue, values, submitForm }) => (
        <Form className="flex items-center gap-2">
          <Input
            type="text"
            required={false}
            placeholder="Search..."
            value={values.search}
            iconSVG={<SearchNormal />}
            // onChange={(e) => {
            //   setFieldValue("search", e.target.value);
            //   submitForm();
            // }}
            onChange={(e) => {
              if (typeof e === "string") {
                setFieldValue("search", e);
              } else if (e && "target" in e) {
                setFieldValue("search", e.target.value);
              }
              submitForm();
            }}
            
            name="search"
            onKeyDown={(e) => handleKeyPress(e, submitForm)}
          />
        </Form>
      )}
    </Formik>
  );
};

export default SearchForm;
