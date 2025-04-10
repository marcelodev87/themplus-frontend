<script setup lang="ts">
import { useDashboardStore } from 'src/stores/dashboard-store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { DatePeriod } from 'src/ts/interfaces/data/Date';

defineOptions({
  name: 'Dashboard',
});

const { getDashboard, downloadDashboard } = useDashboardStore();
const {
  loadingDashboard,
  listCategoryMovementsDashboard,
  listCategorySchedulesDashboard,
  listMonthYear,
  movementsDashboard,
  schedulingsDashboard,
  usersDashboard,
  accountsDashboard,
  filledData,
  listCategoryFilters,
  totalEnterprise,
} = storeToRefs(useDashboardStore());

const selectedFilter = ref<QuasarSelect<string>>({
  label: 'Filtrar por mês',
  value: 'month',
});
const selectedCategory = ref<QuasarSelect<string | null>>({
  label: 'Todas categorias',
  value: null,
});
const showDatePeriod = ref<boolean>(false);
const selectedDatePeriod = ref<DatePeriod>({ from: null, to: null });
const showAlertDataEnterprise = ref<boolean>(false);
const columnsCategoriesDashboard = ref<QuasarTable[]>([
  {
    name: 'name',
    label: 'Categoria',
    field: 'name',
    align: 'left',
    style: 'min-width: 100px; max-width: 30%',
  },
  {
    name: 'value',
    label: 'Valor R$',
    field: 'value',
    align: 'left',
    style: 'width: 70%',
  },
]);
const optionsFilters = reactive<QuasarSelect<string>[]>([
  {
    label: 'Filtrar por mês',
    value: 'month',
  },
  {
    label: 'Filtrar por período',
    value: 'period',
  },
]);

