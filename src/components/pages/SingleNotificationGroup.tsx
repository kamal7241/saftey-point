"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { showToast } from "@/utils/toast";
import { 
  getNotificationGroupStats
} from "@/api/notificationService";
import { NotificationGroupStats, NotificationGroup } from "@/types/api.types";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import Popup from "../ui/Popup";
import NewNotificationForm from "../forms/NewNotificationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPaperPlane,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const SingleNotificationGroup = () => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const params = useParams();
  const groupId = Number(params.groupId);
  
  const [stats, setStats] = useState<NotificationGroupStats | null>(null);
  const [group, setGroup] = useState<NotificationGroup | null>(null);
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Popup states
  const [sendNotificationOpen, setSendNotificationOpen] = useState(false);
  const [addUsersOpen, setAddUsersOpen] = useState(false);
  const [removeUsersOpen, setRemoveUsersOpen] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const fetchData = async () => {
    try {
             const [statsResponse, groupResponse, usersResponse] = await Promise.all([
         getNotificationGroupStats(groupId),
         fetchGroupDetails(),
         fetchGroupUsers()
       ]);
      
      if (statsResponse.innerData) {
        setStats(statsResponse.innerData);
      }
      
      if (groupResponse) {
        setGroup(groupResponse);
      }
      
      if (usersResponse) {
        setUsers(usersResponse);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : tMsgs("failed_to_fetch_group_stats");
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetails = async () => {
    // Mock data for now
    return {
      id: groupId,
      name: `Group ${groupId}`,
      description: "Sample group description",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      userCount: 5
    };
  };

  const fetchGroupUsers = async () => {
    // Mock data for now
    return [
      { id: 1, name: "User 1", email: "user1@example.com" },
      { id: 2, name: "User 2", email: "user2@example.com" },
      { id: 3, name: "User 3", email: "user3@example.com" }
    ];
  };



  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("notifications.notifications"), href: "/dashboard/notifications" },
    { label: group?.name || t("notifications.group_details"), href: `/dashboard/notifications/${groupId}` },
  ];

  const statsCards = [
    {
      title: t("notifications.total_users"),
      value: stats?.totalUsers || 0,
      color: "bg-blue-500"
    },
    {
      title: t("notifications.total_sent"),
      value: stats?.totalSent || 0,
      color: "bg-green-500"
    },
    {
      title: t("notifications.delivery_rate"),
      value: `${stats?.deliveryRate || 0}%`,
      color: "bg-yellow-500"
    },
    {
      title: t("notifications.read_rate"),
      value: `${stats?.readRate || 0}%`,
      color: "bg-purple-500"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">{t("notifications.loading")}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={group?.name || t("notifications.group_details")} />

      <div className="mt-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="primary"
            onClick={() => setSendNotificationOpen(true)}
            label={t("notifications.send_notification_to_group")}
            icon={<FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />}
          />
          <Button
            variant="secondary"
            onClick={() => setAddUsersOpen(true)}
            label={t("notifications.add_users")}
            icon={<FontAwesomeIcon icon={faPlus} className="w-4 h-4" />}
          />
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{card.value}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("notifications.search_users")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {t("notifications.group_users")}
          </h3>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">{t("notifications.no_users_found")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("notifications.user_name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("notifications.email")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("notifications.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          // Handle remove user
                        }}
                        className="text-red-600 hover:text-red-900 px-2 py-1 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Notification Popup */}
      <Popup isOpen={sendNotificationOpen} onClose={() => setSendNotificationOpen(false)}>
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5 duotone-icon duotone-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark">{t("notifications.send_notification_to_group")}</h3>
              <p className="text-light-400 text-sm">{t("notifications.send_notification_to_group_description")}</p>
            </div>
          </div>
          
          <NewNotificationForm
            onSuccess={() => {
              setSendNotificationOpen(false);
              fetchData();
            }}
            onCancel={() => setSendNotificationOpen(false)}
            isGroupNotification={true}
          />
        </div>
      </Popup>

      {/* Add Users Popup */}
      <Popup isOpen={addUsersOpen} onClose={() => setAddUsersOpen(false)}>
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 duotone-icon duotone-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark">{t("notifications.add_users_to_group")}</h3>
              <p className="text-light-400 text-sm">{t("notifications.add_users_description")}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              {t("notifications.add_users_description")}
            </p>
            
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={() => {
                  // Handle add users
                  setAddUsersOpen(false);
                }}
                label={t("notifications.add")}
              />
              <Button
                variant="secondary"
                onClick={() => setAddUsersOpen(false)}
                label={t("cancel")}
              />
            </div>
          </div>
        </div>
      </Popup>

      {/* Remove Users Popup */}
      <Popup isOpen={removeUsersOpen} onClose={() => setRemoveUsersOpen(false)}>
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faTrash} className="w-5 h-5 duotone-icon duotone-danger" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark">{t("notifications.remove_users_from_group")}</h3>
              <p className="text-light-400 text-sm">{t("notifications.remove_users_description")}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              {t("notifications.remove_users_description")}
            </p>
            
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  // Handle remove users
                  setRemoveUsersOpen(false);
                }}
                label={t("notifications.remove")}
                className="bg-red-600 hover:bg-red-700"
              />
              <Button
                variant="secondary"
                onClick={() => setRemoveUsersOpen(false)}
                label={t("cancel")}
              />
            </div>
          </div>
        </div>
      </Popup>
      </div>
    </div>
  );
};

export default SingleNotificationGroup; 