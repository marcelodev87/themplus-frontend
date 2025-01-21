/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  detailsReportService,
  finalizeReportCounterService,
  getReportsService,
  reopenByCounterService,
  undoReportCounterService,
} from 'src/services/report-service';
import { Enterprise } from 'src/ts/interfaces/data/Enterprise';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { Report } from 'src/ts/interfaces/data/Report';

export const useReportStore = defineStore('report', {
  state: () => ({
    loadingReport: false as boolean,
    listReport: [] as Report[],
    clientName: null as string | null,
    listMovement: [] as Movement[],
    entepriseInspected: null as Enterprise | null,
  }),
  actions: {
    clearListReport() {
      this.listReport.splice(0, this.listReport.length);
    },
    clearListMovement() {
      this.listMovement.splice(0, this.listMovement.length);
    },
    setLoading(loading: boolean) {
      this.loadingReport = loading;
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
        const response = await detailsReportService(id);
        this.clearListMovement();
        if (response.status === 200) {
          this.setListMovement(response.data.movements);
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
  },
});
