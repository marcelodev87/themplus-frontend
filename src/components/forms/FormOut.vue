<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataOut } from 'src/ts/interfaces/data/Out';
import { MovementOrSchedule } from 'src/ts/types/FormMode';
import { useMovementStore } from 'src/stores/movement-store';
import { useSchedulingStore } from 'src/stores/scheduling-store';
import { storeToRefs } from 'pinia';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useReportStore } from 'src/stores/report-store';
import imageCompression from 'browser-image-compression';
import ConfirmAction from '../confirm/ConfirmAction.vue';

defineOptions({
  name: 'FormOut',
});

const props = defineProps<{
  open: boolean;
  title: string;
  mode: MovementOrSchedule;
  dataEdit: Movement | Scheduling | null;
  type: 'client' | 'counter';
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
  listCategoryAll: listCategoryAllMovement,
} = storeToRefs(useMovementStore());
const { getSchedulingsInformations, createScheduling, updateScheduling } =
  useSchedulingStore();
const {
  loadingScheduling,
  listAccount: listAccountScheduling,
  listCategory: listCategoryScheduling,
  listCategoryAll: listCategoryAllScheduling,
} = storeToRefs(useSchedulingStore());
const { updateMovementByCounter } = useReportStore();
const { loadingReport } = storeToRefs(useReportStore());

