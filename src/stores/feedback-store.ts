/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { createFeedbackService } from 'src/services/feedback-service';

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    loadingFeedback: false as boolean,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingFeedback = loading;
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
    async createFeedback(message: string) {
      try {
        this.setLoading(true);
        const response = await createFeedbackService(message);
        if (response.status === 201) {
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
  },
});
