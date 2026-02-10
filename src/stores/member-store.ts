/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createMemberService,
  deleteMemberService,
  getMembersService,
  updateMemberService,
  updateActiveMemberService,
  getPreRegistrationService,
  deleteRegistrationService,
  getConfigPreRegistrationService,
  deleteRelationshipService,
  showMemberService,
} from 'src/services/member-service';
import {
  DataMemberChurch,
  MemberChurch,
  PreRegistration,
} from 'src/ts/interfaces/data/Member';

export const useMemberStore = defineStore('member', {
  state: () => ({
    filledData: true as boolean,
    loadingMember: false as boolean,
    loadingShowMember: false as boolean,
    listMember: [] as MemberChurch[],
    listMemberPreRegistration: [] as PreRegistration[],
    Member: {} as MemberChurch,
  }),
  actions: {
    clearListMember() {
      this.listMember.splice(0, this.listMember.length);
    },
    setListMember(members: MemberChurch[]) {
      members.map((item) => this.listMember.push(item));
    },
    setMember(member: MemberChurch) {
      this.Member = member;
    },
    clearListMemberPreRegistration() {
      this.listMemberPreRegistration.splice(
        0,
        this.listMemberPreRegistration.length
      );
    },
    clearMember() {
      this.Member = {} as MemberChurch;
    },
    setListMemberPreRegistration(members: PreRegistration[]) {
      members.map((item) => this.listMemberPreRegistration.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingMember = loading;
    },
    setShowLoading(loading: boolean) {
      this.loadingShowMember = loading;
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
    async getMembers(active?: number) {
      try {
        this.setLoading(true);
        const response = await getMembersService(active);
        if (response.status === 200) {
          this.clearListMember();
          this.setListMember(response.data.members);
          updateNotifications(response.data.notifications);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async showMember(memberID: string) {
      try {
        this.setShowLoading(true);
        const response = await showMemberService(memberID);
        if (response.status === 200) {
          this.clearMember();
          this.setMember(response.data.member);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setShowLoading(false);
      }
    },
    async getPreRegistration() {
      try {
        this.setLoading(true);
        const response = await getPreRegistrationService();
        if (response.status === 200) {
          this.clearListMemberPreRegistration();
          this.setListMemberPreRegistration(response.data.pre_registration);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getConfigPreRegistration() {
      try {
        this.setLoading(true);
        return await getConfigPreRegistrationService();
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async createMember(data: DataMemberChurch) {
      try {
        this.setLoading(true);
        const response = await createMemberService(data);
        if (response.status === 201) {
          this.clearListMember();
          this.setListMember(response.data.members);
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
    async updateActiveMember(active: number, userId: string) {
      try {
        this.setLoading(true);
        const response = await updateActiveMemberService(active, userId);
        if (response.status === 200) {
          this.clearListMember();
          this.setListMember(response.data.members);
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
    async updateMember(id: string, data: DataMemberChurch) {
      try {
        this.setLoading(true);
        const response = await updateMemberService(id, data);
        if (response.status === 200) {
          this.clearListMember();
          this.setListMember(response.data.members);
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
    async deleteMember(memberID: string) {
      this.setLoading(true);
      try {
        const response = await deleteMemberService(memberID);
        if (response.status === 200) {
          this.clearListMember();
          this.setListMember(response.data.members);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteRegistration(registrationID: string) {
      this.setLoading(true);
      try {
        const response = await deleteRegistrationService(registrationID);
        if (response.status === 200) {
          this.clearListMemberPreRegistration();
          this.setListMemberPreRegistration(response.data.pre_registration);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteRelationship(
      memberID: string,
      relatedMemberID: string,
      relationshipID: string
    ) {
      this.setLoading(true);
      try {
        const response = await deleteRelationshipService(
          memberID,
          relatedMemberID,
          relationshipID
        );
        if (response.status === 200) {
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
