<script setup lang="ts">
import {
  computed, reactive, ref, watch,
} from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { DataCategory } from 'src/ts/interfaces/data/Category';
import { Notify } from 'quasar';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'FormCategory',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const filterCategory = ref<string>('');
const dataCategory = reactive<DataCategory>({
  name: '',
});
const rowsTeste = reactive([
  {
    name: 'Categoria 1',
    default: 'Sim',
  },
  {
    name: 'Categoria 2',
    default: 'Sim',
  },
  {
    name: 'Categoria 3',
    default: 'Não',
  },
  {
    name: 'Categoria 4',
    default: 'Não',
  },
]);
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
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): {status: boolean, message?: string} => {
  if (dataCategory.name.trim() === '') {
    return { status: false, message: 'O campo de categoria não pode ser vazio' };
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚâêîôûÂÊÎÔÛãõÃÕçÇ\s]+$/.test(dataCategory.name)) {
    return { status: false, message: 'O campo de categoria só pode conter texto' };
  }
  return { status: true };
};
const save = () => {
  const check = checkData();
  if (check.status) {
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const clear = (): void => {
  dataCategory.name = '';
};

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Cadastro de categorias de movimentações"/>
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form>
          <q-input
              v-model="dataCategory.name"
              bg-color="white"
              label-color="black"
              filled
              label="Crie uma nova categoria"
              dense
              input-class="text-black"
            />
        </q-form>
        <q-table
          flat bordered
          dense
          :rows="rowsTeste"
          :columns="columnsCategory"
          row-key="name"
          :filter="filterCategory"
          no-data-label="Nenhum dado para mostrar"
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
                <q-td
                    key="name"
                    :props="props"
                    class="text-left"
                >
                  {{ props.row.name }}
                </q-td>
                <q-td
                    key="default"
                    :props="props"
                    class="text-left"
                >
                  {{ props.row.default }}
                </q-td>
                <q-td key="action" :props="props">
                  <q-btn
                      size="sm"
                      flat
                      round
                      color="black"
                      icon="edit"
                      :disabled="false"
                  />
                    <q-btn
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
            :disable="false"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
