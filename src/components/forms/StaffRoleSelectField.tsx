/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { fetchStaffRoles, StaffRoleItem } from '@/api/roleService';
import { useTranslations } from 'next-intl';
import SelectField from '../formsUI/SelectField';

interface StaffRoleSelectFieldProps {
  label: string;
  name: string;
  value: number | string;
  onChange: (name: string, value: number | string) => void;
  error?: string;
  touched?: boolean;
  customDropdown?: boolean;
  placeholder?: string;
}

const StaffRoleSelectField: React.FC<StaffRoleSelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  touched,
  customDropdown,
  placeholder = 'Select a role',
}) => {
  const t = useTranslations('common');
  const [roles, setRoles] = useState<StaffRoleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const getRoles = async () => {
      try {
        setLoading(true);
        const fetchedRoles = await fetchStaffRoles();
        setRoles(fetchedRoles);
        setFetchError(null);
      } catch (err) {
        console.error('Failed to fetch staff roles:', err);
        setFetchError(err instanceof Error ? err.message : 'Failed to load roles');
        setRoles([]);
      }
      setLoading(false);
    };

    getRoles();
  }, []);

  const roleOptions = roles.map((role) => ({
    value: role.id.toString(),
    label: role.name,
  }));

  if (loading) {
    return <p>{t('loading_roles')}</p>;
  }

  if (fetchError) {
    return <p className="text-xs text-red-500">{t('error_loading_roles')} {fetchError}</p>;
  }

  return (
    <SelectField
      label={label}
      name={name}
      value={value ? value.toString() : ''} // Ensure value matches option value type
      onChange={(fieldName, selectedValue) => {
        // Convert back to number if your form expects a number ID
        const numericValue = parseInt(selectedValue, 10);
        onChange(fieldName, isNaN(numericValue) ? selectedValue : numericValue);
      }}
      options={roleOptions}
      placeholder={placeholder}
      customDropdown={customDropdown}
      // error={error}
      // touched={touched}
    />
  );
};

export default StaffRoleSelectField;