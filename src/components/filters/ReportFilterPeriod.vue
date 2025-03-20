<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Notify } from 'quasar';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'ReportFilterPeriod',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const dataFilter = reactive({
  data_start: null as string | null,
  data_end: null as string | null,
  category: null as QuasarSelect<string> | null,
  mode: 'enter_out' as 'enter_out' | 'out' | 'enter',
});
const options = reactive([
  {
    label: 'Categoria 1',
    value: 'krhbfrhb',
  },
  {
    label: 'Categoria 2',
    value: 'vrbyvbryuv',
  },
  {
    label: 'Categoria 3',
    value: 'rgurhguirgnb',
  },
  {
    label: 'Categoria 4',
    value: 'f34f84jhfm',
  },
]);
const optionsMode = reactive<{ label: string; value: string }[]>([
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

const checkData = (): { status: boolean; message?: string } => {
  if (dataFilter.data_start === null) {
    return { status: false, message: 'Deve ser selecionado a data inicial' };
  }
  if (dataFilter.data_end === null) {
    return { status: false, message: 'Deve ser selecionado a data final' };
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
    data_start: null,
    data_end: null,
    category: null,
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
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de relatório por mês" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataFilter.data_start"
            bg-color="white"
            label-color="black"
            label="Data inicial"
            filled
            dense
          >
            <template v-slot:prepend>
              <q-icon
                name="calendar_today"
                class="cursor-pointer"
                color="black"
                size="20px"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dataFilter.data_start" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Fechar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="dataFilter.data_end"
            bg-color="white"
            label-color="black"
            label="Data inicial"
            filled
            dense
          >
            <template v-slot:prepend>
              <q-icon
                name="calendar_today"
                class="cursor-pointer"
                color="black"
                size="20px"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dataFilter.data_end" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Fechar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
          <q-select
            v-model="dataFilter.category"
            :options="options"
            label="Categoria"
            filled
            clearable
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
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
