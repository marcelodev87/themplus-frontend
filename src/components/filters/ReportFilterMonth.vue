<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { months } from 'src/utils/months';
import { Notify } from 'quasar';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'ReportFilterMonth',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const dataFilter = reactive({
  month: null as string | null,
  year: null as string | null,
  mode: 'enter_out' as 'enter_out' | 'out' | 'enter',
});

const optionsMode = reactive<{label: string, value: string}[]>([
  {
    label: 'Entrada',
    value: 'enter',
  },
  {
    label: 'Saída',
    value: 'out',
  },
  {
    label: 'Entrada e saída',
    value: 'enter_out',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): {status: boolean, message?: string} => {
  if (dataFilter.month === null) {
    return { status: false, message: 'Deve ser selecionado o mês' };
  }
  if (dataFilter.year === null) {
    return { status: false, message: 'Deve ser selecionado o ano' };
  }

  return { status: true };
};
const search = () => {
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
  Object.assign(dataFilter, {
    month: null,
    year: null,
    mode: 'enter_out',
  });
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
        <TitlePage title="Filtro de relatório por mês"/>
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form class="q-gutter-y-sm">
          <q-select
              v-model="dataFilter.month"
              :options="months"
              label="Mês"
              filled
              clearable
              dense
              options-dense
              map-options
              bg-color="white"
              label-color="black"
              class="full-width"
            >
            <template v-slot:prepend>
                <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
              v-model="dataFilter.year"
              :options="['2020','2021','2022','2023','2024']"
              label="Ano"
              filled
              clearable
              dense
              options-dense
              map-options
              bg-color="white"
              label-color="black"
              class="full-width"
            >
            <template v-slot:prepend>
                <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
              v-model="dataFilter.mode"
              :options="optionsMode"
              label="Tipo de movimentação"
              filled
              dense
              options-dense
              map-options
              bg-color="white"
              label-color="black"
              class="full-width"
            >
            <template v-slot:prepend>
                <q-icon name="tune" color="black" size="20px" />
            </template>
          </q-select>
        </q-form>
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
            @click="search"
            color="primary"
            label="Pesquisar"
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
