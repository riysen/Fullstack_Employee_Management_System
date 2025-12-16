import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// localStorage Cache Management
// ==========================================

const CACHE_KEY = 'employees_cache';
const CACHE_TIMESTAMP_KEY = 'employees_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Check if cache is valid
const isCacheValid = () => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return false;
  
  const now = new Date().getTime();
  const cacheAge = now - parseInt(timestamp);
  
  return cacheAge < CACHE_DURATION;
};

// Get cached data
const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

// Save to cache
const saveToCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

// Clear cache
const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
};

// ==========================================
// Hybrid Employee API
// ==========================================

export const hybridEmployeeAPI = {
  
  // GET All Employees - with cache
  getAll: async (params) => {
    try {
      // Check if cache is valid and no filters applied
      const noFilters = !params.search && !params.department && !params.status;
      
      if (noFilters && isCacheValid()) {
        console.log('📦 Loading from cache...');
        const cachedData = getCachedData();
        if (cachedData) {
          return { data: cachedData, fromCache: true };
        }
      }

      // Fetch from API
      console.log('🌐 Loading from API...');
      const response = await api.get('/employees/', { params });
      
      // Save to cache (only for first page, no filters)
      if (noFilters && params.page === 1) {
        saveToCache(response.data);
      }

      return { data: response.data, fromCache: false };
      
    } catch (error) {
      // Fallback to cache if API fails
      console.log('⚠️ API failed, trying cache...');
      const cachedData = getCachedData();
      if (cachedData) {
        return { data: cachedData, fromCache: true, offline: true };
      }
      throw error;
    }
  },

  // GET Single Employee
  getOne: async (id) => {
    try {
      const response = await api.get(`/employees/${id}/`);
      return response;
    } catch (error) {
      // Try to find in cache
      const cachedData = getCachedData();
      if (cachedData && cachedData.results) {
        const employee = cachedData.results.find(e => e.id === id);
        if (employee) {
          return { data: employee, fromCache: true };
        }
      }
      throw error;
    }
  },

  // CREATE Employee
  create: async (data) => {
    try {
      const response = await api.post('/employees/', data);
      
      // Clear cache so fresh data is fetched
      clearCache();
      
      return response;
    } catch (error) {
      // Save draft to localStorage
      const drafts = JSON.parse(localStorage.getItem('employee_drafts') || '[]');
      drafts.push({
        ...data,
        id: `draft_${Date.now()}`,
        isDraft: true,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('employee_drafts', JSON.stringify(drafts));
      
      throw error;
    }
  },

  // UPDATE Employee
  update: async (id, data) => {
    try {
      const response = await api.put(`/employees/${id}/`, data);
      
      // Update cache
      const cachedData = getCachedData();
      if (cachedData && cachedData.results) {
        const index = cachedData.results.findIndex(e => e.id === id);
        if (index !== -1) {
          cachedData.results[index] = response.data;
          saveToCache(cachedData);
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // DELETE Employee
  delete: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}/`);
      
      // Clear cache
      clearCache();
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // ARCHIVE Employee
  archive: async (id) => {
    try {
      const response = await api.post(`/employees/${id}/archive/`);
      clearCache();
      return response;
    } catch (error) {
      throw error;
    }
  },

  // UNARCHIVE Employee
  unarchive: async (id) => {
    try {
      const response = await api.post(`/employees/${id}/unarchive/`);
      clearCache();
      return response;
    } catch (error) {
      throw error;
    }
  },

  // GET Statistics
  getStatistics: async () => {
    const STATS_CACHE_KEY = 'employees_stats_cache';
    
    try {
      // Check cache first
      if (isCacheValid()) {
        const cached = localStorage.getItem(STATS_CACHE_KEY);
        if (cached) {
          return { data: JSON.parse(cached), fromCache: true };
        }
      }

      // Fetch from API
      const response = await api.get('/employees/statistics/');
      localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(response.data));
      
      return response;
    } catch (error) {
      // Fallback to cache
      const cached = localStorage.getItem(STATS_CACHE_KEY);
      if (cached) {
        return { data: JSON.parse(cached), fromCache: true, offline: true };
      }
      throw error;
    }
  },

  // Get pending drafts
  getDrafts: () => {
    const drafts = localStorage.getItem('employee_drafts');
    return drafts ? JSON.parse(drafts) : [];
  },

  // Clear drafts
  clearDrafts: () => {
    localStorage.removeItem('employee_drafts');
  },

  // Manual cache clear
  clearAllCache: () => {
    clearCache();
    localStorage.removeItem('employees_stats_cache');
    console.log('✅ All cache cleared');
  },
};

// ==========================================
// User Preferences (localStorage only)
// ==========================================

export const userPreferences = {
  
  // Save filter preferences
  saveFilters: (filters) => {
    localStorage.setItem('user_filters', JSON.stringify(filters));
  },

  // Get filter preferences
  getFilters: () => {
    const filters = localStorage.getItem('user_filters');
    return filters ? JSON.parse(filters) : null;
  },

  // Save sort order
  saveSortOrder: (order) => {
    localStorage.setItem('user_sort_order', order);
  },

  // Get sort order
  getSortOrder: () => {
    return localStorage.getItem('user_sort_order');
  },

  // Save view mode (table/card)
  saveViewMode: (mode) => {
    localStorage.setItem('view_mode', mode);
  },

  // Get view mode
  getViewMode: () => {
    return localStorage.getItem('view_mode') || 'table';
  },

  // Save page size preference
  savePageSize: (size) => {
    localStorage.setItem('page_size_preference', size.toString());
  },

  // Get page size preference
  getPageSize: () => {
    const size = localStorage.getItem('page_size_preference');
    return size ? parseInt(size) : 10;
  },

  // Recent searches
  saveRecentSearch: (search) => {
    const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    if (!recent.includes(search)) {
      recent.unshift(search);
      localStorage.setItem('recent_searches', JSON.stringify(recent.slice(0, 10)));
    }
  },

  getRecentSearches: () => {
    return JSON.parse(localStorage.getItem('recent_searches') || '[]');
  },

  clearRecentSearches: () => {
    localStorage.removeItem('recent_searches');
  },
};

// Auth API (already uses localStorage for tokens)
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  refresh: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
};

export default api;  