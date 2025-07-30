"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";
import { 
  getNotificationStats, 
  fetchNotificationGroups, 
  deleteNotificationGroup 
} from "@/api/notificationService";
import { NotificationStats, NotificationGroup } from "@/types/api.types";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import Popup from "../ui/Popup";
import NewNotificationForm from "../forms/NewNotificationForm";
import NewNotificationGroupForm from "../forms/NewNotificationGroupForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEye,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const Notifications = () => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Popup states
  const [sendNotificationOpen, setSendNotificationOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<NotificationGroup | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, groupsResponse] = await Promise.all([
        getNotificationStats(),
        fetchNotificationGroups()
      ]);
      
      if (statsResponse.innerData) {
        setStats(statsResponse.innerData);
      }
      
      if (groupsResponse.groups) {
        setGroups(groupsResponse.groups);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : tMsgs("failed_to_fetch_groups");
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      await deleteNotificationGroup(selectedGroup.id);
      showToast.success(tMsgs("group_deleted_successfully"));
      fetchData();
      setDeleteGroupOpen(false);
      setSelectedGroup(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : tMsgs("failed_to_delete_group");
      showToast.error(errorMessage);
    }
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("notifications.notifications"), href: "/dashboard/notifications" },
  ];

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsCards = [
    {
      title: t("notifications.total_tokens"),
      value: stats?.totalTokens || 0,
      color: "bg-blue-900"
    },
    {
      title: t("notifications.active_users"),
      value: stats?.activeUsers || 0,
      color: "bg-green-900"
    },
    {
      title: t("notifications.android_users"),
      value: stats?.platformStats?.find(p => p.platform === "ANDROID")?.count || "0",
      color: "bg-yellow-900"
    },
    {
      title: t("notifications.ios_users"),
      value: stats?.platformStats?.find(p => p.platform === "IOS")?.count || "0",
      color: "bg-purple-900"
    }
  ];

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("notifications.notifications")} />

      <div className="mt-6 space-y-6">
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

        {/* Platform Stats */}
        {stats?.platformStats && stats.platformStats.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("notifications.platform_breakdown")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.platformStats.map((platform, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {platform.platform}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {platform.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => setSendNotificationOpen(true)}
            label={t("notifications.send_notification")}
            icon={<FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />}
          />
          <Button
            className="bg-gray-900 text-white hover:bg-gray-600"
            variant="secondary"
            onClick={() => setCreateGroupOpen(true)}
            label={t("notifications.create_group")}
            icon={<FontAwesomeIcon icon={faPlus} className="w-4 h-4" />}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("notifications.search_groups")}
              className="w-full px-4 py-2 border border-gray-300 placeholder:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setFiltersOpen(!filtersOpen)}
            label={t("notifications.filters")}
          />
        </div>

        {/* Groups Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t("notifications.notification_groups")}
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-900">{t("notifications.loading")}</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-900">{t("notifications.no_groups_found")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      {t("notifications.group_name")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      {t("notifications.description")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      {t("notifications.user_count")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      {t("notifications.created_at")}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                      {t("notifications.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {group.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {group.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {group.userCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                                                  <button
                          onClick={() => router.push(`/dashboard/notifications/${group.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGroup(group);
                            setSendNotificationOpen(true);
                          }}
                          className="text-green-600 hover:text-green-900 px-2 py-1 text-xs"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGroup(group);
                            setDeleteGroupOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                        </div>
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
                <h3 className="text-xl font-semibold text-dark">{t("notifications.send_notification")}</h3>
                <p className="text-light-400 text-sm">{t("notifications.enter_notification_details")}</p>
              </div>
            </div>
            
            <NewNotificationForm
              onSuccess={() => {
                setSendNotificationOpen(false);
                fetchData();
              }}
              onCancel={() => setSendNotificationOpen(false)}
              selectedUserId={undefined}
              isGroupNotification={!!selectedGroup}
            />
          </div>
        </Popup>

        {/* Create Group Popup */}
        <Popup isOpen={createGroupOpen} onClose={() => setCreateGroupOpen(false)}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5 duotone-icon duotone-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark">{t("notifications.create_notification_group")}</h3>
                <p className="text-light-400 text-sm">{t("notifications.create_group_description")}</p>
              </div>
            </div>
            
            <NewNotificationGroupForm
              onSuccess={() => {
                setCreateGroupOpen(false);
                fetchData();
              }}
              onCancel={() => setCreateGroupOpen(false)}
            />
          </div>
        </Popup>

        {/* Delete Confirmation Popup */}
        <Popup isOpen={deleteGroupOpen} onClose={() => setDeleteGroupOpen(false)}>
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5 duotone-icon duotone-danger" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark">{t("notifications.confirm_delete")}</h3>
                <p className="text-light-400 text-sm">{t("notifications.are_you_sure_delete_group")}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                {t("notifications.group_name")}: <strong>{selectedGroup?.name}</strong>
              </p>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleDeleteGroup}
                  label={t("notifications.delete")}
                  className="bg-red-600 hover:bg-red-700"
                />
                <Button
                  variant="secondary"
                  onClick={() => setDeleteGroupOpen(false)}
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

export default Notifications; 