/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createNetworkService,
  deleteNetworkService,
  getNetworksService,
  updateNetworkService,
} from 'src/services/network-service';
import { DataNetwork, Network } from 'src/ts/interfaces/data/Network';

export const useNetworkStore = defineStore('network', {
  state: () => ({
    filledData: true as boolean,
    loadingNetwork: false as boolean,
    listNetwork: [] as Network[],
  }),
  actions: {
    clearListNetwork() {
      this.listNetwork.splice(0, this.listNetwork.length);
    },
    setListNetwork(netowrks: Network[]) {
      netowrks.map((item) => this.listNetwork.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingNetwork = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
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
    async getNetworks() {
      try {
        this.setLoading(true);
        const response = await getNetworksService();
        if (response.status === 200) {
          this.clearListNetwork();
          this.setListNetwork(response.data.networks);
          updateNotifications(response.data.notifications);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createNetwork(data: DataNetwork) {
      try {
        this.setLoading(true);
        const response = await createNetworkService(data);
        if (response.status === 201) {
          this.clearListNetwork();
          this.setListNetwork(response.data.networks);
          this.createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async updateNetwork(data: DataNetwork) {
      try {
        this.setLoading(true);
        const response = await updateNetworkService(data);
        if (response.status === 200) {
          this.clearListNetwork();
          this.setListNetwork(response.data.networks);
          this.createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async deleteNetwork(networkID: string) {
      this.setLoading(true);
      try {
        const response = await deleteNetworkService(networkID);
        if (response.status === 200) {
          this.clearListNetwork();
          this.setListNetwork(response.data.networks);
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
