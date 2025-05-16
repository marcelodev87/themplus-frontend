<script setup lang="ts">
import bb, { bar } from 'billboard.js';
import { Enterprise } from 'src/ts/interfaces/data/Enterprise';
import { computed, onMounted, ref, watch } from 'vue';
import 'billboard.js/dist/billboard.css';
import { storeToRefs } from 'pinia';
import { useReportStore } from 'src/stores/report-store';
import { getReportsService } from 'src/services/report-service';

defineOptions({
  name: 'DataEnterprise',
});

const props = defineProps<{
  enterprise: Enterprise;
}>();

const { listAmountRegister, listQuantityRegister, listYear, loadingReport } =
  storeToRefs(useReportStore());

const dataEnterprise = computed(() => props.enterprise);
const yearActual = computed(() => {
  const currentDate = new Date();

  return `${currentDate.getFullYear()}`;
});

const selectedYear = ref<string>(yearActual.value);

watch(listYear, async () => {
  await getReportsService(String(selectedYear));
});

onMounted(() => {
  const maxQuantityEntry = Math.max(
    ...listQuantityRegister.value.map((item) => item.entry_quantity)
  );
  const maxQuantityOut = Math.max(
    ...listQuantityRegister.value.map((item) => item.out_quantity)
  );
  const maxQuantityValue = Math.max(maxQuantityEntry, maxQuantityOut);
  const yQuantityTicks = Array.from(
    { length: maxQuantityValue + 1 },
    (_, i) => i
  );

  bb.generate({
    title: {
      text: 'Valores R$ x Mês',
    },
    data: {
      x: 'x',
      columns: [
        ['x', ...listAmountRegister.value.map((item) => item.period)],
        [
          'entrada',
          ...listAmountRegister.value.map((item) => item.entry_value),
        ],
        ['saida', ...listAmountRegister.value.map((item) => item.out_value)],
      ],
      type: bar(),
      colors: {
        entrada: 'green',
        saida: 'red',
      },
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          values: listAmountRegister.value.map((item) =>
            new Date(item.period).getTime()
          ),
          format: '%m/%Y',
          rotate: 0,
          multiline: false,
          culling: false,
        },
      },
      y: {
        show: true,
        tick: {
          count: 10,
          format: (d: number) => Math.floor(d),
        },
        padding: {
          top: 0,
          bottom: 0,
        },
      },
    },
    bar: {
      width: {
        ratio: 0.7,
      },
    },
    bindto: '#allRegister',
  }).resize({
    height: 200,
  });

  bb.generate({
    title: {
      text: 'Registro x Mês',
    },
    data: {
      x: 'x',
      columns: [
        ['x', ...listQuantityRegister.value.map((item) => item.period)],
        [
          'entrada',
          ...listQuantityRegister.value.map((item) => item.entry_quantity),
        ],
        [
          'saida',
          ...listQuantityRegister.value.map((item) => item.out_quantity),
        ],
      ],
      type: bar(),
      colors: {
        entrada: 'green',
        saida: 'red',
      },
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          values: listQuantityRegister.value.map((item) =>
            new Date(item.period).getTime()
          ),
          format: '%m/%Y',
          rotate: 0,
          multiline: false,
          culling: false,
        },
      },
      y: {
        show: true,
        tick: {
          values: yQuantityTicks,
          format: (d: number) => Math.floor(d),
        },
        min: 0,
        padding: {
          top: 0,
          bottom: 0,
        },
      },
    },
    bar: {
      width: {
        ratio: 0.7,
      },
    },
    bindto: '#amountMovement',
  }).resize({
    height: 200,
  });
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
        <q-input
          v-model="dataEnterprise.name"
          bg-color="white"
          label-color="black"
          filled
          label="Nome da organização"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="person" color="black" size="20px" />
          </template>
        </q-input>
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
          <template v-slot:prepend>
            <q-icon name="mail" color="black" size="20px" />
          </template>
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
          <template v-slot:prepend>
            <q-icon name="call" color="black" size="20px" />
          </template>
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
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
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
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
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
          <template v-slot:prepend>
            <q-icon name="search" color="black" size="20px" />
          </template>
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
            <template v-slot:prepend>
              <q-icon name="map" color="black" size="20px" />
            </template>
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
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
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
          <template v-slot:prepend>
            <q-icon name="pin_drop" color="black" size="20px" />
          </template>
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
          <template v-slot:prepend>
            <q-icon name="pin_drop" color="black" size="20px" />
          </template>
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
            <template v-slot:prepend>
              <q-icon name="numbers" color="black" size="20px" />
            </template>
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
            <template v-slot:prepend>
              <q-icon name="numbers" color="black" size="20px" />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-expansion-item>

    <q-card flat bordered class="q-my-sm">
      <q-card-section>
        <div class="row item-center justify-end">
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
            style="min-width: 200px"
            :class="!$q.screen.lt.md ? '' : 'full-width'"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-select>
        </div>
      </q-card-section>
      <q-card-section>
        <div id="allRegister"></div>
      </q-card-section>
      <q-card-section>
        <div id="amountMovement"></div>
      </q-card-section>
    </q-card>
  </section>
</template>
