// API utility functions for making authenticated requests

interface ApiOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { requireAuth = true, ...fetchOptions } = options
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  // Make the request with credentials to include cookies
  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
    credentials: 'include', // This ensures cookies are sent with the request
  })

  // Handle token refresh if needed
  if (response.status === 401 && requireAuth) {
    // Try to refresh token
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (refreshResponse.ok) {
      // Token refreshed successfully, retry original request
      return fetch(endpoint, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      })
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login'
      throw new Error('Authentication failed')
    }
  }

  return response
}

// Convenience methods
export const api = {
  get: (endpoint: string, options?: ApiOptions) => 
    apiCall(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: ApiOptions) =>
    apiCall(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: any, options?: ApiOptions) =>
    apiCall(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: ApiOptions) =>
    apiCall(endpoint, { ...options, method: 'DELETE' }),
}
