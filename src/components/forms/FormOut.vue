<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataOut } from 'src/ts/interfaces/data/Out';
import { MovementOrSchedule } from 'src/ts/types/FormMode';
import { useMovementStore } from 'src/stores/movement-store';
import { useSchedulingStore } from 'src/stores/scheduling-store';
import { storeToRefs } from 'pinia';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';

defineOptions({
  name: 'FormOut',
});

const props = defineProps<{
  open: boolean;
  title: string;
  mode: MovementOrSchedule;
  dataEdit: Movement | Scheduling | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getMovementInformations, createMovement, updateMovement } =
  useMovementStore();
const {
  loadingMovement,
  listAccount: listAccountMovement,
  listCategory: listCategoryMovement,
} = storeToRefs(useMovementStore());
const { getSchedulingsInformations, createScheduling, updateScheduling } =
  useSchedulingStore();
const {
  loadingScheduling,
  listAccount: listAccountScheduling,
  listCategory: listCategoryScheduling,
} = storeToRefs(useSchedulingStore());

const dataOut = reactive<DataOut>({
  type: 'saída',
  value: '',
  description: '',
  file: null,
  category: null,
  account: null,
  date: '',
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [day, month, year] = dataOut.date.split('/').map(Number);
  const inputDate = new Date(year, month - 1, day);
  inputDate.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime())) {
    return {
      status: false,
      message: 'A data fornecida é inválida',
    };
  }

  if (dataOut.category == null) {
    return { status: false, message: 'A categoria deve ser selecionada' };
  }
  if (dataOut.value == null) {
    return { status: false, message: 'O valor deve ser inserido' };
  }
  if (dataOut.account == null) {
    return { status: false, message: 'A conta deve ser selecionada' };
  }
  if (
    dataOut.date?.trim() === '' ||
    !/^(0?[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
      dataOut.date ?? ''
    )
  ) {
    return {
      status: false,
      message: 'A data deve ser informada no formato dd/mm/yyyy',
    };
  }

  if (inputDate.getTime() < today.getTime()) {
    return {
      status: false,
      message: 'Não pode agendar uma data que já passou',
    };
  }

  return { status: true };
};

const clear = (): void => {
  Object.assign(dataOut, {
    category: null,
    value: '',
    date: '',
    account: null,
    description: '',
    file: null,
  });
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    if (props.mode === 'schedule') {
      await createScheduling(
        dataOut.type,
        dataOut.value,
        dataOut.date,
        dataOut.description,
        dataOut.file,
        dataOut.category ? dataOut.category.value : '',
        dataOut.account ? dataOut.account.value : ''
      );
    } else {
      await createMovement(
        dataOut.type,
        dataOut.value,
        dataOut.date,
        dataOut.description,
        dataOut.file,
        dataOut.category ? dataOut.category.value : '',
        dataOut.account ? dataOut.account.value : ''
      );
    }
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    if (props.mode === 'schedule') {
      await updateScheduling(
        props.dataEdit?.id ?? '',
        dataOut.type,
        dataOut.value,
        dataOut.date.replace(/\//g, '-'),
        dataOut.description,
        dataOut.file,
        dataOut.category ? dataOut.category.value : '',
        dataOut.account ? dataOut.account.value : ''
      );
    } else {
      await updateMovement(
        props.dataEdit?.id ?? '',
        dataOut.type,
        dataOut.value,
        dataOut.date.replace(/\//g, '-'),
        dataOut.description,
        dataOut.file,
        dataOut.category ? dataOut.category.value : '',
        dataOut.account ? dataOut.account.value : ''
      );
    }
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const mountEdit = (): void => {
  if (props.mode === 'schedule') {
    Object.assign(dataOut, {
      category: listCategoryScheduling.value.find(
        (item) => item.value === props.dataEdit?.category_id
      ),
      value: props.dataEdit?.value ?? '',
      date: props.dataEdit?.date_movement.split('-').reverse().join('/') ?? '',
      account: listAccountScheduling.value.find(
        (item) => item.value === props.dataEdit?.account_id
      ),
      description: props.dataEdit?.description ?? '',
      file: props.dataEdit?.receipt ?? null,
    });
  } else {
    Object.assign(dataOut, {
      category: listCategoryMovement.value.find(
        (item) => item.value === props.dataEdit?.category_id
      ),
      value: props.dataEdit?.value ?? '',
      date: props.dataEdit?.date_movement.split('-').reverse().join('/') ?? '',
      account: listAccountMovement.value.find(
        (item) => item.value === props.dataEdit?.account_id
      ),
      description: props.dataEdit?.description ?? '',
      file: props.dataEdit?.receipt ?? null,
    });
  }
};
const fetchInformations = async () => {
  if (props.mode === 'schedule') {
    await getSchedulingsInformations(dataOut.type);
  } else {
    await getMovementInformations(dataOut.type);
  }
};

watch(
  () => dataOut.value,
  (value) => {
    const regex = /^\d*\.?\d{0,2}$/;

    if (!regex.test(value)) {
      const formattedValue = parseFloat(value).toFixed(2);
      // eslint-disable-next-line no-restricted-globals
      dataOut.value = isNaN(Number(formattedValue)) ? '' : formattedValue;
    }
  }
);

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchInformations();
    if (props.dataEdit !== null) {
      mountEdit();
    }
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage :title="props.title" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-select
            v-model="dataOut.category"
            :options="
              props.mode === 'schedule'
                ? listCategoryScheduling
                : listCategoryMovement
            "
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
          <q-input
            v-model="dataOut.value"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o valor"
            dense
            input-class="text-black no-spinners"
            type="number"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="dataOut.account"
            :options="
              props.mode === 'schedule'
                ? listAccountScheduling
                : listAccountMovement
            "
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
              <q-icon name="account_balance" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataOut.date"
            bg-color="white"
            label-color="black"
            label="Selecione uma data"
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
                  <q-date v-model="dataOut.date" mask="DD/MM/YYYY">
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
          <q-file
            v-model="dataOut.file"
            filled
            bg-color="white"
            label-color="black"
            label="Adicione um documento (Máx 2Mb)"
            dense
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" color="black" size="20px" />
            </template>
          </q-file>
          <q-input
            v-model="dataOut.description"
            style="height: 150px; max-height: 130px"
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
              <q-icon name="description" color="black" size="20px" />
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
            v-if="props.dataEdit === null"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingMovement || loadingScheduling"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingMovement || loadingScheduling"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingMovement || loadingScheduling"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
