/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { updateNotifications } from 'src/composables/NotificationsManage';
import {
  createCellService,
  deleteCellService,
  getCellsService,
  updateCellService,
} from 'src/services/cell-service';
import { Cell, DataCell } from 'src/ts/interfaces/data/Cell';

export const useCellStore = defineStore('cell', {
  state: () => ({
    filledData: true as boolean,
    loadingCell: false as boolean,
    listCell: [] as Cell[],
  }),
  actions: {
    clearListCell() {
      this.listCell.splice(0, this.listCell.length);
    },
    setListCell(cells: Cell[]) {
      cells.map((item) => this.listCell.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingCell = loading;
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
    async getCells() {
      try {
        this.setLoading(true);
        const response = await getCellsService();
        if (response.status === 200) {
          this.clearListCell();
          this.setListCell(response.data.cells);
          updateNotifications(response.data.notifications);
          this.setFilledData(response.data.filled_data);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCell(data: DataCell) {
      try {
        this.setLoading(true);
        const response = await createCellService(data);
        if (response.status === 201) {
          this.clearListCell();
          this.setListCell(response.data.cells);
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
    async updateCell(data: DataCell) {
      try {
        this.setLoading(true);
        const response = await updateCellService(data);
        if (response.status === 200) {
          this.clearListCell();
          this.setListCell(response.data.cells);
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
    async deleteCell(cellID: string) {
      try {
        this.setLoading(true);
        const response = await deleteCellService(cellID);
        if (response.status === 200) {
          this.clearListCell();
          this.setListCell(response.data.cells);
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