const dataOut = reactive<DataOut>({
  type: 'saída',
  value: '0.00',
  description: '',
  file: null,
  category: null,
  account: null,
  date: '',
  programmed: { label: 'Apenas mês selecionado', value: 0 },
  observation: null,
});
const optionsCategoriesMovement = ref(listCategoryMovement.value);
const optionsCategoriesScheduling = ref(listCategoryScheduling.value);
const optionsAccountsMovement = ref(listAccountMovement.value);
const optionsAccountsScheduling = ref(listAccountScheduling.value);
const showConfirmAction = ref<boolean>(false);
const textAlert = ref<string | null>(null);
const textFile = ref<string | null>(null);
const readObservation = ref<boolean>(false);
const optionsProgrammed = reactive<QuasarSelect<number>[]>([
  {
    label: 'Apenas mês selecionado',
    value: 0,
  },
  {
    label: 'Mês selecionado + 1 mês',
    value: 1,
  },
  {
    label: 'Mês selecionado + 2 meses',
    value: 2,
  },
  {
    label: 'Mês selecionado + 3 meses',
    value: 3,
  },
  {
    label: 'Mês selecionado + 4 meses',
    value: 4,
  },
  {
    label: 'Mês selecionado + 5 meses',
    value: 5,
  },
  {
    label: 'Mês selecionado + 6 meses',
    value: 6,
  },
  {
    label: 'Mês selecionado + 7 meses',
    value: 7,
  },
  {
    label: 'Mês selecionado + 8 meses',
    value: 8,
  },
  {
    label: 'Mês selecionado + 9 meses',
    value: 9,
  },
  {
    label: 'Mês selecionado + 10 meses',
    value: 10,
  },
  {
    label: 'Mês selecionado + 11 meses',
    value: 11,
  },
]);

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
  const rawValue = dataOut.value.trim();

  if (rawValue === '') {
    return { status: false, message: 'O valor deve ser inserido' };
  }

  const numericValue = Number(rawValue.replace(',', '.'));

  if (isNaN(numericValue) || numericValue <= 0) {
    return {
      status: false,
      message: 'O valor deve ser maior que 0,00',
    };
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

  if (inputDate.getTime() < today.getTime() && props.mode === 'schedule') {
    return {
      status: false,
      message: 'Não pode agendar uma data que já passou',
    };
  }

  if (dataOut.file) {
    const fileSizeInMB = dataOut.file.size / (1024 * 1024);

    if (fileSizeInMB > 20) {
      return { status: false, message: 'O arquivo deve ter no máximo 20MB' };
    }

    const validFileTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    const fileType = dataOut.file.type;

    if (!validFileTypes.includes(fileType)) {
      return {
        status: false,
        message:
          'O arquivo deve ser um PDF ou uma imagem (PNG, JPG, JPEG, GIF).',
      };
    }
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataOut, {
    category: null,
    value: '0.00',
    date: '',
    account: null,
    description: '',
    file: null,
    programmed: { label: 'Apenas mês selecionado', value: 0 },
    observation: null,
  });
  textAlert.value = '';
  textFile.value = null;
  readObservation.value = false;
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
        dataOut.account ? dataOut.account.value : '',
        dataOut.programmed.value
      );
    } else {
      await createMovement(
        dataOut.type,
        dataOut.value,
        dataOut.date,
        dataOut.description,
        dataOut.file,
        dataOut.category ? dataOut.category.value : '',
        dataOut.account ? dataOut.account.value : '',
        dataOut.programmed.value
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
const updateByCounter = async () => {
  const check = checkData();
  if (check.status) {
    await updateMovementByCounter(
      props.dataEdit?.id ?? '',
      dataOut.type,
      dataOut.value,
      dataOut.date.replace(/\//g, '-'),
      dataOut.description,
      dataOut.file,
      dataOut.category ? dataOut.category.value : '',
      dataOut.account ? dataOut.account.value : ''
    );
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const fetchInformations = async () => {
  if (props.mode === 'schedule') {
    await getSchedulingsInformations(dataOut.type);
  } else {
    await getMovementInformations(
      dataOut.type,
      props.type === 'counter' ? (props.dataEdit?.enterprise_id ?? null) : null
    );
  }
};
const filterFnCategory = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    if (props.mode === 'schedule') {
      optionsCategoriesScheduling.value =
        val === ''
          ? listCategoryScheduling.value
          : listCategoryScheduling.value.filter((element) =>
              element.label?.toLowerCase().includes(needle)
            );
    } else {
      optionsCategoriesMovement.value =
        val === ''
          ? listCategoryMovement.value
          : listCategoryMovement.value.filter((element) =>
              element.label?.toLowerCase().includes(needle)
            );
    }
  });
};
const filterFnAccount = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    if (props.mode === 'schedule') {
      optionsAccountsScheduling.value =
        val === ''
          ? listAccountScheduling.value
          : listAccountScheduling.value.filter((element) =>
              element.label?.toLowerCase().includes(needle)
            );
    } else {
      optionsAccountsMovement.value =
        val === ''
          ? listAccountMovement.value
          : listAccountMovement.value.filter((element) =>
              element.label?.toLowerCase().includes(needle)
            );
    }
  });
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  if (props.dataEdit === null) {
    await save();
  } else {
    await update();
  }
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const openConfirmAction = (): void => {
  showConfirmAction.value = true;
};
const checkAlert = async () => {
  const check = checkData();
  if (check.status) {
    const categorie =
      props.mode === 'movement'
        ? listCategoryAllMovement.value.find(
            (item) => item.id === (dataOut.category?.value ?? '')
          )
        : listCategoryAllScheduling.value.find(
            (item) => item.id === (dataOut.category?.value ?? '')
          );
    if (categorie && categorie?.alert !== null && props.type !== 'counter') {
      textAlert.value = categorie.alert;
      openConfirmAction();
    } else if (props.dataEdit === null) {
      await save();
    } else if (props.type === 'client') {
      await update();
    } else {
      await updateByCounter();
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const clearFile = () => {
  textFile.value = null;
};
async function handleFileSelect(file: File) {
  if (!file) {
    textFile.value = null;
    return;
  }

  if (file.type.startsWith('image/')) {
    textFile.value = null;

    const options = {
      maxSizeMB: 4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      dataOut.file = await imageCompression(file, options);
    } catch (error) {
      console.error('Erro na compressão:', error);
    }
  } else {
    textFile.value = file.name;
  }
}
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
    });
    textFile.value = props.dataEdit?.receipt ?? null;
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
      observation: props.dataEdit?.observation ?? '',
    });
    textFile.value = props.dataEdit?.receipt ?? null;
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
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage :title="props.title" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <div class="bg-red-1 q-py-sm" v-show="dataOut.observation">
            <q-checkbox
              v-model="readObservation"
              :label="dataOut.observation ?? ''"
            />
          </div>
          <q-select
            v-model="dataOut.category"
            :options="
              props.mode === 'schedule'
                ? optionsCategoriesScheduling
                : optionsCategoriesMovement
            "
            @filter="filterFnCategory"
            label="Categoria"
            :readonly="props.type === 'counter'"
            filled
            clearable
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
            type="text"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="dataOut.account"
            :options="
              props.mode === 'schedule'
                ? optionsAccountsScheduling
                : optionsAccountsMovement
            "
            @filter="filterFnAccount"
            :readonly="props.type === 'counter'"
            label="Conta"
            filled
            clearable
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
            mask="##/##/####"
            :readonly="props.type === 'counter'"
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
                  <q-date
                    v-model="dataOut.date"
                    mask="DD/MM/YYYY"
                    :readonly="props.type === 'counter'"
                  >
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
            v-show="props.dataEdit === null"
            v-model="dataOut.programmed"
            :options="optionsProgrammed"
            :label="
              props.mode === 'movement'
                ? 'Movimentações futuras'
                : 'Agendamento futuros'
            "
            filled
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="event_repeat" color="black" size="20px" />
            </template>
          </q-select>
          <q-file
            @update:model-value="handleFileSelect"
            v-model="dataOut.file"
            v-show="props.type !== 'counter'"
            filled
            bg-color="white"
            label-color="black"
            :label="textFile ? textFile : 'Adicione um documento (Máx 20Mb)'"
            dense
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" color="black" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon
                @click="clearFile"
                v-if="textFile"
                name="close"
                color="black"
                size="20px"
                class="cursor-pointer hover"
              >
                <q-tooltip> Limpar </q-tooltip>
              </q-icon>
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
            <template v-slot:append>
              <q-icon
                @click="clearFile"
                v-if="textFile"
                name="close"
                color="black"
                size="20px"
                class="cursor-pointer hover"
              >
                <q-tooltip> Limpar </q-tooltip>
              </q-icon>
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
            unelevated
            no-caps
          />
          <q-btn
            v-if="props.dataEdit === null"
            @click="checkAlert"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingMovement || loadingScheduling || loadingReport"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="checkAlert"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingMovement || loadingScheduling || loadingReport"
            unelevated
            no-caps
            :disable="dataOut.observation ? !readObservation : false"
          />
        </div>
      </q-card-actions>
      <ConfirmAction
        :open="showConfirmAction"
        label-action="Continuar"
        :title="
          props.mode === 'schedule'
            ? 'Confirmação de agendamento'
            : 'Confirmação de movimentação'
        "
        :message="textAlert ?? ''"
        @update:open="closeConfirmAction"
        @update:ok="closeConfirmActionOk"
      />
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
