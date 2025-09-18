<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { useAuthStore } from 'src/stores/auth-store';
import Paginate from 'src/components/general/Paginate.vue';
import FormCongregation from 'src/components/forms/FormCongregation.vue';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { useCongregationStore } from 'src/stores/congregation-store';
import { Congregation } from 'src/ts/interfaces/data/Congregation';

defineOptions({
  name: 'Congregation',
});

const { user } = storeToRefs(useAuthStore());
const { listCongregation, loadingCongregation, filledData } = storeToRefs(
  useCongregationStore()
);
const { getCongregations, deleteCongregation } = useCongregationStore();

const showConfirmAction = ref<boolean>(false);
const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const showAlertDataEnterprise = ref<boolean>(false);
const showFormCongregation = ref<boolean>(false);
const filterCongregation = ref<string>('');
const selectedDataEdit = ref<Congregation | null>(null);
const dataExclude = ref<string | null>(null);
const columnsCongregation = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'leader',
    label: 'Dirigente',
    field: 'leader',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

// const resetPage = (): void => {
//   currentPage.value = 1;
// };
const clear = (): void => {
  selectedDataEdit.value = null;
  dataExclude.value = null;
  filterCongregation.value = '';
};
const openFormCongregation = (): void => {
  showFormCongregation.value = true;
};
const closeFormCongregation = (): void => {
  showFormCongregation.value = false;
  clear();
};
const handleEdit = (congregation: Congregation) => {
  selectedDataEdit.value = congregation;
  openFormCongregation();
};
const exclude = async (id: string) => {
  await deleteCongregation(id);
  clear();
};
const fetchCongregations = async () => {
  await getCongregations();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await exclude(dataExclude.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  dataExclude.value = null;
};
const openConfirmAction = (id: string): void => {
  dataExclude.value = id;
  showConfirmAction.value = true;
};

const listCongregationCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return listCongregation.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(listCongregation.value.length / rowsPerPage.value);
});

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
  await fetchCongregations();
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
        <TitlePage title="Gerenciamento de congregações" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormCongregation"
          icon-right="add"
          label="Congregação"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area
      :class="!$q.screen.lt.sm ? 'main-scroll' : 'category-scroll'"
    >
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          :rows="loadingCongregation ? [] : listCongregationCurrent"
          :columns="columnsCongregation"
          :loading="loadingCongregation"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma congregação para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <div
              :class="!$q.screen.lt.md ? 'row full-width' : 'column full-width'"
            >
              <span class="text-subtitle2">Lista de congregações</span>
              <q-space />
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-input
                  filled
                  v-model="filterCongregation"
                  dense
                  label="Pesquisar"
                  :style="!$q.screen.lt.sm ? 'width: 200px' : 'width: 49%'"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-expansion-item
                v-else
                expand-separator
                icon="filter_alt"
                label="Filtros"
                class="border-form"
              >
                <q-input
                  filled
                  v-model="filterCongregation"
                  dense
                  label="Pesquisar"
                  class="full-width q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-expansion-item>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td key="leader" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.member?.name }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="openConfirmAction(props.row.id)"
                  v-show="
                    user?.enterprise_id === user?.view_enterprise_id &&
                    user?.position === 'admin'
                  "
                  size="sm"
                  flat
                  round
                  color="negative"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="listCongregation.length"
            />
          </template>
        </q-table>
        <FormCongregation
          :open="showFormCongregation"
          :data-edit="selectedDataEdit"
          @update:open="closeFormCongregation"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de exclusão"
          message="Este processo é irreversível. Caso tenha certeza, clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </main>
    </q-scroll-area>
  </section>
</template>

<style scoped lang="scss">
.category-scroll {
  height: calc(100vh - 180px);
}
</style>
