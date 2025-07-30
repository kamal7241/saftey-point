/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  NotificationDTO, 
  NotificationGroupDTO, 
  NotificationResponse, 
  NotificationStatsResponse,
  NotificationGroupStatsResponse
} from '@/types/api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Utility function to get authentication headers
const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return {
    accept: '*/*',
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};



// Notification Sending
export const sendNotificationToUser = async (userId: number, notification: NotificationDTO) => {
  try {
    const response = await axios.post(
      `${API_URL}v1/mobile/notifications/send-to-user/${userId}`,
      notification,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to send notification');
    }
    
    return {
      success: true,
      data: response.data.innerData
    };
  } catch (error: unknown) {
    console.error('Send notification to user failed:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      throw new Error(error.response.data.message as string);
    }
    throw new Error('Failed to send notification to user.');
  }
};

export const sendNotificationToAll = async (notification: NotificationDTO) => {
  try {
    const response = await axios.post(
      `${API_URL}v1/mobile/notifications/send-to-all`,
      notification,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to send notification to all users');
    }
    
    return {
      success: true,
      data: response.data.innerData
    };
  } catch (error: any) {
    console.error('Send notification to all failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to send notification to all users.');
  }
};

export const getNotificationStats = async (): Promise<NotificationStatsResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}v1/mobile/notifications/stats`,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to fetch notification stats');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Get notification stats failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch notification stats.');
  }
};

// Notification Groups
export const createNotificationGroup = async (groupData: NotificationGroupDTO): Promise<NotificationResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}v1/mobile/notification-groups/create`,
      groupData,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to create notification group');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Create notification group failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create notification group.');
  }
};

export const sendNotificationToGroup = async (groupId: number, notification: NotificationDTO): Promise<NotificationResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}v1/mobile/notification-groups/send/${groupId}`,
      notification,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to send notification to group');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Send notification to group failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to send notification to group.');
  }
};

export const addUsersToGroup = async (groupId: number, userIds: number[]): Promise<NotificationResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}v1/mobile/notification-groups/add-users/${groupId}`,
      { userIds },
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to add users to group');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Add users to group failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to add users to group.');
  }
};

export const removeUsersFromGroup = async (groupId: number, userIds: number[]): Promise<NotificationResponse> => {
  try {
    const response = await axios.delete(
      `${API_URL}v1/mobile/notification-groups/remove-users/${groupId}`,
      {
        headers: getAuthHeaders(),
        data: { userIds },
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to remove users from group');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Remove users from group failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to remove users from group.');
  }
};

export const getNotificationGroupStats = async (groupId: number): Promise<NotificationGroupStatsResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}v1/mobile/notification-groups/stats/${groupId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to fetch group stats');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Get group stats failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch group stats.');
  }
};

// Additional helper functions for managing notification groups
export const fetchNotificationGroups = async (_offset: number = 0, _limit: number = 10): Promise<{ groups: any[], totalCount: number }> => {
  try {
    // This would need to be implemented based on your backend API
    // For now, returning a mock structure
    return {
      groups: [],
      totalCount: 0
    };
  } catch (error: any) {
    console.error('Fetch notification groups failed:', error);
    throw new Error('Failed to fetch notification groups.');
  }
};

export const deleteNotificationGroup = async (groupId: number): Promise<NotificationResponse> => {
  try {
    const response = await axios.delete(
      `${API_URL}v1/mobile/notification-groups/${groupId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to delete notification group');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Delete notification group failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete notification group.');
  }
}; 