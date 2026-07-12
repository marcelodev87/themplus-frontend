<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useRelationshipStore } from 'src/stores/relationship-store';
import { Relationship } from 'src/ts/interfaces/data/Relationship';
import { useSortMethod } from 'src/composables/useTableSort';
import { useTableFilter } from 'src/composables/useTableFilter';

defineOptions({
  name: 'ManageRole',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getRelationships } = useRelationshipStore();
const { loadingRelationship, listRelationship } = storeToRefs(
  useRelationshipStore()
);

const selectedData = ref<string | null>(null);
const filterRelationship = ref<string>('');
const selectedDataEdit = ref<Relationship | null>(null);
const columnsRelationship = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Relação',
    field: 'name',
    align: 'left',
    sortable: true,
  },
]);

const { sortRows: sortRelationshipRows } = useSortMethod(columnsRelationship);
const { filterMethod } = useTableFilter();
const clear = (): void => {
  filterRelationship.value = '';
  selectedDataEdit.value = null;
  selectedData.value = '';
};
const fetchRelationships = async () => {
  await getRelationships();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchRelationships();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 form-basic"
      style="min-width: 900px; max-width: 98vw"
    >
      <q-card-section class="q-pa-none">
        <header
          :class="
            !$q.screen.lt.sm
              ? 'row justify-between no-wrap bg-grey-1'
              : 'column justify-between no-wrap bg-grey-1'
          "
        >
          <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
            <TitlePage title="Gerenciamento de relações" />
          </div>
        </header>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-table
          :rows="loadingRelationship ? [] : listRelationship"
          :columns="columnsRelationship"
          :loading="loadingRelationship"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma relação para mostrar"
          virtual-scroll
          :rows-per-page-options="[0]"
          :filter="filterRelationship"
          :filter-method="filterMethod"
          style="max-height: 500px"
          column-sort-order="da"
          :sort-method="sortRelationshipRows"
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
              <q-space />
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-input
                  filled
                  v-model="filterRelationship"
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
                  v-model="filterRelationship"
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
              <q-td
                key="name"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
