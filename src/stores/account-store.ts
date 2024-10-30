/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { createAccountService, getAccountsService, updateAccountService } from 'src/services/account-service';
import { deleteCategoryService } from 'src/services/category-service';
import { Account } from 'src/ts/interfaces/data/Account';

export const useAccountStore = defineStore('account', {
  state: () => ({
    loadingAccount: false as boolean,
    listAccount: [] as Account[],
  }),
  actions: {
    clearListAccount() {
      this.listAccount.splice(0, this.listAccount.length);
    },
    setLoading(loading: boolean) {
      this.loadingAccount = loading;
    },
    setListAccount(accounts : Account[]) {
      accounts.map((item) => this.listAccount.push(item));
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
    async getAccounts() {
      this.setLoading(true);
      try {
        const response = await getAccountsService();
        if (response.status === 200) {
          this.clearListAccount();
          this.setListAccount(response.data.accounts);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createAccount(
      name: string,
      accountNumber: string | null,
      agencyNumber: string | null,
      description: string | null,
    ) {
      this.setLoading(true);
      try {
        const response = await createAccountService(name, accountNumber, agencyNumber, description);
        if (response.status === 201) {
          this.clearListAccount();
          this.setListAccount(response.data.accounts);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateAccount(
      id: string,
      name: string,
      accountNumber: string,
      agencyNumber: string,
      description: string | null,
    ) {
      this.setLoading(true);
      try {
        const response = await updateAccountService(
          id,
          name,
          accountNumber,
          agencyNumber,
          description,
        );
        if (response.status === 200) {
          this.clearListAccount();
          this.setListAccount(response.data.accounts);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteAccount(accountId: string) {
      this.setLoading(true);
      try {
        const response = await deleteCategoryService(accountId);
        if (response.status === 200) {
          this.listAccount = this.listAccount.filter((item) => item.id !== accountId);
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
