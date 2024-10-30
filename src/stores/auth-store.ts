/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStorage } from '@vueuse/core';
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { User } from 'src/ts/interfaces/data/User';
import { doLoginService, doRegisterService } from 'src/services/auth-service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loadingAuth: false as boolean,
    user: useStorage('themplus_user', {} as User | null),
    token: useStorage('themplus_token', null as string | null),
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
    setLoading(loading: boolean) {
      this.loadingAuth = loading;
    },
    createError(error: any) {
      let message = 'Error';
      if (error instanceof AxiosError) {
        message = error.response?.data?.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      Notify.create({
        message,
        type: 'negative',
      });
    },
    async doLogin(email: string, password: string) {
      this.setLoading(true);
      try {
        const response = await doLoginService(email, password);
        if (response.status === 200) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          this.router.push({ name: 'admin-feed' });
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async doRegister(
      name: string,
      email: string,
      password: string,
      nameEnterprise: string
    ) {
      this.setLoading(true);
      try {
        const response = await doRegisterService(
          name,
          email,
          password,
          nameEnterprise
        );
        if (response.status === 201) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);

          Notify.create({
            message: response.data.message,
            type: 'positive',
          });
          this.router.push({ name: 'admin-feed' });
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
