/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createOfficeService,
  deleteOfficeService,
  getOfficesService,
} from 'src/services/office-service';
import { Office } from 'src/ts/interfaces/data/Enterprise';

export const useOfficeStore = defineStore('office', {
  state: () => ({
    filledData: true as boolean,
    loadingOffice: false as boolean,
    listOffice: [] as Office[],
  }),
  actions: {
    clearListOffice() {
      this.listOffice.splice(0, this.listOffice.length);
    },
    setLoading(loading: boolean) {
      this.loadingOffice = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListOffice(offices: Office[]) {
      offices.map((item) => this.listOffice.push(item));
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
    async getOffices() {
      this.setLoading(true);
      try {
        const response = await getOfficesService();
        if (response.status === 200) {
          this.clearListOffice();
          this.setListOffice(response.data.offices);
          this.setFilledData(response.data.filled_data);
          updateNotifications(response.data.notifications);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createOffice(
      name: string,
      cnpj: string | null,
      cpf: string | null,
      cep: string,
      state: string,
      city: string,
      neighborhood: string,
      address: string,
      complement: string | null,
      numberAddress: string,
      email: string | null,
      phone: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await createOfficeService(
          name,
          cnpj,
          cpf,
          cep,
          state,
          city,
          neighborhood,
          address,
          complement,
          numberAddress,
          email,
          phone
        );
        if (response.status === 201) {
          this.clearListOffice();
          this.setListOffice(response.data.offices);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    // async updateAlert(id: string, description: string | null) {
    //   this.setLoading(true);
    //   try {
    //     const response = await updateAlertService(id, description ?? null);
    //     if (response.status === 200) {
    //       this.clearListAlert();
    //       this.setListAlert(response.data.alerts);
    //       this.createSuccess(response.data.message);
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    async deleteOffice(officeId: string) {
      this.setLoading(true);
      try {
        const response = await deleteOfficeService(officeId);
        if (response.status === 200) {
          this.listOffice = this.listOffice.filter(
            (item) => item.id !== officeId
          );
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
