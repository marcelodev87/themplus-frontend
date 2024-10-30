<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Category, DataCategory } from 'src/ts/interfaces/data/Category';
import { Notify } from 'quasar';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useCategoryStore } from 'src/stores/category-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'FormCategory',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createCategory, getCategories, deleteCategory, updateCategory } =
  useCategoryStore();
const { loadingCategory, listCategory } = storeToRefs(useCategoryStore());

const filterCategory = ref<string>('');
const dataCategory = reactive<DataCategory>({
  name: '',
  type: 'Entrada',
});
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
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);
const optionsTypeCategory = reactive<string[]>(['Entrada', 'Saída']);
const categoryEdit = ref<Category | null>(null);
const showModeEdit = ref<boolean>(false);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataCategory.name.trim() === '') {
    return {
      status: false,
      message: 'O campo de categoria não pode ser vazio',
    };
  }
  if (dataCategory.name.trim().length < 3) {
    return {
      status: false,
      message: 'O campo de categoria deve conter pelo menos 3 caracteres',
    };
  }
  return { status: true };
};
const clear = (): void => {
  dataCategory.name = '';
  dataCategory.type = 'Entrada';
  filterCategory.value = '';
};
const exclude = async (id: string) => {
  clear();
  await deleteCategory(id);
};
const openModeEdit = (): void => {
  showModeEdit.value = true;
};
const closeModeEdit = (): void => {
  showModeEdit.value = false;
  categoryEdit.value = null;
  clear();
};
const handleEdit = (category: Category) => {
  clear();
  categoryEdit.value = category;
  Object.assign(dataCategory, {
    name: category.name,
    type: category.type === 'entrada' ? 'Entrada' : 'Saída',
  });
  openModeEdit();
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    await createCategory(dataCategory.name, dataCategory.type);
    clear();
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    await updateCategory(
      categoryEdit.value?.id ?? '',
      dataCategory.name,
      dataCategory.type
    );
    clear();
    closeModeEdit();
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};

watch(open, async () => {
  if (open.value) {
    closeModeEdit();
    clear();
    await getCategories();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Cadastro de categorias de movimentações" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCategory.name"
            bg-color="white"
            label-color="black"
            filled
            label="Crie uma nova categoria"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="dataCategory.type"
            :options="optionsTypeCategory"
            label="Tipo"
            filled
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="sync_alt" color="black" size="20px" />
            </template>
          </q-select>
        </q-form>
        <q-table
          v-show="!showModeEdit"
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
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            @click="closeModeEdit"
            v-show="showModeEdit"
            color="grey-8"
            label="Voltar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-if="categoryEdit"
            @click="update"
            :loading="loadingCategory"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="save"
            :loading="loadingCategory"
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
