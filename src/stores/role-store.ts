/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createRoleService,
  deleteRoleService,
  getRolesService,
  updateRoleService,
} from 'src/services/role-service';
import { DataRole, Role } from 'src/ts/interfaces/data/Role';

export const useRoleStore = defineStore('role', {
  state: () => ({
    filledData: true as boolean,
    loadingRole: false as boolean,
    listRole: [] as Role[],
  }),
  actions: {
    clearListRole() {
      this.listRole.splice(0, this.listRole.length);
    },
    setListRole(roles: Role[]) {
      roles.map((item) => this.listRole.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingRole = loading;
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
    async getRoles() {
      this.setLoading(true);
      try {
        const response = await getRolesService();
        if (response.status === 200) {
          this.clearListRole();
          this.setListRole(response.data.roles);
          updateNotifications(response.data.notifications);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createRole(data: DataRole) {
      this.setLoading(true);
      try {
        const response = await createRoleService(data);
        if (response.status === 201) {
          this.clearListRole();
          this.setListRole(response.data.roles);
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
    async updateRole(data: DataRole) {
      this.setLoading(true);
      try {
        const response = await updateRoleService(data);
        if (response.status === 200) {
          this.clearListRole();
          this.setListRole(response.data.roles);
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
    async deleteRole(roleID: string) {
      this.setLoading(true);
      try {
        const response = await deleteRoleService(roleID);
        if (response.status === 200) {
          this.clearListRole();
          this.setListRole(response.data.roles);
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
