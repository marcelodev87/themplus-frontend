<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Category } from 'src/ts/interfaces/data/Category';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { MemberChurch } from 'src/ts/interfaces/data/Member';
import { Account } from 'src/ts/interfaces/data/Account';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { useMovementStore } from 'src/stores/movement-store';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'MemberMovementInfo',
});

const props = defineProps<{
  open: boolean;
  memberSelected: MemberChurch | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingMovement } = storeToRefs(useMovementStore());
const { getMovementsMember, downloadFile } = useMovementStore();

const list = ref<Movement[]>([]);
const listCategories = ref<QuasarSelect<string>[]>([]);
const listAccounts = ref<QuasarSelect<string>[]>([]);
const listPeriods = ref<string[]>([]);
const period = ref<string | null>(null);
const optionsType = reactive<QuasarSelect<string | null>[]>([
  {
    label: 'Todos os tipos',
    value: null,
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
const selectedType = ref<QuasarSelect<string | null>>({
  label: 'Todos os tipos',
  value: null,
});
const selectedCategory = ref<QuasarSelect<string | null>>({
  label: 'Todas as categorias',
  value: null,
});
const selectedAccount = ref<QuasarSelect<string | null>>({
  label: 'Todas as contas',
  value: null,
});
const selectedPeriod = ref<QuasarSelect<string | null>>({
  label: 'Todo o período',
  value: null,
});
const columnsMemberMovement = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Banco',
    field: 'account.name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'account_number',
    label: 'Conta',
    field: 'account.account_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'agency_number',
    label: 'Agência',
    field: 'account.agency_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category.name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date_movement',
    label: 'Data de movimentação',
    field: 'date_movement',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'receipt',
    label: 'Arquivo',
    field: 'receipt',
    align: 'left',
    style:
      'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
]);
const clear = (): void => {
  selectedType.value = {
    label: 'Todos os tipos',
    value: null,
  };
  selectedCategory.value = {
    label: 'Todas as categorias',
    value: null,
  };
  selectedAccount.value = {
    label: 'Todas as contas',
    value: null,
  };
  selectedPeriod.value = {
    label: 'Todo o período',
    value: null,
  };
  list.value = [];
};
const fetchMovements = async () => {
  const response = await getMovementsMember({
    member: props.memberSelected?.id ?? '',
    type: selectedType.value.value,
    category: selectedCategory.value.value,
    account: selectedAccount.value.value,
    period: selectedPeriod.value.value,
  });
  if (response?.status === 200) {
    list.value = response.data.movements;
    listAccounts.value = response.data.accounts;
    listCategories.value = response.data.categories;
    listPeriods.value = response.data.months_years;
  }
};
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};
const download = async (url: string) => {
  await downloadFile(url);
};

const optionsCategory = computed<QuasarSelect<string | null>[]>(() => {
  const mappedCategories: QuasarSelect<string>[] = listCategories.value.map(
    (category) => ({
      label: category.label,
      value: category.value,
    })
  );

  return [
    {
      label: 'Todas as categorias',
      value: null,
    },
    ...mappedCategories,
  ];
});
const optionsAccount = computed<QuasarSelect<string | null>[]>(() => {
  const mappedAccounts: QuasarSelect<string>[] = listAccounts.value.map(
    (account) => ({
      label: account.label,
      value: account.value,
    })
  );

  return [
    {
      label: 'Todas as contas',
      value: null,
    },
    ...mappedAccounts,
  ];
});
const optionsPeriod = computed<QuasarSelect<string | null>[]>(() => {
  const mappedPeriods: QuasarSelect<string>[] = listPeriods.value.map((p) => ({
    label: p,
    value: p.replace('/', '-'),
  }));

  return [
    {
      label: 'Todo o período',
      value: null,
    },
    ...mappedPeriods,
  ];
});
const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const getTotalEntry = computed(() => {
  if (!list.value?.length) return 'R$ 0,00';

  const total = list.value
    .filter((item) => item.type === 'entrada')
    .reduce((acc, item) => acc + (parseFloat(String(item.value)) || 0), 0);

  return total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
});

const getTotalOut = computed(() => {
  if (!list.value?.length) return 'R$ 0,00';

  const total = list.value
    .filter((item) => item.type !== 'entrada')
    .reduce((acc, item) => acc + (parseFloat(String(item.value)) || 0), 0);

  return total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
});

