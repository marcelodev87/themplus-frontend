<script setup lang="ts">
import bb, { bar } from 'billboard.js';
import { Enterprise } from 'src/ts/interfaces/data/Enterprise';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import 'billboard.js/dist/billboard.css';
import { storeToRefs } from 'pinia';
import { useReportStore } from 'src/stores/report-store';

defineOptions({ name: 'DataEnterprise' });

const props = defineProps<{ enterprise: Enterprise }>();

const { listAmountRegister, listQuantityRegister, listYear, loadingReport } =
  storeToRefs(useReportStore());
const { getReports } = useReportStore();

const dataEnterprise = computed(() => props.enterprise);
const yearActual = computed(() => `${new Date().getFullYear()}`);

let chartAmount: ReturnType<typeof bb.generate> | null = null;
let chartQuantity: ReturnType<typeof bb.generate> | null = null;

const destroyCharts = () => {
  chartAmount?.destroy();
  chartQuantity?.destroy();
  chartAmount = null;
  chartQuantity = null;
};

const mountDashboard = () => {
  destroyCharts();

  // const maxQuantityEntry = Math.max(
  //   ...listQuantityRegister.value.map((i) => i.entry_quantity)
  // );
  // const maxQuantityOut = Math.max(
  //   ...listQuantityRegister.value.map((i) => i.out_quantity)
  // );
  // const maxQ = Math.max(maxQuantityEntry, maxQuantityOut);
  // const yQuantityTicks = Array.from({ length: maxQ + 1 }, (_, i) => i);

  const commonAxis = (formatFn: (d: number) => string | number) => ({
    x: {
      type: 'timeseries' as const,
      tick: {
        format: '%m/%Y',
        rotate: 0,
        multiline: false,
        culling: false,
        fit: true,
      },
    },
    y: {
      show: true,
      tick: {
        count: 6,
        format: formatFn,
      },
      padding: { top: 20, bottom: 0 },
    },
  });

  chartAmount = bb.generate({
    title: { text: 'Valores (R$) por Mês' },
    data: {
      x: 'x',
      columns: [
        ['x', ...listAmountRegister.value.map((i) => i.period)],
        ['Entrada', ...listAmountRegister.value.map((i) => i.entry_value)],
        ['Saída', ...listAmountRegister.value.map((i) => i.out_value)],
      ],
      type: bar(),
      colors: { Entrada: '#16a34a', Saída: '#dc2626' },
    },
    axis: commonAxis((d: number) =>
      d.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    ),
    bar: { width: { ratio: 0.25 }, radius: { ratio: 0.1 } },
    legend: { position: 'bottom' },
    tooltip: {
      format: {
        value: (v: number) =>
          `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      },
    },
    grid: { y: { show: true } },
    bindto: '#allRegister',
  });

  chartAmount.resize();

  chartQuantity = bb.generate({
    title: { text: 'Quantidade de Registros por Mês' },
    data: {
      x: 'x',
      columns: [
        ['x', ...listQuantityRegister.value.map((i) => i.period)],
        ['Entrada', ...listQuantityRegister.value.map((i) => i.entry_quantity)],
        ['Saída', ...listQuantityRegister.value.map((i) => i.out_quantity)],
      ],
      type: bar(),
      colors: { Entrada: '#16a34a', Saída: '#dc2626' },
    },
    axis: commonAxis((d: number) => (Number.isInteger(d) ? d : '')),
    bar: { width: { ratio: 0.25 }, radius: { ratio: 0.1 } },
    legend: { position: 'bottom' },
    tooltip: {
      format: { value: (v: number) => `${v} registro(s)` },
    },
    grid: { y: { show: true } },
    bindto: '#amountMovement',
  });

  chartQuantity.resize();
};

// Responsividade via ResizeObserver
let resizeObserver: ResizeObserver | null = null;

const setupResize = () => {
  const container = document.querySelector('#chart-container');
  if (!container) return;
  resizeObserver = new ResizeObserver(() => {
    chartAmount?.resize();
    chartQuantity?.resize();
  });
  resizeObserver.observe(container);
};

const selectedYear = ref<string>(yearActual.value);

watch(selectedYear, async () => {
  await getReports(props.enterprise.id, String(selectedYear.value));
  mountDashboard();
});

onMounted(() => {
  mountDashboard();
  setupResize();
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  destroyCharts();
});
</script>

<template>
  <section>
    <q-expansion-item
      expand-separator
      icon="work"
      label="Dados da organização"
      class="border-form"
    >
      <q-form class="q-gutter-y-sm">
        <div class="row justify-between">
          <q-input
            v-model="dataEnterprise.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome da organização"
            dense
            class="input-divider"
            input-class="text-black"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.code_financial"
            bg-color="white"
            label-color="black"
            filled
            label="Código da organização"
            dense
            class="input-divider"
            input-class="text-black"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="key" color="black" size="20px" />
            </template>
          </q-input>
        </div>
        <q-input
          v-model="dataEnterprise.email"
          bg-color="white"
          label-color="black"
          filled
          label="E-mail da organização"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend
            ><q-icon name="mail" color="black" size="20px"
          /></template>
        </q-input>
        <q-input
          v-model="dataEnterprise.phone"
          bg-color="white"
          label-color="black"
          filled
          label="Telefone da organização"
          dense
          input-class="text-black"
          maxlength="15"
          readonly
        >
          <template v-slot:prepend
            ><q-icon name="call" color="black" size="20px"
          /></template>
        </q-input>
        <div class="row justify-between">
          <q-input
            v-if="dataEnterprise.cpf !== null"
            v-model="dataEnterprise.cpf"
            bg-color="white"
            label-color="black"
            filled
            label="CPF"
            dense
            input-class="text-black"
            maxlength="15"
            readonly
            class="full-width"
          >
            <template v-slot:prepend
              ><q-icon name="badge" color="black" size="20px"
            /></template>
          </q-input>
          <q-input
            v-else
            v-model="dataEnterprise.cnpj"
            bg-color="white"
            label-color="black"
            filled
            label="CNPJ"
            dense
            input-class="text-black"
            readonly
            class="full-width"
          >
            <template v-slot:prepend
              ><q-icon name="badge" color="black" size="20px"
            /></template>
          </q-input>
        </div>
        <q-input
          v-model="dataEnterprise.cep"
          bg-color="white"
          label-color="black"
          filled
          label="CEP"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend
            ><q-icon name="search" color="black" size="20px"
          /></template>
        </q-input>
        <div class="row justify-between">
          <q-input
            v-model="dataEnterprise.state"
            bg-color="white"
            label-color="black"
            filled
            label="UF"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend
              ><q-icon name="map" color="black" size="20px"
            /></template>
          </q-input>
          <q-input
            v-model="dataEnterprise.city"
            bg-color="white"
            label-color="black"
            filled
            label="Cidade"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend
              ><q-icon name="pin_drop" color="black" size="20px"
            /></template>
          </q-input>
        </div>
        <q-input
          v-model="dataEnterprise.neighborhood"
          bg-color="white"
          label-color="black"
          filled
          label="Bairro"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend
            ><q-icon name="pin_drop" color="black" size="20px"
          /></template>
        </q-input>
        <q-input
          v-model="dataEnterprise.address"
          bg-color="white"
          label-color="black"
          filled
          label="Logradouro"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend
            ><q-icon name="pin_drop" color="black" size="20px"
          /></template>
        </q-input>
        <div class="row justify-between">
          <q-input
            v-model="dataEnterprise.number_address"
            bg-color="white"
            label-color="black"
            filled
            label="Número"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend
              ><q-icon name="numbers" color="black" size="20px"
            /></template>
          </q-input>
          <q-input
            v-model="dataEnterprise.complement"
            bg-color="white"
            label-color="black"
            filled
            label="Complemento"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend
              ><q-icon name="numbers" color="black" size="20px"
            /></template>
          </q-input>
        </div>
      </q-form>
    </q-expansion-item>

    <q-card flat bordered class="q-my-sm">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between">
          <span class="text-subtitle1 text-weight-medium text-grey-8">
            Relatório anual
          </span>
          <q-select
            v-model="selectedYear"
            :options="listYear"
            :readonly="loadingReport"
            label="Filtrar por ano"
            outlined
            dense
            options-dense
            bg-color="grey-1"
            label-color="black"
            style="min-width: 160px"
            :class="$q.screen.lt.md ? 'full-width q-mt-sm' : ''"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="18px" />
            </template>
          </q-select>
        </div>
      </q-card-section>

      <q-card-section id="chart-container" class="q-pa-sm">
        <div
          id="allRegister"
          class="chart-wrapper"
          style="width: 100%; min-height: 220px"
        />
        <q-separator class="q-my-md" />
        <div
          id="amountMovement"
          class="chart-wrapper"
          style="width: 100%; min-height: 220px"
        />
      </q-card-section>
    </q-card>
  </section>
</template>

<style scoped>
.chart-wrapper :deep(.bb svg) {
  width: 100% !important;
}
.chart-wrapper :deep(.bb-title) {
  font-size: 13px;
  font-weight: 600;
  fill: #374151;
}
.chart-wrapper :deep(.bb-axis text) {
  font-size: 11px;
  fill: #6b7280;
}
.chart-wrapper :deep(.bb-legend-item text) {
  font-size: 12px;
}
.chart-wrapper :deep(.bb-grid line) {
  stroke: #e5e7eb;
}
</style>
