<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { useMovementStore } from 'src/stores/movement-store';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { DataMovementAnalyze, Movement } from 'src/ts/interfaces/data/Movement';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { useAuthStore } from 'src/stores/auth-store';
import { Notify } from 'quasar';

defineOptions({
  name: 'MovementsAnalyze',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const {
  getMovementsAnalyze,
  downloadFile,
  deleteMovementsAnalyze,
  finalizeMovementAnalyze,
} = useMovementStore();
const { loadingMovement, listMovementAnalyze, listAccount, listCategoryAll } =
  storeToRefs(useMovementStore());
const { user } = storeToRefs(useAuthStore());

const selectedDataEdit = ref<Movement | null>(null);
const optionsCategories = ref(listCategoryAll.value);
const optionsAccounts = ref(listAccount.value);
const selectedExclude = ref<string>('');
const columnsMovement = reactive<QuasarTable[]>([
  {
    name: 'date_movement',
    label: 'Data de movimentação',
    field: 'date_movement',
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
  },
  {
    name: 'account',
    label: 'Conta',
    field: '',
    align: 'left',
    style:
      'max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
    style:
      'width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
    style:
      'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'receipt',
    label: 'Arquivo',
    field: 'receipt',
    align: 'left',
    style:
      'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
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
  selectedExclude.value = '';
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};
const download = async (url: string) => {
  await downloadFile(url);
};
const exclude = async (id: string) => {
  await deleteMovementsAnalyze(id);
  if (listMovementAnalyze.value.length === 0) {
    emit('update:open');
  }
};
const fetchMovementsAnalyze = async () => {
  await getMovementsAnalyze();
};
const filterFnAccount = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    optionsAccounts.value =
      val === ''
        ? listAccount.value
        : listAccount.value.filter((element) =>
            element.label?.toLowerCase().includes(needle)
          );
  });
};
const filterFnCategory = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    optionsCategories.value =
      val === ''
        ? listCategoryAll.value
        : listCategoryAll.value.filter((element) =>
            element.name?.toLowerCase().includes(needle)
          );
  });
};
const checkMovement = (movement: DataMovementAnalyze) => {
  return movement.account && movement.category;
};
const save = async (movement: DataMovementAnalyze) => {
  const result = checkMovement(movement);
  if (result) {
    const response = await finalizeMovementAnalyze(
      movement.id,
      movement.account.value,
      movement.category.value,
      movement.date_movement,
      movement.description,
      movement.enterprise_id,
      movement.receipt,
      movement.type,
      movement.value
    );
    await fetchMovementsAnalyze();
    if (response?.status === 201 && listMovementAnalyze.value.length === 0) {
      emit('update:open');
    }
  } else {
    Notify.create({
      message: 'Está faltando conta ou categoria vinculada a movimentação',
      type: 'negative',
    });
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchMovementsAnalyze();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Pré-Movimentações" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-table
          :rows="listMovementAnalyze"
          :columns="columnsMovement"
          :loading="loadingMovement"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma pré-movimentação para mostrar"
          virtual-scroll
          :rows-per-page-options="[10]"
          style="min-height: 250px"
        >
          <template v-slot:top>
            <div>
              <span class="text-subtitle2">Lista de Pré-movimentações</span>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              style="height: 28px"
              :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
            >
              <q-td key="date_movement" :props="props" class="text-left">
                {{ formatDate(props.row.date_movement) }}
              </q-td>
              <q-td key="value" :props="props" class="text-left">
                {{ `${formatCurrencyBRL(props.row.value)}` }}
              </q-td>
              <q-td key="account" :props="props" class="text-left">
                <q-select
                  v-model="props.row.account"
                  :options="optionsAccounts"
                  @filter="filterFnAccount"
                  label="Conta"
                  filled
                  dense
                  options-dense
                  map-options
                  bg-color="white"
                  label-color="black"
                  use-input
                  input-debounce="0"
                  behavior="menu"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_balance" color="black" size="16px" />
                  </template>
                </q-select>
              </q-td>
              <q-td key="category" :props="props" class="text-left">
                <q-select
                  v-model="props.row.category"
                  :options="
                    (props.row.type === 'entrada'
                      ? optionsCategories.filter(
                          (item) => item.type === 'entrada'
                        )
                      : optionsCategories.filter(
                          (item) => item.type === 'saída'
                        )
                    ).map((item) => ({ value: item.id, label: item.name }))
                  "
                  @filter="filterFnCategory"
                  label="Categoria"
                  filled
                  dense
                  options-dense
                  map-options
                  bg-color="white"
                  label-color="black"
                  use-input
                  input-debounce="0"
                  behavior="menu"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" color="black" size="16px" />
                  </template>
                </q-select>
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
                <q-icon name="edit" v-show="!props.row.description" />
                <q-popup-edit
                  v-model="props.row.description"
                  auto-save
                  v-slot="scope"
                  style="width: 300px; max-width: 90%"
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
              <q-td
                key="receipt"
                :props="props"
                class="text-left"
                :class="props.row.receipt ? 'cursor-pointer hover' : ''"
              >
                <q-file
                  v-model="props.row.receipt"
                  @click="download(props.row.receipt)"
                  filled
                  bg-color="white"
                  label-color="black"
                  label="Arquivo"
                  dense
                  clearable
                  accept=".pdf"
                  :max-file-size="2 * 1024 * 1024"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" color="black" size="20px" />
                  </template>
                  <q-tooltip v-if="props.row.receipt">{{
                    props.row.receipt ? props.row.receipt.name : ''
                  }}</q-tooltip>
                </q-file>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  @click="save(props.row)"
                  :disable="loadingMovement"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="save"
                />

                <q-btn
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  @click="exclude(props.row.id)"
                  :disable="loadingMovement"
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
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.movement-scroll {
  height: calc(100vh - 180px);
}
</style>
