/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createUserMemberByCounterService,
  createUserMemberOfficeService,
  createUserMemberService,
  deleteUserMemberByEnterpriseService,
  deleteUserMemberService,
  exportUserService,
  findUserService,
  getUsersMembersByEnterpriseService,
  getUsersMembersService,
  updateUserMemberByCounter,
  updateUserMemberService,
} from 'src/services/users-service';
import { SettingsCounter } from 'src/ts/interfaces/data/Settings';
import { User } from 'src/ts/interfaces/data/User';

export const useUsersMembersStore = defineStore('members', {
  state: () => ({
    filledData: true as boolean,
    loadingUsersMembers: false as boolean,
    listUserMember: [] as User[],
    listUserMemberByEnterprise: [] as User[],
    resultSearchMember: [] as User[],
    settingsCounter: null as SettingsCounter | null,
  }),
  getters: {
    resultUserSelect: (state) => {
      return state.resultSearchMember.map((item) => {
        return {
          label: `${item.name} | ${item.email}`,
          value: item.id,
        };
      });
    },
  },
  actions: {
    clearListUser() {
      this.listUserMember.splice(0, this.listUserMember.length);
    },
    clearListUserByEnterprise() {
      this.listUserMemberByEnterprise.splice(
        0,
        this.listUserMemberByEnterprise.length
      );
    },
    clearResultSearchMember() {
      this.resultSearchMember.splice(0, this.resultSearchMember.length);
    },
    setLoading(loading: boolean) {
      this.loadingUsersMembers = loading;
    },
    setSettingsCounter(settings: SettingsCounter | null) {
      this.settingsCounter = settings;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListUser(users: User[]) {
      users.map((item) => this.listUserMember.push(item));
    },
    setListUserByEnterprise(users: User[]) {
      users.map((item) => this.listUserMemberByEnterprise.push(item));
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
    async getUsersMembers() {
      try {
        this.setLoading(true);
        const response = await getUsersMembersService();
        if (response.status === 200) {
          this.clearListUser();
          this.setListUser(response.data.users);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async findUser(userId: string) {
      try {
        this.setLoading(true);
        return await findUserService(userId);
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async getUsersMembersByEnterprise(enterpriseId: string) {
      try {
        this.setLoading(true);
        this.clearListUserByEnterprise();
        this.setSettingsCounter(null);
        const response = await getUsersMembersByEnterpriseService(enterpriseId);
        if (response.status === 200) {
          this.setListUserByEnterprise(response.data.users);
          this.setSettingsCounter(response.data.settings);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createUserMember(
      name: string,
      position: string,
      email: string,
      password: string,
      department: string | null,
      phone: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await createUserMemberService({
          name,
          position,
          email,
          password,
          department,
          phone,
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
    async createUserMemberByCounter(
      name: string,
      email: string,
      password: string,
      phone: string | null,
      enterpriseId: string
    ) {
      try {
        this.setLoading(true);
        this.clearListUserByEnterprise();
        this.setSettingsCounter(null);
        const response = await createUserMemberByCounterService({
          name,
          email,
          password,
          phone,
          enterpriseId,
        });
        if (response.status === 201) {
          this.setListUserByEnterprise(response.data.users);
          this.setSettingsCounter(response.data.settings);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createUserMemberOffice(
      enterpriseId: string,
      name: string,
      position: string,
      email: string,
      password: string,
      department: string | null,
      phone: string | null
    ) {
      try {
        this.setLoading(true);
        const response = await createUserMemberOfficeService({
          enterpriseId,
          name,
          position,
          email,
          password,
          department,
          phone,
        });
        if (response.status === 201) {
          this.clearListUser();
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
    async exportUser() {
      try {
        this.setLoading(true);
        await exportUserService();
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
      try {
        this.setLoading(true);
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
    async updateUserMemberByCounter(
      id: string,
      name: string,
      email: string,
      phone: string | null
    ) {
      try {
        this.setLoading(true);
        this.setLoading(true);
        this.clearListUserByEnterprise();
        this.setSettingsCounter(null);
        const response = await updateUserMemberByCounter(
          id,
          name,
          email,
          phone
        );
        if (response.status === 200) {
          this.setListUserByEnterprise(response.data.users);
          this.setSettingsCounter(response.data.settings);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteUserMember(userMemberId: string) {
      try {
        this.setLoading(true);
        const response = await deleteUserMemberService(userMemberId);
        if (response.status === 200) {
          this.listUserMember = this.listUserMember.filter(
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
    async deleteUserMemberByEnterprise(userMemberId: string) {
      try {
        this.setLoading(true);
        const response =
          await deleteUserMemberByEnterpriseService(userMemberId);
        if (response.status === 200) {
          this.listUserMemberByEnterprise =
            this.listUserMemberByEnterprise.filter(
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