watch(
  [selectedType, selectedCategory, selectedAccount, selectedPeriod],
  async () => {
    await fetchMovements();
  },
  { deep: true }
);
watch(open, async () => {
  clear();
  if (open.value) {
    await fetchMovements();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 98vw">
      <q-card-section class="q-pa-sm">
        <TitlePage title="Contribuições do membro" />
        <div class="row q-gutter-x-sm q-mb-sm">
          <q-card
            flat
            bordered
            class="q-mt-sm row justify-center text-green text-bold text-h6"
            style="min-width: 200px; max-width: 100%"
          >
            <q-tooltip> Total R$ Entrada </q-tooltip>
            <q-card-section class="row justify-between">
              <span>{{ getTotalEntry }}</span>
            </q-card-section>
          </q-card>
          <q-card
            flat
            bordered
            class="q-mt-sm row justify-center text-red text-bold text-h6"
            style="min-width: 200px; max-width: 100%"
          >
            <q-tooltip> Total R$ Saída </q-tooltip>
            <q-card-section class="row justify-between">
              <span>{{ getTotalOut }}</span>
            </q-card-section>
          </q-card>
        </div>
        <q-table
          :rows="loadingMovement ? [] : list"
          :columns="columnsMemberMovement"
          :loading="loadingMovement"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma movimentação para mostrar"
          virtual-scroll
          :rows-per-page-options="[10]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <div :class="!$q.screen.lt.md ? '' : 'column full-width'">
              <div v-if="!$q.screen.lt.md" class="row">
                <q-select
                  v-model="selectedPeriod"
                  :options="optionsPeriod"
                  :readonly="loadingMovement"
                  label="Filtrar momento"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mr-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_today" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedType"
                  :options="optionsType"
                  :readonly="loadingMovement"
                  label="Filtrar tipo"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mr-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="list" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedCategory"
                  :options="optionsCategory"
                  :readonly="loadingMovement"
                  label="Filtre categoria"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mr-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedAccount"
                  :options="optionsAccount"
                  :readonly="loadingMovement"
                  label="Filtre conta"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mr-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_balance" color="black" size="20px" />
                  </template>
                </q-select>
              </div>
              <q-expansion-item
                v-else
                expand-separator
                icon="filter_alt"
                label="Filtros"
                class="border-form"
              >
                <q-select
                  v-model="period"
                  :options="optionsPeriod"
                  :readonly="loadingMovement"
                  label="Filtrar momento"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_today" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedType"
                  :options="optionsType"
                  :readonly="loadingMovement"
                  label="Filtrar tipo"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mr-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="list" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedCategory"
                  :options="optionsCategory"
                  :readonly="loadingMovement"
                  label="Filtre categoria"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedAccount"
                  :options="optionsAccount"
                  :readonly="loadingMovement"
                  label="Filtre conta"
                  filled
                  dense
                  options-dense
                  bg-color="grey-1"
                  label-color="black"
                  style="min-width: 200px"
                  :class="!$q.screen.lt.md ? '' : 'full-width'"
                  class="q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_balance" color="black" size="20px" />
                  </template>
                </q-select>
              </q-expansion-item>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              style="height: 28px"
              :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
            >
              <q-td key="name" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.account.name }}</span>
              </q-td>
              <q-td key="account_number" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.account.account_number
                }}</span>
              </q-td>
              <q-td key="agency_number" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.account.agency_number
                }}</span>
              </q-td>
              <q-td key="category" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.category.name
                }}</span>
              </q-td>
              <q-td key="value" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  `${formatCurrencyBRL(props.row.value)}`
                }}</span>
              </q-td>
              <q-td key="date_movement" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  formatDate(props.row.date_movement)
                }}</span>
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.description }}</span>
              </q-td>
              <q-td
                @click="download(props.row.receipt)"
                key="receipt"
                :props="props"
                class="text-left"
                :class="props.row.receipt ? 'cursor-pointer hover' : ''"
              >
                <q-icon
                  v-if="props.row.receipt"
                  name="attach_file"
                  size="20px"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-card-actions align="right" class="q-py-sm q-px-none">
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
        :showing="loadingMovement"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
