<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataEntry } from 'src/ts/interfaces/data/Entry';
import { MovementOrSchedule } from 'src/ts/types/FormMode';
import { useMovementStore } from 'src/stores/movement-store';
import { useSchedulingStore } from 'src/stores/scheduling-store';
import { storeToRefs } from 'pinia';
import { Movement } from 'src/ts/interfaces/data/Movement';
import { Scheduling } from 'src/ts/interfaces/data/Scheduling';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'FormEntry',
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

const dataEntry = reactive<DataEntry>({
  type: 'entrada',
  value: '',
  description: '',
  file: null,
  category: null,
  account: null,
  date: '',
  programmed: { label: 'Apenas mês atual', value: 0 },
});
const optionsCategoriesMovement = ref(listCategoryMovement.value);
const optionsCategoriesScheduling = ref(listCategoryScheduling.value);
const optionsAccountsMovement = ref(listAccountMovement.value);
const optionsAccountsScheduling = ref(listAccountScheduling.value);
const optionsProgrammed = reactive<QuasarSelect<number>[]>([
  {
    label: 'Apenas mês atual',
    value: 0,
  },
  {
    label: 'Mês atual + 1 mês',
    value: 1,
  },
  {
    label: 'Mês atual + 2 meses',
    value: 2,
  },
  {
    label: 'Mês atual + 3 meses',
    value: 3,
  },
  {
    label: 'Mês atual + 4 meses',
    value: 4,
  },
  {
    label: 'Mês atual + 5 meses',
    value: 5,
  },
  {
    label: 'Mês atual + 6 meses',
    value: 6,
  },
  {
    label: 'Mês atual + 7 meses',
    value: 7,
  },
  {
    label: 'Mês atual + 8 meses',
    value: 8,
  },
  {
    label: 'Mês atual + 9 meses',
    value: 9,
  },
  {
    label: 'Mês atual + 10 meses',
    value: 10,
  },
  {
    label: 'Mês atual + 11 meses',
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

  const [day, month, year] = dataEntry.date.split('/').map(Number);
  const inputDate = new Date(year, month - 1, day);
  inputDate.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime())) {
    return {
      status: false,
      message: 'A data fornecida é inválida',
    };
  }

  if (dataEntry.category == null) {
    return { status: false, message: 'A categoria deve ser selecionada' };
  }
  if (dataEntry.value == null) {
    return { status: false, message: 'O valor deve ser inserido' };
  }
  if (dataEntry.account == null) {
    return { status: false, message: 'A conta deve ser selecionada' };
  }
  if (
    dataEntry.date?.trim() === '' ||
    !/^(0?[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
      dataEntry.date ?? ''
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

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataEntry, {
    category: null,
    value: '',
    date: '',
    account: null,
    description: '',
    file: null,
    programmed: { label: 'Apenas mês atual', value: 0 },
  });
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    if (props.mode === 'schedule') {
      await createScheduling(
        dataEntry.type,
        dataEntry.value,
        dataEntry.date,
        dataEntry.description,
        dataEntry.file,
        dataEntry.category ? dataEntry.category.value : '',
        dataEntry.account ? dataEntry.account.value : '',
        dataEntry.programmed.value
      );
    } else {
      await createMovement(
        dataEntry.type,
        dataEntry.value,
        dataEntry.date,
        dataEntry.description,
        dataEntry.file,
        dataEntry.category ? dataEntry.category.value : '',
        dataEntry.account ? dataEntry.account.value : '',
        dataEntry.programmed.value
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
        dataEntry.type,
        dataEntry.value,
        dataEntry.date.replace(/\//g, '-'),
        dataEntry.description,
        dataEntry.file,
        dataEntry.category ? dataEntry.category.value : '',
        dataEntry.account ? dataEntry.account.value : ''
      );
    } else {
      await updateMovement(
        props.dataEdit?.id ?? '',
        dataEntry.type,
        dataEntry.value,
        dataEntry.date.replace(/\//g, '-'),
        dataEntry.description,
        dataEntry.file,
        dataEntry.category ? dataEntry.category.value : '',
        dataEntry.account ? dataEntry.account.value : ''
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
    Object.assign(dataEntry, {
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
    Object.assign(dataEntry, {
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
    await getSchedulingsInformations(dataEntry.type);
  } else {
    await getMovementInformations(dataEntry.type);
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

watch(
  () => dataEntry.value,
  (value) => {
    const regex = /^\d*\.?\d{0,2}$/;

    if (!regex.test(value)) {
      const formattedValue = parseFloat(value).toFixed(2);
      // eslint-disable-next-line no-restricted-globals
      dataEntry.value = isNaN(Number(formattedValue)) ? '' : formattedValue;
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
          <q-select
            v-model="dataEntry.category"
            :options="
              props.mode === 'schedule'
                ? optionsCategoriesScheduling
                : optionsCategoriesMovement
            "
            @filter="filterFnCategory"
            label="Categoria"
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
            v-model="dataEntry.value"
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
            v-model="dataEntry.account"
            :options="
              props.mode === 'schedule'
                ? optionsAccountsScheduling
                : optionsAccountsMovement
            "
            @filter="filterFnAccount"
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
            v-model="dataEntry.date"
            bg-color="white"
            label-color="black"
            label="Selecione uma data"
            filled
            dense
            mask="##/##/####"
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
                  <q-date v-model="dataEntry.date" mask="DD/MM/YYYY">
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
            v-model="dataEntry.programmed"
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
            v-model="dataEntry.file"
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
            v-model="dataEntry.description"
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