const allowDownload = computed(() => {
  if (
    selectedFilter.value.value === 'period' &&
    (selectedDatePeriod.value.from === null ||
      selectedDatePeriod.value.to === null)
  ) {
    return true;
  }
  return false;
});
const optionsCategoriesFilter = computed(() => {
  const baseCategories = [
    {
      label: 'Todas categorias',
      value: null,
    },
  ];

  const additionalCategories = listCategoryFilters.value
    .map((item) => ({
      label: item.name,
      value: item.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return [...baseCategories, ...additionalCategories];
});
const categoriesMovementsEntry = computed(() => {
  return listCategoryMovementsDashboard.value
    ?.filter((item) => item.type === 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});
const categoriesMovementsOut = computed(() => {
  return listCategoryMovementsDashboard.value
    ?.filter((item) => item.type !== 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});
const categoriesSchedulesEntry = computed(() => {
  return listCategorySchedulesDashboard.value
    ?.filter((item) => item.type === 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});
const categoriesSchedulesOut = computed(() => {
  return listCategorySchedulesDashboard.value
    ?.filter((item) => item.type !== 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});
const totalValueEntryCategorySchedules = computed(() => {
  if (
    !categoriesSchedulesEntry.value ||
    categoriesSchedulesEntry.value.length === 0
  ) {
    return 0;
  }

  return categoriesSchedulesEntry.value.reduce((total, product) => {
    const productValue = Number(product.value) || 0;
    return total + productValue;
  }, 0);
});
const totalValueOutCategorySchedules = computed(() => {
  if (
    !categoriesSchedulesOut.value ||
    categoriesSchedulesOut.value.length === 0
  ) {
    return 0;
  }

  return categoriesSchedulesOut.value.reduce((total, product) => {
    const productValue = Number(product.value) || 0;
    return total + productValue;
  }, 0);
});
const totalValueEntryCategoryMovements = computed(() => {
  if (
    !categoriesMovementsEntry.value ||
    categoriesMovementsEntry.value.length === 0
  ) {
    return 0;
  }

  return categoriesMovementsEntry.value.reduce((total, product) => {
    const productValue = Number(product.value) || 0;
    return total + productValue;
  }, 0);
});
const totalValueOutCategoryMovements = computed(() => {
  if (
    !categoriesMovementsOut.value ||
    categoriesMovementsOut.value.length === 0
  ) {
    return 0;
  }

  return categoriesMovementsOut.value.reduce((total, product) => {
    const productValue = Number(product.value) || 0;
    return total + productValue;
  }, 0);
});
const dateActual = computed(() => {
  const currentDate = new Date();

  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();

  return `${month}/${year}`;
});
const formattedDate = computed(() => {
  if (selectedDatePeriod.value) {
    const { from, to } = selectedDatePeriod.value;
    if (from && to) {
      return `${from} até ${to}`;
    }
  }
  return 'Sem período selecionado';
});
const filterMonthYear = ref<string>(dateActual.value);
const fetchInformationsDashboard = async (date: string | DatePeriod) => {
  await getDashboard(
    selectedFilter.value.value,
    date,
    selectedCategory.value.value
  );
};
const getCurrentMonthYear = () => {
  if (selectedFilter.value.value === 'month') {
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const [month, year] = filterMonthYear.value.split('/').map(Number);

    if (month >= 1 && month <= 12) {
      return `${monthNames[month - 1]} de ${year}`;
    }

    return 'Mês ou ano inválido';
  }
  return 'Filtro por período';
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const clearDatePeriod = () => {
  selectedDatePeriod.value = { from: null, to: null };
};
const download = async () => {
  await downloadDashboard(
    selectedFilter.value.value,
    selectedFilter.value.value === 'month'
      ? filterMonthYear.value.replace('/', '-')
      : {
          from: selectedDatePeriod.value.from!.replace('/', '-'),
          to: selectedDatePeriod.value.to!.replace('/', '-'),
        },
    selectedCategory.value.value
  );
};

watch(
  filledData,
  () => {
    if (!filledData.value) {
      showAlertDataEnterprise.value = true;
    }
  },
  { immediate: true }
);
watch(
  [
    filterMonthYear,
    selectedFilter,
    selectedDatePeriod,
    selectedCategory,
    showDatePeriod,
  ],
  async () => {
    if (selectedFilter.value.value === 'month') {
      await fetchInformationsDashboard(filterMonthYear.value.replace('/', '-'));
    }
    if (
      selectedFilter.value.value === 'period' &&
      selectedDatePeriod.value.from !== null &&
      selectedDatePeriod.value.to !== null &&
      showDatePeriod.value === false
    ) {
      await fetchInformationsDashboard({
        from: selectedDatePeriod.value.from.replace('/', '-'),
        to: selectedDatePeriod.value.to.replace('/', '-'),
      });
    }
  },
  { deep: true }
);

onMounted(async () => {
  await fetchInformationsDashboard(dateActual.value.replace('/', '-'));
});
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between items-center bg-grey-1 q-pa-sm'
          : 'column justify-between items-center bg-grey-1 q-pa-sm q-gutter-y-sm'
      "
    >
      <span class="text-h6">{{ getCurrentMonthYear() }}</span>
      <q-separator />
      <div v-if="!$q.screen.lt.sm" class="row q-gutter-x-md">
        <q-select
          v-model="selectedFilter"
          :options="optionsFilters"
          :readonly="loadingDashboard"
          label="Tipo de filtro"
          map-options
          filled
          dense
          options-dense
          bg-color="grey-1"
          label-color="black"
          style="min-width: 200px"
          :class="!$q.screen.lt.md ? '' : 'full-width'"
        >
          <template v-slot:prepend>
            <q-icon name="filter_alt" color="black" size="20px" />
          </template>
        </q-select>
        <q-select
          v-if="selectedFilter.value === 'month'"
          v-model="filterMonthYear"
          :options="listMonthYear"
          :readonly="listMonthYear.length === 0 || loadingDashboard"
          :label="listMonthYear.length === 0 ? 'Sem dados' : 'Filtrar mês'"
          filled
          dense
          options-dense
          bg-color="grey-1"
          label-color="black"
          style="min-width: 200px"
          :class="!$q.screen.lt.md ? '' : 'full-width'"
        >
          <template v-slot:prepend>
            <q-icon name="calendar_today" color="black" size="20px" />
          </template>
        </q-select>
        <q-input
          v-else
          v-model="formattedDate"
          :readonly="loadingDashboard"
          filled
          dense
          bg-color="grey-1"
          label-color="black"
          style="min-width: 240px"
          :class="!$q.screen.lt.md ? '' : 'full-width'"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                @show="showDatePeriod = true"
                @hide="showDatePeriod = false"
              >
                <q-date v-model="selectedDatePeriod" range>
                  <div class="row items-center justify-end q-gutter-x-sm">
                    <q-btn
                      v-close-popup
                      label="Fechar"
                      color="red"
                      flat
                      unelevated
                      no-caps
                    />
                    <q-btn
                      @click="clearDatePeriod"
                      label="Limpar"
                      color="primary"
                      unelevated
                      no-caps
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          v-model="selectedCategory"
          :options="optionsCategoriesFilter"
          :readonly="loadingDashboard"
          label="Filtre categoria"
          filled
          dense
          options-dense
          bg-color="grey-1"
          label-color="black"
          style="min-width: 200px"
          :class="!$q.screen.lt.md ? '' : 'full-width'"
        >
          <template v-slot:prepend>
            <q-icon name="category" color="black" size="20px" />
          </template>
        </q-select>
        <q-btn
          @click="download"
          :loading="loadingDashboard"
          :disable="allowDownload"
          flat
          icon-right="download"
          label="Exportar PDF"
          unelevated
          no-caps
          :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
        />
      </div>
      <q-expansion-item
        v-else
        expand-separator
        icon="settings"
        label="Ações"
        class="full-width border-form"
      >
        <q-select
          v-model="selectedFilter"
          :options="optionsFilters"
          :readonly="loadingDashboard"
          label="Tipo de filtro"
          map-options
          filled
          dense
          options-dense
          bg-color="grey-1"
          label-color="black"
          class="q-mt-sm"
        >
          <template v-slot:prepend>
            <q-icon name="filter_alt" color="black" size="20px" />
          </template>
        </q-select>
        <q-select
          v-if="selectedFilter.value === 'month'"
          v-model="filterMonthYear"
          :options="listMonthYear"
          :readonly="listMonthYear.length === 0"
          :label="listMonthYear.length === 0 ? 'Sem dados' : 'Filtrar mês'"
          filled
          dense
          options-dense
          bg-color="grey-1"
          label-color="black"
          class="q-mt-sm"
        >
          <template v-slot:prepend>
            <q-icon name="calendar_today" color="black" size="20px" />
          </template>
        </q-select>
        <q-input
          v-else
          v-model="formattedDate"
          filled
          dense
          bg-color="grey-1"
          label-color="black"
          class="q-mt-sm"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                @show="showDatePeriod = true"
                @hide="showDatePeriod = false"
              >
                <q-date v-model="selectedDatePeriod" range>
                  <div class="row items-center justify-end q-gutter-x-sm">
                    <q-btn
                      v-close-popup
                      label="Fechar"
                      color="red"
                      flat
                      unelevated
                      no-caps
                    />
                    <q-btn
                      @click="clearDatePeriod"
                      label="Limpar"
                      color="primary"
                      unelevated
                      no-caps
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          v-model="selectedCategory"
          :options="optionsCategoriesFilter"
          :readonly="loadingDashboard"
          label="Filtre categoria"
          filled
          dense
          options-dense
          bg-color="grey-1"
          label-color="black"
          class="q-mt-sm"
        >
          <template v-slot:prepend>
            <q-icon name="category" color="black" size="20px" />
          </template>
        </q-select>
        <q-btn
          @click="download"
          :loading="loadingDashboard"
          :disable="allowDownload"
          flat
          icon-right="download"
          label="Exportar PDF"
          unelevated
          no-caps
          class="full-width q-mt-sm"
        />
      </q-expansion-item>
    </header>
    <q-scroll-area
      :class="!$q.screen.lt.sm ? 'main-scroll' : 'dashboard-scroll'"
    >
      <main class="q-pa-sm q-gutter-y-md">
        <div
          :class="
            !$q.screen.lt.sm
              ? 'row justify-between q-mt-sm'
              : 'column justify-center items-center'
          "
        >
          <q-card
            flat
            bordered
            class="q-mt-sm"
            :style="!$q.screen.lt.sm ? 'width: 24%' : 'width: 100%'"
          >
            <q-card-section class="row items-center">
              <q-icon
                name="sync_alt"
                size="20px"
                class="q-mr-sm"
                color="black"
              />
              <div class="text-h6">Movimentações</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span class="text-subtitle1">Total de entrada: </span>
              <span class="text-green">{{
                `${formatCurrencyBRL(Number(movementsDashboard?.entry_value))}`
              }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span class="text-subtitle1"> Total de saída:</span>
              <span class="text-red"
                >{{
                  `${formatCurrencyBRL(Number(movementsDashboard?.out_value))}`
                }}
              </span>
            </q-card-section>

            <q-separator inset />

            <q-card-section
              class="row justify-between"
              :class="
                Number(movementsDashboard?.entry_value) -
                  Number(movementsDashboard?.out_value) <
                0
                  ? 'bg-red-2'
                  : 'bg-green-2'
              "
            >
              <span class="text-subtitle1">Saldo:</span>
              <span>{{
                `${formatCurrencyBRL(
                  Number(movementsDashboard?.entry_value) -
                    Number(movementsDashboard?.out_value)
                )}`
              }}</span>
            </q-card-section>
          </q-card>
          <q-card
            flat
            bordered
            class="q-mt-sm"
            :style="!$q.screen.lt.sm ? 'width: 24%' : 'width: 100%'"
          >
            <q-card-section class="row items-center">
              <q-icon name="event" size="20px" class="q-mr-sm" color="black" />
              <div class="text-h6">Agendamentos</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span class="text-subtitle1">Total de entrada:</span>
              <span class="text-green">{{
                schedulingsDashboard?.entry_value
                  ? `${formatCurrencyBRL(Number(schedulingsDashboard.entry_value))}`
                  : ''
              }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span class="text-subtitle1">Total de saída:</span>
              <span class="text-red">{{
                schedulingsDashboard?.out_value
                  ? `${formatCurrencyBRL(Number(schedulingsDashboard.out_value))}`
                  : ''
              }}</span>
            </q-card-section>

            <q-separator inset />

            <q-card-section
              class="row justify-between"
              :class="
                schedulingsDashboard?.out_value &&
                schedulingsDashboard?.entry_value
                  ? Number(schedulingsDashboard.entry_value) -
                      Number(schedulingsDashboard.out_value) <
                    0
                    ? 'bg-red-2'
                    : 'bg-green-2'
                  : ''
              "
            >
              <span class="text-subtitle1">Saldo:</span>
              <span>{{
                schedulingsDashboard?.out_value &&
                schedulingsDashboard?.entry_value
                  ? `${formatCurrencyBRL(
                      Number(schedulingsDashboard.entry_value) -
                        Number(schedulingsDashboard.out_value)
                    )}`
                  : ''
              }}</span>
            </q-card-section>
          </q-card>
          <q-card
            flat
            bordered
            class="q-mt-sm"
            :style="!$q.screen.lt.sm ? 'width: 24%' : 'width: 100%'"
          >
            <q-card-section class="row items-center">
              <q-icon name="group" size="20px" class="q-mr-sm" color="black" />
              <div class="text-h6">Usuários</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span class="text-subtitle1">Administradores:</span>
              <span>{{ usersDashboard?.amount_admins ?? '' }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span class="text-subtitle1">Usuários comuns:</span>
              <span>{{ usersDashboard?.amount_common_users ?? '' }}</span>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
              <span class="text-subtitle1">Total de usuários:</span>
              <span>{{ usersDashboard?.amount_users ?? '' }}</span>
            </q-card-section>
          </q-card>
          <q-card
            flat
            bordered
            class="q-mt-sm"
            :style="!$q.screen.lt.sm ? 'width: 24%' : 'width: 100%'"
          >
            <q-card-section class="row justify-between items-center">
              <div>
                <q-icon
                  name="account_balance"
                  size="20px"
                  class="q-mr-sm"
                  color="black"
                />
                <span class="text-h6">Contas </span>
                <span class="text-body2 text-bold">TOP 3</span>
              </div>
              <q-banner
                v-show="accountsDashboard?.accounts.length === 0"
                dense
                inline-actions
                class="text-white bg-red"
                rounded
              >
                Não há contas registradas. Por favor, registre uma conta.
              </q-banner>
            </q-card-section>
            <q-card-section
              v-for="(item, index) in accountsDashboard?.accounts"
              class="q-pt-none row justify-between"
              :key="index"
            >
              <span class="text-subtitle1">{{ item.name }}:</span>
              <span>{{ `${formatCurrencyBRL(item.balance)}` }}</span>
            </q-card-section>
          </q-card>
        </div>
        <div
          :class="
            !$q.screen.lt.sm
              ? 'row justify-between q-mt-sm'
              : 'column justify-center items-center q-gutter-y-sm'
          "
        >
          <q-table
            :rows="loadingDashboard ? [] : (categoriesMovementsEntry ?? [])"
            :columns="columnsCategoriesDashboard"
            :loading="loadingDashboard"
            style="max-height: 400px"
            :style="!$q.screen.lt.sm ? 'width: 49.3%' : 'width: 100%'"
            flat
            bordered
            dense
            row-key="index"
            no-data-label="Nenhuma categoria de entrada para mostrar"
            virtual-scroll
            :rows-per-page-options="[5]"
          >
            <template v-slot:top>
              <q-icon
                name="sync_alt"
                size="20px"
                class="q-mr-sm"
                color="green"
              />
              <span class="text-h6 text-green"
                >Movimentações de entrada x categoria</span
              >
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-left">
                  <span class="text-subtitle1"> {{ props.row.name }}</span>
                </q-td>
                <q-td key="value" :props="props" class="text-left">
                  <q-linear-progress
                    :value="
                      (Number(props.row.value) || 0) /
                      (Number(totalValueEntryCategoryMovements) || 1)
                    "
                    size="20px"
                    class="q-my-sm bg-white text-green"
                    rounded
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`${(
                          ((Number(props.row.value) || 0) /
                            (Number(totalValueEntryCategoryMovements) || 1)) *
                          100
                        ).toFixed(1)} %`"
                      />
                      <q-badge
                        class="q-ml-sm"
                        color="white"
                        text-color="black"
                        :label="`${formatCurrencyBRL(props.row.value)}`"
                      />
                    </div>
                  </q-linear-progress>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-table
            :rows="loadingDashboard ? [] : (categoriesMovementsOut ?? [])"
            :columns="columnsCategoriesDashboard"
            :loading="loadingDashboard"
            style="max-height: 400px"
            :style="!$q.screen.lt.sm ? 'width: 49.3%' : 'width: 100%'"
            flat
            bordered
            dense
            row-key="index"
            no-data-label="Nenhuma categoria de saída para mostrar"
            virtual-scroll
            :rows-per-page-options="[5]"
          >
            <template v-slot:top>
              <q-icon name="sync_alt" size="20px" class="q-mr-sm" color="red" />
              <span class="text-h6 text-red"
                >Movimentações de saída x categoria</span
              >
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-left">
                  <span class="text-subtitle1"> {{ props.row.name }}</span>
                </q-td>
                <q-td key="value" :props="props" class="text-left">
                  <q-linear-progress
                    :value="
                      (Number(props.row.value) || 0) /
                      (Number(totalValueOutCategoryMovements) || 1)
                    "
                    size="20px"
                    rounded
                    class="q-my-sm bg-white text-red"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`${(
                          ((Number(props.row.value) || 0) /
                            (Number(totalValueOutCategoryMovements) || 1)) *
                          100
                        ).toFixed(1)} %`"
                      />
                      <q-badge
                        class="q-ml-sm"
                        color="white"
                        text-color="black"
                        :label="`${formatCurrencyBRL(props.row.value)}`"
                      />
                    </div>
                  </q-linear-progress>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div
          :class="
            !$q.screen.lt.sm
              ? 'row justify-between q-mt-sm'
              : 'column justify-center items-center q-gutter-y-sm'
          "
        >
          <q-table
            :rows="loadingDashboard ? [] : (categoriesSchedulesEntry ?? [])"
            :columns="columnsCategoriesDashboard"
            :loading="loadingDashboard"
            style="max-height: 400px"
            :style="!$q.screen.lt.sm ? 'width: 49.3%' : 'width: 100%'"
            flat
            bordered
            dense
            row-key="index"
            no-data-label="Nenhuma categoria de entrada para mostrar"
            virtual-scroll
            :rows-per-page-options="[5]"
          >
            <template v-slot:top>
              <q-icon name="event" size="20px" class="q-mr-sm" color="green" />
              <span class="text-h6 text-green"
                >Agendamentos de entrada x categoria</span
              >
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-left">
                  <span class="text-subtitle1"> {{ props.row.name }}</span>
                </q-td>
                <q-td key="value" :props="props" class="text-left">
                  <q-linear-progress
                    :value="
                      (Number(props.row.value) || 0) /
                      (Number(totalValueEntryCategorySchedules) || 1)
                    "
                    size="20px"
                    class="q-my-sm bg-white text-green"
                    rounded
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`${(
                          ((Number(props.row.value) || 0) /
                            (Number(totalValueEntryCategorySchedules) || 1)) *
                          100
                        ).toFixed(1)} %`"
                      />
                      <q-badge
                        class="q-ml-sm"
                        color="white"
                        text-color="black"
                        :label="`${formatCurrencyBRL(props.row.value)}`"
                      />
                    </div>
                  </q-linear-progress>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-table
            :rows="loadingDashboard ? [] : (categoriesSchedulesOut ?? [])"
            :columns="columnsCategoriesDashboard"
            :loading="loadingDashboard"
            style="max-height: 400px"
            :style="!$q.screen.lt.sm ? 'width: 49.3%' : 'width: 100%'"
            flat
            bordered
            dense
            row-key="index"
            no-data-label="Nenhuma categoria de saída para mostrar"
            virtual-scroll
            :rows-per-page-options="[5]"
          >
            <template v-slot:top>
              <q-icon name="event" size="20px" class="q-mr-sm" color="red" />
              <span class="text-h6 text-red"
                >Agendamentos de saída x categoria</span
              >
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-left">
                  <span class="text-subtitle1"> {{ props.row.name }}</span>
                </q-td>
                <q-td key="value" :props="props" class="text-left">
                  <q-linear-progress
                    :value="
                      (Number(props.row.value) || 0) /
                      (Number(totalValueOutCategorySchedules) || 1)
                    "
                    size="20px"
                    rounded
                    class="q-my-sm bg-white text-red"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`${(
                          ((Number(props.row.value) || 0) /
                            (Number(totalValueOutCategorySchedules) || 1)) *
                          100
                        ).toFixed(1)} %`"
                      />
                      <q-badge
                        class="q-ml-sm"
                        color="white"
                        text-color="black"
                        :label="`${formatCurrencyBRL(props.row.value)}`"
                      />
                    </div>
                  </q-linear-progress>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div
          :class="
            !$q.screen.lt.sm
              ? 'row justify-between q-mt-sm'
              : 'column justify-center items-center'
          "
        >
          <q-list
            bordered
            class="rounded-borders full-width q-mb-md bg-grey-3 text-bold text-subtitle1"
          >
            <q-expansion-item
              expand-separator
              icon="work"
              label="Dados gerais da organização"
            >
              <q-card flat class="q-pt-sm full-width text-body2">
                <q-card-section class="q-pt-none row justify-between">
                  <span class="text-subtitle1">Total de entrada: </span>
                  <span class="text-green">{{
                    `${formatCurrencyBRL(Number(totalEnterprise?.entry))}`
                  }}</span>
                </q-card-section>
                <q-card-section class="q-pt-none row justify-between">
                  <span class="text-subtitle1"> Total de saída:</span>
                  <span class="text-red"
                    >{{ `${formatCurrencyBRL(Number(totalEnterprise?.out))}` }}
                  </span>
                </q-card-section>
                <q-separator inset />

                <q-card-section
                  class="row justify-between"
                  :class="
                    Number(totalEnterprise?.entry) -
                      Number(totalEnterprise?.out) <
                    0
                      ? 'bg-red-2'
                      : 'bg-green-2'
                  "
                >
                  <span class="text-subtitle1">Saldo:</span>
                  <span>{{
                    `${formatCurrencyBRL(
                      Number(totalEnterprise?.entry) -
                        Number(totalEnterprise?.out)
                    )}`
                  }}</span>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>

<style scoped lang="scss">
.dashboard-scroll {
  height: calc(100vh - 180px);
}
</style>
