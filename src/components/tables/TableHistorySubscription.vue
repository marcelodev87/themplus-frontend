<script setup lang="ts">
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { reactive } from 'vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'TableHistorySubscription',
});

const { loadingEnterprise, listCouponEnterprise } =
  storeToRefs(useEnterpriseStore());

const columnsHistory = reactive<QuasarTable[]>([
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'date_action',
    label: 'Data de ação',
    field: 'date_action',
    align: 'left',
  },
]);
</script>

<template>
  <q-card class="bg-grey-2 full-width">
    <q-card-section class="q-pa-none">
      <TitlePage title="Gerenciamento de histórico" />
    </q-card-section>
    <q-card-section class="q-pa-sm q-gutter-y-sm">
      <q-table
        :rows="listCouponEnterprise"
        :columns="columnsHistory"
        :loading="loadingEnterprise"
        flat
        bordered
        dense
        row-key="index"
        no-data-label="Nenhum histórico para mostrar"
        virtual-scroll
        :rows-per-page-options="[20]"
      >
        <template v-slot:top>
          <span class="text-subtitle2">Lista de cupons</span>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" style="height: 28px">
            <q-td key="description" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.description }}</span>
            </q-td>
            <q-td key="date_action" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.date_action }}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
