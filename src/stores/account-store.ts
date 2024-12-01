/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createAccountService,
  getAccountsService,
  updateAccountService,
  deleteAccountService,
  createTransferService,
  exportAccountService,
  updateActiveAccountService,
} from 'src/services/account-service';
import { Account } from 'src/ts/interfaces/data/Account';

export const useAccountStore = defineStore('account', {
  state: () => ({
    filledData: true as boolean,
    loadingAccount: false as boolean,
    listAccount: [] as Account[],
  }),
  getters: {
    accountsSelect: (state) => {
      return state.listAccount.map((item) => {
        const accountPart = item.account_number
          ? `C:${item.account_number}`
          : '';
        const agencyPart = item.agency_number ? `A:${item.agency_number}` : '';

        const label = `${item.name}${accountPart ? ` - ${accountPart}` : ''}${agencyPart ? ` - ${agencyPart}` : ''}`;

        return {
          label,
          value: item.id,
        };
      });
    },
  },
  actions: {
    clearListAccount() {
      this.listAccount.splice(0, this.listAccount.length);
    },
    setLoading(loading: boolean) {
      this.loadingAccount = loading;
    },
    setFilledData(data: boolean) {
      this.filledData = data;
    },
    setListAccount(accounts: Account[]) {
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
          this.setFilledData(response.data.filled_data);
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
      description: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await createAccountService(
          name,
          accountNumber,
          agencyNumber,
          description
        );
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
    async createTransfer(
      accountOut: string,
      accountEntry: string,
      value: number,
      date: string
    ) {
      this.setLoading(true);
      try {
        const response = await createTransferService(
          accountOut,
          accountEntry,
          value,
          date
        );
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
    async exportAccount() {
      try {
        this.setLoading(true);
        await exportAccountService();
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateAccount(
      id: string,
      name: string,
      accountNumber: string | null,
      agencyNumber: string | null,
      description: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await updateAccountService(
          id,
          name,
          accountNumber,
          agencyNumber,
          description
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
    async updateActiveAccount(id: string) {
      this.setLoading(true);
      try {
        const response = await updateActiveAccountService(id);
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
        const response = await deleteAccountService(accountId);
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
  },
});
