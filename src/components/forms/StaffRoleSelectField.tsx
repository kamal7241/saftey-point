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
    return (
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">{t('loading_roles')}</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex items-center justify-center p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-sm text-red-500">{t('error_loading_roles')} {fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <SelectField
      label={label}
      name={name}
      value={value ? value.toString() : ''} // Ensure value matches option value type
      onChange={(fieldName, selectedValue) => {
        // Convert back to number if your form expects a number ID
        const numericValue = parseInt(selectedValue, 10);
        const finalValue = isNaN(numericValue) ? "" : numericValue;
        onChange(fieldName, finalValue);
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