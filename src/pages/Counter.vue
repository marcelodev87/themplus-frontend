<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormAlert from 'src/components/forms/FormAlert.vue';
import { storeToRefs } from 'pinia';
import { useAlertStore } from 'src/stores/alert-store';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { Alert } from 'src/ts/interfaces/data/Alert';

defineOptions({
  name: 'Counter',
});

const { listAlert, loadingAlert, filledData } = storeToRefs(useAlertStore());
const { getAlerts, deleteAlert } = useAlertStore();

const showFormAlert = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const filterAlert = ref<string>('');
const selectedDataEdit = ref<Alert | null>(null);
const columnsAlert = reactive<QuasarTable[]>([
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
    sortable: true,
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  selectedDataEdit.value = null;
  filterAlert.value = '';
};
const openFormAlert = (): void => {
  showFormAlert.value = true;
};
const closeFormAlert = (): void => {
  showFormAlert.value = false;
  clear();
};
const handleEdit = (alert: Alert) => {
  selectedDataEdit.value = alert;
  openFormAlert();
};
const exclude = async (id: string) => {
  await deleteAlert(id);
};
const fetchAlerts = async () => {
  await getAlerts();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};

watch(
  filledData,
  () => {
    if (!filledData.value) {
      showAlertDataEnterprise.value = true;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchAlerts();
});
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Gerenciamento de alertas" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          @click="openFormAlert"
          color="blue-8"
          icon-right="warning"
          label="Alertas"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          :rows="loadingAlert ? [] : listAlert"
          :columns="columnsAlert"
          :filter="filterAlert"
          :loading="loadingAlert"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma alerta para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de alertas</span>
            <q-space />
            <q-input filled v-model="filterAlert" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="description" :props="props" class="text-left">
                {{ props.row.description }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="exclude(props.row.id)"
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
        <FormAlert
          :open="showFormAlert"
          :data-edit="selectedDataEdit"
          @update:open="closeFormAlert"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
