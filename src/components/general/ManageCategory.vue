<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from 'src/stores/category-store';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { CategoryPanel } from 'src/ts/interfaces/data/Category';
import TitlePage from '../shared/TitlePage.vue';
import FormCategoryCode from '../forms/FormCategoryCode.vue';

defineOptions({
  name: 'ManageCategory',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listCategoryPanel, loadingCategory } = storeToRefs(useCategoryStore());
const { getEnterpriseCategoryByCounter } = useCategoryStore();

const selectedCategory = ref<CategoryPanel | null>(null);
const showFormCategoryUpdate = ref<boolean>(false);
const filterCategory = ref<string>('');
const selectedType = ref<QuasarSelect<string>>({
  label: 'Todos os tipos',
  value: 'all',
});
const optionsType = reactive<QuasarSelect<string>[]>([
  {
    label: 'Todas as categorias',
    value: 'all',
  },
  {
    label: 'Entrada',
    value: 'entrada',
  },
  {
    label: 'Saída',
    value: 'saida',
  },
]);
const selectedClassification = ref<QuasarSelect<string>>({
  label: 'Todas as classificações',
  value: 'all',
});
const optionsClassification = reactive<QuasarSelect<string>[]>([
  {
    label: 'Todas as classificações',
    value: 'all',
  },
  {
    label: 'Padrão',
    value: '1',
  },
  {
    label: 'Criada',
    value: '0',
  },
]);
const columnsCategoryPanel = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'default',
    label: 'Tipo',
    field: 'default',
    align: 'left',
  },
  {
    name: 'organization_name',
    label: 'Organização',
    field: 'organization_name',
    align: 'left',
  },
  {
    name: 'code_debt',
    label: 'Código débito',
    field: 'code_debt',
    align: 'left',
  },
  {
    name: 'code_credit',
    label: 'Código crédito',
    field: 'code_credit',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ações',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  selectedCategory.value = null;
  filterCategory.value = '';
  selectedType.value = {
    label: 'Todos os tipos',
    value: 'all',
  };
  selectedClassification.value = {
    label: 'Todas as classificações',
    value: 'all',
  };
};
const openFormCategoryUpdate = (data: CategoryPanel): void => {
  selectedCategory.value = data;
  showFormCategoryUpdate.value = true;
};
const closeFormCategoryUpdate = (): void => {
  showFormCategoryUpdate.value = false;
  clear();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(
  [() => open.value, selectedType, selectedClassification],
  async ([isOpen, type, classification]) => {
    if (isOpen) {
      await getEnterpriseCategoryByCounter(type.value, classification.value);
    }
  }
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Listagem de categorias" />
        <q-table
          :rows="listCategoryPanel"
          :rows-per-page-options="[10]"
          :filter="filterCategory"
          :columns="columnsCategoryPanel"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma categoria para mostrar"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de categorias</span>
            <q-space />
            <q-select
              v-model="selectedType"
              label="Filtrar por tipo"
              :options="optionsType"
              class="q-mr-sm"
              filled
              dense
              options-dense
              bg-color="grey-1"
              label-color="black"
              style="min-width: 200px"
              :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
            ></q-select>
            <q-select
              v-model="selectedClassification"
              label="Filtrar por classificação"
              :options="optionsClassification"
              class="q-mr-sm"
              filled
              dense
              options-dense
              bg-color="grey-1"
              label-color="black"
              style="min-width: 200px"
              :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
            ></q-select>
            <q-input
              filled
              dense
              v-model="filterCategory"
              label="Pesquisar"
              q-input
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td
                key="name"
                :props="props"
                class="text-left"
                :class="
                  props.row.type === 'entrada' ? 'text-green' : 'text-red'
                "
              >
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td key="default" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.default === 1 ? 'Padrão' : 'Criada'
                }}</span>
              </q-td>
              <q-td key="organization_name" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.organization_name
                }}</span>
              </q-td>
              <q-td key="code_debt" :props="props" class="text-left">
                <span class="text-subtitle2">
                  {{ props.row.code_debt }}
                </span>
              </q-td>
              <q-td key="code_credit" :props="props" class="text-left">
                <q-span class="text-subtitle2">
                  {{ props.row.code_credit }}
                </q-span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="openFormCategoryUpdate(props.row)"
                  :disable="loadingCategory"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-card-actions align="right">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-card-section>
      <q-inner-loading
        :showing="loadingCategory"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
      <FormCategoryCode
        :categorySelected="selectedCategory"
        :open="showFormCategoryUpdate"
        @update:open="closeFormCategoryUpdate"
      />
    </q-card>
  </q-dialog>
</template>
