// PokerNow API Client
// バックエンドAPIとの通信を担当

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3248';

// APIレスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

// APIエラー
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// 認証トークン管理
let authToken: string | null = localStorage.getItem('pokernow_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('pokernow_token', token);
  } else {
    localStorage.removeItem('pokernow_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// HTTPクライアント
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || 'API request failed',
      data.details
    );
  }

  return data;
}

// HTTP メソッド
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
