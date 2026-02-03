<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Category } from 'src/ts/interfaces/data/Category';
import FormCategory from 'src/components/forms/FormCategory.vue';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { useCategoryStore } from 'src/stores/category-store';
import { useAuthStore } from 'src/stores/auth-store';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'Category',
});

const { user } = storeToRefs(useAuthStore());
const { listCategory, loadingCategory, filledData } =
  storeToRefs(useCategoryStore());
const {
  getCategories,
  deleteCategory,
  getCategoriesWithParams,
  updateActiveCategory,
  exportCategory,
} = useCategoryStore();

const currentPage = ref(1);
const rowsPerPage = ref(10);
const onlyCreatedByMe = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const onlyDefault = ref<boolean>(false);
const showFormCategory = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const filterCategory = ref<string>('');
const filterAllCategories = ref<string>('Todas');
const selectedDataEdit = ref<Category | null>(null);
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
    name: 'default',
    label: 'Padrão',
    field: 'default',
    align: 'left',
  },
  {
    name: 'alert',
    label: 'Alerta',
    field: 'alert.description',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const resetPage = (): void => {
  currentPage.value = 1;
};
const clear = (): void => {
  selectedDataEdit.value = null;
  filterCategory.value = '';
  filterAllCategories.value = 'Todas';
  filteredCategories.splice(0, filteredCategories.length);
  onlyCreatedByMe.value = false;
  onlyDefault.value = false;
};
const openFormCategory = (): void => {
  showFormCategory.value = true;
};
const closeFormCategory = (): void => {
  showFormCategory.value = false;
  clear();
};
const handleEdit = (category: Category) => {
  selectedDataEdit.value = category;
  openFormCategory();
};
const exclude = async (id: string) => {
  await deleteCategory(id);
  clear();
};
const fetchAlerts = async () => {
  await getCategories();
};
const reactivate = async (id: string) => {
  await updateActiveCategory(id);
  clear();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const exportData = async (): Promise<void> => {
  loadingExport.value = true;
  await exportCategory();
  loadingExport.value = false;
};
const filteredCategory = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const filterResult =
    filterAllCategories.value === 'Todas'
      ? listCategory.value
      : listCategory.value.filter((item) =>
          normalize(filterAllCategories.value).includes(normalize(item.type))
        );
  resetPage();
  const searchTerm = normalize(filterCategory.value);
  return filterResult.filter((item) => {
    return item.name && normalize(item.name).includes(searchTerm);
  });
});

const listCategoryCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredCategory.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredCategory.value.length / rowsPerPage.value);
});

