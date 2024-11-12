/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createUserMemberService,
  deleteUserMemberService,
  getUsersMembersService,
  updateUserMemberService,
} from 'src/services/users-service';
import { User } from 'src/ts/interfaces/data/User';

export const useUsersStore = defineStore('users', {
  state: () => ({
    loadingUsers: false as boolean,
    listUser: [] as User[],
  }),
  actions: {
    clearListUser() {
      this.listUser.splice(0, this.listUser.length);
    },
    setLoading(loading: boolean) {
      this.loadingUsers = loading;
    },
    setListUser(users: User[]) {
      users.map((item) => this.listUser.push(item));
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
    async getUsers() {
      this.setLoading(true);
      try {
        const response = await getUsersMembersService();
        if (response.status === 200) {
          this.clearListUser();
          this.setListUser(response.data.users);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createUserMember(
      name: string,
      position: 'admin' | 'common_user',
      email: string,
      password: string
    ) {
      this.setLoading(true);
      try {
        const response = await createUserMemberService({
          name,
          position,
          email,
          password,
        });
        if (response.status === 201) {
          this.clearListUser();
          this.setListUser(response.data.users);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateUserMember(
      id: string,
      name: string,
      email: string,
      phone: string | null,
      position: string,
      departmentId: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await updateUserMemberService(
          id,
          name,
          email,
          phone,
          position,
          departmentId
        );
        if (response.status === 200) {
          this.clearListUser();
          this.setListUser(response.data.users);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteUserMember(userMemberId: string) {
      this.setLoading(true);
      try {
        const response = await deleteUserMemberService(userMemberId);
        if (response.status === 200) {
          this.listUser = this.listUser.filter(
            (item) => item.id !== userMemberId
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