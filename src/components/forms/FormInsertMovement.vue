<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { useMovementStore } from 'src/stores/movement-store';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import * as XLSX from 'xlsx';

defineOptions({
  name: 'FormInsertMovement',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { exportMovementInsertExample, setLoading } = useMovementStore();
const { loadingMovement } = storeToRefs(useMovementStore());

const viewMode = ref<'add' | 'process'>('add');
const listInsertMovement = ref<any[]>([]);
const dataInsert = reactive({
  file: null as File | null,
});
const columnsMovement = reactive<QuasarTable[]>([
  {
    name: 'dateMovement',
    label: 'Data de movimentação',
    field: 'dateMovement',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Banco',
    field: 'account',
    align: 'left',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'receipt',
    label: 'Arquivo',
    field: 'receipt',
    align: 'left',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataInsert.file === null) {
    return {
      status: false,
      message: 'Selecione uma planilha',
    };
  }

  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (!allowedTypes.includes(dataInsert.file.type)) {
    return {
      status: false,
      message: 'O arquivo deve ser uma planilha do Excel (.xls ou .xlsx)',
    };
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataInsert, {
    file: null,
  });
  viewMode.value = 'add';
  listInsertMovement.value = [];
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    // Criar função para criar
    clear();
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const exportInsert = async () => {
  await exportMovementInsertExample();
};
const excelSerialToDate = (serial: number): string => {
  const utcDays = serial - 25569;
  const utcValue = utcDays * 86400;
  const date = new Date(utcValue * 1000);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
const normalizeAndValidateValue = (valor: string): string | null => {
  if (typeof valor !== 'string') return null;

  if (valor.includes('.') && valor.includes(',')) {
    valor = valor.replace(/\./g, '').replace(',', '.');
  } else if (valor.includes(',')) {
    valor = valor.replace(',', '.');
  }

  if (/^\d+(\.\d{1,2})?$/.test(valor)) {
    return valor;
  }

  return null;
};

const process = () => {
  const check = checkData();
  if (check.status) {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target) {
        Notify.create({
          message: 'Erro ao processar o arquivo: evento inválido.',
          type: 'negative',
        });
        setLoading(false);
        return;
      }

      const { result } = e.target;
      if (!(result instanceof ArrayBuffer)) {
        Notify.create({
          message: 'Erro ao processar o arquivo: formato inválido.',
          type: 'negative',
        });
        setLoading(false);
        return;
      }

      const data = new Uint8Array(result);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers: any = jsonData[0];
      const requiredHeaders = [
        'TIPO',
        'VALOR',
        'DATA DE MOVIMENTAÇÃO',
        'DESCRIÇÃO',
      ];
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header)
      );
      if (missingHeaders.length > 0) {
        Notify.create({
          type: 'negative',
          message: `As seguintes colunas estão ausentes no arquivo: ${missingHeaders.join(', ')}`,
        });
        setLoading(false);
        return;
      }

      const columnIndexes = requiredHeaders.map((header) =>
        headers.indexOf(header)
      );

      const columnErrors = {
        TIPO: 0,
        VALOR: 0,
        'DATA DE MOVIMENTAÇÃO': 0,
      };

      const validRows: any[] = [];

      jsonData.slice(1).forEach((row: any) => {
        const tipo = row[columnIndexes[0]];
        const valor = row[columnIndexes[1]];
        let dataMovimentacao = row[columnIndexes[2]];
        const descricao = row[columnIndexes[3]];

        let isValid = true;

        dataMovimentacao = excelSerialToDate(dataMovimentacao);

        if (!['entrada', 'saída'].includes(tipo?.toLowerCase())) {
          columnErrors.TIPO++;
          isValid = false;
        }

        const normalizedValue = normalizeAndValidateValue(valor);
        if (!normalizedValue) {
          columnErrors.VALOR++;
          isValid = false;
        }

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataMovimentacao)) {
          columnErrors['DATA DE MOVIMENTAÇÃO']++;
          isValid = false;
        }

        if (isValid) {
          validRows.push({
            tipo,
            valor: normalizedValue,
            dataMovimentacao,
            descricao,
          });
        }
      });

      if (Object.values(columnErrors).some((count) => count > 0)) {
        const errorMessages = [];

        if (columnErrors.TIPO > 0) {
          errorMessages.push(
            `A coluna "TIPO" contém ${columnErrors.TIPO} erros. Valores permitidos: "entrada" ou "saída".`
          );
        }
        if (columnErrors.VALOR > 0) {
          errorMessages.push(
            `A coluna "VALOR" contém ${columnErrors.VALOR} erros. Formato esperado: numérico, ex: 5000.00 ou 650.00.`
          );
        }
        if (columnErrors['DATA DE MOVIMENTAÇÃO'] > 0) {
          errorMessages.push(
            `A coluna "DATA DE MOVIMENTAÇÃO" contém ${columnErrors['DATA DE MOVIMENTAÇÃO']} erros. Formato esperado: DD/MM/AAAA.`
          );
        }

        Notify.create({
          type: 'negative',
          message: `Erros encontrados nas colunas:\n${errorMessages.join('\n')}`,
          timeout: 10000,
          progress: true,
        });
        setLoading(false);
        return;
      }

      listInsertMovement.value = validRows;

      Notify.create({
        message: 'Arquivo processado com sucesso',
        type: 'positive',
      });

      setLoading(false);
    };

    reader.onerror = () => {
      Notify.create({
        message: 'Erro ao ler o arquivo',
        type: 'negative',
      });
      setLoading(false);
    };

    if (dataInsert.file) {
      reader.readAsArrayBuffer(dataInsert.file);
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${day}/${month}/${year}`;
};
watch(
  () => dataInsert.file,
  (file) => {
    if (file === null) {
      listInsertMovement.value = [];
    }
  },
  { immediate: true }
);
watch(open, async () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Inserção de movimentações em lote" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form v-if="viewMode === 'add'" class="q-gutter-y-sm">
          <q-file
            v-model="dataInsert.file"
            filled
            bg-color="white"
            label-color="black"
            label="Adicione um documento ( .xls ou .xlsx )"
            dense
            clearable
            accept=".xls,.xlsx"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" color="black" size="20px" />
            </template>
          </q-file>
        </q-form>
        <q-table
          v-else
          :rows="loadingMovement ? [] : listInsertMovement"
          :columns="columnsMovement"
          :loading="loadingMovement"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhuma movimentação para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Planilha processada</span>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              style="height: 28px"
              :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
            >
              <q-td key="dateMovement" :props="props" class="text-left">
                {{ formatDate(props.row.date_movement) }}
              </q-td>
              <q-td key="type" :props="props" class="text-left">
                {{ formatDate(props.row.date_movement) }}
              </q-td>
              <q-td key="value" :props="props" class="text-left">
                {{ `${formatCurrencyBRL(props.row.value)}` }}
              </q-td>
              <q-td key="account" :props="props" class="text-left">
                {{ props.row.account }}
              </q-td>
              <q-td key="category" :props="props" class="text-left">
                {{ props.row.category }}
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                {{ props.row.description }}
              </q-td>
              <q-td key="receipt" :props="props" class="text-left">
                {{ props.row.receipt }}
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
          <q-btn
            @click="exportInsert"
            color="black"
            icon-right="download"
            label="Exemplo"
            flat
            size="md"
            :loading="loadingMovement"
            unelevated
            no-caps
          />
          <q-btn
            @click="process"
            color="primary"
            label="Processar"
            icon-right="sync"
            size="md"
            :loading="loadingMovement"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