watch(
  [onlyCreatedByMe, onlyDefault],
  async ([newCreatedByMe, newDefault], [oldCreatedByMe, oldDefault]) => {
    let lastChanged = null;
    resetPage();

    if (newCreatedByMe !== oldCreatedByMe) {
      lastChanged = 'onlyCreatedByMe';
    }
    if (newDefault !== oldDefault) {
      lastChanged = 'onlyDefault';
    }

    if (lastChanged === 'onlyCreatedByMe') {
      if (newCreatedByMe) {
        onlyDefault.value = false;
      }
    }
    if (lastChanged === 'onlyDefault') {
      if (newDefault) {
        onlyCreatedByMe.value = false;
      }
    }

    const shouldCallWithParams = newCreatedByMe || newDefault;

    if (newCreatedByMe && newDefault) {
      return;
    }

    if (shouldCallWithParams) {
      await getCategoriesWithParams(newCreatedByMe, newDefault);
    } else {
      await fetchAlerts();
    }
  }
);
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
        <TitlePage title="Gerenciamento de categorias" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          @click="exportData"
          :loading="loadingExport"
          flat
          color="black"
          icon-right="download"
          label="Exportar"
          unelevated
          no-caps
        />
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormCategory"
          icon-right="add"
          label="Categorias"
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
        class="q-pa-md q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          :rows="loadingCategory ? [] : listCategoryCurrent"
          :columns="columnsCategory"
          :loading="loadingCategory"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma categoria para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-weight-bold text-grey-8"
              >
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>

          <template v-slot:top>
            <div
              :class="
                !$q.screen.lt.md
                  ? 'row full-width items-center'
                  : 'column full-width q-gutter-y-sm'
              "
            >
              <div class="row items-center">
                <q-icon name="list" size="sm" class="q-mr-sm text-primary" />
                <span class="text-subtitle1 text-weight-bold"
                  >Lista de categorias</span
                >
              </div>

              <q-space v-if="!$q.screen.lt.md" />

              <div
                v-if="!$q.screen.lt.sm"
                class="row items-center q-gutter-x-md"
              >
                <div
                  class="row items-center bg-grey-3 q-px-sm rounded-borders"
                  style="height: 40px"
                >
                  <q-toggle
                    v-model="onlyDefault"
                    color="primary"
                    label="Padrão"
                    dense
                  />
                  <q-toggle
                    v-model="onlyCreatedByMe"
                    color="primary"
                    label="Criados"
                    dense
                  />
                </div>

                <q-select
                  v-model="filterAllCategories"
                  :options="['Todas', 'Entradas', 'Saídas']"
                  dense
                  filled
                  options-dense
                  label="Filtrar tipo"
                  style="width: 180px"
                />

                <q-input
                  v-model="filterCategory"
                  filled
                  dense
                  label="Pesquisar"
                  style="width: 220px"
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
                label="Filtros e Pesquisa"
                class="full-width border-form rounded-borders bg-grey-1"
                header-class="text-weight-medium"
              >
                <div class="q-pa-sm q-gutter-y-sm">
                  <div
                    class="row justify-around bg-white q-pa-xs rounded-borders border-form"
                  >
                    <q-toggle
                      v-model="onlyDefault"
                      color="primary"
                      label="Padrão"
                    />
                    <q-toggle
                      v-model="onlyCreatedByMe"
                      color="primary"
                      label="Criados"
                    />
                  </div>
                  <q-select
                    v-model="filterAllCategories"
                    :options="['Todos', 'Entradas', 'Saídas']"
                    dense
                    filled
                    label="Filtrar categorias"
                    class="full-width"
                  />
                  <q-input
                    v-model="filterCategory"
                    filled
                    dense
                    label="Pesquisar"
                    class="full-width"
                  >
                    <template v-slot:prepend><q-icon name="search" /></template>
                  </q-input>
                </div>
              </q-expansion-item>
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
              class="transition-row"
              :class="[
                props.row.type === 'entrada' ? 'row-entrada' : 'row-saida',
                props.row.active === 0 ? 'bg-grey-2 opacity-60' : '',
              ]"
            >
              <q-td key="name" :props="props" class="text-left">
                <div class="row items-center no-wrap">
                  <q-badge
                    rounded
                    :color="
                      props.row.type === 'entrada' ? 'positive' : 'negative'
                    "
                    class="q-mr-sm"
                    style="width: 8px; height: 8px; padding: 0"
                  />
                  <span
                    class="text-subtitle2"
                    :class="
                      props.row.active === 0
                        ? 'text-grey-7'
                        : 'text-weight-medium'
                    "
                  >
                    {{ props.row.name }}
                  </span>
                </div>
              </q-td>

              <q-td key="default" :props="props" class="text-left">
                <q-chip
                  dense
                  :color="props.row.default === 1 ? 'blue-1' : 'orange-1'"
                  :text-color="props.row.default === 1 ? 'blue-9' : 'orange-9'"
                  :label="props.row.default === 1 ? 'Sistema' : 'Manual'"
                  class="text-weight-bold"
                  size="11px"
                />
              </q-td>

              <q-td key="alert" :props="props" class="text-left">
                <span class="text-caption text-grey-8">{{
                  props.row.alert || '---'
                }}</span>
              </q-td>

              <q-td key="action" :props="props" class="q-gutter-x-xs">
                <q-btn
                  v-show="
                    props.row.enterprise_id !== null &&
                    props.row.active === 1 &&
                    props.row.default === 0 &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  icon="edit"
                  size="sm"
                  flat
                  round
                  color="grey-9"
                  @click="handleEdit(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  v-show="
                    props.row.enterprise_id !== null &&
                    props.row.active === 1 &&
                    props.row.default === 0 &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  icon="delete"
                  size="sm"
                  flat
                  round
                  color="negative"
                  @click="exclude(props.row.id)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
                <q-btn
                  v-show="
                    props.row.active === 0 &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  icon="settings_backup_restore"
                  size="sm"
                  flat
                  round
                  color="primary"
                  @click="reactivate(props.row.id)"
                >
                  <q-tooltip>Reativar</q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>

          <template v-slot:bottom>
            <div class="row full-width justify-center q-py-sm">
              <Paginate
                v-model="currentPage"
                :max="maxPages"
                :length="filteredCategory.length"
              />
            </div>
          </template>
        </q-table>

        <FormCategory
          :open="showFormCategory"
          :data-edit="selectedDataEdit"
          @update:open="closeFormCategory"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
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
