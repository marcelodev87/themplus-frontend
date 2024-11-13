/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createDepartmentService,
  deleteDepartmentService,
  getDepartmentsService,
  updateDepartmentService,
} from 'src/services/department-service';
import {
  Department,
  DepartmentNode,
  TransformedDepartment,
} from 'src/ts/interfaces/data/Department';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    loadingDepartment: false as boolean,
    listDepartment: [] as DepartmentNode[],
  }),
  getters: {
    treeDepartment: (state) => {
      const transformNode = (node: DepartmentNode): TransformedDepartment => {
        return {
          id: node.id,
          label: node.name,
          icon: 'domain',
          children:
            node.children.length > 0
              ? node.children.map(transformNode)
              : undefined,
        };
      };
      return state.listDepartment.map(transformNode);
    },
  },
  actions: {
    clearListDepartment() {
      this.listDepartment.splice(0, this.listDepartment.length);
    },
    setLoading(loading: boolean) {
      this.loadingDepartment = loading;
    },
    setListDepartment(departments: Department[]) {
      departments.map((item) => this.listDepartment.push(item));
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
    async getDepartments() {
      this.setLoading(true);
      try {
        const response = await getDepartmentsService();
        if (response.status === 200) {
          this.clearListDepartment();
          this.setListDepartment(response.data.departments);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createDepartment(name: string, parentId: string | null) {
      this.setLoading(true);
      try {
        const response = await createDepartmentService(name, parentId);
        if (response.status === 201) {
          this.clearListDepartment();
          this.setListDepartment(response.data.departments);
          this.createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async updateDepartment(id: string, name: string, parentId: string | null) {
      this.setLoading(true);
      try {
        const response = await updateDepartmentService(id, name, parentId);
        if (response.status === 200) {
          this.clearListDepartment();
          this.setListDepartment(response.data.departments);
          this.createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async deleteDepartment(departmentId: string) {
      this.setLoading(true);
      try {
        const response = await deleteDepartmentService(departmentId);
        if (response.status === 200) {
          this.listDepartment = this.listDepartment.filter(
            (item) => item.id !== departmentId
          );
          this.createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
