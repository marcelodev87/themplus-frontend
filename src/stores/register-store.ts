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
  }),
  actions: {
    clearListRegister() {
      this.listRegister.splice(0, this.listRegister.length);
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
    setListRegister(registers: Register[]) {
      this.listRegister = registers.slice();

      this.listRegister.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
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
        const response = await getRegistersService();
        if (response.status === 200) {
          this.clearListRegister();
          this.setListRegister(response.data.registers);
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
