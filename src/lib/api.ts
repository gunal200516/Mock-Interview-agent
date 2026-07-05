// API utility functions for the mock interview agent

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${BASE_URL}/api${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.error || 'Request failed',
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Dashboard API
  async getDashboardData(userId?: string): Promise<ApiResponse> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(`/dashboard${params}`);
  }

  // Chat API
  async sendChatMessage(message: string, userId: string): Promise<ApiResponse> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
    });
  }

  async getChatHistory(userId: string, sessionId?: string): Promise<ApiResponse> {
    const params = new URLSearchParams({ userId });
    if (sessionId) params.append('sessionId', sessionId);
    
    return this.request(`/chat?${params.toString()}`);
  }

  // Applications API
  async getApplications(userId: string, options?: {
    status?: string;
    limit?: number;
  }): Promise<ApiResponse> {
    const params = new URLSearchParams({ userId });
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    return this.request(`/applications?${params.toString()}`);
  }

  async createApplication(data: {
    userId: string;
    company: string;
    department: string;
    position?: string;
    status?: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(id: string, data: {
    status?: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.request('/applications', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    });
  }

  // Practice Scores API
  async addPracticeScore(data: {
    userId: string;
    category: string;
    score: number;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.request('/practice-scores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Networking Contacts API
  async getNetworkingContacts(userId: string): Promise<ApiResponse> {
    return this.request(`/networking?userId=${userId}`);
  }

  async addNetworkingContact(data: {
    userId: string;
    name: string;
    company: string;
    position?: string;
    email?: string;
    linkedin?: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.request('/networking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

// React hooks for easier usage
export const useApi = () => {
  return api;
};

// Utility function for handling API responses in components
export const handleApiResponse = <T>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => void,
  onError?: (error: string) => void
) => {
  if (response.data) {
    onSuccess(response.data);
  } else if (response.error && onError) {
    onError(response.error);
  }
};

// Type definitions for API responses
export interface DashboardData {
  user: {
    id: string;
    name: string;
    initials: string;
    plan: string;
  };
  stats: Array<{
    id: string;
    label: string;
    value: string;
    trend?: string;
    trendPositive?: boolean;
    icon: string;
    accent: string;
  }>;
  upcomingInterviews: Array<{
    id: string;
    company: string;
    initials: string;
    role: string;
    when: string;
    time: string;
    avatarAccent: 'purple' | 'teal' | 'amber';
  }>;
  recentApplications: Array<{
    id: string;
    company: string;
    department: string;
    status: string;
    applied: string;
  }>;
  weeklyActivity: Array<{
    day: string;
    hours: number;
    sessions: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info' | 'urgent';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Application {
  id: string;
  company: string;
  department: string;
  position?: string;
  status: 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';
  appliedDate: string;
  notes?: string;
  interviews?: Interview[];
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}