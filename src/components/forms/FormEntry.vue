<script setup lang="ts">
import {
  computed, reactive, watch,
} from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataEntry } from 'src/ts/interfaces/data/Entry';

defineOptions({
  name: 'FormEntry',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const dataEntry = reactive<DataEntry>({
  category: null,
  value: null,
  date: null,
  account: null,
  description: '',
  file: null,
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
const optionsConta = reactive([
  {
    label: 'Caixa',
    value: 'krhbfrhb',
  },
  {
    label: 'Banco do Brasil',
    value: 'vrbyvbryuv',
  },
  {
    label: 'Bradesco',
    value: 'rgurhguirgnb',
  },
  {
    label: 'Santander',
    value: 'f34f84jhfm',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): {status: boolean, message?: string} => {
  if (dataEntry.category == null) {
    return { status: false, message: 'O categoria deve ser selecionada' };
  }
  if (dataEntry.value == null) {
    return { status: false, message: 'O valor deve ser inserido' };
  }
  if (dataEntry.account == null) {
    return { status: false, message: 'A conta deve ser selecionada' };
  }
  if (dataEntry.date?.trim() === '' || (/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/).test(dataEntry.date ?? '')) {
    return { status: false, message: 'A data deve ser informada no formato dd/mm/yyyy' };
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
  Object.assign(dataEntry, {
    category: null,
    value: null,
    date: null,
    account: null,
    description: null,
    file: null,
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
        <TitlePage title="Registre uma entrada"/>
      </q-card-section>
      <q-card-section class="q-pa-sm ">
        <q-form class="q-gutter-y-sm">
          <q-select
            v-model="dataEntry.category"
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
              <q-icon name="category" color="grey" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataEntry.value"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o valor"
            dense
            input-class="text-black no-spinners"
            type="number"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="grey" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="dataEntry.account"
            :options="optionsConta"
            label="Conta"
            filled
            clearable
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="account_balance" color="grey" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataEntry.date"
            bg-color="white"
            label-color="black"
            label="Selecione uma data"
            filled
            dense
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" class="cursor-pointer" color="grey" size="20px">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dataEntry.date" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-file
            v-model="dataEntry.file"
            filled
            bg-color="white"
            label-color="black"
            label="Adicione um documento"
            dense
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" color="grey" size="20px"/>
            </template>
          </q-file>
          <q-input
            v-model="dataEntry.description"
            style="height: 150px; max-height: 130px;"
            bg-color="white"
            label-color="black"
            filled
            label="Digite uma descrição"
            dense
            input-class="text-black no-resize"
            type="textarea"
            class="no-resize"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="grey" size="20px" />
            </template>
          </q-input>
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
