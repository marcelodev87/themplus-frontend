/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  getRegisterDetailService,
  getRegistersService,
} from 'src/services/register-service';
import { Register } from 'src/ts/interfaces/data/Register';

export const useRegisterStore = defineStore('register', {
  state: () => ({
    filledData: true as boolean,
    loadingRegister: false as boolean,
    loadingRegisterDetail: false as boolean,
    listRegister: [] as Register[],
    registerDetail: null as string | null,
    listOptionsUsers: [] as { id: string; name: string }[],
  }),
  actions: {
    parseCustomDate(dateString: string): Date | null {
      const parts = dateString.split(/[- :]/);
      if (parts.length !== 6) return null;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const hours = parseInt(parts[3], 10);
      const minutes = parseInt(parts[4], 10);
      const seconds = parseInt(parts[5], 10);

      if (
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        isNaN(hours) ||
        isNaN(minutes) ||
        isNaN(seconds)
      ) {
        return null;
      }

      return new Date(year, month, day, hours, minutes, seconds);
    },
    clearListRegister() {
      this.listRegister.splice(0, this.listRegister.length);
    },
    clearListOptionsUsers() {
      this.listOptionsUsers.splice(0, this.listOptionsUsers.length);
    },
    setLoading(loading: boolean) {
      this.loadingRegister = loading;
    },
    setLoadingDetail(loading: boolean) {
      this.loadingRegisterDetail = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListOptionsUsers(users: { id: string; name: string }[]) {
      users.map((item) => this.listOptionsUsers.push(item));
    },
    setListRegister(registers: Register[]) {
      this.listRegister = registers.slice();

      this.listRegister.sort((a, b) => {
        const dateA = this.parseCustomDate(a.date);
        const dateB = this.parseCustomDate(b.date);

        if (!dateA || !dateB) {
          return 0;
        }

        return dateB.getTime() - dateA.getTime();
      });
    },
    setRegisterDetail(register: string | null) {
      this.registerDetail = register;
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
    createSuccess(message: string) {
      Notify.create({
        message,
        type: 'positive',
      });
    },
    async getRegisters() {
      try {
        this.setLoading(true);
        this.clearListRegister();
        this.clearListOptionsUsers();
        const response = await getRegistersService();
        if (response.status === 200) {
          this.setListRegister(response.data.registers);
          this.setListOptionsUsers(response.data.users);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getRegisterDetail(id: string) {
      try {
        this.setLoadingDetail(true);
        this.setRegisterDetail(null);
        const response = await getRegisterDetailService(id);
        if (response.status === 200) {
          this.setRegisterDetail(response.data.register);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoadingDetail(false);
      }
    },
  },
});
