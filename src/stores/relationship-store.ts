/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { Relationship } from 'src/ts/interfaces/data/Relationship';
import {
  createRelationshipService,
  deleteRelationshipService,
  getRelationshipsService,
  updateRelationshipService,
} from 'src/services/relationship-service';

export const useRelationshipStore = defineStore('relationship', {
  state: () => ({
    loadingRelationship: false as boolean,
    listRelationship: [] as Relationship[],
  }),
  actions: {
    clearListRelationship() {
      this.listRelationship.splice(0, this.listRelationship.length);
    },
    setListRelationship(relationships: Relationship[]) {
      relationships.map((item) => this.listRelationship.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingRelationship = loading;
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
    async getRelationships() {
      this.setLoading(true);
      try {
        const response = await getRelationshipsService();
        if (response.status === 200) {
          this.clearListRelationship();
          this.setListRelationship(response.data.relationships);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createRelationship(name: string) {
      this.setLoading(true);
      try {
        const response = await createRelationshipService(name);
        if (response.status === 201) {
          this.clearListRelationship();
          this.setListRelationship(response.data.relationships);
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
    async updateRelationship(id: string, name: string) {
      this.setLoading(true);
      try {
        const response = await updateRelationshipService(id, name);
        if (response.status === 200) {
          this.clearListRelationship();
          this.setListRelationship(response.data.relationships);
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
    async deleteRelationship(relationshipID: string) {
      this.setLoading(true);
      try {
        const response = await deleteRelationshipService(relationshipID);
        if (response.status === 200) {
          this.clearListRelationship();
          this.setListRelationship(response.data.relationships);
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
