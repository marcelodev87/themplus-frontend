/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  detailsReportService,
  downloadReportService,
  excludeMovementService,
  finalizeReportCounterService,
  getReportsService,
  reopenByCounterService,
  undoReportCounterService,
  updateMovementByCounterService,
} from 'src/services/report-service';
import {
  AmountRegister,
  QuantityRegister,
} from 'src/ts/interfaces/data/Dashboard';
import { Enterprise } from 'src/ts/interfaces/data/Enterprise';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { Report } from 'src/ts/interfaces/data/Report';
import { SettingsCounter } from 'src/ts/interfaces/data/Settings';

export const useReportStore = defineStore('report', {
  state: () => ({
    loadingReport: false as boolean,
    listReport: [] as Report[],
    clientName: null as string | null,
    listMovement: [] as Movement[],
    listAmountRegister: [] as AmountRegister[],
    listQuantityRegister: [] as QuantityRegister[],
    entepriseInspected: null as Enterprise | null,
    permissions: null as SettingsCounter | null,
    finalizedReport: false as boolean,
  }),
  actions: {
    clearListReport() {
      this.listReport.splice(0, this.listReport.length);
    },
    clearListMovement() {
      this.listMovement.splice(0, this.listMovement.length);
    },
    clearListAmountRegister() {
      this.listAmountRegister.splice(0, this.listAmountRegister.length);
    },
    clearListQuantityRegister() {
      this.listQuantityRegister.splice(0, this.listQuantityRegister.length);
    },
    setListAmountRegister(amounts: AmountRegister[]) {
      amounts.map((item) => this.listAmountRegister.push(item));
    },
    setListQuantityRegister(quantities: QuantityRegister[]) {
      quantities.map((item) => this.listQuantityRegister.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingReport = loading;
    },
    setFinalizedReport(finalized: boolean) {
      this.finalizedReport = finalized;
    },
    setPermissions(permissions: SettingsCounter | null) {
      this.permissions = permissions;
    },
    setListMovement(movements: Movement[]) {
      this.listMovement = movements.sort((a, b) => {
        const dateA = new Date(a.date_movement);
        const dateB = new Date(b.date_movement);
        return dateB.getTime() - dateA.getTime();
      });
    },
    setClientName(name: string | null) {
      this.clientName = name;
    },
    setEnterpriseInspected(enterprise: Enterprise | null) {
      this.entepriseInspected = enterprise;
    },
    setListReport(report: Report[]) {
      report.map((item) => this.listReport.push(item));
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
    async getReports(id: string) {
      try {
        this.setLoading(true);
        const response = await getReportsService(id);
        this.setClientName(null);
        this.setEnterpriseInspected(null);
        if (response.status === 200) {
          this.clearListReport();
          this.setListReport(response.data.reports);
          this.setClientName(response.data.client_name);
          this.setEnterpriseInspected(response.data.enterprise_inspected);
          this.clearListAmountRegister();
          this.clearListQuantityRegister();
          this.setListAmountRegister(response.data.dashboard.amount_registers);
          this.setListQuantityRegister(
            response.data.dashboard.quantity_registers
          );
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async detailsReport(id: string) {
      try {
        this.setLoading(true);
        this.setPermissions(null);
        const response = await detailsReportService(id);
        if (response.status === 200) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
          this.setPermissions(response.data.permissions);
          this.setFinalizedReport(response.data.finalized);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async excludeMovement(id: string) {
      try {
        this.setLoading(true);
        const response = await excludeMovementService(id);
        if (response.status === 200) {
          this.setPermissions(response.data.permissions);
          this.listMovement = this.listMovement.filter(
            (item) => item.id !== id
          );
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async reopenByCounter(id: string) {
      try {
        this.setLoading(true);
        const response = await reopenByCounterService(id);
        this.setClientName(null);
        if (response.status === 200) {
          this.clearListReport();
          this.setListReport(response.data.reports);
          this.setClientName(response.data.client_name);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async undoReportCounter(id: string) {
      try {
        this.setLoading(true);
        const response = await undoReportCounterService(id);
        this.setClientName(null);
        if (response.status === 200) {
          this.clearListReport();
          this.setListReport(response.data.reports);
          this.setClientName(response.data.client_name);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async finalizeReportCounter(id: string) {
      try {
        this.setLoading(true);
        const response = await finalizeReportCounterService(id);
        this.setClientName(null);
        if (response.status === 200) {
          this.clearListReport();
          this.setListReport(response.data.reports);
          this.setClientName(response.data.client_name);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateMovementByCounter(
      id: string,
      type: string,
      value: string,
      date: string,
      description: string | null,
      file: File | string | null,
      category: string,
      account: string
    ) {
      this.setLoading(true);
      try {
        const response = await updateMovementByCounterService(
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
          this.setPermissions(response.data.permissions);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async downloadReport(reportId: string) {
      this.setLoading(true);
      try {
        await downloadReportService(reportId);
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
