import axios from 'axios';

// Create central Axios instance pointing to Laravel API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables Sanctum cookie and session sharing
});

// Request Interceptor: Attach Bearer token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages & handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract user-friendly error message
    let errorMessage = 'Terjadi kesalahan pada sistem.';

    if (!error.response) {
      errorMessage = 'Koneksi ke server gagal. Pastikan backend Laravel aktif pada port 8000.';
    } else if (error.response.data?.errors) {
      // Laravel validation errors object: { field: ['error 1'] }
      const firstKey = Object.keys(error.response.data.errors)[0];
      if (firstKey && error.response.data.errors[firstKey]?.length > 0) {
        errorMessage = error.response.data.errors[firstKey][0];
      }
    } else if (error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.status === 401) {
      errorMessage = 'Sesi telah berakhir atau Anda belum login.';
    } else if (error.response.status === 403) {
      errorMessage = 'Anda tidak memiliki akses ke sumber daya ini.';
    } else if (error.response.status === 404) {
      errorMessage = 'Data atau rute tidak ditemukan.';
    } else if (error.response.status >= 500) {
      errorMessage = 'Terjadi kesalahan pada server internal.';
    }

    // Attach processed message to error object for easy access
    error.userMessage = errorMessage;

    // Handle 401 Unauthorized: clear expired token and notify app
    if (error.response?.status === 401) {
      const isLoginOrRegister =
        error.config?.url?.includes('/api/login') || error.config?.url?.includes('/api/register');
      if (!isLoginOrRegister) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication API Service
 */
export const authApi = {
  // Request CSRF cookie before authentication calls
  getCsrfCookie: async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
    } catch {
      // Non-fatal if using Bearer token directly
    }
  },

  // Login user with email and password
  login: async (credentials) => {
    await authApi.getCsrfCookie();
    const response = await api.post('/api/login', credentials);
    return response.data;
  },

  // Register user with full details
  register: async (payload) => {
    await authApi.getCsrfCookie();
    const response = await api.post('/api/register', payload);
    return response.data;
  },

  // Logout user and revoke token
  logout: async () => {
    try {
      await api.post('/api/logout');
    } catch (err) {
      // Ignore network errors on logout
      console.warn('Logout API call failed, continuing local cleanup', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Get current authenticated user profile
  getUser: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
};

/**
 * Wallet and Transactions API Service
 */
export const walletApi = {
  // Retrieve current wallet balance
  getBalance: async () => {
    const response = await api.get('/api/wallet');
    return response.data;
  },

  // Top up wallet balance
  topup: async (amount) => {
    const response = await api.post('/api/topup', { amount: Number(amount) });
    return response.data;
  },

  // Transfer funds to another user (by email or phone number)
  transfer: async ({ to, amount }) => {
    const response = await api.post('/api/transfer', { to, amount: Number(amount) });
    return response.data;
  },

  // Retrieve transaction history
  getTransactions: async () => {
    const response = await api.get('/api/transactions');
    return response.data;
  },
};

/**
 * Currency formatter helper
 */
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number || 0);
};

export default api;
