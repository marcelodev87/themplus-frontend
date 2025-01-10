/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  finalizeReportCounterService,
  getReportsService,
  reopenByCounterService,
  undoReportCounterService,
} from 'src/services/report-service';
import { Report } from 'src/ts/interfaces/data/Report';

export const useReportStore = defineStore('report', {
  state: () => ({
    loadingReport: false as boolean,
    listReport: [] as Report[],
    clientName: null as string | null,
  }),
  actions: {
    clearListReport() {
      this.listReport.splice(0, this.listReport.length);
    },
    setLoading(loading: boolean) {
      this.loadingReport = loading;
    },
    setClientName(name: string | null) {
      this.clientName = name;
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
        if (response.status === 200) {
          this.clearListReport();
          this.setListReport(response.data.reports);
          this.setClientName(response.data.client_name);
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
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
