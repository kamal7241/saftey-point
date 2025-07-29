"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/UserProvider";
import Input from "@/components/formsUI/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/global/PageHeader";

import Popup from "@/components/ui/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faShield, 
  faEnvelope, 
  faPhone, 
  faIdCard, 
  faCalendar, 
  faCheckCircle, 
  faEdit,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const t = useTranslations("common");
  const { user, updateUserContext } = useAuth();
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("dashboard"), href: "/dashboard" },
    { label: t("profile"), href: "/dashboard/profile" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    // For now, we'll just update the local context
    if (user) {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      // Note: updateUserContext expects tokens, but we don't have them in the user object
      // This is a simplified version - in a real app, you'd need to handle this properly
      updateUserContext(updatedUser, "", "");
    }
    setEditPopupOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
    setEditPopupOpen(false);
  };

  const handleEditClick = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
    setEditPopupOpen(true);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-500">{t("please_log_in")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("profile")}
        actions={
          <Button className="hidden" onClick={handleEditClick} icon={<FontAwesomeIcon icon={faEdit} />} label={t("edit")} />
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <div className="p-8 text-center bg-gray-100 rounded-lg">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-white text-4xl font-bold">
                    {user.firstName?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-dark mb-2">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-light-400 mb-4">{user.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                {t("active_account")}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Information */}
            <div className="p-8 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary bg-gray-200 p-3 rounded-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark">{t("personal_information")}</h3>
                  <p className="text-light-400 text-sm">{t("your_basic_profile_details")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-light-400">{t("first_name")}</label>
                  <p className="text-dark font-semibold text-lg">
                    {user.firstName || t("not_provided")}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-light-400">{t("last_name")}</label>
                  <p className="text-dark font-semibold text-lg">
                    {user.lastName || t("not_provided")}
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-light-400">{t("email_address")}</label>
                  <p className="text-dark font-semibold text-lg">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="p-8 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faShield} className="w-5 h-5 text-primary bg-gray-200 p-3 rounded-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark">{t("account_information")}</h3>
                  <p className="text-light-400 text-sm">{t("your_account_and_security_details")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-light-400">{t("email")}</span>
                  </div>
                  <p className="text-dark font-semibold">{user.email}</p>
                </div>

                <div className="p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-light-400">{t("phone_number")}</span>
                  </div>
                  <p className="text-dark font-semibold">
                    {"phone" in user ? (user as { phone: string }).phone : t("not_provided")}
                  </p>
                </div>

                <div className="p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faIdCard} className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-light-400">{t("user_id")}</span>
                  </div>
                  <p className="text-dark font-semibold">{user.id || "N/A"}</p>
                </div>

                <div className="p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faShield} className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-light-400">{t("role")}</span>
                  </div>
                  <p className="text-dark font-semibold capitalize">
                    {("role" in user && user.role) ||
                      ("roles" in user && user.roles?.[0]?.role?.name) ||
                      "User"}
                  </p>
                </div>

                <div className="p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faCalendar} className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-light-400">{t("member_since")}</span>
                  </div>
                  <p className="text-dark font-semibold">January 2024</p>
                </div>

                <div className="p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-light-400">{t("status")}</span>
                  </div>
                  <p className="text-success font-semibold">{t("active")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Popup isOpen={editPopupOpen} onClose={handleCancel}>
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faEdit} className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark">{t("edit_profile")}</h3>
              <p className="text-light-400 text-sm">{t("update_personal_information")}</p>
            </div>
          </div>
          
          {/* Profile Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-dark mb-4">{t("personal_information")}</h4>
            <div className="space-y-4">
              <Input
                label={t("first_name")}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  handleInputChange(
                    "firstName",
                    (e as React.ChangeEvent<HTMLInputElement>).target.value
                  )
                }
                placeholder={`Enter your ${t("first_name").toLowerCase()}`}
              />

              <Input
                label={t("last_name")}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  handleInputChange(
                    "lastName",
                    (e as React.ChangeEvent<HTMLInputElement>).target.value
                  )
                }
                placeholder={`Enter your ${t("last_name").toLowerCase()}`}
              />

              <Input
                label={t("email_address")}
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  handleInputChange(
                    "email",
                    (e as React.ChangeEvent<HTMLInputElement>).target.value
                  )
                }
                placeholder={`Enter your ${t("email_address").toLowerCase()}`}
              />
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-dark mb-4">{t("account_details")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-light-400 mb-2">
                  {t("user_id")}
                </label>
                <p className="text-dark font-semibold">{user.id || "N/A"}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-light-400 mb-2">
                  {t("role")}
                </label>
                <p className="text-dark font-semibold capitalize">
                  {("role" in user && user.role) ||
                    ("roles" in user && user.roles?.[0]?.role?.name) ||
                    "User"}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-light-400 mb-2">
                {t("phone_number")}
              </label>
              <p className="text-dark font-semibold">
                {"phone" in user ? (user as { phone: string }).phone : t("not_provided")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button onClick={handleSave} label={t("save_changes")} />
            <Button
              variant="secondary"
              onClick={handleCancel}
              icon={<FontAwesomeIcon icon={faTimes} />}
              label={t("cancel")}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ProfilePage;
