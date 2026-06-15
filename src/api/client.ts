const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('sx_token');
}

function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('sx_token', token);
  } else {
    localStorage.removeItem('sx_token');
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('sx_token');
    localStorage.removeItem('sx_logged_in');
    localStorage.removeItem('sx_user');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export const auth = {
  login(email: string, password: string) {
    return request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
  },

  register(email: string, username: string, password: string) {
    return request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    }, false);
  },

  me() {
    return request<{ user: any }>('/auth/me');
  },

  storeToken(token: string) {
    setToken(token);
  },

  clearToken() {
    setToken(null);
  },
};

// ─── Content ────────────────────────────────────────────────────────────────

export interface CatalogParams {
  page?: number;
  limit?: number;
  type?: 'movie' | 'series';
  genre?: string;
  year?: number;
  search?: string;
  sort?: 'rating' | 'year' | 'title';
  maturity?: string;
}

export const content = {
  getCatalog(params: CatalogParams = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    if (params.type) q.set('type', params.type);
    if (params.genre) q.set('genre', params.genre);
    if (params.year) q.set('year', String(params.year));
    if (params.search) q.set('search', params.search);
    if (params.sort) q.set('sort', params.sort);
    if (params.maturity) q.set('maturity', params.maturity);
    const qs = q.toString();
    return request<{ data: any[]; pagination: any }>(`/content/catalog${qs ? `?${qs}` : ''}`);
  },

  getFeatured() {
    return request<{ data: any[] }>('/content/featured');
  },

  getTrending(params: { page?: number; limit?: number } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return request<{ data: any[] }>(`/content/trending${qs ? `?${qs}` : ''}`);
  },

  getById(id: number) {
    return request<{ data: any }>(`/content/${id}`);
  },

  getEpisodes(id: number) {
    return request<{ data: any[] }>(`/content/${id}/episodes`);
  },

  search(query: string, page = 1) {
    return request<{ data: any[]; pagination: any }>(`/content/search?q=${encodeURIComponent(query)}&page=${page}`);
  },
};

// ─── User ───────────────────────────────────────────────────────────────────

export const user = {
  getProfile() {
    return request<{ user: any }>('/users/profile');
  },

  updateProfile(data: { displayName?: string; username?: string; avatarUrl?: string }) {
    return request<{ user: any }>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getStats() {
    return request<{ stats: any }>('/users/stats');
  },

  getWatchlist() {
    return request<{ data: any[] }>('/users/watchlist');
  },

  addToWatchlist(contentId: number) {
    return request<{ data: any }>('/users/watchlist', {
      method: 'POST',
      body: JSON.stringify({ content_id: contentId }),
    });
  },

  removeFromWatchlist(contentId: number) {
    return request<void>(`/users/watchlist/${contentId}`, { method: 'DELETE' });
  },

  getHistory() {
    return request<{ data: any[] }>('/users/history');
  },

  updateProgress(contentId: number, progress: { position_seconds: number; duration_watched_seconds: number; completed?: boolean; episode_id?: number }) {
    return request<{ data: any }>('/users/history/progress', {
      method: 'POST',
      body: JSON.stringify({ content_id: contentId, ...progress }),
    });
  },

  clearHistory() {
    return request<{ message: string }>('/users/history', { method: 'DELETE' });
  },
};

// ─── Watch ──────────────────────────────────────────────────────────────────

export const watch = {
  getStreamToken(contentId: number, episodeId?: number) {
    const q = episodeId ? `?episode_id=${episodeId}` : '';
    return request<{ token: string; url: string; expiresIn: string }>(`/watch/token/${contentId}${q}`);
  },

  reportProgress(contentId: number, data: { position_seconds: number; duration_seconds?: number; quality?: string }) {
    return request<{ message: string }>(`/watch/progress/${contentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ─── Payments ───────────────────────────────────────────────────────────────

export const payments = {
  getPlans() {
    return request<{ data: any[] }>('/payments/plans', {}, false);
  },

  createCheckout(planId: string) {
    return request<{ url: string }>('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  getPortal() {
    return request<{ url: string }>('/payments/portal');
  },

  cancelSubscription() {
    return request<{ message: string }>('/payments/cancel', { method: 'POST' });
  },
};
