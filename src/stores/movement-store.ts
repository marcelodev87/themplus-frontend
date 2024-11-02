/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createMovementService,
  deleteMovementService,
  getMovementsService,
  updateMovementService,
} from 'src/services/movement-service';
import { Movement } from 'src/ts/interfaces/data/Movement';

export const useMovementStore = defineStore('movement', {
  state: () => ({
    loadingMovement: false as boolean,
    listMovement: [] as Movement[],
  }),
  actions: {
    clearListMovement() {
      this.listMovement.splice(0, this.listMovement.length);
    },
    setLoading(loading: boolean) {
      this.loadingMovement = loading;
    },
    setListMovement(movements: Movement[]) {
      movements.map((item) => this.listMovement.push(item));
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
    async getMovements() {
      this.setLoading(true);
      try {
        const response = await getMovementsService();
        if (response.status === 200) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createMovement(
      type: string,
      value: string,
      date: string,
      description: string | null,
      file: File | null,
      category: string,
      account: string
    ) {
      this.setLoading(true);
      try {
        const response = await createMovementService(
          type,
          value,
          date,
          description,
          file,
          category,
          account
        );
        if (response.status === 201) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateCategory(
      id: string,
      type: string,
      value: string,
      date: string,
      description: string | null,
      file: File | null,
      category: string,
      account: string
    ) {
      this.setLoading(true);
      try {
        const response = await updateMovementService(
          id,
          type,
          value,
          date,
          description,
          file,
          category,
          account
        );
        if (response.status === 200) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteMovement(movementId: string) {
      this.setLoading(true);
      try {
        const response = await deleteMovementService(movementId);
        if (response.status === 200) {
          this.listMovement = this.listMovement.filter(
            (item) => item.id !== movementId
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
