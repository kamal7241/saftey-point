export const getChangedFields = <T extends { [key: string]: string | undefined }>(
    initialValues: T,
    currentValues: T
  ): Partial<T> => {
    const changedFields: Partial<T> = {};
  
    (Object.keys(initialValues) as Array<keyof T>).forEach((key) => {
      if (initialValues[key] !== currentValues[key]) {
        changedFields[key] = currentValues[key];
      }
    });
  
    return changedFields;
  };