import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.VITE_API_BASE_URL });

export default boot(({ app, router }) => {
  const authStore = useAuthStore();
  const { token: tokenValue } = storeToRefs(authStore);
  const { setToken, setUser } = authStore;

  const logout = async () => {
    setToken(null);
    setUser(null);
    await router.push('/');
  };

  api.interceptors.request.use(
    (config) => {
      const token = tokenValue.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response?.status === 401 &&
        error.response.data?.message === 'Unauthenticated.'
      ) {
        await logout();
      }
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
