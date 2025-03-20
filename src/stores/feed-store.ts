/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import { getFeedService } from 'src/services/feed-service';

export const useFeedStore = defineStore('feed', {
  state: () => ({
    filledData: true as boolean,
    loadingFeed: false as boolean,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingFeed = loading;
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
    async getFeed() {
      try {
        this.setLoading(true);
        const response = await getFeedService();
        if (response.status === 200) {
          this.setFilledData(response.data.filled_data);
          updateNotifications(response.data.notifications);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
