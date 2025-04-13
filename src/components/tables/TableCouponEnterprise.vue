<script setup lang="ts">
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { reactive, ref } from 'vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'CounterInfo',
});

const { loadingEnterprise, listCouponEnterprise } =
  storeToRefs(useEnterpriseStore());
const { checkCoupon } = useEnterpriseStore();

const nameCoupon = ref<string>('');
const columnsCoupon = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Tipo de cupom', // SUBSCRIPTION - SERVICE
    field: 'type',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Descrição', // BASIC , MV100
    field: 'description',
    align: 'left',
  },
  {
    name: 'discount',
    label: 'Desconto',
    field: 'discount',
    align: 'left',
  },
  {
    name: 'date_expiration',
    label: 'Data de expiração',
    field: 'date_expiration',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  nameCoupon.value = '';
};
const check = async (): Promise<void> => {
  await checkCoupon(nameCoupon.value);
  clear();
};
</script>

<template>
  <q-card class="bg-grey-2 full-width">
    <q-card-section class="q-pa-none">
      <TitlePage title="Gerenciamento de cupons" />
    </q-card-section>
    <q-card-section class="q-pa-sm q-gutter-y-sm">
      <q-table
        :rows="listCouponEnterprise"
        :columns="columnsCoupon"
        :loading="loadingEnterprise"
        flat
        bordered
        dense
        row-key="index"
        no-data-label="Nenhuma cupom para mostrar"
        virtual-scroll
        :rows-per-page-options="[20]"
      >
        <template v-slot:top>
          <div class="row items-center justify-between full-width">
            <span class="text-subtitle2">Lista de cupons</span>
            <q-separator />
            <div class="row items-center justify-end q-gutter-x-sm">
              <q-input
                v-model="nameCoupon"
                outlined
                dense
                label="Adicione um cupom"
                :class="!$q.screen.lt.md ? '' : 'q-mt-sm'"
              />
              <q-btn
                @click="check"
                color="green"
                size="sm"
                round
                icon="search"
                unelevated
              >
                <q-tooltip>Validar cupom</q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" style="height: 28px">
            <q-td key="name" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.name }}</span>
            </q-td>
            <q-td key="type" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.type }}</span>
            </q-td>
            <q-td key="description" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.description }}</span>
            </q-td>
            <q-td key="discount" :props="props" class="text-left">
              <span class="text-subtitle2">{{ props.row.discount }}</span>
            </q-td>
            <q-td key="date_expiration" :props="props" class="text-left">
              <span class="text-subtitle2">{{
                props.row.date_expiration
              }}</span>
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                :disable="loadingEnterprise"
                size="sm"
                flat
                round
                color="red"
                icon="delete"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
