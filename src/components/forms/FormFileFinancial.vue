<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useFinancialStore } from 'src/stores/financial-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'FormFileFinancial',
});

const props = defineProps<{
  open: boolean;
  monthYear: string | null;
  idClient?: string | null;
  mode: 'client' | 'counter';
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const {
  getFileFinancial,
  createFileFinancial,
  deleteFileFinancial,
  downloadFile,
} = useFinancialStore();
const { loadingDelivery, listFileFinancial } = storeToRefs(useFinancialStore());

const textFile = ref<string | null>(null);
const dataFile = reactive({
  name: '' as string,
  file: null as File | null,
});
const columnsFileClient = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome do arquivo',
    field: 'name',
    align: 'left',
  },
  {
    name: 'receipt',
    label: 'Arquivo',
    field: 'receipt',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);
const columnsFileCounter = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome do arquivo',
    field: 'name',
    align: 'left',
  },
  {
    name: 'receipt',
    label: 'Arquivo',
    field: 'receipt',
    align: 'left',
  },
]);

const checkData = (): { status: boolean; message?: string } => {
  if (dataFile.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado um nome para seu arquivo',
    };
  }

  if (dataFile.file) {
    const fileSizeInMB = dataFile.file.size / (1024 * 1024);
    if (fileSizeInMB > 2) {
      return { status: false, message: 'O arquivo deve ter no máximo 2MB' };
    }

    const validFileTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    const fileType = dataFile.file.type;

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
  Object.assign(dataFile, {
    name: '',
    file: null,
  });
};
const clearFile = () => {
  textFile.value = null;
  dataFile.file = null;
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    await createFileFinancial(
      dataFile.name,
      dataFile.file,
      props.monthYear?.replace(/\//g, '-') ?? ''
    );
    clear();
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const fetchFileFinancial = async () => {
  if (props.monthYear) {
    await getFileFinancial(
      props.monthYear.replace(/\//g, '-'),
      props.idClient ?? null
    );
  }
};
const download = async (url: string) => {
  await downloadFile(url);
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const allowSave = computed((): boolean => {
  return !!dataFile.file && dataFile.name.trim().length > 0;
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchFileFinancial();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 900px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Painel de arquivos" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-banner
          dense
          inline-actions
          class="text-white bg-red"
          rounded
          v-show="mode == 'client'"
        >
          Reabrir o relatório resultará na perda de todos os arquivos anexados
          separadamente. Verifique e finalize o relatório com atenção para
          evitar a necessidade de reabertura.
        </q-banner>
        <q-form class="q-gutter-y-sm" v-show="props.mode == 'client'">
          <div class="q-gutter-y-sm">
            <q-input
              v-model="dataFile.name"
              bg-color="white"
              label-color="black"
              filled
              label="Nome do arquivo"
              dense
              input-class="text-black no-spinners"
              fill-mask="0"
              reverse-fill-mask
            >
              <template v-slot:prepend>
                <q-icon name="description" color="black" size="20px" />
              </template>
            </q-input>
            <q-file
              v-model="dataFile.file"
              filled
              bg-color="white"
              label-color="black"
              :label="textFile ? textFile : 'Adicione um documento (Máx 2Mb)'"
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
          </div>
          <div class="row justify-end items-center">
            <q-btn
              @click="save"
              :disable="!allowSave"
              color="primary"
              label="Salvar"
              size="md"
              :loading="false"
              unelevated
              no-caps
            />
          </div>
        </q-form>
        <q-separator />
        <q-table
          :rows="listFileFinancial"
          :columns="
            props.mode == 'client' ? columnsFileClient : columnsFileCounter
          "
          :loading="false"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum arquivo para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de arquivos</span>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="code_financial" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.code_financial
                }}</span>
              </q-td>
              <q-td key="name" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td
                @click="download(props.row.receipt)"
                key="receipt"
                :props="props"
                class="text-left"
                :class="props.row.receipt ? 'cursor-pointer hover' : ''"
              >
                <q-icon
                  v-if="props.row.receipt"
                  name="attach_file"
                  size="20px"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="mode == 'client'"
                  @click="deleteFileFinancial(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
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
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingDelivery"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
