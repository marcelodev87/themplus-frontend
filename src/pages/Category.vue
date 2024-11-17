<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Category } from 'src/ts/interfaces/data/Category';
import FormCategory from 'src/components/forms/FormCategory.vue';
import { useCategoryStore } from 'src/stores/category-store';

defineOptions({
  name: 'Category',
});

const { listCategory, loadingCategory } = storeToRefs(useCategoryStore());
const { getCategories, deleteCategory, getCategoriesWithParams } =
  useCategoryStore();

const onlyCreatedByMe = ref<boolean>(false);
const onlyDefault = ref<boolean>(false);
const showFormCategory = ref<boolean>(false);
const filterCategory = ref<string>('');
const selectedDataEdit = ref<Category | null>(null);
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
    sortable: true,
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
    sortable: true,
  },
  {
    name: 'alert',
    label: 'Alerta',
    field: 'alert.description',
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
  filterCategory.value = '';
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
};
const fetchAlerts = async () => {
  await getCategories();
};

watch(
  [onlyCreatedByMe, onlyDefault],
  async ([newCreatedByMe, newDefault], [oldCreatedByMe, oldDefault]) => {
    let lastChanged = null;

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

onMounted(async () => {
  await fetchAlerts();
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-6">
        <TitlePage title="Gerenciamento de categorias" />
      </div>
      <div class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormCategory"
          color="blue-8"
          icon-right="category"
          label="Categorias"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <main class="q-pa-sm">
      <q-table
        :rows="loadingCategory ? [] : listCategory"
        :columns="columnsCategory"
        :filter="filterCategory"
        :loading="loadingCategory"
        style="max-height: 400px"
        flat
        bordered
        dense
        row-key="name"
        no-data-label="Nenhuma categoria para mostrar"
      >
        <template v-slot:top>
          <span class="text-subtitle2">Lista de categorias</span>
          <q-space />
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
          <q-input filled v-model="filterCategory" dense label="Pesquisar">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" style="height: 28px">
            <q-td key="name" :props="props" class="text-left">
              {{ props.row.name }}
            </q-td>
            <q-td key="default" :props="props" class="text-left">
              {{ props.row.enterprise_id === null ? 'Sim' : 'Não' }}
            </q-td>
            <q-td key="type" :props="props" class="text-left capitalize">
              {{ props.row.type }}
            </q-td>
            <q-td key="alert" :props="props" class="text-left text-column">
              {{ props.row.alert_id ? props.row.alert.description : '' }}
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                @click="handleEdit(props.row)"
                v-show="props.row.enterprise_id !== null"
                size="sm"
                flat
                round
                color="black"
                icon="edit"
                :disabled="false"
              />
              <q-btn
                @click="exclude(props.row.id)"
                v-show="props.row.enterprise_id !== null"
                size="sm"
                flat
                round
                color="negative"
                icon="delete"
                :disabled="false"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <FormCategory
        :open="showFormCategory"
        :data-edit="selectedDataEdit"
        @update:open="closeFormCategory"
      />
    </main>
  </section>
</template>
