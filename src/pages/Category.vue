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
} = useCategoryStore();

const currentPage = ref(1);
const rowsPerPage = ref(10);
const onlyCreatedByMe = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const onlyDefault = ref<boolean>(false);
const showFormCategory = ref<boolean>(false);
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
  filterAllCategories.value = ' Todas';
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
const customFilterCategory = (
  rows: readonly Category[],
  terms: string,
  cols: readonly Category[],
  getCellValue: (row: Category | null, col: QuasarTable | null) => unknown
): readonly Category[] => {
  const searchTerm = terms.toLowerCase();
  resetPage();

  if (filteredCategories.length > 0) {
    return filteredCategories.filter((item) => {
      return item.name && item.name.toLowerCase().includes(searchTerm);
    });
  }

  return listCategory.value.filter((item) => {
    return item.name && item.name.toLowerCase().includes(searchTerm);
  });
};

const listCategoryCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return listCategory.value.slice(start, end);
});
const maxPages = computed(() => {
  const filterLength = customFilterCategory(
    [],
    filterCategory.value,
    [],
    () => null
  ).length;
  if (filterCategory.value.length > 0) {
    return Math.ceil(filterLength / rowsPerPage.value);
  }
  return Math.ceil(listCategory.value.length / rowsPerPage.value);
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
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          :rows="
            loadingCategory
              ? []
              : filteredCategories.length > 0
                ? filteredCategories
                : listCategoryCurrent
          "
          :columns="columnsCategory"
          :filter="filterCategory"
          :filter-method="customFilterCategory"
          :loading="loadingCategory"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma categoria para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:top>
            <div
              :class="!$q.screen.lt.md ? 'row full-width' : 'column full-width'"
            >
              <span class="text-subtitle2">Lista de categorias</span>
              <q-space />
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-toggle
                  v-model="onlyDefault"
                  color="primary"
                  label="Padrão"
                  left-label
                />
                <q-toggle
                  v-model="onlyCreatedByMe"
                  color="primary"
                  label="Criados"
                  left-label
                />
                <q-select
                  v-model="filterAllCategories"
                  :options="['Todas', 'Entradas', 'Saídas']"
                  dense
                  options-dense
                  filled
                  label="Filtrar tipo"
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
                <q-toggle
                  v-model="onlyDefault"
                  color="primary"
                  label="Padrão"
                  left-label
                  class="q-ml-sm"
                />
                <q-toggle
                  v-model="onlyCreatedByMe"
                  color="primary"
                  label="Criados"
                  left-label
                />
                <q-select
                  v-model="filterAllCategories"
                  :options="['Todos', 'Entradas', 'Saídas']"
                  dense
                  options-dense
                  filled
                  label="Filtrar categorias"
                  class="full-width q-mt-sm"
                />
                <q-input
                  filled
                  v-model="filterCategory"
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
            <q-tr
              :props="props"
              style="height: 28px"
              :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
            >
              <q-td
                key="name"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td
                key="default"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{
                  props.row.default === 1 ? 'Sim' : 'Não'
                }}</span>
              </q-td>
              <q-td
                key="alert"
                :props="props"
                class="text-left text-column"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2"> {{ props.row.alert }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  v-show="
                    props.row.enterprise_id !== null &&
                    props.row.active === 1 &&
                    props.row.default === 0 &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="exclude(props.row.id)"
                  v-show="
                    props.row.enterprise_id !== null &&
                    props.row.active === 1 &&
                    props.row.default === 0 &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  size="sm"
                  flat
                  round
                  color="negative"
                  icon="delete"
                />
                <q-btn
                  @click="reactivate(props.row.id)"
                  v-show="
                    props.row.active === 0 &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  size="sm"
                  flat
                  round
                  color="replay"
                  icon="replay"
                >
                  <q-tooltip> Reativar </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="listCategory.length"
            />
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
