<script setup lang="ts">
import { useDashboardStore } from 'src/stores/dashboard-store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';

defineOptions({
  name: 'Dashboard',
});

const { getDashboard } = useDashboardStore();
const {
  loadingDashboard,
  listCategoryDashboard,
  listMonthYear,
  movementsDashboard,
  schedulingsDashboard,
  usersDashboard,
  accountsDashboard,
  filledData,
} = storeToRefs(useDashboardStore());

const showAlertDataEnterprise = ref<boolean>(false);
const columnsCategoriesDashboard = reactive<QuasarTable[]>([
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

const categoriesEntry = computed(() => {
  return listCategoryDashboard.value
    ?.filter((item) => item.type === 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});
const categoriesOut = computed(() => {
  return listCategoryDashboard.value
    ?.filter((item) => item.type !== 'entrada')
    .sort((a, b) => Number(b.value) - Number(a.value));
});
const totalValueEntryCategory = computed(() => {
  if (!categoriesEntry.value || categoriesEntry.value.length === 0) {
    return 0;
  }

  return categoriesEntry.value.reduce((total, product) => {
    const productValue = Number(product.value) || 0;
    return total + productValue;
  }, 0);
});
const totalValueOutCategory = computed(() => {
  if (!categoriesOut.value || categoriesOut.value.length === 0) {
    return 0;
  }

  return categoriesOut.value.reduce((total, product) => {
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
const filterMonthYear = ref<string>(dateActual.value);
const fetchInformationsDashboard = async (date: string) => {
  await getDashboard(date);
};
const getCurrentMonthYear = () => {
  const currentDate = new Date();
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
  return `${monthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
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
watch(filterMonthYear, async () => {
  await fetchInformationsDashboard(filterMonthYear.value.replace('/', '-'));
});

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
      <q-select
        v-model="filterMonthYear"
        :options="listMonthYear"
        :readonly="listMonthYear.length === 0"
        :label="listMonthYear.length === 0 ? 'Sem dados' : 'Filtrar momento'"
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
    </header>
    <q-scroll-area class="main-scroll">
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
            <q-card-section>
              <div class="text-h6">Movimentações</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span>Valor de entrada: </span>
              <span>{{
                `${formatCurrencyBRL(Number(movementsDashboard?.entry_value))}`
              }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span> Valor de saída:</span>
              <span
                >{{
                  `${formatCurrencyBRL(Number(movementsDashboard?.out_value))}`
                }}
              </span>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
              <span>Saldo:</span>
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
            <q-card-section>
              <div class="text-h6">Agendamentos</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span>Valor de entrada:</span>
              <span>{{
                schedulingsDashboard?.entry_value
                  ? `${formatCurrencyBRL(Number(schedulingsDashboard.entry_value))}`
                  : ''
              }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span>Valor de saída:</span>
              <span>{{
                schedulingsDashboard?.out_value
                  ? `${formatCurrencyBRL(Number(schedulingsDashboard.out_value))}`
                  : ''
              }}</span>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
              <span>Saldo:</span>
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
            <q-card-section>
              <div class="text-h6">Usuários</div>
            </q-card-section>

            <q-card-section class="q-pt-none row justify-between">
              <span>Administradores:</span>
              <span>{{ usersDashboard?.amount_admins ?? '' }}</span>
            </q-card-section>
            <q-card-section class="q-pt-none row justify-between">
              <span>Usuários comuns:</span>
              <span>{{ usersDashboard?.amount_common_users ?? '' }}</span>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="row justify-between">
              <span>Total de usuários:</span>
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
              <span>{{ item.name }}:</span>
              <span>{{ `${formatCurrencyBRL(item.balance)}` }}</span>
            </q-card-section>
          </q-card>
        </div>
        <div class="q-gutter-y-sm q-mt-sm q-mb-lg">
          <q-table
            :rows="loadingDashboard ? [] : (categoriesEntry ?? [])"
            :columns="columnsCategoriesDashboard"
            :loading="loadingDashboard"
            style="max-height: 400px"
            flat
            bordered
            dense
            row-key="id"
            no-data-label="Nenhuma categoria de entrada para mostrar"
            virtual-scroll
            :rows-per-page-options="[5]"
          >
            <template v-slot:top>
              <span class="text-subtitle2 text-green"
                >Movimentações de entrada x categoria</span
              >
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-left">
                  {{ props.row.name }}
                </q-td>
                <q-td key="value" :props="props" class="text-left">
                  <q-linear-progress
                    :value="
                      (Number(props.row.value) || 0) /
                      (Number(totalValueEntryCategory) || 1)
                    "
                    size="20px"
                    class="q-my-sm"
                    rounded
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
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
            :rows="loadingDashboard ? [] : (categoriesOut ?? [])"
            :columns="columnsCategoriesDashboard"
            :loading="loadingDashboard"
            style="max-height: 400px"
            flat
            bordered
            dense
            row-key="id"
            no-data-label="Nenhuma categoria de saída para mostrar"
            virtual-scroll
            :rows-per-page-options="[5]"
          >
            <template v-slot:top>
              <span class="text-subtitle2 text-red"
                >Movimentações de saída x categoria</span
              >
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-left">
                  {{ props.row.name }}
                </q-td>
                <q-td key="value" :props="props" class="text-left">
                  <q-linear-progress
                    :value="
                      (Number(props.row.value) || 0) /
                      (Number(totalValueOutCategory) || 1)
                    "
                    size="20px"
                    rounded
                    class="q-my-sm"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`R$ ${formatCurrencyBRL(props.row.value)}`"
                      />
                    </div>
                  </q-linear-progress>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
