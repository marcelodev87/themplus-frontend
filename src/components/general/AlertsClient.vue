<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useAlertStore } from 'src/stores/alert-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Category } from 'src/ts/interfaces/data/Category';

defineOptions({
  name: 'AlertsClient',
});

const { loadingAlert, listCategory } = storeToRefs(useAlertStore());
const { getCategories, updateAlert } = useAlertStore();

const props = defineProps<{
  open: boolean;
  enterpriseId: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const filterAllCategories = ref<string>('Todos');
const filterCategory = ref<string>('');
const filteredCategories = reactive<Category[]>([]);
const columnsCategory = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Categoria',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'alert',
    label: 'Alerta',
    field: 'alert.description',
    align: 'left',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const clear = (): void => {
  filterCategory.value = '';
  filterAllCategories.value = 'Todos';
};
const fetchCategories = async () => {
  await getCategories(props.enterpriseId ?? '');
};
const save = async () => {
  const data: { id: string; alert: null | string }[] = [];
  listCategory.value.forEach((item) => {
    data.push({
      id: item.id,
      alert:
        item.alert?.trim() === '' || item.alert === null ? null : item.alert,
    });
  });

  const response = await updateAlert(data, props.enterpriseId ?? '');
  if (response?.status === 200) {
    clear();
    emit('update:open');
  }
};

watch(
  filterAllCategories,
  (type) => {
    if (type === 'Entradas') {
      filteredCategories.splice(0, filteredCategories.length);
      listCategory.value.forEach((item) => {
        if (item.type === 'entrada') {
          filteredCategories.push(item);
        }
      });
    } else if (type === 'Saídas') {
      filteredCategories.splice(0, filteredCategories.length);
      listCategory.value.forEach((item) => {
        if (item.type === 'saída') {
          filteredCategories.push(item);
        }
      });
    } else {
      filteredCategories.splice(0, filteredCategories.length);
    }
  },
  { immediate: true }
);
watch(open, async () => {
  if (open.value) {
    clear();
    await fetchCategories();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 99vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de alertas x categoria" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <main class="q-pa-sm q-mb-md">
          <q-table
            :rows="
              loadingAlert
                ? []
                : filteredCategories.length > 0
                  ? filteredCategories
                  : listCategory
            "
            :columns="columnsCategory"
            :filter="filterCategory"
            :loading="loadingAlert"
            flat
            bordered
            dense
            row-key="index"
            no-data-label="Nenhuma categoria para mostrar"
            virtual-scroll
            :rows-per-page-options="[10]"
            style="min-height: 400px"
          >
            <template v-slot:top>
              <div :class="!$q.screen.lt.md ? '' : 'column full-width'">
                <span class="text-subtitle2">Lista de categorias</span>
                <q-space />
                <div v-if="!$q.screen.lt.md" class="row">
                  <q-select
                    v-model="filterAllCategories"
                    :options="['Todos', 'Entradas', 'Saídas']"
                    dense
                    options-dense
                    filled
                    label="Filtrar categorias"
                    :style="!$q.screen.lt.sm ? 'width: 200px' : 'width: 49%'"
                    class="q-mr-sm"
                  />
                  <q-input
                    filled
                    v-model="filterCategory"
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
                  <q-select
                    v-model="filterAllCategories"
                    :options="['Todos', 'Entradas', 'Saídas']"
                    dense
                    options-dense
                    filled
                    label="Filtrar categorias"
                    class="q-mt-sm"
                  />
                  <q-input
                    filled
                    v-model="filterCategory"
                    dense
                    label="Pesquisar"
                    class="q-mt-sm"
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
                  {{ props.row.name }}
                </q-td>
                <q-td
                  key="type"
                  :props="props"
                  class="text-left capitalize"
                  :class="props.row.active === 0 ? 'text-grey-5' : ''"
                >
                  {{ props.row.type }}
                </q-td>
                <q-td key="alert" :props="props">
                  <span v-if="props.row.alert">{{ props.row.alert }}</span>
                  <span v-else class="text-red">
                    <q-icon name="edit" /> Adicione uma alerta
                  </span>
                  <q-popup-edit
                    v-model="props.row.alert"
                    auto-save
                    v-slot="scope"
                  >
                    <q-input
                      v-model="scope.value"
                      dense
                      autofocus
                      counter
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </main>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            size="md"
            flat
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            v-show="listCategory.length > 0"
            :loading="loadingAlert"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
